package util;

import java.util.HashMap;
import java.util.List;

public class QuestionTrueOrFalse {

	public String enunciated;
	public QuestionListQuestionsTF questionsList;
	public QuestionListAnswerTF answersList;
	public int id;
	public int numberOfQuestions;
	
	
	public QuestionTrueOrFalse(String enunciated, QuestionListQuestionsTF questions, 
								int numberOfQuestions,  QuestionListAnswerTF answers, int id) {
		
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
