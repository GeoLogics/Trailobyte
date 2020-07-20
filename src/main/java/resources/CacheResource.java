package resources;


import java.io.IOException;

import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;

import com.google.gson.Gson;


import util.CacheToken;

public class CacheResource {

	private final MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory tokenKeyFactory = datastore.newKeyFactory().setKind("Token");
	private final Gson g = new Gson();



	public boolean Authentication(String authKey, String username) throws ClassNotFoundException, IOException{

		String verifier;
		long expirationDate;
		String cacheKey = username+"token";


		byte[] value = (byte[]) syncCache.get(cacheKey);
		if(value != null) {
			//CacheToken token = (CacheToken) deserializeByteArray(value);
			CacheToken token = g.fromJson(new String(value), CacheToken.class);
			verifier = token.verifier;
			expirationDate = token.expirationDate;
		}

		//tirar o token da bd
		//remover 
		else {
			Key tokenKey = tokenKeyFactory.newKey(username);
			Entity tokenEntity = datastore.get(tokenKey);
			if(tokenKey == null || tokenEntity == null)
				return false;
			verifier = tokenEntity.getString("verifier");
			expirationDate = tokenEntity.getLong("expirationData");
			syncCache.put(cacheKey, g.toJson(new CacheToken(expirationDate, verifier)).getBytes());
		}
		if(authKey.equals(verifier))  {
			if(System.currentTimeMillis() < expirationDate) {
				syncCache.put(cacheKey, g.toJson(new CacheToken(System.currentTimeMillis()+1000*60, verifier)).getBytes());
				return true;
			}
				
			else {
				syncCache.delete(username+"token");
				return false;
			}
		}


		return false;
	}



	/*
	private <T> T deserializeByteArray(byte[] value) throws IOException, ClassNotFoundException{
		ByteArrayInputStream bis = new ByteArrayInputStream(value);
		ObjectInput in = new ObjectInputStream(bis);
		@SuppressWarnings("unchecked")
		T object = (T) in.readObject();
		return object;
	}*/


}
