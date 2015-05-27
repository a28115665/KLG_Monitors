<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@ include file="DBConnect.jsp"%>
<%@ include file="Unitility/DBTable.jsp"%>
<%
	String SQLCommand = null;
	String returnStatus = null;

	try{

		Statement stmt = conn.createStatement();
		SQLCommand = " UPDATE ";
		SQLCommand += DBTables(request.getParameter("table"));

		String updatename = request.getParameter("updatename");
		//String update = URLDecoder.decode(request.getParameter("update"),"UTF-8");
		String update = request.getParameter("update");
		if(update != null){
			JSONObject requestJSON = new JSONObject(update);
			if(requestJSON != null){
				SQLCommand += UpdateMethod(updatename, requestJSON);
			}
		}
		SQLCommand += " WHERE 1=1 ";
		String query = null;
		if(request.getParameter("query") != null && !request.getParameter("query").equals("undefined")){
			//query = URLDecoder.decode(request.getParameter("query"),"UTF-8");
			query = request.getParameter("query");
		}

		JSONObject requestJSON = null;
		if(query != null){
			requestJSON = new JSONObject(query);
			//if(requestJSON != null){
				//SQLCommand += ConditionOfUpdateMethod(queryname, requestJSON);
			//}
		}
		SQLCommand += QueryMethod("Select", requestJSON);
		//out.println(SQLCommand);
		stmt.executeUpdate(SQLCommand);
		loger.info("Update成功["+ whouse +"]:" + SQLCommand);

		returnStatus = "Success";
	}
	catch(SQLException ex2) {
		loger.error("Update失敗["+ whouse +"]:"+SQLCommand+"，" + ex2.getMessage());
		returnStatus = "Fail";
	} finally {
		loger.info("中斷連線["+ whouse +"]("+ conn +")");
		conn = null;
	}

%><%=returnStatus %>