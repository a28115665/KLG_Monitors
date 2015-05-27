<%@ include file="DBConnect.jsp"%>
<%@ page import="java.io.*,java.util.*, javax.servlet.*, java.net.*" %>
<%@ page import="javax.servlet.http.*" %>
<%@ page import="org.apache.commons.fileupload.*" %>
<%@ page import="org.apache.commons.fileupload.disk.*" %>
<%@ page import="org.apache.commons.fileupload.servlet.*" %>
<%@ page import="org.apache.commons.io.output.*" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
   File file ;
   int maxFileSize = 25 * 1000 * 1024;
   int maxMemSize = 25 * 1000 * 1024;
   String finalFilePath = null;
   // ServletContext context = pageContext.getServletContext();
   // String filePath = context.getInitParameter("file-upload");
   String filePath = absolutePath+"webapps\\ROOT\\KLG_Bulletin\\"+request.getParameter("file-upload")+"\\";
   String datetime = request.getParameter("datetime");

   // Verify the content type
   // String contentType = request.getContentType();
   // if ((contentType.indexOf("multipart/form-data") >= 0)) {
      DiskFileItemFactory factory = new DiskFileItemFactory();
      // maximum size that will be stored in memory
      factory.setSizeThreshold(maxMemSize);
      // Location to save data that is larger than maxMemSize.
      //factory.setRepository(new File("H:\\syscom\\Demo\\jetty_demo\\webapps\\root\\KLG_Bulletin\\uploads\\User1\\"));

      // Create a new file upload handler
      ServletFileUpload upload = new ServletFileUpload(factory);
      // maximum file size to be uploaded.
      upload.setSizeMax( maxFileSize );
      try{ 
         // Parse the request to get file items. 
         List fileItems = upload.parseRequest(request);
         // Process the uploaded file items
         Iterator i = fileItems.iterator();

         //out.println("<html>");
         //out.println("<head>");
         //out.println("<title>JSP File upload</title>");  
         //out.println("</head>");
         //out.println("<body>");
         while ( i.hasNext () ) 
         {
            FileItem fi = (FileItem)i.next();
            if ( !fi.isFormField () )  
            {
            // Get the uploaded file parameters
            String fieldName = fi.getFieldName();
            String fileName = URLDecoder.decode(fi.getName(),"UTF-8");
            boolean isInMemory = fi.isInMemory();
            long sizeInBytes = fi.getSize(); 

            if( request.getParameter("file-upload").toString().equals("files") ){
               // Write the file
               if( fileName.lastIndexOf("\\") >= 0 ){
                  fileName = datetime + '_' + fileName.substring( fileName.lastIndexOf("\\"));
                  file = new File( filePath + fileName) ;
               }else{
                  fileName = datetime + '_' + fileName.substring( fileName.lastIndexOf("\\")+1);
                  file = new File( filePath + fileName) ;
               }
               finalFilePath = filePath.substring(filePath.indexOf("files"), filePath.length()) + fileName; // "uploads/User1/"
            }else{
               // Write the file
               if( fileName.lastIndexOf("\\") >= 0 ){
                  fileName = Calendar.getInstance(TimeZone.getTimeZone("GMT")).getTimeInMillis() + "_" + fileName.substring( fileName.lastIndexOf("\\"));
                  file = new File( filePath + fileName) ;
               }else{
                  fileName = Calendar.getInstance(TimeZone.getTimeZone("GMT")).getTimeInMillis() + "_" + fileName.substring(fileName.lastIndexOf("\\")+1);
                  file = new File( filePath + fileName) ;
               }
               finalFilePath = filePath.substring(filePath.indexOf("uploads"), filePath.length()) + fileName; // "uploads/User1/"
            }
            fi.write( file ) ;
            //out.println("Uploaded Filename: " + filePath + fileName + "<br>");
            }
         }
         //out.println("</body>");
         //out.println("</html>");
      }catch(Exception ex) {
         System.out.println(ex);
      }
   // }else{
      // out.println("<html>");
      // out.println("<head>");
      // out.println("<title>Servlet upload</title>");  
      // out.println("</head>");
      // out.println("<body>");
      // out.println("<p>No file uploaded</p>"); 
      // out.println("</body>");
      // out.println("</html>");
   // }

%> <%=finalFilePath%>