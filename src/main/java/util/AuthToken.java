package util;



public class AuthToken {

	public static final long EXPIRATION_TIME = 1000*60*60*2; //2h

	public String username;
	public String role;
	public Validity validity;

	public AuthToken() {

	}

	public AuthToken(String username, String role, Validity validity) {
		this.username = username;
		this.role = role;
		this.validity = validity;

	}
}
