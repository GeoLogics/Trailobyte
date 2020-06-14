package resources;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.appengine.api.datastore.Query.CompositeFilter;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.memcache.ErrorHandlers;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;

import com.google.cloud.datastore.Cursor;
import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.EntityQuery;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.Query;
import com.google.cloud.datastore.QueryResults;
import com.google.cloud.datastore.StructuredQuery.OrderBy;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.gson.Gson;

import DTOs.QueryData;
import DTOs.QueryResult;
import DTOs.TrailInfo;
import util.RolesTable;
import util.Trail;
import util.TrailQuestion;

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
	public Response queryTrailByUsername(QueryData queryData) {
		
		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
				.setKind("Trail")
				.setFilter(PropertyFilter.eq("creator", (String) queryData.param)).setLimit(queryData.pageSize);
				
		if(queryData.cursor != null)
			queryBuilder.setStartCursor(Cursor.fromUrlSafe(queryData.cursor));
		
		return Response.ok(g.toJson(RunTrailQuery(queryBuilder, queryData.pageSize, null))).build();	 	
	}

	@POST
	@Path("/trail/byRating")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response queryTrailByRating(QueryData queryData) {
		
		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
		        .setKind("Trail")
		        //.setFilter(PropertyFilter.ge("avgRating", queryData.param))
		        .setOrderBy(OrderBy.desc("avgRating"))
		        .setLimit(queryData.pageSize);
		
		if(queryData.cursor != null)
			queryBuilder.setStartCursor(Cursor.fromUrlSafe(queryData.cursor));
		
		String key = null;
		if(queryData.cursor == null)
			key = "trailsRating"+queryData.pageSize;
		
		return Response.ok(g.toJson(RunTrailQuery(queryBuilder, queryData.pageSize, key))).build();
	}
	
	
	private QueryResult RunTrailQuery(EntityQuery.Builder queryBuilder, int pageSize, String key){
		MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
		syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
		
		List<TrailInfo> trails = new ArrayList<>();
		
		if(key!= null) {
			String value = (String) syncCache.get(key);
			if(value != null) 
				return g.fromJson(value, QueryResult.class);
		}
		
		QueryResults<Entity> trailsQ = datastore.run(queryBuilder.build());
		
		while (trailsQ.hasNext()) {
			Entity trailEntity = trailsQ.next();
			TrailInfo trail = new TrailInfo(trailEntity.getString("name"), 
									trailEntity.getString("creator"),
									trailEntity.getString("start"), 
									trailEntity.getString("end"),
									trailEntity.getDouble("avgRating"), 
									(int) trailEntity.getLong("nRatings"),
									trailEntity.getDouble("dist"),
									trailEntity.getBoolean("verified")
									);
			
		      trails.add(trail);
		}
	
		String nextPageCursor = trailsQ.getCursorAfter().toUrlSafe();
				
		QueryResult result = new QueryResult(trails, nextPageCursor);
		
		if(key != null)
			syncCache.put(key, g.toJson(result));
		
		return result;
	}
	
	
	
	/////////////////////////////////////////////////////////
	////////////////////////QUESTIONS////////////////////////
	/////////////////////////////////////////////////////////
	
	//returns a list with all the questions from the trail's markers for the verificationLevel given and above
	public QueryResult queryTrailQuizz(QueryData queryData,  String trailName) {
		
		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
				.setKind("TrailQuestion")
			    .setFilter(PropertyFilter.hasAncestor(
			        datastore.newKeyFactory().setKind("Trail").newKey(trailName)))
			    .setFilter(PropertyFilter.ge("verificationLevel", (int) queryData.param));
			    //.setOrderBy(OrderBy.asc("markerName"));
			    //.setLimit(queryData.pageSize);
		
		if(queryData.cursor != null)
			queryBuilder.setStartCursor(Cursor.fromUrlSafe(queryData.cursor));
		
		return RunQuestionQuery(queryBuilder, queryData.pageSize);
	}
	
	//returns a list with all the questions from the trail's markers for the verificationLevel given and above
	public QueryResult queryTrailUnverifiedQuestions(QueryData queryData,  String trailName) {
		
		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
			.setKind("TrailQuestion")
		    .setFilter(PropertyFilter.hasAncestor(
		        datastore.newKeyFactory().setKind("Trail").newKey(trailName)))
		    .setFilter(PropertyFilter.eq("verificationLevel", (int) queryData.param))
		    //.setOrderBy(OrderBy.asc("markerName"));
		    .setLimit(queryData.pageSize);
		
		if(queryData.cursor != null)
			queryBuilder.setStartCursor(Cursor.fromUrlSafe(queryData.cursor));
		
		return RunQuestionQuery(queryBuilder, queryData.pageSize);
	}
		
	
	
	
	
	private QueryResult RunQuestionQuery(EntityQuery.Builder query, int pageSize){
		
		List<TrailQuestion> trailQuestions = new ArrayList<>();
		
		QueryResults<Entity> trailsQuestions = datastore.run(query.build());
		
		while (trailsQuestions.hasNext()) {
			
			Entity questionEntity = trailsQuestions.next();
			
			
			
			TrailQuestion trailQuestion = new TrailQuestion(
					questionEntity.getString("questionKey"),
					questionEntity.getString("author"),
					questionEntity.getString("trailName"),
					questionEntity.getString("markerName"),
					(int) questionEntity.getLong("verificationLevel"),
					questionEntity.getString("question"),
					questionEntity.getString("optionA"),
					questionEntity.getString("optionB"),
					questionEntity.getString("optionC"),
					questionEntity.getString("optionD"),
					questionEntity.getString("answer")
					);
			
			trailQuestions.add(trailQuestion);
		}
	
		String nextPageCursor = trailsQuestions.getCursorAfter().toUrlSafe();
		
		QueryResult result = new QueryResult(trailQuestions, nextPageCursor);
		
		return result;
	}
	
	
	
	
	@POST
	@Path("/trail/questions/{trailName}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response queryTrailQuestionByMarker(QueryData queryData,  @PathParam("trailName")String trailName) {
		
	
		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
		        .setKind("TrailQuestion")
		        .setFilter(PropertyFilter.eq("markerName", (String) queryData.param))
		        .setOrderBy(OrderBy.desc("avgRating"))
		        .setLimit(queryData.pageSize);
		
		if(queryData.cursor != null)
			queryBuilder.setStartCursor(Cursor.fromUrlSafe(queryData.cursor));
		
		return Response.ok(RunQuestionQuery(queryBuilder, queryData.pageSize)).build();
	}
	
	
	
	
	
	
	
	
	
}
