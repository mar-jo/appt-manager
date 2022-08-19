<?php
//define variables to access db
define('DB_HOST', 'localhost');
define('DB_USER', 'bif2webscriptinguser');
define('DB_PASS', 'bif2021');
define('DB_NAME', 'appointment');
// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// output error if connection is interrupted/not established
if($conn->connect_error) {
    die('Database error:' . $conn->connect_error);
}
?>