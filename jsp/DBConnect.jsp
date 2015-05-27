<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"
		 import="com.google.common.collect.*,
		 		 util.io.*,
		 		 java.net.*,
		 		 java.util.*,
		 		 java.io.*,
		 		 java.util.regex.*,
		 		 java.lang.*,
		 		 org.json.*,
		 		 java.sql.*,
		 		 org.apache.log4j.Logger,
		 		 org.apache.log4j.PropertyConfigurator"
%>
<%! static Logger loger; %>
<% 
	String loggerName = "DBConnect";
    loggerName = ":" + this.getClass();
	loger = Logger.getLogger(loggerName);

	String conn_str = "jdbc:sqlserver://192.168.124.138:1433;databaseName=KLG_Monitors;user=sa;password=p@ssw0rd;";
	Connection conn = null;
	File now_directory = new File(".");

	//使用者
	String whouse = URLDecoder.decode(request.getParameter("whouse"),"UTF-8");
	//相對路徑
	String absolutePath = now_directory.getAbsolutePath().replaceAll("\\.","");
	//log初始化
	PropertyConfigurator.configure(absolutePath + "webapps\\root\\KLG_Monitors\\jsp\\conf\\log4j.properties");
	
	try {
		Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
		conn = DriverManager.getConnection(conn_str);

		loger.info("連線成功["+ whouse +"]("+ conn +")");
	}
	catch(ClassNotFoundException ex1) {
		loger.error("連線失敗["+ whouse +"]("+ conn +")，" + ex1.getMessage());
		out.println("JDBC Driver Fail");
	}

%>