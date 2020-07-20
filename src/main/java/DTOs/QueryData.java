package DTOs;

public class QueryData<E> {

	public E param;
	public int pageSize;
	public String cursor;
	
	public QueryData() {}
	
	public QueryData(E param, int pageSize, String cursor) {
		this.param = param;
		this.pageSize = pageSize;
		this.cursor = cursor;
	}
}
