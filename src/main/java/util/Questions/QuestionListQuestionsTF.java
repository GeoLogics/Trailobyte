package util.Questions;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class QuestionListQuestionsTF {
	
	public List<String> questions;
	
	@JsonCreator
	public QuestionListQuestionsTF(@JsonProperty("questions") List<String> questions) {
		this.questions=questions;
	}

}
