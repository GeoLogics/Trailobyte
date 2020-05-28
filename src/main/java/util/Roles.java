package util;

import java.util.List;
import java.util.Map;

import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;

public class Roles {
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory roleKeyFactory = datastore.newKeyFactory().setKind("Role");
	
	public Map<String, List<String>> rolesTable;
	
	
	public Roles() {}
	
	public Roles(Map<String, List<String>> rolesTable) {
		this.rolesTable = rolesTable;
	}
	
	public void getTable() {
		
	}

}
