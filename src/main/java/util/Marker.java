package util;

public class Marker {
	
	public long lat;
	public long lng;
	public String type;
	public String description;
	public String id;
	
	public Marker (String id, long lat, long lng, String type, String description) {
		this.id=id;
		this.lat=lat;
		this.lng=lng;
		this.type=type;
		this.description=description;
	}

}
