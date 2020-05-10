package resources;

import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.ListValue;
import com.google.cloud.datastore.Value;
import com.google.cloud.datastore.ValueBuilder;
import com.google.cloud.datastore.Key;

@Path("/roles")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class RoleResource {
	
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory roleKeyFactory = datastore.newKeyFactory().setKind("Role");
	
	public RoleResource() {
		
	}
	
	public void createRolesTable() {
		
		Key rolesTableKey = roleKeyFactory.newKey("roles");
		
		Entity rolesTableEntity = Entity.newBuilder(rolesTableKey)
				.set("E1", ListValue.of("postTrail", "getTrail", "postReview"))
				.set("E2", ListValue.of("postTrail", "getTrail", "postReview"))
				.set("BO1", ListValue.of("postTrail", "getTrail", "postReview"))
				.set("BO2", ListValue.of("postTrail", "getTrail", "postReview"))
				.set("BE1", ListValue.of("postTrail", "getTrail", "postReview"))
				.set("BE2", ListValue.of("postTrail", "getTrail", "postReview"))
				.set("ROOT", ListValue.of("postTrail", "getTrail", "postReview"))
				.build();
	}

	
	
	public boolean checkPermissions(String username, String method) {
		
		
		
		return false;
	}
}
