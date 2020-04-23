package util;

import java.util.ArrayList;
import java.util.List;

public class Trail {
	
	public List<Marker> markers;
	
	public Trail() {
		this.markers = new ArrayList<Marker>();
	}

	
	public void addMarker(Marker marker) {
		markers.add(marker);
	}
}
