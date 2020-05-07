package util;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class LongURL {
	
	public long number;
	
	@JsonCreator
	public LongURL(@JsonProperty("number") long number){
		this.number=number;
	}

}
