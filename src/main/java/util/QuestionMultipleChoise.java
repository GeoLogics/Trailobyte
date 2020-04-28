package util;

public class QuestionMultipleChoise {
	
	public String enunciated;
	public String question;
	public String optionA;
	public String optionB;
	public String optionC;
	public String optionD;
	public String correctOption;
	public int id;
	
	public QuestionMultipleChoise(String enunciated, String question, String optionA, String optionB,
								  String optionC, String optionD, String correctOption, int id) {
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
