package util;

public enum Role {
	USER, 
	GBO,
	GA,
	GS,
	SU;

	public void enumSwitch() {
		Role role = USER;
		switch(role) {
		case USER:
			System.out.println("User");
			break;
		case GBO:
			System.out.println("Backoffice manager");
			break;
		case GA:
			System.out.println("Application manager");
			break;
		case GS:
			System.out.println("System manager");
			break;
		case SU:
			System.out.println("Super user");
			break;	    
		}
	}
}