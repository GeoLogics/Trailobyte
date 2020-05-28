package DTOs;



public class TrailInfo {
	
	public String name;
	public String creator;
	
	public String start;
	public String end;

	public double avgRating;
	public int nRatings;
	public double dist;
	
	public boolean verified;
	
	public TrailInfo(String name, String creator, String start, String end, double avgRating, int nRatings, double dist, boolean verified) {
		this.name = name;
		this.creator = creator;
		this.start = start;
		this.end = end;
		this.avgRating = avgRating;
		this.nRatings = nRatings;
		this.dist = dist;
		this.verified = verified;
	}

	
	
	
	

}
