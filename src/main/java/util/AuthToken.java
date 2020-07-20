package util;

import java.util.UUID;

public class AuthToken {

	//public static final long EXPIRATION_TIME = 1000*60*60*2; //2h
	//public static final long EXPIRATION_TIME = 1000*60; //1min
	public static final long EXPIRATION_TIME = 1000*60*60*24*7; //24h X 7

	public String username;
	public long creationData;
	public long expirationData;
	public String verifier;
	
	public AuthToken() {

	}

	public AuthToken(String username) {
		this.username = username;
		this.verifier = UUID.randomUUID().toString();
		this.creationData = System.currentTimeMillis();
		this.expirationData = this.creationData + EXPIRATION_TIME;

	}
}
