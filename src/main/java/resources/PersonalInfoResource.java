package resources;


import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.KeyFactory;


import com.google.cloud.datastore.Transaction;
import com.google.cloud.datastore.Value;
import com.google.gson.Gson;

import util.RegisterData;


@Path("/list")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class PersonalInfoResource {

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory userKeyFactory = datastore.newKeyFactory().setKind("User");
	private final Gson g = new Gson();




	@GET
	@Path("/v1")
	@Produces(MediaType.APPLICATION_JSON)
	public Response doShowProperties(@Context HttpServletRequest req) {

		Transaction txn = datastore.newTransaction();
		String username = req.getHeader("username");

		Key userKey = userKeyFactory.newKey(username);
			
		try {
			Entity user = txn.get(userKey);
	
				Map <String, Value<?>> properties = user.getProperties();

				
				String email = (String) properties.get("user_email").get();	
				String telephone = (String) properties.get("user_telephone").get();
				String mobilePhone = (String) properties.get("user_mobphone").get();
				String address = (String) properties.get("user_address").get();

				RegisterData data = new RegisterData (username, email, telephone, mobilePhone, address);
				txn.commit();
				return Response.ok(g.toJson(data)).build();
			

		}catch (Exception e) {
			txn.rollback();
			return Response.status(Status.BAD_REQUEST).entity(e.toString()).build();	
		}

	}

}


