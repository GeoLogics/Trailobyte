package resources;

import java.util.Collection;
import java.util.List;
import java.util.ListIterator;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;


import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.ListValue;
import com.google.cloud.datastore.StringValue;
import com.google.cloud.datastore.Transaction;
import com.google.cloud.datastore.Value;
import com.google.cloud.datastore.ValueBuilder;
import com.google.cloud.datastore.Key;

@Path("/roles")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class RoleResource {
	
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory roleKeyFactory = datastore.newKeyFactory().setKind("Role");
	private final KeyFactory userKeyFactory = datastore.newKeyFactory().setKind("User");
	
	public RoleResource() {
		
	}
	
	@POST
	@Path("/createRoleTable")
	public Response createRolesTable() {
		
		Key rolesTableKey = roleKeyFactory.newKey("roletable");
		
		Entity rolesTableEntity = Entity.newBuilder(rolesTableKey)
				.set("E1", ListValue.of("T1","T3","T4"))
				.set("E2", ListValue.of("T1","T2","T3","T4"))
				.set("E3", ListValue.of("T1","T3","T4"))
				.set("E4", ListValue.of("T1","T2","T3","T4"))
				.set("BO", ListValue.of("T1","T2","T3","T4"))
				.set("BOT", ListValue.of("T1","T2","T3","T4"))
				.set("BOQ", ListValue.of("T1","T3","T4"))
				.set("FOW", ListValue.of("T1","T3","T4"))
				.set("FOA", ListValue.of("T1","T3","T4"))
				.set("FO", ListValue.of("T1","T3","T4"))
				.set("ADMIN", ListValue.of("T1","T2","T3","T4"))
				.build();
		
		 Transaction txn = null;
		 
		 try {
			 if(rolesTableEntity != null) {
				 txn = datastore.newTransaction();
				 txn.put(rolesTableEntity);
				 txn.commit();
				 return Response.ok("table created").build();
			 }
		 }catch(Exception e) {
			e.printStackTrace();
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		 }
		 finally{
			 if(txn.isActive())
				 txn.rollback();
		 }
		return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		 
	}

	
	
	public boolean checkPermissions(String userName, String method) {
		Key rolesTableKey = roleKeyFactory.newKey("roletable");
		Entity rolesTable = datastore.get(rolesTableKey);
		
		Key userKey = userKeyFactory.newKey(userName);
		Entity userEntity = datastore.get(userKey);
		
		if(userKey == null || userEntity == null || rolesTableKey == null || rolesTable == null)
			return false;

		ListIterator iterator =  rolesTable.getList(userEntity.getString("user_role")).listIterator();
		while(iterator.hasNext()){
			StringValue next =  (StringValue) iterator.next();
			if(next.get().equals(method))
				return true;
		}
				
		return false;
	}
	
	
	//implementar depois
	public  void addMethod(String method, List<String> roles) {
		Key rolesTableKey = roleKeyFactory.newKey("Roles");
		
		Entity rolesTable = datastore.get(rolesTableKey);
		
		Collection<Value<?>> values = rolesTable.getProperties().values();
		for(String aux : roles)
		{
			rolesTable.getList(aux);
			
			
		}
	}
}
