<?php

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "expense_tracker";

if(!$con = mysqli_connect($dbhost,$dbuser,$dbpass,$dbname))
{

	die("failed to connect!");
}
