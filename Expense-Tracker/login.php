<?php

session_start();

include ("connection.php");
include ("functions.php");


if ($_SERVER['REQUEST_METHOD'] == "POST") {
    //something was posted
    $user_name = $_POST['user_name'];
    $password = $_POST['password'];

    if (!empty($user_name) && !empty($password) && !is_numeric($user_name)) {

        //read from database
        $query = "select * from users where user_name = '$user_name' limit 1";
        $result = mysqli_query($con, $query);

        if ($result) {
            if ($result && mysqli_num_rows($result) > 0) {

                $user_data = mysqli_fetch_assoc($result);

                if ($user_data['password'] === $password) {

                    $_SESSION['user_id'] = $user_data['user_id'];
                    header("Location: homepage.php");
                    die;
                }
            }
        }

        echo "<span>" . "wrong username or password!" . "</span>";
    } else {
        echo "<span>" . "wrong username or password!" . "</span>";
    }
}

?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
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

        span {
            color: red;
            position: absolute;
            top: 75%;
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
        <h1>Login</h1>
        <form method="post">
            <input id="text" type="text" name="user_name" placeholder="Username" required><br>
            <input id="text" type="password" name="password" placeholder="Password" required><br>
            <input id="button" type="submit" value="Login"><br>
            <p>Don't have an account? <a href="signup.php">Sign up</a></p>
        </form>
    </div>
</body>

</html>