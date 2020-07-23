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



	/*public boolean Authentication(String authKey, String username) throws ClassNotFoundException, IOException{

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
			if(System.currentTimeMillis() < expirationDate) {//7 dias
				syncCache.put(cacheKey, g.toJson(new CacheToken(System.currentTimeMillis()+1000*60*60*7, verifier)).getBytes());
				return true;
			}

			else {
				syncCache.delete(username+"token");
				return false;
			}
		}


		return false;
	}*/ 

	public boolean Authentication(String authKey, String username) throws ClassNotFoundException, IOException{

		String verifier = null;
		long expirationDate = 0;
		String cacheKey = username+"token";


		byte[] value = (byte[]) syncCache.get(cacheKey);
		if(value != null) {
			//CacheToken token = (CacheToken) deserializeByteArray(value);
			CacheToken token = g.fromJson(new String(value), CacheToken.class);
			verifier = token.verifier;
			expirationDate = token.expirationDate;
			System.out.println("XD1");
		}


		if(authKey.equals(verifier))  {
			if(System.currentTimeMillis() < expirationDate) {//refresh da sessao cada vez q se faz 1 pedido - 1000*60*60*24*7 7 dias
				syncCache.put(cacheKey, g.toJson(new CacheToken(System.currentTimeMillis()+1000*60*30, verifier)).getBytes());
				System.out.println("XD2");
				return true;

			}

			else {//remover sessão da cache por ser inválida
				syncCache.delete(username+"token");
				System.out.println("XD3");
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
