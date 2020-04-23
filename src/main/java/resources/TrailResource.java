package resources;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.PathElement;
import com.google.cloud.datastore.Value;
import com.google.gson.Gson;

import util.Marker;
import util.RegisterData;
import util.Trail;

@Path("/trail")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class TrailResource {

	
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final KeyFactory trailKeyFactory = datastore.newKeyFactory().setKind("Trail");
	
	private final Gson g = new Gson();
	
	public TrailResource() {
		
	}
	
	@POST
	@Path("/post")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postTrail(Trail trail) {
		
		/*List<Marker> markers = new ArrayList<Marker>();
		
		for(int i=0; i < trail.markers.size() + 2; i++) {
			markers.add(trail.markers.get(i));
		}*/
		
		Key trailKey = trailKeyFactory.newKey(trail.name);
		Entity trailEntity = Entity.newBuilder(trailKey)
				.set("Name", trail.name)
				.set("NumberMarkers", trail.getNumberMarkers())
				.build();
		
		Key startKey = datastore.newKeyFactory()
				.addAncestor(PathElement.of("Trail", trail.name))
				.setKind("Start")
				.newKey(trail.name);
		
		Entity startEntity = Entity.newBuilder(startKey)
				.set("Lat", trail.start.lat)
				.set("Lng", trail.start.lng)
				.set("Type", trail.start.type)
				.set("Description", trail.start.description)
				.build();
		
		Key endKey = datastore.newKeyFactory()
				.addAncestor(PathElement.of("Trail", trail.name))
				.setKind("End")
				.newKey(trail.name);
		
		Entity endEntity = Entity.newBuilder(endKey)
				.set("Lat", trail.end.lat)
				.set("Lng", trail.end.lng)
				.set("Type", trail.end.type)
				.set("Description", trail.end.description)
				.build();
		
		/*Entity trailEntity1 = Entity.newBuilder(trailKey)
				.set("Name", trail.name)
				.set("Start", startEntity)
				.set("End", endEntity)
				.build();
		*/
		
		datastore.add(trailEntity);
		datastore.add(startEntity);
		datastore.add(endEntity);
		
		for(int i =0; i < trail.markers.size(); i++) {
			
			Key markerKey = datastore.newKeyFactory()
					.addAncestor(PathElement.of("Trail", trail.name))
					.setKind("Marker")
					.newKey(trail.markers.get(i).id);
			
			Entity markerEntity = Entity.newBuilder(markerKey)
					.set("ID", trail.markers.get(i).id)
					.set("Lat", trail.end.lat)
					.set("Lng", trail.end.lng)
					.set("Type", trail.end.type)
					.set("Description", trail.end.description)
					.build();
			
			datastore.add(markerEntity);
		}
		

		
		
		return Response.ok("{}").build();
	}
	
	
	@POST
	@Path("/get")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getTrail(String trailName) {
		
		Trail trail= new Trail(trailName);
		
		long latStart;
		long lngStart;
		String typeStart;
		String descriptionStart;
		
		Key startKey = datastore.newKeyFactory().addAncestor(PathElement.of("Trail", trailName))
				.setKind("Start").newKey(trailName);
		
		Entity startEntity = datastore.get(startKey);
		
		latStart = startEntity.getLong("Lat");
		lngStart = startEntity.getLong("Lng");
		typeStart=startEntity.getString("Type");
		descriptionStart = startEntity.getString("Description");
		
		Marker start = new Marker("-1", latStart, lngStart, typeStart, descriptionStart);
		
		long latEnd;
		long lngEnd;
		String typeEnd;
		String descriptionEnd;
		
		Key EndKey = datastore.newKeyFactory().addAncestor(PathElement.of("Trail", trailName))
				.setKind("End").newKey(trailName);
		
		Entity EndEntity = datastore.get(EndKey);
		
		latStart = EndEntity.getLong("Lat");
		lngStart = EndEntity.getLong("Lng");
		typeStart= EndEntity.getString("Type");
		descriptionStart = EndEntity.getString("Description");
		
		Marker End = new Marker("-1", latStart, lngStart, typeStart, descriptionStart);
		
		List<Marker> markers = new ArrayList<Marker>();
		
		Key trailKey = trailKeyFactory.newKey(trailName);
		Entity trailEntity = datastore.get(trailKey);
		
		int size = (int) trailEntity.getLong("NumberMarkers");
				
		for(int i =0; i < size; i++) {
			long lat;
			long lng;
			String type;
			String description;
			
			Key Key = datastore.newKeyFactory().addAncestor(PathElement.of("Trail", trailName))
					.setKind("Marker").newKey(i);
			
			Entity Entity = datastore.get(Key);
			
			lat = Entity.getLong("Lat");
			lng = Entity.getLong("Lng");
			type= Entity.getString("Type");
			description = Entity.getString("Description");
			
			String id = String.valueOf(i);
			
			Marker marker = new Marker(id, latStart, lngStart, typeStart, descriptionStart);
			
			markers.add(marker);
		}
		
		trail.addMarker(start);
		
		for(Marker i :markers) {
			trail.addMarker(i);
		}
		
		trail.addMarker(End);
		
		return Response.ok(g.toJson(trail)).build();
	}
}
