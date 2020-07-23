package util;



import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.xml.ws.Response;

import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;

@Path("/rolestest")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class Roles {
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory roleKeyFactory = datastore.newKeyFactory().setKind("Role");
	
	public Map<String, List<String>> rolesTable;
	
	
	public Roles() {}
	
	public Roles(Map<String, List<String>> rolesTable) {
		this.rolesTable = rolesTable;
	}
	
	
	
	/*
	@GET
	@Path("/test")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getTable() {
		
		Key rolesTableKey = roleKeyFactory.newKey("roletable");
		
		Entity tableEntity = datastore.get(rolesTableKey);
		Map<String, List<String>> rolesTable =  (Map<String, List<String>>) ofy().load().value(tableEntity).now();
		return null;
		
	}*/

}
