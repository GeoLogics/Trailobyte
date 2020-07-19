package resources;


import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.google.appengine.api.memcache.ErrorHandlers;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;

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
import DTOs.QueryResult;
import DTOs.TrailInfo;
import util.Ranking;
import util.RegisterData;
import util.Review;
import util.TrailQuestion;

@Path("/query")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class QueryResource {

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	private final Gson g = new Gson();
	public QueryResource() {}

	/////////////////////////////////////////////////////////
	/////////////////////////LISTS//////////////////////////
	/////////////////////////////////////////////////////////

	@SuppressWarnings("unchecked")
	@GET
	@Path("/listUsers")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response listUsers() {

		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
				.setKind("User");

		QueryResults<Entity> users = datastore.run(queryBuilder.build());	

		List<RegisterData> users2 = new ArrayList<>();

		while (users.hasNext()) {
			Entity userEntity = users.next();
			RegisterData user = new RegisterData(userEntity.getKey().toString(),
					userEntity.getString("user_email"),
					userEntity.getString("user_telephone"),
					userEntity.getString("user_mobphone"),
					userEntity.getString("user_address")
					);

			users2.add(user);
		}

		@SuppressWarnings("rawtypes")
		QueryResult result = new QueryResult(users2,null);

		return Response.ok(g.toJson(result)).build();	 	
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@GET
	@Path("/listTrails")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response listTrails() {

		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
				.setKind("Trail");

		QueryResults<Entity> trails = datastore.run(queryBuilder.build());	

		List<TrailInfo> trails2 = new ArrayList<>();


		while (trails.hasNext()) {
			Entity trailEntity = trails.next();
			TrailInfo trail = new TrailInfo(trailEntity.getString("name"),
					trailEntity.getString("trailImg"), 
					trailEntity.getString("creator"),
					trailEntity.getString("start"), 
					trailEntity.getString("end"),
					trailEntity.getDouble("avgRating"), 
					(int) trailEntity.getLong("nRatings"),
					trailEntity.getDouble("dist"),
					trailEntity.getBoolean("verified")
					);

			trails2.add(trail);
		}

		QueryResult result = new QueryResult(trails2,null);

		return Response.ok(g.toJson(result)).build();	 	
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@GET
	@Path("/listTrailsUnverified")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response listTrailsUnverified() {

		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
				.setKind("Trail")
				.setFilter(PropertyFilter.eq("verified", false));

		QueryResults<Entity> trails = datastore.run(queryBuilder.build());	

		List<TrailInfo> trails2 = new ArrayList<>();


		while (trails.hasNext()) {
			Entity trailEntity = trails.next();
			TrailInfo trail = new TrailInfo(trailEntity.getString("name"),
					trailEntity.getString("trailImg"),
					trailEntity.getString("creator"),
					trailEntity.getString("start"), 
					trailEntity.getString("end"),
					trailEntity.getDouble("avgRating"), 
					(int) trailEntity.getLong("nRatings"),
					trailEntity.getDouble("dist"),
					trailEntity.getBoolean("verified")
					);

			trails2.add(trail);
		}

		QueryResult result = new QueryResult(trails2,null);

		return Response.ok(g.toJson(result)).build();	 	
	}



	/////////////////////////////////////////////////////////
	/////////////////////////TRAILS//////////////////////////
	/////////////////////////////////////////////////////////


	@SuppressWarnings("rawtypes")
	@POST
	@Path("/byUser")
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



	@SuppressWarnings("rawtypes")
	@POST
	@Path("/byRating")
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
		if(queryData.cursor==null) {
			key = "trailsRating"+queryData.pageSize;
		}

		return Response.ok(g.toJson(RunTrailQuery2(queryBuilder, queryData.pageSize, key))).build();
	}

	@SuppressWarnings("rawtypes")
	@POST
	@Path("/trail/byArea")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response queryTrailByArea(QueryData queryData) {

		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
				.setKind("Trail")
				//.setFilter(PropertyFilter.ge("avgRating", queryData.param))
				.setOrderBy(OrderBy.desc("area"))
				.setLimit(queryData.pageSize);

		if(queryData.cursor != null)
			queryBuilder.setStartCursor(Cursor.fromUrlSafe(queryData.cursor));

		String key = null;
		if(queryData.cursor == null)
			key = "trailsArea"+queryData.pageSize;

		return Response.ok(g.toJson(RunTrailQuery(queryBuilder, queryData.pageSize, key))).build();
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private QueryResult RunTrailQuery(EntityQuery.Builder queryBuilder, int pageSize, String key){
		//MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
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
					trailEntity.getString("trailImg"), 
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


		/*if(key != null)
			syncCache.put(key, g.toJson(result));
		 */
		return result;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private QueryResult RunTrailQuery2(EntityQuery.Builder queryBuilder, int pageSize, String key){
		//MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
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
					trailEntity.getString("trailImg"), 
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

		if(key != null && pageSize == 10)
			syncCache.put(key, g.toJson(result));

		return result;
	}

	/////////////////////////////////////////////////////////
	/////////////////////////REVIEWS//////////////////////////
	/////////////////////////////////////////////////////////

	@SuppressWarnings("rawtypes")
	@POST
	@Path("/trailReviews")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response queryTrailReviews(QueryData queryData) {

		if(queryData.pageSize == null)
			queryData.pageSize = 10;

		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
				.setKind("Review")
				//.setOrderBy(OrderBy.desc("rating"))
				.setFilter(PropertyFilter.eq("trailName", (String) queryData.param))
				.setLimit(queryData.pageSize);

		if(queryData.cursor != null)
			queryBuilder.setStartCursor(Cursor.fromUrlSafe(queryData.cursor));

		String key = null;
		if(queryData.cursor==null) {
			key = "reviews"+queryData.pageSize;
		}

		return Response.ok(g.toJson(RunTrailReviewQuery(queryBuilder, queryData.pageSize, key))).build();	 	
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private QueryResult RunTrailReviewQuery(EntityQuery.Builder queryBuilder, int pageSize, String key){
		//MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
		syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));

		List<Review> reviews = new ArrayList<>();


		QueryResults<Entity> reviewsQ = datastore.run(queryBuilder.build());

		while (reviewsQ.hasNext()) {
			Entity reviewEntity = reviewsQ.next();
			Review review = new Review(reviewEntity.getString("author"), 
					reviewEntity.getString("trailName"),
					reviewEntity.getString("comment"), 
					reviewEntity.getDouble("rating")
					);

			reviews.add(review);
		}

		String nextPageCursor = reviewsQ.getCursorAfter().toUrlSafe();
		QueryResult result = new QueryResult(reviews, nextPageCursor);

		return result;
	}





	/////////////////////////////////////////////////////////
	////////////////////////QUESTIONS////////////////////////
	/////////////////////////////////////////////////////////

	//returns a list with all the questions from the trail's markers for the verificationLevel given and above
	@SuppressWarnings("rawtypes")
	public QueryResult queryTrailQuizz(QueryData queryData,  String trailName) {

		if(queryData.pageSize == null)
			queryData.pageSize = 10;

		if(queryData.param == null)
			queryData.param = 1;
		
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
	@SuppressWarnings("rawtypes")
	public QueryResult queryTrailUnverifiedQuestions(QueryData queryData,  String trailName) {

		if(queryData.param == null)
			queryData.param = 0;
		
		if(queryData.pageSize == null)
			queryData.pageSize = 10;
		
		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
				.setKind("TrailQuestion")
				//.setFilter(PropertyFilter.hasAncestor(
				//		datastore.newKeyFactory().setKind("Trail").newKey(trailName)))
				.setFilter(PropertyFilter.eq("verificationLevel", (int) queryData.param))
				//.setOrderBy(OrderBy.asc("markerName"));
				.setLimit(queryData.pageSize);

		if(queryData.cursor != null)
			queryBuilder.setStartCursor(Cursor.fromUrlSafe(queryData.cursor));

		return RunQuestionQuery(queryBuilder, queryData.pageSize);
	}





	@SuppressWarnings({ "rawtypes", "unchecked" })
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




	@SuppressWarnings("rawtypes")
	@POST
	@Path("/trail/questions/{trailName}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response queryTrailQuestionByMarker(QueryData queryData,  @PathParam("trailName")String trailName) {

		if(queryData.pageSize == null)
			queryData.pageSize = 10;

		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
				.setKind("TrailQuestion")
				.setFilter(PropertyFilter.eq("markerName", (String) queryData.param))
				//.setOrderBy(OrderBy.desc("avgRating"))
				.setLimit(queryData.pageSize);

		if(queryData.cursor != null)
			queryBuilder.setStartCursor(Cursor.fromUrlSafe(queryData.cursor));

		return Response.ok(RunQuestionQuery(queryBuilder, queryData.pageSize)).build();
	}


	/////////////////////////////////////////////////////////
	///////////////////////QUIZZRANKING//////////////////////
	/////////////////////////////////////////////////////////

	@SuppressWarnings("rawtypes")
	@POST
	@Path("/rankings")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response queryRanks(QueryData queryData) {

		syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));

		String param = (String) queryData.param;
		String key = null;

		if(queryData.pageSize > 20)
			return Response.status(Status.FORBIDDEN).entity("Page Size too long").build();

		if(queryData.param == null)
			param = "rank";

		if(queryData.pageSize == 10) {
			key = "rankings"+param+"10";

			String value = (String) syncCache.get(key);
			if(value != null) 
				return Response.ok(g.fromJson(value, QueryResult.class)).build();
		}

		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
				.setKind("Ranking")
				.setOrderBy(OrderBy.desc(param))
				.setLimit(queryData.pageSize);

		if(queryData.cursor != null)
			queryBuilder.setStartCursor(Cursor.fromUrlSafe(queryData.cursor));

		return Response.ok(RunRanksQuery(queryBuilder, queryData.pageSize, key)).build();
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private QueryResult RunRanksQuery(EntityQuery.Builder query, int pageSize, String key){

		List<Ranking> quizzRankings = new ArrayList<>();

		QueryResults<Entity> quizzesRankings = datastore.run(query.build());

		while (quizzesRankings.hasNext()) {

			Entity questionEntity = quizzesRankings.next();

			Ranking rank = new Ranking(
					questionEntity.getDouble("right"),
					questionEntity.getDouble("wrong"),
					questionEntity.getString("userName")
					);

			quizzRankings.add(rank);
		}

		String nextPageCursor = quizzesRankings.getCursorAfter().toUrlSafe();

		QueryResult result = new QueryResult(quizzRankings, nextPageCursor);

		if(key != null)
			syncCache.put(key, g.toJson(result));
		return result;
	}



	/////////////////////////////////////////////////////////
	///////////////////////UPDATE_CACHE//////////////////////
	/////////////////////////////////////////////////////////



	@SuppressWarnings({ "rawtypes", "unchecked" })
	@GET
	@Path("/cacheUpdate")
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response cacheUpdate() {
		syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
		String key = "rankings"+"rank"+"10";
		QueryData queryData = new QueryData("rank", 10, null);
		String param = (String) queryData.param;

		EntityQuery.Builder queryBuilder = Query.newEntityQueryBuilder()
				.setKind("Ranking")
				.setOrderBy(OrderBy.desc(param))
				.setLimit(queryData.pageSize);

		if(queryData.cursor != null)
			queryBuilder.setStartCursor(Cursor.fromUrlSafe(queryData.cursor));

		QueryResult result = RunRanksQuery(queryBuilder, queryData.pageSize, key);
		syncCache.put(key, g.toJson(result));
		//
		queryBuilder = Query.newEntityQueryBuilder()
				.setKind("Trail")
				//.setFilter(PropertyFilter.ge("avgRating", queryData.param))
				.setOrderBy(OrderBy.desc("avgRating"))
				.setLimit(queryData.pageSize);

		if(queryData.cursor != null)
			queryBuilder.setStartCursor(Cursor.fromUrlSafe(queryData.cursor));

		key = null;
		if(queryData.cursor==null) {
			key = "trailsRating"+queryData.pageSize;
		}

		result = RunTrailQuery2(queryBuilder, queryData.pageSize, key);
		syncCache.put(key, g.toJson(result));


		return Response.ok().build();
	}

	






}
