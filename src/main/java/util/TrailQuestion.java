package util;

import com.google.cloud.datastore.Key;

public class TrailQuestion {
	
	public String questionKey;
	public String author;
	public String trailName;
	public String markerName;
	public int verificationLevel;
	
	public String question;
	public String optionA;
	public String optionB;
	public String optionC;
	public String optionD;
	public String answer;
	
	
	public TrailQuestion(){}
	
	public TrailQuestion(String questionKey, String author, String trailName, String markerName,  int verificationLevel, String question,
			String optionA, String optionB, String optionC, String optionD, String answer) {
		
		this.questionKey = questionKey;
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