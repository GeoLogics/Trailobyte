package DTOs;

public class IconImg {
	
	public String url;
	public widthHeightObject size;
	public widthHeightObject scaledSize;
	public xyObject origin;
	public xyObject anchor;
	
	public IconImg() {
		
	}
	
	public IconImg(String url, widthHeightObject size, widthHeightObject scaledSize, xyObject origin, xyObject anchor) {
		this.url = url;
		this.size = size;
		this.scaledSize = scaledSize;
		this.origin = origin;
		this.anchor = anchor;
	}
	

}
