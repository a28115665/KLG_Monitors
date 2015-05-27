<%@ include file="shared.jsp"%>
<%@page import="java.io.*"%>

<%
	String filePath = absolutePath+"webapps\\root\\KLG_Bulletin\\uploads\\"+request.getParameter("file-upload-path");

	String path = filePath;      		//把路徑給path

	File folder = new File(path);       //建立實體

	folder.mkdir();                     //完成建立

	String fileName = request.getParameter("file-upload-path");
    String fname = new String();
    String browse = new String();
    // 解决中文文件名乱码问题
    if (request.getHeader("User-Agent").toLowerCase().indexOf("firefox") > 0) {
        fname = fileName;//new String(fileName.getBytes("ISO8859-1"), "UTF-8"); // Firefox瀏覽器
        browse = new String("Firefox瀏覽器".getBytes("ISO8859-1"), "UTF-8");
    } else if (request.getHeader("User-Agent").toUpperCase().indexOf("CHROME") > 0) {
        fname = fileName;//new String(fileName.getBytes("ISO8859-1"), "UTF-8");// Google
        browse = new String("Google".getBytes("ISO8859-1"), "UTF-8");
    } else if (request.getHeader("User-Agent").toUpperCase().indexOf("WINDOWS") > 0) {
        fname = fileName;//URLEncoder.encode(fileName, "UTF-8");// IE瀏覽器
        //fname = new String(fileName.getBytes("ISO8859-1"), "UTF-8");
        browse = new String("IE瀏覽器".getBytes("ISO8859-1"), "UTF-8");
    }
    
    out.println("<!doctype html>");
    out.println("<head>");
    out.println("<title>Servlet upload</title>"); 
    out.println("</head>");
    out.println("<body>");
    out.println("<p>("+browse+" - "+request.getHeader("User-Agent")+")</P>");
    out.println("<p>absolutePath: " + absolutePath+"webapps\\root\\ESVC\\uploads\\"+ fname + "</p>"); 
    out.println("</body>");
    out.println("</html>");

%>