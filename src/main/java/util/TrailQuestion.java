package util;

public class TrailQuestion {
	
	public String author;
	public String trailName;
	public String markerName;
	public String verificationLevel;
	
	public String question;
	public String optionA;
	public String optionB;
	public String optionC;
	public String optionD;
	public String answer;
	
	
	public TrailQuestion(){}
	
	public TrailQuestion(String author, String trailName, String markerName, String verificationLevel, String question,
			String optionA, String optionB, String optionC, String optionD, String answer) {
		
		this.author = author;
		this.trailName = trailName;
		this.markerName = markerName;
		this.verificationLevel = verificationLevel;
		this.question = question;
		this.optionA = optionA;
		this.optionB = optionB;
		this.optionC = optionC;
		this.optionD = optionD;
		this.answer = answer;
	}
	

}
