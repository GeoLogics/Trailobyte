package resources;

import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
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
import com.google.cloud.datastore.ListValue;
import com.google.cloud.datastore.Transaction;

import util.LoginData;
import util.Role;

@Path("/roleTable")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class CreateRoleTable {

	private static final Logger LOG = Logger.getLogger(CreateRoleTable.class.getName());
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory roleKeyFactory = datastore.newKeyFactory().setKind("Role");


	//anotar os métodos em cada endpoint que precise testes de roles
	@POST
	@Path("/all")
	public Response CreateRoleTable() {

		Key roleKey = roleKeyFactory.newKey("Roles");
		Transaction txn = datastore.newTransaction();

		try {
			Entity role1 = Entity.newBuilder(roleKey)
					//					.set("M2", )
					//					.set("M3", )
					//					.set("M4", )
					//					.set("M5", )
					//			
					.set("USER", ListValue.of("M3,M12"))
					.set("USER2", ListValue.of("M5"))
					.set("BO", ListValue.of("M2,M3,M4,M2,M3"))
					.set("BE", ListValue.of("M2,M3,M4,M2,M3"))
					.set("ADMIN", ListValue.of("M2,M3,M4,M2,M3"))
					.build();

			if(role1.getValue("USER").get().toString().contains("M2")) { // <--- importante pa testar se o método está dentro dos métodos permitidos
				LOG.warning("xd");
				//role1.getValue("USER").toBuilder().addValue("M10");
				//role1.getValue("USER").toBuilder().

			}
			//String xd = role1.getValue("USER").get().toString();

			//(ListValue)role1.getValue("USER").toBuilder().addValue("M10");
			//.toBuilder().addValue("M5")
			//LOG.warning(role1.getValue("USER").get().toString());
			//LOG.warning(role1.getValue("USER").toString());
			//LOG.warning(xd);

			txn.put(role1);
			txn.commit();





			return Response.ok().build();


		}
		catch (Exception e) {
			txn.rollback();
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}
		finally{
			if(txn.isActive())
				txn.rollback();


		}

	}
	
}



