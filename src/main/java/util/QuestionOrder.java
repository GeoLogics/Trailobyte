package util;

import java.util.HashMap;
import java.util.List;

public class QuestionOrder {
	
	public String enunciated;
	public String question;
	public List<String> options;
	public HashMap<Integer, String> order;
	public int id;
	
	public QuestionOrder(String enunciated, String question, 
							String options, String order, int id) {
		
		this.enunciated=enunciated;
		this.question=question;
		/*this.options=options;
		this.order=order;*/
		this.id=id;
		
	}

}
