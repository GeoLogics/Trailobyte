package util;


import java.util.List;


public class Trail {
	
	public String name;
	public String description;
	public String trailImg;
	public String creator;
	
	public String start;
	public String end;
	public List<Marker> markers;
	
	public double avgRating;
	public int nRatings;
	public double dist;
	
	public boolean verified;
	
	
	
	
	public Trail() {}
	
	
	public Trail(String name, String description, String trailImg, String creator, String start, String end, List<Marker> markers, double avgRating, int nRatings, double dist, boolean verified) {
		
		this.name= name;
		this.description = description;
		this.trailImg = trailImg;
		this.creator = creator;
		 
		this.markers = markers;
		this.start = start;
		this.end = end;
		
		this.avgRating = avgRating;
		this.nRatings = nRatings;
		this.dist = dist;
		
		this.verified = verified;
		
	}

	
	public int getNumberMarkers() {
		return markers.size();
	}
}
