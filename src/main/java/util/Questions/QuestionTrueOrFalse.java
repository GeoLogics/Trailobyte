package util.Questions;

import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class QuestionTrueOrFalse {

	public String enunciated;
	public QuestionListQuestionsTF questionsList;
	public QuestionListAnswerTF answersList;
	public int id;
	public int numberOfQuestions;
	
	 @JsonCreator
	public QuestionTrueOrFalse(@JsonProperty("enunciated") String enunciated, 
								@JsonProperty("questions") QuestionListQuestionsTF questions, 
								@JsonProperty("numberOfQuestions") int numberOfQuestions,  
								@JsonProperty("answers") QuestionListAnswerTF answers,
								@JsonProperty("id") int id) {
		
		this.enunciated=enunciated;
		this.numberOfQuestions=numberOfQuestions;
		questionsList = questions;
		answersList = answers;
		this.id=id;
		
	}
	
	/*private QuestionListTF initQuestions(QuestionListTF questions){
		
		return questionsList;
		
	}
	
	private QuestionListAnswerTF initAnswers(QuestionListAnswerTF answers) {
		return answersList;
		
	}*/
	
}
