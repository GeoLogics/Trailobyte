package util.Questions;

import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class QuestionOrder {
	
	public String enunciated;
	public String question;
	public QuestionListOptionsQO options;
	public QuestionListOrderQO byOrder;
	public int id;
	
	@JsonCreator
	public QuestionOrder(@JsonProperty("enunciated") String enunciated, 
							@JsonProperty("question") String question,
							@JsonProperty("options") QuestionListOptionsQO options, 
							@JsonProperty("byOrder") QuestionListOrderQO byOrder,
							@JsonProperty("id")int id) {
		
		this.enunciated=enunciated;
		this.question=question;
		this.options=options;
		this.byOrder=byOrder;
		this.id=id;
		
	}

}
