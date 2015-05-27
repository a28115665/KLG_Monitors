<html>
  
<head>  
  

  
<!-- 1 -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
 
<script src="js/plugin/dropzone/dropzone.min.js"></script>
 
<script>
<!-- 3 -->
Dropzone.options.myDropzone = {
    init: function() {
        thisDropzone = this;

        <!-- 4 -->
        $.get('/ESVC/upload.php', function(data) {
            
            console.log(123);
            <!-- 5 -->
            $.each(data, function(key,value){
                 
                var mockFile = { name: value.name, size: value.size };
                 
                thisDropzone.options.addedfile.call(thisDropzone, mockFile);
 
                thisDropzone.options.thumbnail.call(thisDropzone, mockFile, "uploads/"+value.name);
                 
            });
             
        });
    }
};
</script>
 
</head>
  
<body>
  
<!-- 2 -->
<form action="upload.php" class="dropzone" id="my-dropzone">
  <input type="submit">
</form>
    
</body>
  
</html>