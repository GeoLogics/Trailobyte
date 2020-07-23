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

import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;



@Path("/logout")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class LogoutResource {

	private final MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	private static final Logger LOG = Logger.getLogger(LogoutResource.class.getName());
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory userKeyFactory = datastore.newKeyFactory().setKind("User");
	Utils util = new Utils();


	//XD?
	@DELETE
	@Path("/v1")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response doLogout(@Context HttpServletRequest req) {


		String username = req.getHeader("username");
		System.out.println(username);

		LOG.fine("Attempt to logout user: " + username);

		Key userKey = userKeyFactory.newKey(username);

		try {
			
			Entity user = datastore.get(userKey);
			if(user == null) {
				LOG.warning("Failed logout attempt for username: " + username);
				return Response.status(Status.FORBIDDEN).build();
			}	

			String cacheKey = username+"token";
			byte[] value = (byte[]) syncCache.get(cacheKey);

			if(value != null) {
				syncCache.delete(cacheKey);
				return Response.ok().build();
			}
			else {
				return Response.status(Status.NOT_FOUND).entity("Token not found .").build();
			}
			

		}catch (Exception e) {
			e.printStackTrace();
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();	
		}
		
	}

}
