<!DOCTYPE html>
<html>
<head>
  <title>Display all records from Database</title>
</head>
<body>

<h2>Employee Details</h2>

<table border = "2">
  <tr>
    <td>ID.</td>
    <td>Name</td>
    <td>Password</td>
    <td>Edit</td>
    <td>Delete</td>
  </tr>

<?php

include "conn.php"; // Using database connection file here

$records = mysqli_query($mysql,"select * from users"); // fetch data from database

while($data = mysqli_fetch_array($records))
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
</table>

</body>
<br><br><button type="button" onclick="location.href='export.php';">Export to Excel</button><br>
<button type="button" onclick="location.href='logout.php';">Log out</button>
</html>