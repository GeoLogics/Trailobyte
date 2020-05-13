package resources;

import java.util.ArrayList;
import java.util.Arrays;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.ws.rs.Consumes;
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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.google.appengine.repackaged.com.google.gson.reflect.TypeToken;

import com.google.cloud.Timestamp;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.EntityQuery;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;

import com.google.cloud.datastore.PathElement;

import com.google.cloud.datastore.Query;
import com.google.cloud.datastore.QueryResults;

import com.google.cloud.datastore.Transaction;
import com.google.cloud.datastore.Value;
import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
import com.google.cloud.datastore.StructuredQuery.OrderBy;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.cloud.datastore.Cursor;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.protobuf.ByteString;

import DTOs.QueryData;
import DTOs.VerifyTrailObject;
import util.LongURL;
import util.Marker;
import util.Review;
import util.Trail;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;



@Path("/trail")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class TrailResource {

	//A Logger Object
	private static final Logger LOGGER = Logger.getLogger(LoginResource.class.getName());
	
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final Storage storage = StorageOptions.newBuilder().setProjectId("trailobyte-275015").build().getService();
	private final KeyFactory trailKeyFactory = datastore.newKeyFactory().setKind("Trail");
	private final KeyFactory userKeyFactory = datastore.newKeyFactory().setKind("User");
	private final KeyFactory reviewKeyFactory = datastore.newKeyFactory().setKind("Review");
	private final KeyFactory tokenKeyFactory = datastore.newKeyFactory().setKind("Token");
	private final RoleResource roles = new RoleResource();
	private final Utils utils = new Utils();

	private final Gson g = new Gson();
	
	
	
	
	public TrailResource() {
		
	}
	
	
	//ROLES: E1, E2, E3, E4, BO, BOT, BOQ, FOW, FOA, FO, ADMIN
	//OP_CODE: T1
	@SuppressWarnings("deprecation")
	@POST
	@Path("/posttrail")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response postTrail(@Context HttpServletRequest req, @Context HttpServletResponse res)  throws ServletException, IOException, FileUploadException {
		
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
         
         if(!utils.Authentication(authKey, username))
        	 return Response.status(Status.FORBIDDEN).entity("User: " + username + " does not have a valid session key.").build();
         if(!roles.checkPermissions(username, "T1"))
        	 return Response.status(Status.FORBIDDEN).entity("User: " + username + " does not have the necessary permissions for this operation.").build();
         
         try {
			 while(iterator.hasNext()) {
	        	 item = iterator.next();
	        	 InputStream stream = item.openStream();
	        	 if(item.isFormField()) {
	        		JsonParser jsonParser = new JsonParser();
	        		JsonObject jsonObject = (JsonObject)jsonParser.parse(new InputStreamReader(item.openStream(), "UTF-8"));
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
					.set("trailImg", trail.trailImg)
					.set("creator", trail.creator)
					
					.set("markers", markersMediaLink)
					.set("start", trail.markers.get(0).name)
					.set("end", trail.markers.get(trail.markers.size()-1).name)
					
					.set("avgRating", trail.avgRating)
					.set("nRatings", trail.nRatings)
					.set("dist", trail.dist)
					
					.set("verified", trail.verified)
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
	@Path("/verifytrail")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response verifyTrail(@Context HttpServletRequest req, @Context HttpServletResponse res, VerifyTrailObject data) throws ServletException{
		Transaction txn = null;
		
		String authKey = req.getHeader("Authorization").split(" ")[1];
        String username = req.getHeader("username");
         
        if(!utils.Authentication(authKey, username))
        	 return Response.status(Status.FORBIDDEN).entity("User: " + username + " does not have a valid session key.").build();
        if(!roles.checkPermissions(username, "T2"))
        	 return Response.status(Status.FORBIDDEN).entity("User: " + username + " does not have the necessary permissions for this operation.").build();
		 
		Key trailKey = trailKeyFactory.newKey(data.trailName);
		Entity trailEntity = datastore.get(trailKey);
		if(trailKey == null || trailEntity == null)
			return Response.status(Status.NOT_FOUND).entity("Trail '"+ data.trailName +"' doesn´t exist.").build();
		
		Key userKey = userKeyFactory.newKey(data.userName);
		Entity userEntity = datastore.get(userKey);
		if(userKey == null || userEntity == null)
			return Response.status(Status.NOT_FOUND).entity("User '"+ data.userName +"' doesn´t exist.").build();
		
		 
		try {
			 txn = datastore.newTransaction();
			 
			 Entity newTrailEntity = Entity.newBuilder(trailKey)
					.set("name", trailEntity.getString("name"))
					.set("description", trailEntity.getString("description"))
					.set("trailImg", trailEntity.getString("trailImg"))
					.set("creator", trailEntity.getString("creator"))
					
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
	@Path("/gettrail/{trailName}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getTrail(@Context HttpServletRequest req, @Context HttpServletResponse res, @PathParam("trailName")String trailName) throws ServletException, JsonMappingException, JsonProcessingException {
		
		
		String authKey = req.getHeader("Authorization").split(" ")[1];
        String username = req.getHeader("username");
         
        if(!utils.Authentication(authKey, username))
        	 return Response.status(Status.FORBIDDEN).entity("User: " + username + " does not have a valid session key.").build();
        if(!roles.checkPermissions(username, "T3"))
        	 return Response.status(Status.FORBIDDEN).entity("User: " + username + " does not have the necessary permissions for this operation.").build();
		 
		try {
			Key trailKey = trailKeyFactory.newKey(trailName);
			Entity trailEntity = datastore.get(trailKey);
			
			if(trailEntity == null)
				return Response.status(Status.NOT_FOUND).entity("Trail '"+ trailName+"' doesn´t exist.").build();
				
			String name = trailEntity.getString("name");
			String description = trailEntity.getString("description");
			String trailImg = trailEntity.getString("trailImg");
			String creator = trailEntity.getString("creator");
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
	     	
			Trail trail = new Trail(name, description, trailImg, creator, start, end, markerList, avgRating, nRatings, dist, verified);
			
			return Response.ok(g.toJson(trail)).build();
			
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	//ROLES: E1, E2, E3, E4, BO, BOT, BOQ, FOW, FOA, FO, ADMIN
	//OP_CODE: T4
	@POST
	@Path("/postreview")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postReview(Review review)  {
		Transaction txn = null;		
		String userName = review.author;
		String trailName = review.trailName;
		String comment = review.comment;
		double rating = review.rating;
		
		if(!roles.checkPermissions(userName, "T4"))
			return Response.status(Status.FORBIDDEN).entity("User '"+ userName +"' doesn´t have the permissions to access this operation").build();
					
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

		
	

	

	
	
}
