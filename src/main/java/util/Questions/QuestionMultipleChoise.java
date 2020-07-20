package util.Questions;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class QuestionMultipleChoise {
	
	public String enunciated;
	public String question;
	public String optionA;
	public String optionB;
	public String optionC;
	public String optionD;
	public String correctOption;
	public int id;
	
	@JsonCreator
	public QuestionMultipleChoise(@JsonProperty("enunciated") String enunciated,
									@JsonProperty("question") String question, 
									@JsonProperty("optionA") String optionA, 
									@JsonProperty("optionB") String optionB,
									@JsonProperty("optionC") String optionC, 
									@JsonProperty("optionD") String optionD, 
									@JsonProperty("correctOption") String correctOption, 
									@JsonProperty("id") int id) {
		this.enunciated=enunciated;
		this.question=question;
		this.optionA=optionA;
		this.optionB=optionB;
		this.optionC=optionC;
		this.optionD=optionD;
		this.correctOption=correctOption;
		this.id=id;
		
	}
	

}
