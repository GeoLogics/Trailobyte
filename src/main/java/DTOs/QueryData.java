package DTOs;

public class QueryData<E> {

	public E param;
	public Integer pageSize;
	public String cursor;
	
	public QueryData() {}
	
	public QueryData(E param, Integer pageSize, String cursor) {
		this.param = param;
		this.pageSize = pageSize;
		this.cursor = cursor;
	}
}
