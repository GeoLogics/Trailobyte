package util;

import DTOs.Coords;
import DTOs.IconImg;

public class Marker {
	public String name;
	public Coords coords;
	public String type;
	public String content;
	public String imgURL;
	public IconImg iconImg;
	public boolean stopover;
	
	public Marker() {}
	
	
	public Marker (String name, Coords coords, String type, String content, String imgURL, IconImg iconImg, boolean stopover) {
		this.name = name;
		this.coords = coords;
		this.type= type;
		this.content= content;
		this.imgURL = imgURL;
		this.iconImg =  iconImg;
		this.stopover = stopover;
	}

}
