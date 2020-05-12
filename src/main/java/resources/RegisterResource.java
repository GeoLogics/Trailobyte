package resources;


import java.util.logging.Logger;

import javax.ws.rs.Consumes;

import javax.ws.rs.POST;
import javax.ws.rs.Path;

import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.digest.DigestUtils;

import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;

import com.google.cloud.Timestamp;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;


import util.RegisterData;

@Path("/register")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class RegisterResource {

	/**
	 * Logger Object
	 */
	private static final Logger LOG = Logger.getLogger(RegisterResource.class.getName());
	// Instantiates a client
	//private static final DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();



	public RegisterResource() { }


	@POST
	@Path("/v1")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response doRegistration(RegisterData data) {
		LOG.fine("Attempt to register user: " + data.username);

		if( ! data.validRegistration() ) {
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		}

		try {
			Key userKey = datastore.newKeyFactory().setKind("User").newKey(data.username);
			Entity user = Entity.newBuilder(userKey)
					.set("user_pwd", DigestUtils.sha512Hex(data.password))
					.set("user_email", data.email)
					.set("user_telephone", data.telephone == null ? "" : data.telephone)
					.set("user_mobphone", data.mobilePhone == null ? "" : data.mobilePhone)
					.set("user_address", data.address == null ? "" : data.address)
					.set("user_role", "E1")
					.set("user_creation_time", Timestamp.now())
					.build();
			datastore.add(user);
			LOG.info("User registered " + data.username);
			return Response.ok("{}").build();

		} catch(Exception e) {
			return Response.status(Status.BAD_REQUEST).entity(e.toString()).build();			
		}
	}


}

