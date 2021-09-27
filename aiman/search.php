<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<h2>Search result</h2>

<table border = "2">
  <tr>
    <td>ID.</td>
    <td>Name</td>
    <td>Password</td>
    <td>Edit</td>
    <td>Delete</td>
  </tr>
<?php
    
    $con= new mysqli("localhost","root","","usersdb");
    $name = $_POST["search"];
    //$query = "SELECT * FROM employees
   // WHERE first_name LIKE '%{$name}%' OR last_name LIKE '%{$name}%'";

    // Check connection
    if (mysqli_connect_errno())
      {
      echo "Failed to connect to MySQL: " . mysqli_connect_error();
      }

$result = mysqli_query($con, "SELECT * FROM users
    WHERE uname LIKE '%{$name}%'");

$records = mysqli_query($con,"select * from users"); // fetch data from database

while($data = mysqli_fetch_array($result))
{
?>
  <tr>
    <td><?php echo $data['id']; ?></td>
    <td><?php echo $data['uname']; ?></td>
    <td><?php echo $data['password']; ?></td>    
    <td><a href="edit.php?id=<?php echo $data['id']; ?>">Edit</a></td>
    <td><a href="delete.php?id=<?php echo $data['id']; ?>">Delete</a></td>
  </tr>	
<?php
}
?>
</body>
</html>

