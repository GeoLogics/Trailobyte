package resources;

import java.util.Collection;
import java.util.List;
import java.util.ListIterator;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
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

import DTOs.UserRoleData;
import util.RegisterData;

import com.google.cloud.datastore.Key;

@Path("/roles")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class RoleResource {
	
	
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory roleKeyFactory = datastore.newKeyFactory().setKind("Role");
	private final KeyFactory userKeyFactory = datastore.newKeyFactory().setKind("User");
	
	private static enum roles{E1, E2, E3, E4, BO, BOT, BOQ, FOW, FOA, FO, ADMIN};
	
	public RoleResource() {
		
	}
	
	public Response createRolesTable() {
		
		Key rolesTableKey = roleKeyFactory.newKey("roletable");
		
		Entity rolesTableEntity = Entity.newBuilder(rolesTableKey)
				.set("E1", ListValue.of("T1","T3","T4"))
				.set("E2", ListValue.of("T1","T2","T3","T4"))
				.set("E3", ListValue.of("T1","T3","T4"))
				.set("E4", ListValue.of("T1","T2","T3","T4"))
				.set("BO", ListValue.of("T1","T2","T3","T4","PQMC1","PQO1","PQTF1"))
				.set("BOT", ListValue.of("T1","T2","T3","T4"))
				.set("BOQ", ListValue.of("T1","T3","T4","PQMC1","PQO1","PQTF1"))
				.set("FOW", ListValue.of("T1","T3","T4"))
				.set("FOA", ListValue.of("T1","T3","T4"))
				.set("FO", ListValue.of("T1","T3","T4"))
				.set("ADMIN", ListValue.of("T1","T2","T3","T4","PQMC1","PQO1","PQTF1","X1"))
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

	//ROLES: ADMIN
	//OP_CODE: X1
	@PUT
	@Path("/changerole")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response changeUserRole(@Context HttpServletRequest req, UserRoleData data) {
		String admin_authKey = req.getHeader("Authorization").split(" ")[1];
		String admin_username = req.getHeader("username");
		
		Utils util = new Utils();
		Transaction txn = null;
		
		if(!util.Authentication(admin_authKey, admin_username)) 
			return Response.status(Status.FORBIDDEN).entity("User: " + admin_username + " does not have a valid session key.").build();

		if(!checkPermissions(admin_username, "X1"))
			return Response.status(Status.FORBIDDEN).entity("User: " + admin_username + " does not have the necessary permissions for this operation.").build();
		
		if(data.role.equals("ADMIN"))
			return Response.status(Status.FORBIDDEN).entity("Cannot change user roles to ADMIN").build();
		
		if(!containsRole(data.role))
			return Response.status(Status.FORBIDDEN).entity("Role "+ data.role+" is not valid.").build();
		
		try {
			txn = datastore.newTransaction();
			//user to be changed
			Key userKey2 = userKeyFactory.newKey(data.username);
			Entity user2 = datastore.get(userKey2);

			if( user2 != null) {

				user2 = Entity.newBuilder(userKey2)
						.set("user_pwd", user2.getString("user_pwd"))
						.set("user_email", user2.getString("user_email"))
						.set("user_telephone", user2.getString("user_telephone"))
						.set("user_mobphone", user2.getString("user_mobphone"))
						.set("user_address", user2.getString("user_address"))
						.set("user_role", data.role)
						.set("user_creation_time", user2.getTimestamp("user_creation_time"))
						.build();

				txn.put(user2);
				txn.commit();
				return Response.ok().entity("User "+ data.username + " role changed to "+ data.role+".").build();				
			}
			return Response.status(Status.NOT_FOUND).entity("User does not exist.").build();	
			
		}catch(Exception e) {
				return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}finally {
			if(txn.isActive())
				txn.rollback();
		}
	}
	
	
	
	
	public boolean checkPermissions(String userName, String method) {
		
		Key userKey = userKeyFactory.newKey(userName);
		Entity userEntity = datastore.get(userKey);
		
		if(!containsRole(userEntity.getString("user_role")))
			return false;
		
		Key rolesTableKey = roleKeyFactory.newKey("roletable");
		Entity rolesTable = datastore.get(rolesTableKey);
		
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
	
	public static boolean containsRole(String testRole) {

	    for (roles role : roles.values()) 
	        if (testRole.equals(role.toString())) 
	            return true;
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
