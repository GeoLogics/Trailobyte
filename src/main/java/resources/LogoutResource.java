package resources;

import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.PathElement;
import com.google.cloud.datastore.Transaction;



@Path("/logout")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class LogoutResource {

	private static final Logger LOG = Logger.getLogger(LogoutResource.class.getName());
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory userKeyFactory = datastore.newKeyFactory().setKind("User");



	//XD?
	@DELETE
	@Path("/v1")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response doLogout(@Context HttpServletRequest req) {
		String username = req.getHeader("username");
		String verifier = req.getHeader("verifier");
		
		
		LOG.fine("Attempt to logout user: " + username);
		
		
		Key userKey = userKeyFactory.newKey(username);
		Transaction txn = datastore.newTransaction();
		
		try {
			Entity user = txn.get(userKey);

			if(user!= null) {
				Key tokenKey = datastore.newKeyFactory().setKind("Token").newKey(username);
				Entity token = datastore.get(tokenKey);


				if(token == null) {
					txn.rollback();
					return Response.status(Status.NOT_FOUND).entity("Token not found .").build();

				}else
					txn.delete(tokenKey);
					txn.commit();
				return Response.ok().build();

			}
			else {
				LOG.warning("Failed logout attempt for username: " + username);
				return Response.status(Status.FORBIDDEN).build();
			}


		}catch (Exception e) {
			txn.rollback();
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();	
		}


	}

}
