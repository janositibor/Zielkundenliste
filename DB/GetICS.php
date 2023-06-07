<?php
class ICS {
    var $data;
    var $name;
    function ICS($start,$end,$name,$description,$location) {
        $this->name = $name;
        $this->data = "BEGIN:VCALENDAR\nVERSION:2.0\nMETHOD:PUBLISH\nBEGIN:VEVENT\nDTSTART:".date("Ymd\THis\Z",strtotime($start))."\nDTEND:".date("Ymd\THis\Z",strtotime($end))."\nLOCATION:".$location."\nTRANSP: OPAQUE\nSEQUENCE:0\nUID:\nDTSTAMP:".date("Ymd\THis\Z")."\nSUMMARY:".$name."\nDESCRIPTION:".$description."\nPRIORITY:1\nCLASS:PUBLIC\nBEGIN:VALARM\nTRIGGER:-PT10080M\nACTION:DISPLAY\nDESCRIPTION:Reminder\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR\n";
    }
    function save() {
        file_put_contents($this->name.".ics",$this->data);
    }
    function show() {
        header("Content-type:text/calendar");
        header('Content-Disposition: attachment; filename="'.$this->name.'.ics"');
        Header('Content-Length: '.strlen($this->data));
        Header('Connection: close');
        echo $this->data;
    }
}
?>

<?php
//$actualUser="Tibor";
$actualUser="Lars";

$ZielKundenID=$_GET["ZielKundenID"];
$servername = "localhost";
/*
$username = "zielkundenliste_user";
$password = "pass_for_zielkundenliste_user";
$database="zielkundenliste_DB";
*/
$username = "dmtourda_zielkundenliste_user";
$password = "pass_for_zielkundenliste_user";
$database="dmtourda_zielkundenliste";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);
$conn->set_charset('utf8');
//printf("Success... %s\n", $conn->host_info);
// Check connection
if ($conn->connect_error) {
	error_log("Connection failed: " . $conn->connect_error, 0);
	die("Connection failed: " . $conn->connect_error);
}
$query="SELECT * FROM zielkundenliste_basicData WHERE ZielKundenID=".$ZielKundenID;


//error_log($query, 0);
//checkMemory("Nagy query elott");
$result = $conn->query($query);
//checkMemory("Nagy query utan");
$obj = $result->fetch_object();
$conn->close();

$ZielKundenID=$obj->ZielKundenID;
$Erinnerung_Outlook=$obj->Erinnerung_Outlook;
$NameDesKontakts=$obj->NameDesKontakts;
$EMailAdresse=$obj->EMailAdresse;
$WerKummertSich=$obj->WerKummertSich;





$event = new ICS($Erinnerung_Outlook." 09:00",$Erinnerung_Outlook." 10:00",$NameDesKontakts." ".$EMailAdresse,$WerKummertSich." ".$NameDesKontakts." ".$EMailAdresse." (".$ZielKundenID.")","Online event");
$event->show();

function checkMemory($info)
	{
	error_log("Memory used (".$info."): ".memory_get_usage(),0);
	}
?> 