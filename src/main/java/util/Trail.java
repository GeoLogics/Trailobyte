package util;

import java.util.ArrayList;
import java.util.List;

public class Trail {
	
	public List<Marker> markers;
	public String name;
	public Marker start;
	public Marker end;
	
	public Trail(String name) {
		
		this.markers = new ArrayList<Marker>();
		this.name=name;
		
	}

	
	public void addMarker(Marker marker) {
		if(markers.isEmpty())
			start = marker;
		
		markers.add(marker);
	}
	
	public void addLast(Marker marker) {
		end = marker;
	}
}
