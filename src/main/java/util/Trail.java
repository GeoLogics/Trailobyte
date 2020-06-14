package util;


import java.util.List;
import java.util.Map;
import com.google.cloud.datastore.Key;


public class Trail {
	
	public String name;
	public String description;
	public String trailImg;
	public String creator;
	
	public String start;
	public String end;
	public List<Marker> markers;
	//map that stores the keys to the trail's questions. (K,V) K - waypoints's name, V - List of Questions
	public Map<String, List<Key>> trailQuestions;
	
	public double avgRating;
	public int nRatings;
	public double dist;
	
	public boolean verified;
	
	
	
	
	public Trail() {}
	
	
	public Trail(String name, String description, String trailImg, String creator, String start, String end, 
				 List<Marker> markers, Map<String, List<Key>> trailQuestions, double avgRating, int nRatings, 
				 double dist, boolean verified)
	{	
		this.name= name;
		this.description = description;
		this.trailImg = trailImg;
		this.creator = creator;
		 
		this.start = start;
		this.end = end;
		this.markers = markers;
		this.trailQuestions = trailQuestions;
		
		this.avgRating = avgRating;
		this.nRatings = nRatings;
		this.dist = dist;
		
		this.verified = verified;
	}

	
	public int getNumberMarkers() {
		return markers.size();
	}
}
