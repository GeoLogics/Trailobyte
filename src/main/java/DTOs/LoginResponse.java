package DTOs;

public class LoginResponse {
	
	public String verifier;
	public String role;
	
	
	public LoginResponse() {}
	
	public LoginResponse(String verifier, String role) {
		this.verifier = verifier;
		this.role = role;
	}

}
