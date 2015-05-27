<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@ include file="DBConnect.jsp"%>
<%@ include file="Unitility/DBTable.jsp"%>
<%
	String SQLCommand = null;
	String returnStatus = null;

	try{

		//if(request.getParameter("table") == null) return;
		//if(request.getParameter("insertname") == null) return;
		//if(request.getParameter("insert") == null) return;

		Statement stmt = conn.createStatement();
		SQLCommand = " INSERT INTO ";
		SQLCommand += DBTables(request.getParameter("table"));

		String insertname = request.getParameter("insertname");
		String insert = URLDecoder.decode(request.getParameter("insert"),"UTF-8");
		//String insert = request.getParameter("insert");
		if(insert != null){
			//out.println(request.getParameter("insert"));
			JSONObject requestJSON = new JSONObject(insert);
			if(requestJSON != null){
				SQLCommand += InsertMethod(insertname, requestJSON);
			}
		}
		//out.println(SQLCommand);
		stmt.executeUpdate(SQLCommand);
		loger.info("Insert成功["+ whouse +"]:" + SQLCommand);

		//ResultSetMetaData metaData = rs.getMetaData();
		//returnNumber = metaData.getColumnCount();
		returnStatus = "Success";
	}
	catch(SQLException ex2) {
		loger.error("Insert失敗["+ whouse +"]:"+SQLCommand+"，" + ex2.getMessage());
		returnStatus = "Fail";
	} finally {
		loger.info("中斷連線["+ whouse +"]("+ conn +")");
		conn = null;
	}

%><%=returnStatus %>