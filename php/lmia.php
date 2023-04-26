<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "canadata";
// Create connection
$mysqli = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($mysqli->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$row = 1;
if (($handle = fopen("./2020_q4-2016_q1.csv", "r")) !== FALSE) {
  while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
    $num = count($data);
    $row++;
    $s = hash('sha256', uniqid());
    $substrings = str_split($s, 4);
    $id = $substrings[0] . $substrings[1] . '-' . $substrings[2] . '-' . $substrings[3] . '-' . $substrings[4] . '-' . $substrings[5] . $substrings[6];

    $province = $mysqli->real_escape_string(trim($data[0]));
    $stream = $mysqli->real_escape_string(trim($data[1]));
    $employer = $mysqli->real_escape_string(trim($data[2]));
    $address = $mysqli->real_escape_string(trim($data[3]));
    $occupation = $mysqli->real_escape_string(trim($data[4]));
    $noc = trim(explode('-', $data[4])[0]);
    $incorporate_status = $mysqli->real_escape_string(trim($data[5]));
    $approved_lmias = trim($data[6]);
    $approved_positions = trim($data[7]);
    $year = trim($data[8]);
    $quarter = trim($data[9]);
    $query = "INSERT INTO lmia (id, province, stream, employer, address, occupation, noc, incorporate_status, approved_lmias, approved_positions, year, quarter) VALUES ('$id', '$province', '$stream', '$employer', '$address', '$occupation', '$noc', '$incorporate_status', $approved_lmias, $approved_positions, $year, '$quarter')";
    if ($mysqli->query($query) === TRUE) {
    } else {
      echo "Error: " . $query . "---" . $mysqli->error;
    }
  }
  fclose($handle);
}
