package resources;
//xxxx
import java.util.logging.Logger;


import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.digest.DigestUtils;

import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.PathElement;
import com.google.cloud.datastore.Transaction;
import com.google.gson.Gson;

import util.AuthToken;
import util.LoginData;
import util.Validity;

@Path("/login")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class LoginResource {

	/**
	 * Logger Object
	 */
	private static final Logger LOG = Logger.getLogger(LoginResource.class.getName());
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory userKeyFactory = datastore.newKeyFactory().setKind("User");

	private final Gson g = new Gson();

	public LoginResource() { }

	
	@POST
	@Path("/v1")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response doLogin1(LoginData data) {
		LOG.fine("Attempt to login user: " + data.username);

		Key userKey = userKeyFactory.newKey(data.username);
		Transaction txn = datastore.newTransaction();

		try {
			Entity user = txn.get(userKey);
			if( user != null ) {
				String hashedPWD = user.getString("user_pwd");
				if (hashedPWD.equals(DigestUtils.sha512Hex(data.password))) {
					Validity validity = new Validity();
					AuthToken token = new AuthToken(data.username, "User", validity);
					LOG.info("User '" + data.username + "' logged in sucessfully.");


					Key tokenKey = datastore.newKeyFactory().setKind("Token").newKey(data.username);
					Entity tokenEntity = Entity.newBuilder(tokenKey)
							.set("username", data.username).build();
					txn.put(tokenEntity);

					Key validityKey = datastore.newKeyFactory()
							.addAncestor(PathElement.of("Token", data.username))
							.setKind("Validity")
							.newKey(data.username);

					Entity validityEntity = Entity.newBuilder(validityKey)
							.set("Verifier", validity.verifier)
							.set("ExpirationData", validity.expirationData)
							.build();
					txn.put(validityEntity);
					txn.commit();
					//probably devolver a string verifier chega
					return Response.ok(g.toJson(token)).build();				

				} else {
					LOG.warning("Wrong password for username: " + data.username);
					return Response.status(Status.FORBIDDEN).build();				
				}
			}
			else {
				// Username does not exist
				LOG.warning("Failed login attempt for username: " + data.username);
				return Response.status(Status.FORBIDDEN).build();
			}

		} catch (Exception e) {
			txn.rollback();
			LOG.warning("xd" + e);
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}

	}

	@GET
	@Path("/{username}")
	public Response checkUsernameAvailable(@PathParam("username") String username) {
		if(!username.equals("jleitao")) {
			return Response.ok().entity(false).build();
		} else {
			return Response.ok().entity(true).build();
		}
	}

}
