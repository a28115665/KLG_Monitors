<?php
$ds          = DIRECTORY_SEPARATOR;  //1
 
$storeFolder = 'uploads';   //2

echo "<script>console.log( 'upload.php' );</script>";
if (!empty($_FILES)) {
     
    $tempFile = $_FILES['file']['tmp_name'];          //3             
    echo "<script>console.log( 'tempFile: " . $tempFile . "' );</script>";
    $targetPath = dirname( __FILE__ ) . $ds. $storeFolder . $ds;  //4
    echo "<script>console.log( 'targetPath: " . $targetPath . "' );</script>"; 
    $targetFile =  $targetPath. $_FILES['file']['name'];  //5
 	echo "<script>console.log( 'targetFile: " . $targetFile . "' );</script>";
    move_uploaded_file($tempFile,$targetFile); //6
     
} else {                                                           
    $result  = array();
 
    $files = scandir($storeFolder);                 //1
    if ( false!==$files ) {
        foreach ( $files as $file ) {
            if ( '.'!=$file && '..'!=$file) {       //2
                $obj['name'] = $file;
                $obj['size'] = filesize($storeFolder.$ds.$file);
                $result[] = $obj;
            }
        }
    }
     
    header('Content-type: text/json');              //3
    header('Content-type: application/json');
    echo json_encode($result);
}
?>