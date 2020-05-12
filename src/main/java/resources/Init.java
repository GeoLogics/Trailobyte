package resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.digest.DigestUtils;

import com.google.cloud.Timestamp;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.Transaction;



@Path("/init")
public class Init {
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

	
	@POST
	@Path("/createAdmin")
	public Response CreateADMIN() {
		Transaction txn = null;
		Key userKey = datastore.newKeyFactory().setKind("User").newKey("ADMIN");
		
		try {
			txn = datastore.newTransaction();
			Entity user = Entity.newBuilder(userKey)
					.set("user_pwd", DigestUtils.sha512Hex("ADMIN"))
					.set("user_role", "ADMIN")
					.set("user_creation_time", Timestamp.now())
					.build();
			txn.add(user);
			txn.commit();
			return Response.ok().entity("User ADMIN registered.").build();

		} catch(Exception e) {
			return Response.status(Status.BAD_REQUEST).entity(e.toString()).build();			
		}
		finally {
			if(txn.isActive())
				txn.rollback();
		}
	}
		
	@POST
	@Path("/generateRoleTable")
	public Response GenerateRoleTable() {
		RoleResource roles = new RoleResource();
		return roles.createRolesTable();
	}
	
		
	
	
	
	

}
