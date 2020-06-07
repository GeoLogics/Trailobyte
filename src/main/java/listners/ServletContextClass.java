package listners;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import com.googlecode.objectify.ObjectifyService;


@WebListener
public class ServletContextClass implements ServletContextListener{


    public void contextInitialized(ServletContextEvent arg0){
    	ObjectifyService.init();
   
    }//end contextInitialized method

    public void contextDestroyed(ServletContextEvent arg0){
     
    }//end constextDestroyed method
	
}
