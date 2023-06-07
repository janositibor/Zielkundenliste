<?php
$Data=(array)json_decode(file_get_contents('php://input', true));
//$DataKeys=array_keys($FilterOptions);
//$output->Erinnerung_Outlook=$Data["Erinnerung_Outlook"];
//$output["Erinnerung_Outlook"]=$Data["Erinnerung_Outlook"];
//if (!isset($output)) 

//$actualUser="Tibor";
$actualUser="Lars";


$servername = "localhost";

$username = "zielkundenliste_user";
$password = "pass_for_zielkundenliste_user";
$database="zielkundenliste_DB";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);
$conn->set_charset('utf8');
//printf("Success... %s\n", $conn->host_info);
// Check connection
if ($conn->connect_error) {
	error_log("Connection failed: " . $conn->connect_error, 0);
	die("Connection failed: " . $conn->connect_error);
}
$queryPart1="INSERT INTO zielkundenliste_basicData (";
$queryPart2="VALUES (";
//INSERT INTO table_name (column_a, column_b) VALUES ("value_a", "value_b");

$index=0;
foreach ($Data as $key => $value){
	$index++;
	$queryPart1.=$key;
	$queryPart1.=(($index==count($Data))?") ":", ");
	$queryPart2.="\"".$value."\"";
	$queryPart2.=(($index==count($Data))?") ":", ");
}

$query=$queryPart1.$queryPart2;
//error_log($query, 0);
//checkMemory("Nagy query elott");
$result = $conn->query($query);
//checkMemory("Nagy query utan");

/*
foreach ($Data as $key => $value){
	$output[$key] = $value;
}
*/
$output->OK="OK";
$output->dataLength=count($Data);
$output->query=$query;


$response = json_encode($output);
echo $response;

$conn->close();

function checkMemory($info)
	{
	error_log("Memory used (".$info."): ".memory_get_usage(),0);
	}
?> 