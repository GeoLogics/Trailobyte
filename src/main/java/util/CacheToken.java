package util;

public class CacheToken {
	
	public long expirationDate;
	public String verifier;
	
	
	public CacheToken(long expirationDate, String verifier) {
		this.expirationDate = expirationDate;
		this.verifier = verifier;
	}
	
	public CacheToken() {
		
	}

}
