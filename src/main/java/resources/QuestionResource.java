package resources;


import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
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

import util.QuestionListQuestionsTF;
import util.QuestionListAnswerTF;
import util.QuestionMultipleChoise;
import util.QuestionOrder;
import util.QuestionTrueOrFalse;



@Path("/question")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class QuestionResource {
	
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory questionKeyFactory = datastore.newKeyFactory().setKind("Question");
	
	private final Gson g = new Gson();
	
	public QuestionResource() {
		
	}
	
	@POST
	@Path("/postQMC")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postQuestionMultipleChoise(QuestionMultipleChoise question) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key questionKey = questionKeyFactory.newKey(question.id);
			Entity questionMCEntity = Entity.newBuilder(questionKey)
					.set("enunciated", question.enunciated)
					.set("question",question.question)
					.set("optionA", question.optionA)
					.set("optionB", question.optionB)
					.set("optionC", question.optionC)
					.set("optionD", question.optionD)
					.set("correctOption", question.correctOption)
					.build();
			
			txn.put(questionMCEntity);
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
	@Path("/getQMC")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getQuestionMultipleChoise(int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key questionKey = questionKeyFactory.newKey(id);
			
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
	
	
	
	@POST
	@Path("/postQO")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postQuestionOrder(QuestionOrder question) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key questionKey = questionKeyFactory.newKey(question.id);
			Entity questionQOEntity = Entity.newBuilder(questionKey)
					.set("enunciated", question.enunciated)
					.set("question", question.question)
					.set("options", g.toJson(question.options))
					.set("order", g.toJson(question.order))
					.build();
			
			txn.put(questionQOEntity);
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
	@Path("/getQO")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getQuestionOrder(int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key questionKey = questionKeyFactory.newKey(id);
			
			Entity questionOEntity = datastore.get(questionKey);
			
			String enunciated = questionOEntity.getString("enunciated");
			String questionS = questionOEntity.getString("question");
			String options = questionOEntity.getString("options");
			String order = questionOEntity.getString("order");
			
			QuestionOrder question = new QuestionOrder(
					enunciated, questionS,
					options, order, id);
			
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
			Key questionKey = questionKeyFactory.newKey(question.id);
			Entity questionTFEntity = Entity.newBuilder(questionKey)
					.set("enunciated", question.enunciated)
					.set("questions", g.toJson(question.questionsList))
					.set("answers", g.toJson(question.answersList))
					.set("numberOfQuestions", question.numberOfQuestions)
					.build();
			
			txn.put(questionTFEntity);
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
	@Path("/getQTF")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getQuestionTrueOrFalse(int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			Key questionKey = questionKeyFactory.newKey(id);
			
			Entity questionTFEntity = datastore.get(questionKey);
			
			String enunciated = questionTFEntity.getString("enunciated");
			String questionsS = questionTFEntity.getString("questions");
			String answers = questionTFEntity.getString("answers");
			int numberOfQuestions = (int) questionTFEntity.getLong("numberOfQuestions");
			
			//Gson g = new Gson(); 
			QuestionListQuestionsTF questions = g.fromJson(questionsS, QuestionListQuestionsTF.class);
			QuestionListAnswerTF answersList = g.fromJson(answers, QuestionListAnswerTF.class);
			
			QuestionTrueOrFalse question = new QuestionTrueOrFalse(
					enunciated, questions, numberOfQuestions,
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
