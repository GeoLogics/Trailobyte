package util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegisterData {

	public String username;
	public String email;	
	public String password;
	public String confirmation;
	//public ProfileData profile;
	public String telephone;
	public String mobilePhone;
	public String address;
	//public AccountStateData state;
	public String role;

	public RegisterData() {}
	

	public RegisterData(String email,String telephone, 
			String mobilePhone, String address) {

		this.email = email;
		this.telephone = telephone;
		this.mobilePhone = mobilePhone;
		this.address = address;

	}
	
	public RegisterData(String username, String email,String telephone, 
			String mobilePhone, String address) {
		
		this.username = username;
		this.email = email;
		this.telephone = telephone;
		this.mobilePhone = mobilePhone;
		this.address = address;

	}


	private boolean validField(String value) {
		return value != null && !value.equals("");
	}

	private boolean validPassword(String value) {
		return value != null && !value.equals("") && value.length()>=5;
	}

	public boolean validRegistration() {
		
		String regex = "^(.+)@(.+)$";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(email);
	
		return 	validField(username) &&
				validField(email) &&
				validPassword(password) &&
				validPassword(confirmation) &&
				password.equals(confirmation) &&
				matcher.matches();		
	}

}
