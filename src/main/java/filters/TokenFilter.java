//package filters;
//
//import java.io.IOException;
//import java.util.logging.Logger;
//
//import javax.ws.rs.WebApplicationException;
//import javax.ws.rs.container.ContainerRequestContext;
//import javax.ws.rs.container.ContainerRequestFilter;
//import javax.ws.rs.core.Response;
//import javax.ws.rs.core.Response.Status;
//import javax.ws.rs.ext.Provider;
//
//import org.glassfish.jersey.server.ContainerRequest;
//
//import io.jsonwebtoken.ExpiredJwtException;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.MalformedJwtException;
//import util.AuthToken;
//
//@Provider   
//@JwtCustomToken   // 1
//public class TokenFilter implements ContainerRequestFilter {
//	
//	
//	private static final Logger LOG = Logger.getLogger(TokenFilter.class.getName());
//	private static final String PRIVATE_KEY = "privateKey";  
//	private static final String USERNAME = "username"; 
//	private AuthToken jwTokenHelper = AuthToken.getInstance();
//	
//	/*public ContainerRequest filter(ContainerRequest request)throws IOException {  // 3
//		// ? 
//		String path = request.getPath(false);
//
//		if(path.equals("login"))        // |       4
//			return request;
//		//String privateKeyHeaderValue = request.getHeaderValue(PRIVATE_KEY); 
//		String privateKeyHeaderValue = request.getHeaderString(PRIVATE_KEY);// 5
//		if (privateKeyHeaderValue == null || privateKeyHeaderValue.isEmpty()) {
//			//throw new WebApplicationException(getUnAuthorizeResponse(PRIVATE_KEY + " is missing in header")); 
//			LOG.warning(PRIVATE_KEY + "is missing in header"); //?
//			throw new WebApplicationException(Response.status(Status.UNAUTHORIZED).build()); //?
//		}
//			  // 6
//			try {
//				jwTokenHelper.claimKey(privateKeyHeaderValue);   // 7
//			} catch(Exception e) {
//				if (e instanceof ExpiredJwtException) {
//					//throw new WebApplicationException(getUnAuthorizeResponse(PRIVATE_KEY + " is expired"));
//					LOG.warning(PRIVATE_KEY + "is expired");
//					throw new WebApplicationException(Response.status(Status.UNAUTHORIZED).build());
//				} else if (e instanceof MalformedJwtException) {
//					//throw new WebApplicationException(getUnAuthorizeResponse(PRIVATE_KEY + " is not correct"));
//					LOG.warning(PRIVATE_KEY + "is not correct");
//					throw new WebApplicationException(Response.status(Status.UNAUTHORIZED).build());
//				}
//			}
//		return request;
//	}*/
//
//	/*private Response getUnAuthorizeResponse(String message) {
//		return Response.ok(BaseResponse.FAILURE, message
//				).status(Response.Status.UNAUTHORIZED)
//				.type(MediaType.APPLICATION_JSON)
//				.build()
//	}*/
//
//	@Override
//	public void filter(ContainerRequestContext requestContext) throws IOException {
//		//String path = requestContext.
//		//((ContainerRequest) requestContext).getPath(false);
//		//requestContext.getRequest()
//		String path = requestContext.getUriInfo().getPath();
//		//if(path.equals("register/v1")) {
//			//???
//			
//			
//			
//			//String privateKeyHeaderValue = requestContext.getHeaderString(PRIVATE_KEY);
//			//LOG.warning(jwTokenHelper.claimKey2(privateKeyHeaderValue));
//			
//			//String x = jwTokenHelper.getSubject(privateKeyHeaderValue);
//			//LOG.warning(x);devolte o subject (último e único pq na net tava mal)
//		//}
//				if(path.equals("login/v1") /*||path.equals("register/v1") )  {      // |       4
//					
//					//requestContext.abortWith(Response.status(Status.OK).build());//XD?
//					//String x = jwTokenHelper.xd();
//					//String x = Jwts.claims().getSubject();
//					//LOG.warning(x);		
//				}
//				else {
//				String privateKeyHeaderValue = requestContext.getHeaderString(PRIVATE_KEY); // 5
//				String username = requestContext.getHeaderString(USERNAME);
//				
//				if (privateKeyHeaderValue == null || privateKeyHeaderValue.isEmpty()) {
//					LOG.warning(PRIVATE_KEY + "is missing in header"); //?
//					//LOG.warning(path);
//					//LOG.warning(privateKeyHeaderValue);
//					throw new WebApplicationException(Response.status(Status.UNAUTHORIZED).build());
//					
//				}
//					   // 6
//					try {
//						
//						//jwTokenHelper.getToken(username)
//						jwTokenHelper.claimKey2(username, privateKeyHeaderValue);   // 7
//					} catch(Exception e) {
//						if (e instanceof ExpiredJwtException) {
//							LOG.warning(PRIVATE_KEY + "is expired");
//							jwTokenHelper.deleteToken(username);
//							throw new WebApplicationException(Response.status(Status.UNAUTHORIZED).build());
//						} else if (e instanceof MalformedJwtException) {
//							LOG.warning(PRIVATE_KEY + "is not correct");
//							//jwTokenHelper.deleteToken(username);??
//							throw new WebApplicationException(Response.status(Status.UNAUTHORIZED).build());
//						}
//
//					}
//	}}
//}