package util.Questions;

import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class QuestionListAnswerTF {
	
	public List<String> answersList;
	
	@JsonCreator
	public QuestionListAnswerTF(@JsonProperty("answersList") List answersList) {
		
		this.answersList=answersList;
		
	}

}
