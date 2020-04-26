package util;

public class Marker {
	
	public Coords coords;
	public String type;
	public String content;
	public IconImg iconImg;
	public boolean stopover;
	
	public Marker() {}
	
	
	public Marker (Coords coords, String type, String content, IconImg iconImg, boolean stopover) {
		this.coords = coords;
		this.type= type;
		this.content= content;
		this.iconImg =  iconImg;
		this.stopover = stopover;
	}

}
