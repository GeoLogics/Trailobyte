package resources;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Type;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.nio.file.Paths;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.google.appengine.repackaged.com.google.gson.reflect.TypeToken;
import com.google.cloud.Timestamp;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.PathElement;
import com.google.cloud.datastore.Query;
import com.google.cloud.datastore.QueryResults;
import com.google.cloud.datastore.Transaction;
import com.google.cloud.datastore.Value;
import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
import com.google.cloud.datastore.StructuredQuery.OrderBy;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;

import util.LongURL;
import util.Marker;
import util.RegisterData;
import util.Trail;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUpload;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;



@Path("/trail")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class TrailResource {

	//A Logger Object
	private static final Logger LOGGER = Logger.getLogger(LoginResource.class.getName());
	
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final Storage storage = StorageOptions.newBuilder().setProjectId("trailobyte-275015").build().getService();
	private final KeyFactory trailKeyFactory = datastore.newKeyFactory().setKind("Trail");
	
	private final Gson g = new Gson();
	
	public TrailResource() {
		
	}
	
	

	
	@SuppressWarnings("deprecation")
	@POST
	@Path("/postimage")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response postImage(@Context HttpServletRequest req, @Context HttpServletResponse res)  throws ServletException, IOException, FileUploadException {
		
		 ServletFileUpload upload = new ServletFileUpload();
         FileItemIterator iterator = upload.getItemIterator(req);
         
        
         Trail trail = null;
         Key trailKey = null;
         Transaction txn = null;
         FileItemStream item;
         String markersMediaLink = "";
         
               
         try {
             
			 while(iterator.hasNext()) {
	        	 item = iterator.next();
	        	 InputStream stream = item.openStream();
	        	 if(item.isFormField()) {
	        		JsonParser jsonParser = new JsonParser();
	        		JsonObject jsonObject = (JsonObject)jsonParser.parse(new InputStreamReader(item.openStream(), "UTF-8"));
	        		trail = g.fromJson(jsonObject, Trail.class);
	        		trailKey = trailKeyFactory.newKey(trail.name);
	        		if(datastore.get(trailKey) != null)
						return null;
	        		
	        		//store markers list
	        		BlobId blobId = BlobId.of("trailobyte-275015.appspot.com", "trails/ "+ trail.name +"/"+"markers.json");
     	        	BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
     	        	//String saveMarkers = "{\"markers\":"+ g.toJson(trail.markers).toString() +"}";
     	        	markersMediaLink = storage.create(blobInfo, g.toJson(trail.markers).toString().getBytes()).getMediaLink();
     				
	        	 }
	        		 
	        	 else {
	        		//store trail's image
	        		 if(item.getName().equals(trail.name)) {
	        			 BlobId blobId = BlobId.of("trailobyte-275015.appspot.com", "trails/" + trail.name + "/" + item.getName());
		 	     	     BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
		 	     			
		 	     		 //saves image's storage URL to trailImg in the trail (the trailImg comes with picture_name.jpg or null)
		 	     	     if(trail.trailImg !=null && trail.trailImg.equals(item.getName()))
		 	     	    	trail.trailImg = storage.create(blobInfo, toByteArray(stream)).getMediaLink();
	        		 }else {
	        			//store marker's images 
	 	        		BlobId blobId = BlobId.of("trailobyte-275015.appspot.com", "trails/" + trail.name + "/pictures/" + item.getName());
	 	     	        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
	 	     			
	 	     			//saves image's storage URL to imgURL in the marker (the imgURL comes with picture_name.jpg or null)
	 	     			for(Marker aux : trail.markers)
	 	     				if(aux.imgURL !=null && aux.imgURL.equals(item.getName()))
	 	     					aux.imgURL = storage.create(blobInfo, toByteArray(stream)).getMediaLink();
	        		 }	        		
	        	 }	 
			 }
			 txn = datastore.newTransaction();
			 
			 Entity trailEntity = Entity.newBuilder(trailKey)
					.set("name", trail.name)
					.set("description", trail.description)
					.set("trailImg", trail.trailImg)
					.set("creator", trail.creator)
					
					.set("markers", markersMediaLink )
					.set("start", trail.markers.get(0).name)
					.set("end", trail.markers.get(trail.markers.size()-1).name)
					
					.set("avgRating", trail.avgRating)
					.set("nRatings", trail.nRatings)
					.set("dist", trail.dist)
					
					.set("verified", trail.verified)
					.build();
							
			txn.put(trailEntity);
			txn.commit();
			return Response.ok("{}").build();
					
		 }catch(Exception e) {
				e.printStackTrace();
		}
		finally{
			if(txn.isActive())
				txn.rollback();
		}
	    return null;
	   }
	
	
	
	
	
	
	
	//from:https://www.techiedelight.com/convert-inputstream-byte-array-java/
	private static byte[] toByteArray(InputStream in) throws IOException {

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
	
	
	@GET
	@Path("/get/{trailName}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getTrail(@PathParam("trailName")String trailName) throws JsonMappingException, JsonProcessingException {
		
		try {
			Key trailKey = trailKeyFactory.newKey(trailName);
			Entity trailEntity = datastore.get(trailKey);
			if(trailEntity == null)
				return Response.status(Status.NOT_FOUND).entity("Trail '"+ trailName+"' doesn´t exist.").build();
				
			
			
			String name = trailEntity.getString("name");
			String description = trailEntity.getString("description");
			String trailImg = trailEntity.getString("trailImg");
			String creator = trailEntity.getString("creator");
			String start = trailEntity.getString("start");
			String end = trailEntity.getString("end");
			String markerstxt = trailEntity.getString("markers");
			double avgRating = trailEntity.getDouble("avgRating");
			int nRatings =  (int) trailEntity.getLong("nRatings");
			double dist = trailEntity.getDouble("dist");
			boolean verified = trailEntity.getBoolean("verified");
			
			
			
			/*
			ByteBuffer buffer = ByteBuffer.allocate(1024);
			
			//get markers from storage
			BlobId blobId = BlobId.of("trailobyte-275015.appspot.com", "trails/ "+ trailName +"/markers");
	     	BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
	     	Blob blob = storage.get(blobId);
	     	blob.reader().read(buffer);
	     	if(blob.reader().isOpen())
	     		blob.reader().close();
	     	String asd =  Arrays.toString(buffer.array());
	     	//List<Marker> markers = g.fromJson(g.toJson(storage.get(blobId)), new TypeToken<ArrayList<Marker>>() {}.getType());
	     	
	     	ObjectMapper mapper = new ObjectMapper();
	     	CollectionType javaType = mapper.getTypeFactory().constructCollectionType(List.class, Marker.class);
	     	String markersJson = g.toJson(storage.get(blobId));
	     	List<Marker> markers = mapper.readValue(markersJson, javaType);
			
			BlobId blobId = BlobId.of("trailobyte-275015.appspot.com", "trails/"+ trailName +"/markers.json");
	     	BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
	     	Blob blob = storage.get(blobId);
	     	Type listOfMyClassObject = new TypeToken<ArrayList<Marker>>() {}.getType();
	     	 
	     	ByteBuffer buffer = ByteBuffer.allocate(1024*64);
	     	
	     	blob.reader().read(buffer);
	     	if(blob.reader().isOpen())
	     		blob.reader().close();
	     	
	     	String asd =  Arrays.toString(buffer.array());
	        List<Marker> markers = g.fromJson(asd, listOfMyClassObject);
	     	*/
			
			Trail trail = new Trail(name, description, trailImg, creator, start, end, null, avgRating, nRatings, dist, verified);
			
			
			
			return Response.ok(g.toJson(trail)).build();
			
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
		
	}
	
	
	/**
	 * Checks that the file extension is supported.
	 * from: https://cloud.google.com/java/getting-started-appengine-standard/using-cloud-storage#handle_user_uploads
	 */
	private void checkFileExtension(String fileName) throws ServletException {
	  if (fileName != null && !fileName.isEmpty() && fileName.contains(".")) {
	    String[] allowedExt = {".jpg", ".jpeg", ".png", ".gif"};
	    for (String ext : allowedExt) {
	      if (fileName.endsWith(ext)) {
	        return;
	      }
	    }
	    throw new ServletException("file must be an image");
	  }
	}
	
	//ROLES: E1, E2, E3, E4
	//OP_CODE: QTU1
	
	@POST
	@Path("/queryByUser/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response queryByUsername(@PathParam("username") String username) {
		
		Query<Entity> query = Query.newEntityQueryBuilder()
				.setKind("Trail")
				.setFilter(CompositeFilter.and(
								PropertyFilter.eq("creator", username)
							)
					)
				.build();
		
		QueryResults<Entity> trailsQ = datastore.run(query);
		
		List<String> trails = new ArrayList();
		
		trailsQ.forEachRemaining(trail -> {
			trails.add(trail.getString("name"));
		});
		
		return Response.ok(g.toJson(trails)).build();

	 	
	}
	
	
	//ROLES: E1, E2, E3, E4
	//OP_CODE: QTR1
	
	@POST
	@Path("/queryByRating")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response queryRating(LongURL ratingU) {
		

		long rating = ratingU.number;
		
		double ratingD = rating;

		Query<Entity> query = Query.newEntityQueryBuilder()
		        .setKind("Trail")
		        .setFilter(CompositeFilter.and(
		        		PropertyFilter.ge("avgRating", ratingD)))
		        .setOrderBy(OrderBy.desc("avgRating"))
		        .build();
		
		QueryResults<Entity> trailsQ = datastore.run(query);
		
		List<String> trails = new ArrayList();
		
		trailsQ.forEachRemaining(trail -> {
			trails.add(trail.getString("name"));
		});
		
		return Response.ok(g.toJson(trails)).build();

		
	}
	
	
	
	
	
	
	

	
	/*List<Trail> trails = new ArrayList();
	
	for(int i = 0; i<trailsE.size(); i++) {
		
		Entity trailEntity = trailsE.get(i);
		
		String name = trailEntity.getString("name");
		String description = trailEntity.getString("description");
		String trailImg = trailEntity.getString("trailImg");
		String creator = trailEntity.getString("creator");
		String start = trailEntity.getString("start");
		String end = trailEntity.getString("end");
		String markerstxt = trailEntity.getString("markers");
		double avgRating = trailEntity.getDouble("avgRating");
		int nRatings =  (int) trailEntity.getLong("nRatings");
		double dist = trailEntity.getDouble("dist");
		boolean verified = trailEntity.getBoolean("verified");
		
		Trail trail = new Trail(name, description, trailImg, 
								creator, start, end, null,
								avgRating, nRatings, dist, verified);

		
	}
	*/
	
}
