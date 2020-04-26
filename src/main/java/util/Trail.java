package util;

import java.util.ArrayList;
import java.util.List;
import com.google.cloud.datastore.Key;

public class Trail {
	
	public String name;
	public Marker start;
	public Marker end;
	public List<Marker> markers;
	public String description;
	public String trailImg;
	public double dist;
	
	public Trail() {}
	
	
	public Trail(String name, String description, String trailImg, double dist, List<Marker> markers) {
		
		this.name= name;
		this.description = description;
		this.trailImg = trailImg;
		this.dist = dist; 
		this.markers = markers;
		this.start = markers.get(0);
		this.end = markers.get(markers.size()-1);
		
	}

	
	public void addMarker(Marker marker) {
		if(markers.isEmpty())
			start = marker;
		
		markers.add(marker);
	}
	
	public void addLast(Marker marker) {
		end = marker;
	}
	
	public int getNumberMarkers() {
		return markers.size();
	}
}
