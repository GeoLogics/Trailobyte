package util;

public class Ranking {

	public double right;
	public double wrong;
	public double rank;
	public String userName;
	
	public Ranking() {}
	
	public Ranking(double right, double wrong, String userName) {
		this.right = right;
		this.wrong = wrong;
		this.rank = (right/wrong);
		this.userName = userName;
	}
	
	
}
