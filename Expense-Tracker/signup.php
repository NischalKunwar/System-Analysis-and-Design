<?php 
session_start();

	include("connection.php");
	include("functions.php");


	if($_SERVER['REQUEST_METHOD'] == "POST")
	{
		//something was posted
		$user_name = $_POST['user_name'];
		$password = $_POST['password'];

		if(!empty($user_name) && !empty($password) && !is_numeric($user_name))
		{

			//save to database
			$user_id = random_num(20);
			$query = "insert into users (user_id,user_name,password) values ('$user_id','$user_name','$password')";

			mysqli_query($con, $query);

			header("Location:login.php");
			die;
		}else
		{
			echo "Please enter some valid information!";
		}
	}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup</title>
    <style>
        #title {
            position: absolute;
            top: 15%;
        }
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f2f5;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        #box {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 360px;
            padding: 20px;
            text-align: center;
        }

        #box h1 {
            margin-bottom: 20px;
            color: #333;
            font-size: 24px;
        }

        #text {
            height: 45px;
            border-radius: 6px;
            padding: 10px;
            border: 1px solid #ddd;
            width: 100%;
            margin-bottom: 15px;
            box-sizing: border-box;
        }

        #button {
            padding: 12px;
            width: 100%;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
        }

        #button:hover {
            background-color: #0056b3;
        }

        a {
            color: #007bff;
            text-decoration: none;
            font-size: 14px;
        }

        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1 id="title">Expense Tracker</h1>
    <div id="box">
        <h1>Signup</h1>
        <form method="post">
            <input id="text" type="text" name="user_name" placeholder="Username" required><br>
            <input id="text" type="password" name="password" placeholder="Password" required><br>
            <input id="button" type="submit" value="Signup"><br>
            <p>Already have an account? <a href="login.php">Login</a></p>
        </form>
    </div>
</body>
</html>
