<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

<?php
include_once 'conn.php';
if(isset($_POST['save']))
{	 
	 $uname = $_POST['uname'];
	 $password = $_POST['password'];
	 $sql = "INSERT INTO users (uname,password) VALUES ('$uname','$password')";
	 if (mysqli_query($mysql, $sql)) {
        $last_id = mysqli_insert_id($mysql);
		echo "New record created successfully! Last inserted ID is: " . $last_id;
	 } else {
		echo "Error: " . $sql . "
" . mysqli_error($mysql);
	 }
	 mysqli_close($mysql);
}
?>

<br><br><button type="button" onclick="location.href='add.php';">Add more data</button>
<button type="button" onclick="location.href='allrecords.php';">List/edit data or Export to Excel</button><br>
<button type="button" onclick="location.href='logout.php';">Log out</button>
</body>
</html>