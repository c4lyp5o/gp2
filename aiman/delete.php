<?php

include "conn.php"; // Using database connection file here

$id = $_GET['id']; // get id through query string

$del = mysqli_query($mysql,"delete from users where id = '$id'"); // delete query

if($del)
{
    mysqli_close($mysql); // Close connection
    header("location:allrecords.php"); // redirects to all records page
    exit;	
}
else
{
    echo "Error deleting record"; // display error message if not delete
}
?>