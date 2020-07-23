package resources;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;


import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;

import com.google.cloud.datastore.PathElement;


import com.google.cloud.datastore.Transaction;
import com.google.cloud.datastore.Batch;


import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;


import DTOs.QueryData;
import DTOs.QueryResult;
import DTOs.QuizzResult;

import util.Marker;
import util.Ranking;
import util.Review;
import util.Trail;
import util.TrailQuestion;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

@Path("/trail")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class TrailResource {

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final Storage storage = StorageOptions.newBuilder().setProjectId("trailobyte-275015").build().getService();
	private final KeyFactory trailKeyFactory = datastore.newKeyFactory().setKind("Trail");
	private final KeyFactory userKeyFactory = datastore.newKeyFactory().setKind("User");
	private final KeyFactory reviewKeyFactory = datastore.newKeyFactory().setKind("Review");
	private final KeyFactory tokenKeyFactory = datastore.newKeyFactory().setKind("Token");
	private final KeyFactory rankingKeyFactory = datastore.newKeyFactory().setKind("Ranking");
	private final QueryResource queries = new QueryResource();
	private final Gson g = new Gson();

	public TrailResource() {

	}

	//ROLES: E1, E2, E3, E4, BO, BOT, BOQ, FOW, FOA, FO, ADMIN
	//OP_CODE: T1
	@SuppressWarnings("deprecation")
	@POST
	@Path("/OPT1OP")//post trail
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response postTrail(@Context HttpServletRequest req)  throws ServletException, IOException, FileUploadException {

		ServletFileUpload upload = new ServletFileUpload();
		FileItemIterator iterator = upload.getItemIterator(req);
		BlobInfo markersBlobInfo = null;
		Trail trail = null;
		Key trailKey = null;
		Transaction txn = null;
		FileItemStream item;
		String markersMediaLink = null;

		String authKey = req.getHeader("Authorization").split(" ")[1];    
		String username = req.getHeader("username");

		Key userKey = userKeyFactory.newKey(username);
		Entity userEntity = datastore.get(userKey);

		if(userEntity ==  null)
			return Response.status(Status.NOT_FOUND).entity("User " + username + " does not exist.").build();

		boolean verificationLevel = false;

		switch(userEntity.getString("user_role")) {
		case "E2" : verificationLevel = true; break;
		case "BO" : verificationLevel = true; break;
		case "BOQ": verificationLevel = true; break;
		case "ADMIN": verificationLevel = true; break;
		default	 : verificationLevel = false; break;
		}

		try {
			while(iterator.hasNext()) {
				item = iterator.next();
				InputStream stream = item.openStream();
				if(item.isFormField()&&item!=null) {
					JsonParser jsonParser = new JsonParser();
					JsonObject jsonObject = (JsonObject)jsonParser.parse(new InputStreamReader(item.openStream(), "UTF-8"));
					//JsonObject jsonObject = (JsonObject) JsonParser.parseReader(new InputStreamReader(item.openStream(), "UTF-8"));
					trail = g.fromJson(jsonObject, Trail.class);
					trailKey = trailKeyFactory.newKey(trail.name);

					//if the trail already exists checks if the user making the request is the author of the trail
					//if it is, the trail is updated. if not, returns
					if(datastore.get(trailKey) != null){ 
						Key tokenKey = tokenKeyFactory.newKey(trail.creator);
						if(tokenKey == null || authKey != datastore.get(tokenKey).getString("verifier"))
							return Response.status(Status.FORBIDDEN).entity("Trail '"+trail.name+"' already exists and this user is not it's creator").build();
					}
					//store markers list
					BlobId blobId = BlobId.of("trailobyte-275015.appspot.com", "trails/"+ trail.name +"/"+"markers.json");
					markersBlobInfo = BlobInfo.newBuilder(blobId).build();
				} 
				else {
					if(!Utils.checkFileExtension(item.getName()))
						return Response.status(Status.FORBIDDEN).entity("File " + item.getName() + " format not accepted.").build();
					//store trail's image
					if(item.getName().equals(trail.trailImg)) {
						//saves image's storage URL to trailImg in the trail (the trailImg comes with picture_name.jpg or null)
						if(trail.trailImg !=null && trail.trailImg.equals(item.getName())) {
							BlobId blobId = BlobId.of("trailobyte-275015.appspot.com", "trails/" + trail.name + "/pictures/" + item.getName());
							BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
							trail.trailImg = storage.create(blobInfo, Utils.toByteArray(stream)).getMediaLink();
						}
					}else {
						//saves image's storage URL to imgURL in the marker (the imgURL comes with picture_name.jpg or null)
						for(Marker aux : trail.markers)
							if(aux.imgURL !=null && aux.imgURL.equals(item.getName())) {
								//store marker's images
								BlobId blobId = BlobId.of("trailobyte-275015.appspot.com", "trails/" + trail.name + "/pictures/" + item.getName());
								BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
								aux.imgURL = storage.create(blobInfo, Utils.toByteArray(stream)).getMediaLink();
							}
					}	        		
				}	 
			}

			if(markersBlobInfo != null)
				markersMediaLink = storage.create(markersBlobInfo, g.toJson(trail.markers).toString().getBytes()).getMediaLink();

			txn = datastore.newTransaction();

			Entity trailEntity = Entity.newBuilder(trailKey)
					.set("name", trail.name)
					.set("description", trail.description)
					.set("trailImg", trail.trailImg == null ? "" : trail.trailImg)
					.set("creator", trail.creator)

					.set("country", trail.country== null ? "" : trail.country)
					.set("area", trail.area== null ? "" : trail.area)

					.set("markers", markersMediaLink)
					.set("start", trail.markers.get(0).name)
					.set("end", trail.markers.get(trail.markers.size()-1).name)
					//.set("trailQuestions", "")

					.set("avgRating", trail.avgRating)
					.set("nRatings", trail.nRatings)
					.set("dist", trail.dist)

					.set("verified", verificationLevel)
					.build();

			txn.put(trailEntity);
			txn.commit();
			return Response.ok("{}").build();

		}catch(Exception e) {
			e.printStackTrace();
		}
		finally{
			if(txn.isActive())
				txn.rollback();
		}
		return null;
	}

	//ROLES: E2, E4, BO, BOT, ADMIN
	//OP_CODE: T2
	@POST
	@Path("/OPT2OP/{trailName}") //verify trail
	@Consumes(MediaType.APPLICATION_JSON)
	public Response verifyTrail(@Context HttpServletRequest req, @PathParam("trailName")String trailName) throws ServletException{
		Transaction txn = null;


		Key trailKey = trailKeyFactory.newKey(trailName);
		Entity trailEntity = datastore.get(trailKey);
		if(trailKey == null || trailEntity == null)
			return Response.status(Status.NOT_FOUND).entity("Trail '"+ trailName +"' doesn´t exist.").build();

		String username = req.getHeader("username");
		Key userKey = userKeyFactory.newKey(username);
		Entity userEntity = datastore.get(userKey);
		if(userKey == null || userEntity == null)
			return Response.status(Status.NOT_FOUND).entity("User '"+ username +"' doesn´t exist.").build();


		try {
			txn = datastore.newTransaction();

			Entity newTrailEntity = Entity.newBuilder(trailKey)
					.set("name", trailEntity.getString("name"))
					.set("description", trailEntity.getString("description"))
					.set("trailImg", trailEntity.getString("trailImg"))
					.set("creator", trailEntity.getString("creator"))

					.set("country", trailEntity.getString("country"))
					.set("area", trailEntity.getString("area"))

					.set("markers", trailEntity.getString("markers"))
					.set("start", trailEntity.getString("start"))
					.set("end", trailEntity.getString("end"))

					.set("avgRating", trailEntity.getDouble("avgRating"))
					.set("nRatings", (int)trailEntity.getLong("nRatings"))
					.set("dist", trailEntity.getDouble("dist"))

					.set("verified", true)
					.build();

			txn.put(newTrailEntity);
			txn.commit();
			return Response.ok("{}").build();

		}catch(Exception e) {
			e.printStackTrace();
		}
		finally{
			if(txn.isActive())
				txn.rollback();
		}
		return null;
	}

	//ROLES: E1, E2, E3, E4, BO, BOT, BOQ, FOW, FOA, FO, ADMIN
	//OP_CODE: T3
	@GET
	@Path("/OPT3OP/{trailName}") // get trail
	@Produces(MediaType.APPLICATION_JSON)
	public Response getTrail(@PathParam("trailName")String trailName) throws ServletException, JsonMappingException, JsonProcessingException {


		try {
			Key trailKey = trailKeyFactory.newKey(trailName);
			Entity trailEntity = datastore.get(trailKey);

			if(trailEntity == null)
				return Response.status(Status.NOT_FOUND).entity("Trail '"+ trailName+"' doesn´t exist.").build();

			String name = trailEntity.getString("name");
			String description = trailEntity.getString("description");
			String trailImg = trailEntity.getString("trailImg");
			String creator = trailEntity.getString("creator");
			String area = trailEntity.getString("area");
			String country = trailEntity.getString("country");
			String start = trailEntity.getString("start");
			String end = trailEntity.getString("end");
			double avgRating = trailEntity.getDouble("avgRating");
			int nRatings =  (int) trailEntity.getLong("nRatings");
			double dist = trailEntity.getDouble("dist");
			boolean verified = trailEntity.getBoolean("verified");

			BlobId blobId = BlobId.of("trailobyte-275015.appspot.com", "trails/"+ trailName +"/markers.json");	
			Blob blob = storage.get(blobId);

			byte[] content = blob.getContent();
			String data = new String(content);

			ObjectMapper mapper = new ObjectMapper();
			List<Marker> markerList = mapper.readValue(data, new TypeReference<List<Marker>>(){});

			//VER COMO È QUE SE FAZ EM RELAÇÂO ÀS PERGUNTAS
			//TODO:
			Trail trail = new Trail(name, description, trailImg, creator, area, country, start, end, markerList, avgRating, nRatings, dist, verified);

			return Response.ok(g.toJson(trail)).build();

		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	//ROLES: E1, E2, E3, E4, BO, BOT, BOQ, FOW, FOA, FO, ADMIN
	//OP_CODE: T4
	@POST
	@Path("/OPT4OP") //post review
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postReview(Review review)  {
		Transaction txn = null;		
		String userName = review.author;
		String trailName = review.trailName;
		String comment = review.comment;
		double rating = review.rating;

		Key userKey = userKeyFactory.newKey(userName);
		if(datastore.get(userKey) ==  null)
			return Response.status(Status.NOT_FOUND).entity("User " + userName + " does not exist.").build();

		Key trailKey = trailKeyFactory.newKey(trailName);
		if(datastore.get(trailKey) ==  null)
			return Response.status(Status.NOT_FOUND).entity("Trail " + trailName + " does not exist.").build();

		Key reviewKey = reviewKeyFactory.newKey(userName+trailName);
		if(datastore.get(reviewKey) != null)
			return Response.status(Status.FORBIDDEN).entity("User " + userName + " already posted a review for trail " + trailName).build();

		try {
			txn = datastore.newTransaction();

			Entity reviewEntity = Entity.newBuilder(reviewKey)
					.set("author", userName)
					.set("trailName", trailName)
					.set("comment", comment)
					.set("rating", rating)
					.build();

			Entity trail = datastore.get(trailKey);
			int reviewers = (int) trail.getLong("nRatings");
			double avgRating = trail.getDouble("avgRating");
			double newRating= (reviewers*avgRating + rating) / (reviewers+1);

			Entity updatedTrailEntity = Entity.newBuilder(trailKey)
					.set("name", trail.getString("name"))
					.set("description", trail.getString("description"))
					.set("trailImg", trail.getString("trailImg"))
					.set("creator", trail.getString("creator"))

					.set("country", trail.getString("country"))
					.set("area", trail.getString("area"))

					.set("markers", trail.getString("markers"))
					.set("start", trail.getString("start"))
					.set("end", trail.getString("end"))

					.set("avgRating", newRating)
					.set("nRatings", reviewers+1)
					.set("dist", trail.getDouble("dist"))

					.set("verified", trail.getBoolean("verified"))
					.build();

			txn.put(updatedTrailEntity);
			txn.put(reviewEntity);
			txn.commit();
			return Response.ok("User " + userName + " posted a " + rating +"* review for trail " + trailName).build();

		}catch(Exception e) {
			e.printStackTrace();
		}
		finally{
			if(txn.isActive())
				txn.rollback();
		}
		return null;
	}

	//ROLES: E1, E2, E3, E4, BO, BOT, BOQ, FOW, FOA, FO, ADMIN
	//OP_CODE: T5
	@POST
	@Path("/OPT5OP/{trailName}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postTrailQuestions(@Context HttpServletRequest req, @Context HttpServletResponse res,  @PathParam("trailName")String trailName, List<TrailQuestion> questions) throws FileUploadException, IOException  {

		String userName = req.getHeader("username");
		Key userKey = userKeyFactory.newKey(userName);

		Batch batch = null;
		Key trailKey = null;
		Entity trailEntity = null;
		TrailQuestion trailQuestion = null;

		Entity userEntity = datastore.get(userKey);

		if(userEntity ==  null)
			return Response.status(Status.NOT_FOUND).entity("User " + userName + " does not exist.").build();

		int verificationLevel = 0;

		switch(userEntity.getString("user_role")) {
		case "E2" : verificationLevel = 1; break;
		case "E3" : verificationLevel = 1; break;
		case "E4" :	verificationLevel = 1; break;
		case "BO" : verificationLevel = 1; break;
		case "BOQ": verificationLevel = 2; break;
		case "ADMIN": verificationLevel = 2; break;
		default	  : verificationLevel = 0; break;
		}

		Iterator<TrailQuestion> iterator = questions.iterator();

		KeyFactory questionKeyFactory = datastore.newKeyFactory().addAncestors(PathElement.of("Trail", trailName)).setKind("TrailQuestion");

		if(trailName == null) 
			return Response.status(Status.BAD_REQUEST).entity("Resquest doesnt contain a trailName").build();

		List<Marker> markersList =  getMarkersList(trailName);
		if(markersList == null)
			return Response.status(Status.BAD_REQUEST).entity("Trail does not contain markers").build();



		trailKey = trailKeyFactory.newKey(trailName);
		trailEntity = datastore.get(trailKey);

		if(trailEntity == null)
			return Response.status(Status.BAD_REQUEST).entity("Trail '"+ trailName +"' given, does not exist.").build();


		try {
			batch = datastore.newBatch();
			while(iterator.hasNext()) {
				trailQuestion = (TrailQuestion) iterator.next();

				if(trailQuestion == null) 
					return Response.status(Status.BAD_REQUEST).entity("Invalid file type received").build();

				if(!containsMarkerName(markersList, trailQuestion.markerName))
					return Response.status(Status.BAD_REQUEST).entity("Marker associated with question does not exist").build();

				if(!trailName.equals(trailQuestion.trailName))
					return Response.status(Status.BAD_REQUEST).entity("Trail '"+ trailQuestion.trailName +"' in current question, differs from Trail: '"+ trailName+"' from previous questions.").build();

				String keyString = String.valueOf(Math.random());
				Key questionKey = questionKeyFactory.newKey(keyString); 



				Entity questionEntity = Entity.newBuilder(questionKey)
						.set("questionKey", keyString)
						.set("author", userName)
						.set("trailName", trailQuestion.trailName)
						.set("markerName", trailQuestion.markerName)
						.set("verificationLevel", (int) verificationLevel)

						.set("question", trailQuestion.question)
						.set("optionA", trailQuestion.optionA)
						.set("optionB", trailQuestion.optionB)
						.set("optionC", trailQuestion.optionC)
						.set("optionD", trailQuestion.optionD)
						.set("answer", trailQuestion.answer)
						.build();

				batch.add(questionEntity);	 

			}
			batch.submit();
			return Response.ok("{}").build();

		}catch(Exception e) {
			e.printStackTrace();
		}
		finally{

			if(batch.isActive())
				((Transaction) batch).rollback();
		}
		return null;
	}





	//ROLES:E3, E4, BO, BOQ, ADMIN
	//OP_CODE: T6
	@POST
	@Path("/OPT6OP/{trailName}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response verifyTrailQuestion(@Context HttpServletRequest req, @Context HttpServletResponse res,  @PathParam("trailName")String trailName, String questionKeyString) throws FileUploadException, IOException  {

		KeyFactory questionKeyFactory = datastore.newKeyFactory().addAncestors(PathElement.of("Trail", trailName)).setKind("TrailQuestion");

		String userName = req.getHeader("username");

		Key userKey = userKeyFactory.newKey(userName);

		Entity userEntity = datastore.get(userKey);

		Key questionKey = questionKeyFactory.newKey(questionKeyString);

		Entity questionEntity = datastore.get(questionKey);

		int verificationLevel = 0;

		if(userEntity ==  null)
			return Response.status(Status.NOT_FOUND).entity("User " + userName + " does not exist.").build();

		if(trailName == null) 
			return Response.status(Status.BAD_REQUEST).entity("Resquest doesnt contain a trailName").build();

		if(questionEntity == null) 
			return Response.status(Status.NOT_FOUND).entity("Question does not exist.").build();

		//ver melhor como é que isto fica
		switch(userEntity.getString("user_role")) {

		case "E3" : verificationLevel = 1; break;
		case "E4" :	verificationLevel = 1; break;
		case "BO" : verificationLevel = 1; break;
		case "BOQ" : verificationLevel = 2; break;
		case "ADMIN" : verificationLevel = 1; break;
		default	  : verificationLevel = 0; break;
		}

		if((int) questionEntity.getLong("verificationLevel") >= verificationLevel)
			return Response.status(Status.BAD_REQUEST).entity("User does not have permissions to change verification level").build();
		Transaction txn = null;
		try {
			txn =  datastore.newTransaction();


			Entity newQuestionEntity = Entity.newBuilder(questionKey)
					.set("questionKey", questionEntity.getString("questionKey"))
					.set("author", questionEntity.getString("author"))
					.set("trailName", questionEntity.getString("trailName"))
					.set("markerName", questionEntity.getString("markerName"))
					.set("verificationLevel", verificationLevel)

					.set("question", questionEntity.getString("question"))
					.set("optionA", questionEntity.getString("optionA"))
					.set("optionB", questionEntity.getString("optionB"))
					.set("optionC", questionEntity.getString("optionC"))
					.set("optionD", questionEntity.getString("optionD"))
					.set("answer", questionEntity.getString("answer"))
					.build();

			txn.put(newQuestionEntity); 
			txn.commit();
			return Response.ok("{}").build();

		}catch(Exception e) {
			e.printStackTrace();
		}
		finally{
			if(txn.isActive())
				txn.rollback();

		}
		return null;	
	}

	//ROLES: E3, E4, BO, BOQ, ADMIN
	//OP_CODE: T7
	@SuppressWarnings("rawtypes")
	@POST
	//@Path("/OPT7OP/{trailName}")
	@Path("/OPT7OP")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUnverifiedQuestions(QueryData queryData /*@PathParam("trailName")String trailName*/) throws FileUploadException, IOException  {

		/*if(trailName == null) 
			return Response.status(Status.BAD_REQUEST).entity("null trailName").build();*/

		try {
			if(queryData != null)
				return Response.ok(g.toJson(queries.queryTrailUnverifiedQuestions(queryData, /*trailName*/null))).build();		

			else {
				QueryData newQueryData = new QueryData(null, null, null);
				return Response.ok(g.toJson(queries.queryTrailUnverifiedQuestions(newQueryData, /*trailName*/null))).build();
			}
		}
		catch(Exception e) {
			e.printStackTrace();
			throw(e);
		}
	}

	//ROLES: E1, E2, E3, E4, BO, BOT, BOQ, FOW, FOA, FO, ADMIN
	//OP_CODE: T8
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@POST
	@Path("/OPT8OP/{trailName}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response getTrailQuizz(QueryData queryData, @PathParam("trailName")String trailName) throws FileUploadException, IOException  {
		//WARNING: this beautiful piece of code is the most efficient thing ever made. 
		//you are strongly advised not to read it. proceed at your own discretion

		if(trailName == null) 
			return Response.status(Status.BAD_REQUEST).entity("null trailName").build();


		try {
			List<String> markersList =  getMarkersNamesList(trailName);

			List<List<TrailQuestion>> questionsList = new ArrayList<>(markersList.size());

			for(int i = 0; i < markersList.size(); i++)
				questionsList.add(new LinkedList<>());

			List<TrailQuestion> quizz = new ArrayList<>();

			QueryResult query = queries.queryTrailQuizz(queryData ,trailName);


			Iterator<TrailQuestion> it = query.resultList.iterator();

			TrailQuestion next;

			while(it.hasNext()) {
				next = it.next();
				int index = markersList.indexOf(next.markerName);

				if (index < 0)
					return Response.status(Status.NO_CONTENT).entity("No questions").build();;


					questionsList.get(index).add(next);
			}

			Random generator = new Random();

			//adds 1 question from each marker to the quizz list
			for(List<TrailQuestion> auxList : questionsList) 
				if(!auxList.isEmpty())
					quizz.add(auxList.get(generator.nextInt(auxList.size())));
			return Response.ok(g.toJson(quizz)).build();
		}
		catch(Exception e) {
			e.printStackTrace();
			throw(e);
		}

	}

	//ROLES: E1, E2, E3, E4, BO, BOT, BOQ, FOW, FOA, FO, ADMIN
	//OP_CODE: T9
	@POST
	@Path("/OPT9OP") //post quizz result
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postQuizzResults(QuizzResult result)  {
		Ranking rank = null;
		Transaction txn = null;		
		String userName = result.userName;
		String trailName = result.trailName;
		int right = result.right;
		int wrong = result.wrong;

		if( right < 0 || wrong < 0)
			return Response.status(Status.FORBIDDEN).entity("Invalid parameter values.").build();

		Key userKey = userKeyFactory.newKey(userName);
		if(datastore.get(userKey) ==  null)
			return Response.status(Status.NOT_FOUND).entity("User " + userName + " does not exist.").build();

		Key trailKey = trailKeyFactory.newKey(trailName);
		if(datastore.get(trailKey) ==  null)
			return Response.status(Status.NOT_FOUND).entity("Trail " + trailName + " does not exist.").build();

		Key rankKey = rankingKeyFactory.newKey(userName);
		Entity rankEntity = datastore.get(rankKey);
		if(rankEntity == null)
			rank = new Ranking(right, wrong, userName);
		else {
			right +=  rankEntity.getDouble("right");
			wrong +=  rankEntity.getDouble("wrong");
			rank = new Ranking(right, wrong, userName);
		}


		try {
			txn = datastore.newTransaction();

			Entity rankingEntity = Entity.newBuilder(rankKey)
					.set("right", rank.right)
					.set("wrong", rank.wrong)
					.set("rank", rank.rank)
					.set("userName", rank.userName)
					.build();


			txn.put(rankingEntity);
			txn.commit();
			return Response.ok("User " + userName + " submited a quizz result for trail: " + trailName).build();

		}catch(Exception e) {
			e.printStackTrace();
		}
		finally{
			if(txn.isActive())
				txn.rollback();
		}
		return null;
	}	



	@DELETE
	@Path("/deleteTrailQuestion/{trailName}/{questionKeyString}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response deleteTrailQuestion(@Context HttpServletRequest req, @Context HttpServletResponse res,  @PathParam("trailName")String trailName, @PathParam("questionKeyString")String questionKeyString) throws FileUploadException, IOException  {

		String userName = req.getHeader("username");
		Key userKey = userKeyFactory.newKey(userName);

		Key trailKey = null;
		Entity trailEntity = null;

		Entity userEntity = datastore.get(userKey);


		if(userEntity ==  null)
			return Response.status(Status.NOT_FOUND).entity("User " + userName + " does not exist.").build();

		KeyFactory questionKeyFactory = datastore.newKeyFactory().addAncestors(PathElement.of("Trail", trailName)).setKind("TrailQuestion");

		if(trailName == null) 
			return Response.status(Status.BAD_REQUEST).entity("Resquest doesnt contain a trailName").build();

		trailKey = trailKeyFactory.newKey(trailName);
		trailEntity = datastore.get(trailKey);


		if(trailEntity == null)
			return Response.status(Status.BAD_REQUEST).entity("Trail '"+ trailName +"' given, does not exist.").build();

		String creator = trailEntity.getString("creator");
		String role = userEntity.getString("user_role");
		Transaction txn = datastore.newTransaction();

		try {

			Key questionKey = questionKeyFactory.newKey(questionKeyString);
			Entity questionEntity = txn.get(questionKey);

			if(questionEntity == null) 
				return Response.status(Status.BAD_REQUEST).entity("Invalid question received").build();

			if(role.equals("ADMIN")||role.equals("BO")||role.equals("BOT")||userName.equals(creator)) {	
				txn.delete(questionKey);	 
				txn.commit();

				return Response.ok("{}").build();
			}

		}catch(Exception e) {
			e.printStackTrace();
			txn.rollback();
		}
		return null;

	}


	@DELETE
	@Path("/deleteTrail/{trailName}") // delete trail
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteTrail(@PathParam("trailName")String trailName, @Context HttpServletRequest req) throws ServletException, JsonMappingException, JsonProcessingException {

		Transaction txn = datastore.newTransaction();
		String username = req.getHeader("username");

		Key userKey = userKeyFactory.newKey(username);
		Key trailKey = trailKeyFactory.newKey(trailName);

		try {

			Entity trail = datastore.get(trailKey);
			Entity user = datastore.get(userKey);

			if(trail == null)
				return Response.status(Status.NOT_FOUND).entity("Trail '"+ trailName+"' doesn´t exist.").build();

			if(datastore.get(userKey) ==  null) 
				return Response.status(Status.NOT_FOUND).entity("User " + username + " does not exist.").build();

			String creator = trail.getString("creator");
			String role = user.getString("user_role");

			if(role.equals("ADMIN")||role.equals("BO")||role.equals("BOT")||username.equals(creator)) {
				txn.delete(trailKey);
				txn.commit();
				return Response.ok("Trail deleted").build();
			}

			else {
				return Response.status(Status.FORBIDDEN).entity("Não é o criador ou não tem permissões").build();
			}

		}catch(Exception e) {
			txn.rollback();
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();	
		}
	}


	@SuppressWarnings("unused")
	private TrailQuestion getTrailQuestion(String trailName, String key) {

		KeyFactory questionKeyFactory = datastore.newKeyFactory().addAncestors(PathElement.of("Trail", trailName)).setKind("TrailQuestion");

		Key questionKey = questionKeyFactory.newKey(key); 

		Entity questEnt = datastore.get(questionKey);

		return new TrailQuestion(
				questEnt.getString("questionKey"), 
				questEnt.getString("author"),
				questEnt.getString("trailName"),
				questEnt.getString("markerName"),
				(int) questEnt.getDouble("verificationLevel"),
				questEnt.getString("question"),
				questEnt.getString("optionA"),
				questEnt.getString("optionB"),
				questEnt.getString("optionC"),
				questEnt.getString("optionD"),
				questEnt.getString("answer")
				);
	}


	private boolean containsMarkerName(List<Marker> markers, String markerName) {
		for(Marker aux : markers)
			if(aux.stopover == true)
				if(aux.name.equals(markerName))
					return true;
		return false;
	}

	private List<Marker> getMarkersList(String trailName) throws JsonMappingException, JsonProcessingException{

		BlobId blobId = BlobId.of("trailobyte-275015.appspot.com", "trails/"+ trailName +"/markers.json");	
		Blob blob = storage.get(blobId);

		byte[] content = blob.getContent();
		String data = new String(content);

		ObjectMapper mapper = new ObjectMapper();
		return mapper.readValue(data, new TypeReference<List<Marker>>(){});
	}

	private List<String> getMarkersNamesList(String trailName) throws JsonMappingException, JsonProcessingException{

		List<Marker> markersList = getMarkersList(trailName);

		List<String> list = new ArrayList<>();

		for(Marker aux : markersList)
			if(aux.stopover)
				list.add(aux.name);

		return list;	
	}
}





