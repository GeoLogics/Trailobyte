package resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Entity.Builder;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.Transaction;
import com.google.gson.Gson;

import util.Questions.QuestionMultipleChoise;

@Path("/ValidateQuestion")
public class ValidateQuestionResource {
	
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	
	private final KeyFactory questionTempQMCKeyFactory = datastore.newKeyFactory().setKind("TempQuestionQMC");
	private final KeyFactory questionTempQOKeyFactory = datastore.newKeyFactory().setKind("TempQuestionQO");
	private final KeyFactory questionTempQTFKeyFactory = datastore.newKeyFactory().setKind("TempQuestionQTF");
	
	private final KeyFactory questionQMCKeyFactory = datastore.newKeyFactory().setKind("QuestionQMC");
	private final KeyFactory questionQOKeyFactory = datastore.newKeyFactory().setKind("QuestionQO");
	private final KeyFactory questionQTFKeyFactory = datastore.newKeyFactory().setKind("QuestionQTF");
	
	private final KeyFactory questionsLastIDKeyFactory = datastore.newKeyFactory().setKind("QuestionsLastID");
	/*private final KeyFactory questionQOIDKeyFactory = datastore.newKeyFactory().setKind("QOLastID");
	private final KeyFactory questionQTFIDKeyFactory = datastore.newKeyFactory().setKind("QTFLastID");*/

	
	private final Gson g = new Gson();
	
	public ValidateQuestionResource() {
		
	}
	
	@POST
	@Path("/TempQMC/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response validateQuestionMultipleChoise(@PathParam("id") int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			
			Key questionTempKey = questionTempQMCKeyFactory.newKey(id);
			
			Entity questionTempQMCEntity = datastore.get(questionTempKey);
			
			
			Key idKey = questionsLastIDKeyFactory.newKey("QMCID");
			
			Entity questionLastIDEntity = datastore.get(idKey);
			
			int idFDB = (int) questionLastIDEntity.getLong("LastID");
			idFDB++;
			
			Key QMCIDKey = questionsLastIDKeyFactory.newKey("QMCID");
			Entity QMCIDEntity = Entity.newBuilder(QMCIDKey)
					.set("LastID", idFDB)
					.build();
			
			
			long idNew = (long) idFDB;
			Key questionKey = questionQMCKeyFactory.newKey(idFDB);
			//Key destinationKey = KeyFactory.createKey(questionKey.getKind(), idNew);
			
			//Entity questionEntity = Entity.newBuilder(questionKey).build();
			String qt = questionTempQMCEntity.toString();
			Entity questionEntity = Entity.newBuilder(questionKey, questionTempQMCEntity).build();
			
			
			txn.put(questionEntity, QMCIDEntity);
			txn.delete(questionTempKey);
			txn.commit();
			return Response.ok("validated QMC").build();
			
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
	@Path("/TempQO/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response validateQuestionOrder(@PathParam("id") int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			
			Key questionTempKey = questionTempQOKeyFactory.newKey(id);
			
			Entity questionTempQOEntity = datastore.get(questionTempKey);
			
			
			Key idKey = questionsLastIDKeyFactory.newKey("QOID");
			
			Entity questionLastIDEntity = datastore.get(idKey);
			
			int idFDB = (int) questionLastIDEntity.getLong("LastID");
			idFDB++;
			
			Key QOIDKey = questionsLastIDKeyFactory.newKey("QOID");
			Entity QOIDEntity = Entity.newBuilder(QOIDKey)
					.set("LastID", idFDB)
					.build();
			
			
			long idNew = (long) idFDB;
			Key questionKey = questionQOKeyFactory.newKey(idFDB);
			//Key destinationKey = KeyFactory.createKey(questionKey.getKind(), idNew);
			
			Entity questionEntity = Entity.newBuilder(questionKey, questionTempQOEntity).build();
			
			
			txn.put(questionEntity, QOIDEntity);
			txn.delete(questionTempKey);
			txn.commit();
			return Response.ok("validated QO").build();
			
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
	@Path("/TempQTF/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response validateQuestionTrueOrFalse(@PathParam("id") int id) {
		
		Transaction txn = datastore.newTransaction();
		try {
			
			Key questionTempKey = questionTempQTFKeyFactory.newKey(id);
			
			Entity questionTempQTFEntity = datastore.get(questionTempKey);
			
			
			Key idKey = questionsLastIDKeyFactory.newKey("QTFID");
			
			Entity questionLastIDEntity = datastore.get(idKey);
			
			int idFDB = (int) questionLastIDEntity.getLong("LastID");
			idFDB++;
			
			Key QTFIDKey = questionsLastIDKeyFactory.newKey("QTFID");
			Entity QTFIDEntity = Entity.newBuilder(QTFIDKey)
					.set("LastID", idFDB)
					.build();
			
			
			long idNew = (long) idFDB;
			Key questionKey = questionQTFKeyFactory.newKey(idFDB);
			//Key destinationKey = KeyFactory.createKey(questionKey.getKind(), idNew);
			
			Entity questionEntity = Entity.newBuilder(questionKey, questionTempQTFEntity).build();
			
			
			txn.put(questionEntity, QTFIDEntity);
			txn.delete(questionTempKey);
			txn.commit();
			return Response.ok("validated QTF").build();
			
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