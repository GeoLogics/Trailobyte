package filters;

import java.io.IOException;
import java.util.logging.Logger;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.Provider;

import org.glassfish.jersey.server.ContainerRequest;

import resources.CacheResource;
import resources.RoleResource;
import resources.Utils;
import util.AuthToken;


@Provider 
@PreMatching
public class Filter implements ContainerRequestFilter, ContainerResponseFilter{


	private static final Logger LOG = Logger.getLogger(Filter.class.getName());
	private final Utils utils = new Utils();
	private final RoleResource roles = new RoleResource();
	private final CacheResource cache = new CacheResource();

	public Filter() {}

	@Override
	public void filter(ContainerRequestContext requestContext)throws IOException {  


		String path = ((ContainerRequest) requestContext).getPath(false);
		if(!path.equals("login/v1")&&!path.equals("register/v1")&&!path.contains("OPT3OP")&&!path.equals("query/byUser")&&
				!path.equals("query/byRating")&&!path.equals("query/rankings")&&!path.equals("query/cacheUpdate")/*&&!path.equals("query/listUsers")&&!path.equals("query/listTrails")&&!path.equals("query/listTrailsUnverified")*/) { 


			String authKey = requestContext.getHeaderString("Authorization").split(" ")[1];
			String username = requestContext.getHeaderString("username");

			try {//mudar codigo de erro para reiniciar app
				if(!cache.Authentication(authKey, username))
					throw new WebApplicationException(Response.status(Status.FORBIDDEN).entity("User: " + username + " does not have a valid session key.").build());
			} catch (ClassNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}


			if(path.contains("OP")) {
				String code = path.substring(path.indexOf("OP")+2, path.lastIndexOf("OP"));  
				System.out.println(code);

				if(!roles.checkPermissions(username, code))
					throw new WebApplicationException(Response.status(Status.FORBIDDEN).entity("User: " + username + " does not have the necessary permissions for this operation.").build());

			}

		}

	}

	@Override
	public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext)
			throws IOException {
		responseContext.getHeaders().add("Access-Control-Allow-Methods", "HEAD,GET,PUT,POST,DELETE,OPTIONS");
		responseContext.getHeaders().add("Access-Control-Allow-Origin", "*");
		responseContext.getHeaders().add("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Authorization, username");




	}


}