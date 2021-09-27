<?php    
    
    include "conn.php";
while($row = mysql_fetch_object($result)){    
    
    
?>  
    <tr>  
        <td>  
            <?php echo $row->id;?>  
        </td>

        <td>  
            <?php echo $row->fname;?>  
        </td>

        <td>  
            <?php echo $row->mname;?>  
        </td>

        <td>  
            <?php echo $row->lname;?>  
        </td>

        <td>  
            <?php echo $row->pwd;?>  
        </td>

        <td>  
            <?php echo $row->cnf;?>  
        </td>

        <td>  
            <?php echo $row->mail;?>  
        </td>

        <td>  
            <?php echo $row->number;?>  
        </td>

        <td>  
            <?php echo $row->sex;?>  
        </td>

        <td>  
            <?php echo $row->address;?>  
        </td>

        <td>  
            <?php echo $row->code;?>  
        </td>

        <td>  
            <?php echo $row->city;?>  
        </td>

        <td>  
            <?php echo $row->country;?>  
        </td> 

        <td>  
            <?php echo $row->skills;?>  
        </td>

        <td>  
            <?php echo $row->attach_file;?>  
        </td>  

        <td> <a href="listing.php?id =     
            <?php echo $row->id;?>" onclick="return confirm('Are You Sure')">Delete    
        </a> | <a href="index.php?id =     
            <?php echo $row->id;?>" onclick="return confirm('Are You Sure')">Edit    
        </a> 
    </td>  
        <tr>  
            <?php } ?> 