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
$query="UPDATE zielkundenliste_basicData SET ";

$index=0;
foreach ($Data as $key => $value){
	$index++;
	if($key!="ZielKundenID"){
		if($index>1){
		$query.=", ";
		}
		$query.=$key." = \"".$value."\"";
	}
}

$query.=" WHERE ZielKundenID=".$Data["ZielKundenID"];
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