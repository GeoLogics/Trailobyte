package DTOs;

public class QuizzResult {
	
	public int right;
	public int wrong;
	public String trailName;
	public String userName;
	
	public QuizzResult() {}
	
	public QuizzResult(int right, int wrong, String trailName,String userName) {
		this.right = right;
		this.wrong = wrong;
		this.trailName = trailName;
		this.userName = userName;
	}
}
