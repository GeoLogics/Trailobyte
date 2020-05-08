package resources;

import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
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

import util.AuthToken;
import util.LoginData;
import util.Validity;

@Path("/logout")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class LogoutResource {

	private static final Logger LOG = Logger.getLogger(LogoutResource.class.getName());
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory userKeyFactory = datastore.newKeyFactory().setKind("User");

	/*//XD?
	@DELETE
	@Path("/v1")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response doLogout(String username) {
		LOG.fine("Attempt to logout user: " + username);

		Key userKey = userKeyFactory.newKey(username);
		Transaction txn = datastore.newTransaction();

		try {
			Entity user = txn.get(userKey);

			if(user!= null) {
				//AuthToken.getInstance().deleteToken(username);

		
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


	}*/
	
	//mudar pa n eliminar e mudar os timestamps e no login remover e adicionar o token
	@DELETE
	@Path("/v1")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response doLogout(LoginData username) {
		LOG.fine("Attempt to logout user: " + username);

		Key userKey = userKeyFactory.newKey(username.username);
		Transaction txn = datastore.newTransaction();

		try {
			Entity user = txn.get(userKey);

			if(user!= null) {
			
				Key tokenKey = datastore.newKeyFactory().setKind("Token").newKey(username.username);
				Entity token = datastore.get(tokenKey);
				Key tokenValidity = datastore.newKeyFactory().addAncestors(PathElement.of("Token", username.username))
						.setKind("Validity")
						.newKey(username.username);
				
				
				
				Entity validityEntity = datastore.get(tokenValidity);
				
				Key validityKey = datastore.newKeyFactory()
						.addAncestor(PathElement.of("Token", username.username))
						.setKind("Validity")
						.newKey(username.username);
				
				validityEntity = Entity.newBuilder(validityKey)
						.set("Verifier", validityEntity.getValue("Verifier").get().toString())
						.set("ExpirationData", 0)
						.build();


				if(token == null || validityEntity == null) {
					txn.rollback();
					return Response.status(Status.NOT_FOUND).entity("Token not found .").build();

				}else
				txn.put(validityEntity);
				//txn.delete(tokenValidity);
				//txn.delete(tokenKey);
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
