package util.Questions;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class QuestionListOptionsQO {
	
	public List<String> options;
	
	@JsonCreator
	public QuestionListOptionsQO(@JsonProperty("options") List<String> options) {
		this.options=options;
		
	}

}
