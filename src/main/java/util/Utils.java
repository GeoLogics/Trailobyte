package util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class Utils {
	
	public Utils() { }
	
	
	
	//from:https://www.techiedelight.com/convert-inputstream-byte-array-java/
	public static byte[] toByteArray(InputStream in) throws IOException {
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		byte[] buffer = new byte[1024];
		int len;
		// read bytes from the input stream and store them in buffer
		while ((len = in.read(buffer)) != -1) {
			// write bytes from the buffer into output stream
			os.write(buffer, 0, len);
		}
		return os.toByteArray();
	}	
		
		
	/**
	* Checks that the file extension is supported.
	* from: https://cloud.google.com/java/getting-started-appengine-standard/using-cloud-storage#handle_user_uploads
	*/
	public boolean checkFileExtension(String fileName) {
		if (fileName != null && !fileName.isEmpty() && fileName.contains(".")) {
			String[] allowedExt = {".jpg", ".jpeg", ".png", ".gif"};
		    for (String ext : allowedExt) 
		      if (fileName.endsWith(ext)) 
		        return true; 
		}
		return false;
	}

}
