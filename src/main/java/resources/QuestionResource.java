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
import util.Questions.QuestionMultipleChoice;
import util.Questions.QuestionOrder;
import util.Questions.QuestionTrueOrFalse;



@Path("/question")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class QuestionResource {
	
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory questionQMCKeyFactory = datastore.newKeyFactory().setKind("QuestionQMC");
	private final KeyFactory questionQOKeyFactory = datastore.newKeyFactory().setKind("QuestionQO");
	private final KeyFactory questionQTFKeyFactory = datastore.newKeyFactory().setKind("QuestionQTF");
	
	private final KeyFactory questionsLastIDKeyFactory = datastore.newKeyFactory().setKind("QuestionsLastID");
	/*private final KeyFactory questionQOIDKeyFactory = datastore.newKeyFactory().setKind("QOLastID");
	private final KeyFactory questionQTFIDKeyFactory = datastore.newKeyFactory().setKind("QTFLastID");*/

	
	private final Gson g = new Gson();
	
	public QuestionResource() {
		
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
	@POST
	@Path("/postQMCID/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postQuestionMultipleChoiseID(@PathParam("id") int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key QMCIDKey = questionsLastIDKeyFactory.newKey("QMCID");
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
	
	@POST
	@Path("/postQOID/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postQuestionOrderID(@PathParam("id") int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key QOIDKey = questionsLastIDKeyFactory.newKey("QOID");
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
	
	@POST
	@Path("/postQTFID/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postQuestionTrueOrFalseID(@PathParam("id") int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key QTFIDKey = questionsLastIDKeyFactory.newKey("QTFID");
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
	
	
	@POST
	@Path("/postQMC")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postQuestionMultipleChoise(QuestionMultipleChoice question) {
		
		Transaction txn = datastore.newTransaction();
		try {
			
			Key idKey = questionsLastIDKeyFactory.newKey("QMCID");
			
			Entity questionLastIDEntity = datastore.get(idKey);
			
			int idFDB = (int) questionLastIDEntity.getLong("LastID");
			idFDB++;
			
			Key QMCIDKey = questionsLastIDKeyFactory.newKey("QMCID");
			Entity QMCIDEntity = Entity.newBuilder(QMCIDKey)
					.set("LastID", idFDB)
					.build();
			
			Key questionKey = questionQMCKeyFactory.newKey(idFDB);
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
	
	
	@GET
	@Path("/getQMC/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getQuestionMultipleChoise(@PathParam("id") int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key questionKey = questionQMCKeyFactory.newKey(id);
			
			Entity questionMCEntity = datastore.get(questionKey);
			
			String enunciated = questionMCEntity.getString("enunciated");
			String questionS = questionMCEntity.getString("question");
			String optionA = questionMCEntity.getString("optionA");
			String optionB = questionMCEntity.getString("optionB");
			String optionC = questionMCEntity.getString("optionC");
			String optionD = questionMCEntity.getString("optionD");
			String correctOption = questionMCEntity.getString("correctOption");
			
			QuestionMultipleChoice question = new QuestionMultipleChoice(
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
	
	
	
	@POST
	@Path("/postQO")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postQuestionOrder(QuestionOrder question) {
		
		Transaction txn = datastore.newTransaction();
		try {
			
			
			Key idKey = questionsLastIDKeyFactory.newKey("QOID");
			
			Entity questionLastIDEntity = datastore.get(idKey);
			
			int idFDB = (int) questionLastIDEntity.getLong("LastID");
			idFDB++;
			
			Key QOIDKey = questionsLastIDKeyFactory.newKey("QOID");
			Entity QOIDEntity = Entity.newBuilder(QOIDKey)
					.set("LastID", idFDB)
					.build();
			
			
			
			Key questionKey = questionQOKeyFactory.newKey(idFDB);
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
	
	
	@GET
	@Path("/getQO/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getQuestionOrder(@PathParam("id") int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key questionKey = questionQOKeyFactory.newKey(id);
			
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
	
	
	@POST
	@Path("/postQTF")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postQuestionTrueOrFalse(QuestionTrueOrFalse question) {
		
		Transaction txn = datastore.newTransaction();
		try {
			
			
			Key idKey = questionsLastIDKeyFactory.newKey("QTFID");
			
			Entity questionLastIDEntity = datastore.get(idKey);
			
			int idFDB = (int) questionLastIDEntity.getLong("LastID");
			idFDB++;
			
			Key QTFIDKey = questionsLastIDKeyFactory.newKey("QTFID");
			Entity QTFIDEntity = Entity.newBuilder(QTFIDKey)
					.set("LastID", idFDB)
					.build();
			
			
			Key questionKey = questionQTFKeyFactory.newKey(idFDB);
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
	
	
	
	
	@GET
	@Path("/getQTF/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getQuestionTrueOrFalse(@PathParam("id") int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key questionKey = questionQTFKeyFactory.newKey(id);
			
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
