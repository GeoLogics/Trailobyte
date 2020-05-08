package resources;


import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.Transaction;
import com.google.gson.Gson;

import util.Questions.QuestionListAnswerTF;
import util.Questions.QuestionListOptionsQO;
import util.Questions.QuestionListOrderQO;
import util.Questions.QuestionListQuestionsTF;
import util.Questions.QuestionMultipleChoise;
import util.Questions.QuestionOrder;
import util.Questions.QuestionTrueOrFalse;



@Path("/TempQuestion")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class TempQuestionResource {
	
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory questionTempQMCKeyFactory = datastore.newKeyFactory().setKind("TempQuestionQMC");
	private final KeyFactory questionTempQOKeyFactory = datastore.newKeyFactory().setKind("TempQuestionQO");
	private final KeyFactory questionTempQTFKeyFactory = datastore.newKeyFactory().setKind("TempQuestionQTF");
	
	private final KeyFactory questionsTempLastIDKeyFactory = datastore.newKeyFactory().setKind("TempQuestionsLastID");
	/*private final KeyFactory questionQOIDKeyFactory = datastore.newKeyFactory().setKind("QOLastID");
	private final KeyFactory questionQTFIDKeyFactory = datastore.newKeyFactory().setKind("QTFLastID");*/

	
	private final Gson g = new Gson();
	
	public TempQuestionResource() {
		
	}
	
	/*@GET
	@Path("/getRandom")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getQuestionsAtRandom() {
		
		/*List<String> types = new ArrayList<String>();
		
		types.add("QMC");
		types.add("QO");
		types.add("QTF");*/
		
		/*Random rand = new Random();
		
		int QMCrand_int1 = rand.nextInt(1000); 
		int QMCrand_int1 = rand.nextInt(1000); 
		int QMCrand_int1 = rand.nextInt(1000); 
		int QMCrand_int1 = rand.nextInt(1000); 
		int QMCrand_int1 = rand.nextInt(1000); 
		int QMCrand_int1 = rand.nextInt(1000); 

		
		return null;
	}*/
	
	
	/*
	 //ROLES: ADMIN
	//OP_CODE: PTQMCID1
	@POST
	@Path("/postQMCID/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postTempQuestionMultipleChoiseID(@PathParam("id") int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key QMCIDKey = questionsTempLastIDKeyFactory.newKey("QMCID");
			Entity QMCIDEntity = Entity.newBuilder(QMCIDKey)
					.set("LastID", id)
					.build();
			
			txn.put(QMCIDEntity);
			txn.commit();
			return Response.ok("postQMCID").build();
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		finally{
			if(txn.isActive())
				txn.rollback();
		}
		return null;
	}
	
	//ROLES: ADMIN
	//OP_CODE: PTQOID1
	@POST
	@Path("/postQOID/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postTempQuestionOrderID(@PathParam("id") int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key QOIDKey = questionsTempLastIDKeyFactory.newKey("QOID");
			Entity QOIDEntity = Entity.newBuilder(QOIDKey)
					.set("LastID", id)
					.build();
			
			txn.put(QOIDEntity);
			txn.commit();
			return Response.ok("postQOID").build();
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		finally{
			if(txn.isActive())
				txn.rollback();
		}
		return null;
	}
	
	
	//ROLES: ADMIN
	//OP_CODE: PTQTFID1
	@POST
	@Path("/postQTFID/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postTempQuestionTrueOrFalseID(@PathParam("id") int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key QTFIDKey = questionsTempLastIDKeyFactory.newKey("QTFID");
			Entity QTFIDEntity = Entity.newBuilder(QTFIDKey)
					.set("LastID", id)
					.build();
			
			txn.put(QTFIDEntity);
			txn.commit();
			return Response.ok("postQTFID").build();
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		finally{
			if(txn.isActive())
				txn.rollback();
		}
		return null;
	}*/
	
	
	 //ROLES: E1, E2, E3, E4
	//OP_CODE: PTQMC1
	@POST
	@Path("/postQMC")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postTempQuestionMultipleChoise(QuestionMultipleChoise question) {
		
		Transaction txn = datastore.newTransaction();
		try {
			
			Key idKey = questionsTempLastIDKeyFactory.newKey("QMCID");
			
			Entity questionLastIDEntity = datastore.get(idKey);
			
			int idFDB = (int) questionLastIDEntity.getLong("LastID");
			idFDB++;
			
			Key QMCIDKey = questionsTempLastIDKeyFactory.newKey("QMCID");
			Entity QMCIDEntity = Entity.newBuilder(QMCIDKey)
					.set("LastID", idFDB)
					.build();
			
			Key questionKey = questionTempQMCKeyFactory.newKey(idFDB);
			Entity questionMCEntity = Entity.newBuilder(questionKey)
					.set("enunciated", question.enunciated)
					.set("question",question.question)
					.set("optionA", question.optionA)
					.set("optionB", question.optionB)
					.set("optionC", question.optionC)
					.set("optionD", question.optionD)
					.set("correctOption", question.correctOption)
					.build();
			
			txn.put(questionMCEntity, QMCIDEntity);
			txn.commit();
			return Response.ok("postQMC").build();
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		finally{
			if(txn.isActive())
				txn.rollback();
		}
		return null;
	}
	
	 //ROLES: E3, BOQ, BO, ADMIN
	//OP_CODE: GTQMC1
	@GET
	@Path("/getQMC/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getTempQuestionMultipleChoise(@PathParam("id") int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key questionKey = questionTempQMCKeyFactory.newKey(id);
			
			Entity questionMCEntity = datastore.get(questionKey);
			
			String enunciated = questionMCEntity.getString("enunciated");
			String questionS = questionMCEntity.getString("question");
			String optionA = questionMCEntity.getString("optionA");
			String optionB = questionMCEntity.getString("optionB");
			String optionC = questionMCEntity.getString("optionC");
			String optionD = questionMCEntity.getString("optionD");
			String correctOption = questionMCEntity.getString("correctOption");
			
			QuestionMultipleChoise question = new QuestionMultipleChoise(
					enunciated, questionS,
					optionA, optionB,
					optionC, optionD,
					correctOption, id);
			
			return Response.ok(g.toJson(question)).build();
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		finally{
			if(txn.isActive())
				txn.rollback();
		}
		return null;
	}
	
	
	 //ROLES: E1, E2, E3, E4
	//OP_CODE: PTQO1
	@POST
	@Path("/postQO")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postTempQuestionOrder(QuestionOrder question) {
		
		Transaction txn = datastore.newTransaction();
		try {
			
			
			Key idKey = questionsTempLastIDKeyFactory.newKey("QOID");
			
			Entity questionLastIDEntity = datastore.get(idKey);
			
			int idFDB = (int) questionLastIDEntity.getLong("LastID");
			idFDB++;
			
			Key QOIDKey = questionsTempLastIDKeyFactory.newKey("QOID");
			Entity QOIDEntity = Entity.newBuilder(QOIDKey)
					.set("LastID", idFDB)
					.build();
			
			
			
			Key questionKey = questionTempQOKeyFactory.newKey(idFDB);
			Entity questionQOEntity = Entity.newBuilder(questionKey)
					.set("enunciated", question.enunciated)
					.set("question", question.question)
					.set("options", g.toJson(question.options))
					.set("byOrder", g.toJson(question.byOrder))
					.build();
			
			txn.put(questionQOEntity, QOIDEntity);
			txn.commit();
			return Response.ok("postQO").build();
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		finally{
			if(txn.isActive())
				txn.rollback();
		}
		return null;
	}
	
	 //ROLES: E3, BOQ, BO, ADMIN
	//OP_CODE: GTQO1
	@GET
	@Path("/getQO/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getTempQuestionOrder(@PathParam("id") int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key questionKey = questionTempQOKeyFactory.newKey(id);
			
			Entity questionOEntity = datastore.get(questionKey);
			
			String enunciated = questionOEntity.getString("enunciated");
			String questionS = questionOEntity.getString("question");
			String optionsS = questionOEntity.getString("options");
			String byOrderS = questionOEntity.getString("byOrder");
			

			
			QuestionListOptionsQO options = g.fromJson(optionsS, QuestionListOptionsQO.class);
			QuestionListOrderQO byOrder = g.fromJson(byOrderS, QuestionListOrderQO.class);
	
			QuestionOrder question = new QuestionOrder(
					enunciated, questionS,
					options, byOrder, id);
			
			return Response.ok(g.toJson(question)).build();
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		finally{
			if(txn.isActive())
				txn.rollback();
		}
		return null;
	}
	
	 //ROLES: E1, E2, E3, E4
	//OP_CODE: PTQTF1
	@POST
	@Path("/postQTF")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postTempQuestionTrueOrFalse(QuestionTrueOrFalse question) {
		
		Transaction txn = datastore.newTransaction();
		try {
			
			
			Key idKey = questionsTempLastIDKeyFactory.newKey("QTFID");
			
			Entity questionLastIDEntity = datastore.get(idKey);
			
			int idFDB = (int) questionLastIDEntity.getLong("LastID");
			idFDB++;
			
			Key QTFIDKey = questionsTempLastIDKeyFactory.newKey("QTFID");
			Entity QTFIDEntity = Entity.newBuilder(QTFIDKey)
					.set("LastID", idFDB)
					.build();
			
			
			Key questionKey = questionTempQTFKeyFactory.newKey(idFDB);
			Entity questionTFEntity = Entity.newBuilder(questionKey)
					.set("enunciated", question.enunciated)
					.set("question", question.question)
					.set("questions", g.toJson(question.questionsList))
					.set("answers", g.toJson(question.answersList))
					.set("numberOfQuestions", question.numberOfQuestions)
					.build();
			
			txn.put(questionTFEntity, QTFIDEntity);
			txn.commit();
			return Response.ok("postQTF").build();
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		finally{
			if(txn.isActive())
				txn.rollback();
		}
		return null;
	}
	
	
	
	 //ROLES: E3, BOQ, BO, ADMIN
	//OP_CODE: GTQTF1
	@GET
	@Path("/getQTF/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getTempQuestionTrueOrFalse(@PathParam("id") int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key questionKey = questionTempQTFKeyFactory.newKey(id);
			
			Entity questionTFEntity = datastore.get(questionKey);
			
			String enunciated = questionTFEntity.getString("enunciated");
			String questionS = questionTFEntity.getString("question");
			String questionsS = questionTFEntity.getString("questions");
			String answers = questionTFEntity.getString("answers");
			int numberOfQuestions = (int) questionTFEntity.getLong("numberOfQuestions");
			
			//Gson g = new Gson(); 
			QuestionListQuestionsTF questions = g.fromJson(questionsS, QuestionListQuestionsTF.class);
			QuestionListAnswerTF answersList = g.fromJson(answers, QuestionListAnswerTF.class);
			
			QuestionTrueOrFalse question = new QuestionTrueOrFalse(
					enunciated, questionS, questions, numberOfQuestions,
					answersList, id);
			
			return Response.ok(g.toJson(question)).build();
			
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
