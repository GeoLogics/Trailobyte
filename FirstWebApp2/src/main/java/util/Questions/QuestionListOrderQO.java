package util.Questions;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class QuestionListOrderQO {
	
	public List<String> byOrder;
	
	@JsonCreator
	public QuestionListOrderQO(@JsonProperty("byOrder") List<String> byOrder) {
		this.byOrder=byOrder;
	}

}
