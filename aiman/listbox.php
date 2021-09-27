<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1><strong>Please select user</strong></h1><br>

    <?php   
$mysql = mysqli_connect('localhost', 'root', '', 'usersdb');

$sql = "SELECT uname FROM users";
$records = mysqli_query($mysql,"select * from users");

echo "<select name='uname'>";
while ($row = mysqli_fetch_array($records)) {
    echo "<option value='" . $row['uname'] ."'>" . $row['uname'] ."</option>";
}
echo "</select>";

# here username is the column of my table(userregistration)
# it works perfectly
?>

    
</body>
</html>
