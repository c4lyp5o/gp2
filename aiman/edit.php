<?php

include "conn.php"; // Using database connection file here

$id = $_GET['id']; // get id through query string

$qry = mysqli_query($mysql,"select * from users where id='$id'"); // select query

$data = mysqli_fetch_array($qry); // fetch data

if(isset($_POST['update'])) // when click on Update button
{
    $fullname = $_POST['fullname'];
    $age = $_POST['age'];
	
    $edit = mysqli_query($mysql,"update users set uname='$fullname', password='$age' where id='$id'");
	
    if($edit)
    {
        mysqli_close($mysql); // Close connection
        header("location:allrecords.php"); // redirects to all records page
        exit;
    }
    else
    {
        echo mysqli_error();
    }    	
}
?>

<h3>Update Data</h3>

<form method="POST">
  <input type="text" name="fullname" value="<?php echo $data['uname'] ?>" placeholder="Enter Full Name" Required>
  <input type="text" name="age" value="<?php echo $data['password'] ?>" placeholder="Enter Age" Required>
  <input type="submit" name="update" value="Update">
</form>