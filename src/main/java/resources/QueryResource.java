package resources;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.cloud.datastore.Cursor;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.EntityQuery;
import com.google.cloud.datastore.Query;
import com.google.cloud.datastore.QueryResults;
import com.google.cloud.datastore.StructuredQuery.OrderBy;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.gson.Gson;

import DTOs.QueryData;
import util.Trail;

@Path("/query")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class QueryResource {
	
	//A Logger Object
	private static final Logger LOGGER = Logger.getLogger(LoginResource.class.getName());
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private final Gson g = new Gson();
	public QueryResource() {}

	/////////////////////////////////////////////////////////
	/////////////////////////TRAILS//////////////////////////
	/////////////////////////////////////////////////////////
	@POST
	@Path("/trail/byUser")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response queryByUsername(QueryData queryData) {
		
		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
				.setKind("Trail")
				.setFilter(PropertyFilter.eq("creator", (String) queryData.param)).setLimit(queryData.pageSize);
				
		if(queryData.cursor != null)
			queryBuilder.setStartCursor(Cursor.fromUrlSafe(queryData.cursor));
		
		return Response.ok(g.toJson(RunTrailQuery(queryBuilder))).build();	 	
	}

	@POST
	@Path("/trail/byRating")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response queryRating(QueryData queryData) {
		
		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
		        .setKind("Trail")
		        //.setFilter(PropertyFilter.ge("avgRating", queryData.param))
		        .setOrderBy(OrderBy.desc("avgRating"))
		        .setLimit(queryData.pageSize);
		
		if(queryData.cursor != null)
			queryBuilder.setStartCursor(Cursor.fromUrlSafe(queryData.cursor));
		
		return Response.ok(g.toJson(RunTrailQuery(queryBuilder))).build();
	}
	
	private List<String> RunTrailQuery(EntityQuery.Builder queryBuilder){
		QueryResults<Entity> trailsQ = datastore.run(queryBuilder.build());
		
		List<String> trails = new ArrayList();
		
		while (trailsQ.hasNext()) {
			Entity trailEntity = trailsQ.next();
			Trail trail = new Trail(trailEntity.getString("name"), 
									null, 
									null, 
									trailEntity.getString("creator"),trailEntity.getString("start"), 
									trailEntity.getString("end"), 
									null, 
									trailEntity.getDouble("avgRating"), 
									(int) trailEntity.getLong("nRatings"),
									trailEntity.getDouble("dist"),
									trailEntity.getBoolean("verified"));
			
		      trails.add(g.toJson(trail));
		}
	
		String nextPageCursor = trailsQ.getCursorAfter().toUrlSafe();
		trails.add(nextPageCursor);
		return trails;
	}
	
	
	/////////////////////////////////////////////////////////
	////////////////////////QUESTIONS////////////////////////
	/////////////////////////////////////////////////////////
	
}
