package DTOs;



public class TrailInfo {
	
	public String name;
	public String trailImg;
	public String creator;
	
	public String start;
	public String end;

	public double avgRating;
	public int nRatings;
	public double dist;
	
	public boolean verified;
	
	public TrailInfo(String name, String trailImg, String creator, String start, String end, double avgRating, int nRatings, double dist, boolean verified) {
		this.name = name;
		this.trailImg = trailImg;
		this.creator = creator;
		this.start = start;
		this.end = end;
		this.avgRating = avgRating;
		this.nRatings = nRatings;
		this.dist = dist;
		this.verified = verified;
	}

	
	
	
	

}
