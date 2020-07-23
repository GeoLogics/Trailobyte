package resources;

import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;

import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.Transaction;
import com.google.gson.Gson;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.Entity;


@Path("/remove")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class RemoveUserResource {

	private static final Logger LOG = Logger.getLogger(RemoveUserResource.class.getName());
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory userKeyFactory = datastore.newKeyFactory().setKind("User");
	private final MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();

	//ROLES: ADMIN
	//OP_CODE: X2
	@DELETE
	@Path("/OPX2OP/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response doAdminDeleteUser(@PathParam("username") String username) {
		LOG.fine("Attempt to delete user: " + username);

		Transaction txn = datastore.newTransaction();

		Key userRemoveKey = userKeyFactory.newKey(username);


		try {
			Entity user = txn.get(userRemoveKey);

			if(user==null)
				return Response.status(Status.NOT_FOUND).entity("User '"+ username +"' doesn´t exist.").build();

			String cacheKey = username+"token";
			byte[] value = (byte[]) syncCache.get(cacheKey);
			if(value != null) {
				syncCache.delete(cacheKey);
			}

			txn.delete(userRemoveKey);
			txn.commit();

			return Response.ok("{}").build();

		}catch(Exception e) {
			txn.rollback();
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();	
		}
	}


	@DELETE
	@Path("/v1")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response doDeleteUser(@Context HttpServletRequest req) {
		String username = req.getHeader("username");
		LOG.fine("Attempt to delete user: " + username);

		Transaction txn = datastore.newTransaction();

		Key userRemoveKey = userKeyFactory.newKey(username);


		try {
			Entity user = txn.get(userRemoveKey);

			String cacheKey = username+"token";
			byte[] value = (byte[]) syncCache.get(cacheKey);
			if(value != null) {
				syncCache.delete(cacheKey);
			}

			txn.delete(userRemoveKey);
			txn.commit();

			return Response.ok("{}").build();

		}catch(Exception e) {
			txn.rollback();
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();	
		}
	}


}
