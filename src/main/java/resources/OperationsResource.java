package resources;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;

public class OperationsResource {

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();




	private boolean validSession(String verifier, String username) {

		Key validityKey = datastore.newKeyFactory().setKind("Validity").newKey(username);
		Entity validity = datastore.get(validityKey);

		if(validity == null) 
			return false;

		String verificatorKey = validity.getValue("Verifier").get().toString();

		if( verifier != verificatorKey ) 				
			return false;
		return true;
	}




}
