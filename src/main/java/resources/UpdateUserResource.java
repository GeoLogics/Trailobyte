package resources;


import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.PUT;
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
import com.google.cloud.datastore.Transaction;

import util.RegisterData;

@Path("/update")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class UpdateUserResource {

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory userKeyFactory = datastore.newKeyFactory().setKind("User");


	@PUT
	@Path("/v1")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response doUpdateUser (@Context HttpServletRequest req, RegisterData data) {

		String username = req.getHeader("username");
		Transaction txn = datastore.newTransaction();

		Key userKey = userKeyFactory.newKey(username);

		try {

			Entity user = txn.get(userKey);

			user = Entity.newBuilder(userKey)
					.set("user_pwd", user.getValue("user_pwd").get().toString())
					.set("user_email", data.email == null ? user.getValue("user_email").get().toString() : data.email)
					.set("user_telephone", data.telephone == null ? user.getValue("user_telephone").get().toString() : data.telephone)
					.set("user_mobphone", data.mobilePhone == null ? user.getValue("user_mobphone").get().toString() : data.mobilePhone)
					.set("user_address", data.address == null ? user.getValue("user_address").get().toString() : data.address)
					.set("user_role", user.getValue("user_role").get().toString())
					.set("user_creation_time", user.getValue("user_creation_time").get().toString())
					.build();
			txn.put(user);
			txn.commit();

			return Response.ok("{}").build();
		}catch(Exception e) {
			txn.rollback();
			return Response.status(Status.BAD_REQUEST).entity(e.toString()).build();			
		}



	}



}
