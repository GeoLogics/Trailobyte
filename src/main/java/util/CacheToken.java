package util;

import java.util.UUID;

public class CacheToken {
	
	public static final long EXPIRATION_TIME = 1000*60*30; //30 mins
	//public static final long EXPIRATION_TIME = 1000*60*60*24*7; //7 dias
	public long expirationDate;
	public String verifier;
	
	
	public CacheToken(long expirationDate, String verifier) {
		this.expirationDate = expirationDate;
		this.verifier = verifier;
	}
	
	public CacheToken() {
		this.expirationDate = System.currentTimeMillis() + EXPIRATION_TIME;
		this.verifier = UUID.randomUUID().toString();
	}

}
