package DTOs;

import java.util.List;

public class QueryResult<E> {
	
	public List<E> resultList;
	public String cursor;
	
	public QueryResult() {}
	
	public QueryResult(List<E> resultList, String cursor) {
		this.resultList = resultList;
		this.cursor = cursor;
	}

}
