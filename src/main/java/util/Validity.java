package util;

import java.util.UUID;

public class Validity {

	public long creationData;
	public long expirationData;
	public String verifier;




	public Validity() {
		this.verifier = UUID.randomUUID().toString();
		this.creationData = System.currentTimeMillis();
		this.expirationData = this.creationData + AuthToken.EXPIRATION_TIME;

	}


}