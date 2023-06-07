<?php
$FilterOptions=(array)json_decode(file_get_contents('php://input', true));
$FilterOptionsKeys=array_keys($FilterOptions);

if (!isset($output)) 
$output->IDToDelete = $FilterOptions["userID"];

//$actualUser="Tibor";
$actualUser="Lars";

/*
$filters=[];
$filter_adatok=
	[
	"Tour" => ["ValueField" => "TourName", "TableAlias" => "Tours"], 
	"Year" => ["ValueField" => "Year", "TableAlias" => "Dates"], 
	"Month" => ["ValueField" => "Month", "TableAlias" => "Dates"], 
	"Day" => ["ValueField" => "Day", "TableAlias" => "Dates"], 
	"Country" => ["ValueField" => "CountryName", "TableAlias" => "Countries"], 
	"City" => ["ValueField" => "CityName", "TableAlias" => "Cities"], 
	"Venue" => ["ValueField" => "VenueName", "TableAlias" => "Venues"], 
	"Era" =>["ValueField" => "EraName", "TableAlias" => "Eras"],
	"Song" =>["ValueField" => "SongTitle", "TableAlias" => "Songs"]
	];
$MonthName2number=
	[
	"Januar"=>1,
	"Februar"=>2,
	"March"=>3,
	"April"=>4,
	"May"=>5,
	"June"=>6,
	"July"=>7,
	"August"=>8,
	"September"=>9,
	"October"=>10,
	"November"=>11,
	"December"=>12
	];
$monthListAlap = ["Januar","Februar","March","April","May","June","July","August","September","October","November","December"];
$songfilter=NULL;
forEach($FilterOptionsKeys as &$FOKey)
	{
	if($FOKey=="Venue" || $FOKey=="Song")
		{
		$FilterOptions[$FOKey]=str_replace("'","\'",$FilterOptions[$FOKey]);
		}
	if($FOKey!="Era" && $FOKey!="Song")
		{
		if($FOKey=="Month")
			{
			$FilterOptions[$FOKey]=$MonthName2number[$FilterOptions[$FOKey]];
			}
		//$output->Response[$FOKey]=$FilterOptions[$FOKey];
		$filters[]=$filter_adatok[$FOKey]["TableAlias"].".".$filter_adatok[$FOKey]["ValueField"]."='".$FilterOptions[$FOKey]."'";
		}
	else
		{
		//if(property_exists($FilterOptions, "Song"))
		if($FilterOptions["Song"]!=NULL)
			{
			$FOKey="Song";
			}
		else
			{
			$FOKey="Era";
			}
		$songfilter=$filter_adatok[$FOKey]["TableAlias"].".".$filter_adatok[$FOKey]["ValueField"]." LIKE '".$FilterOptions[$FOKey]."'";
		}
	}
$query_filter=NULL;
if(count($filters)>0)
	{
	$query_filter=" WHERE ".implode(" AND ", $filters);
	}	
if($songfilter!=NULL)
	{
	if($query_filter==NULL)
		{
		$query_filter=" WHERE ";
		}
	else
		{
		$query_filter.=" AND ";
		}
	$query_filter.="Events.EventID IN (SELECT Songs2Events.EventID FROM dmtd_Songs2Events AS Songs2Events 
		LEFT JOIN dmtd_Songs Songs ON Songs.SongID=Songs2Events.SongID
		LEFT JOIN dmtd_Eras Eras ON Eras.EraID=Songs.EraID
		WHERE ".$songfilter.")";
		
	
	$SongAndEra_query = "
	SELECT Eras.EraName, Songs.SongTitle FROM dmtd_Songs As Songs 
		INNER JOIN dmtd_Eras AS Eras ON Eras.EraID=Songs.EraID
		WHERE ".$songfilter;
	}
//$output=json_decode($_POST["FilterOptions"]);
*/
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
//echo "Connected successfully";

/*
$query_alap = "
	SELECT Events.EventID, Events.Link, Tours.TourName, Dates.Year, Dates.Month, Dates.Day, Countries.CountryName, Cities.CityName, Venues.VenueName FROM dmtd_Events AS Events
		INNER JOIN dmtd_Tours Tours ON Tours.TourID=Events.TourID
		INNER JOIN dmtd_Dates Dates ON Dates.DateID=Events.DateID
		INNER JOIN dmtd_Event2Country Event2Country ON Event2Country.EventID=Events.EventID
		INNER JOIN dmtd_Countries Countries ON Countries.CountryID=Event2Country.CountryID
		INNER JOIN dmtd_Event2City Event2City ON Event2City.EventID=Events.EventID
		INNER JOIN dmtd_Cities Cities ON Cities.CityID=Event2City.CityID
		INNER JOIN dmtd_Event2Venue Event2Venue ON Event2Venue.EventID=Events.EventID
		INNER JOIN dmtd_Venues Venues ON Venues.VenueID=Event2Venue.VenueID
		LEFT JOIN dmtd_Songs2Events Songs2EventsSetlist ON Songs2EventsSetlist.EventID=Events.EventID
		LEFT JOIN dmtd_Songs SetlistSongs ON SetlistSongs.SongID=Songs2EventsSetlist.SongID
		LEFT JOIN dmtd_Eras Eras ON Eras.EraID=SetlistSongs.EraID
		";
$query_order=" ORDER BY Dates.Year, Dates.Month, Dates.Day, Events.EventID, Countries.CountryName DESC, Songs2EventsSetlist.orderNo ASC";
$query=$query_alap.$query_filter.$query_order;
*/
//$query="SELECT * FROM zielkundenliste_basicData ORDER BY ZielKundenID";
$query="DELETE FROM zielkundenliste_basicData WHERE ZielKundenID=".$FilterOptions["userID"];
//error_log($query, 0);
//checkMemory("Nagy query elott");
$result = $conn->query($query);
//checkMemory("Nagy query utan");
/*
$ZielKundenIDs=[];
$KundenPRIOs=[];
$WerKummertSichs=[];
$Firmennames=[];
$NameDesKontakts=[];
$RechnungsAdresses=[];
$Orts=[];
$Postleitzahls=[];
$Land_Regions=[];
$Telefonnummers=[];
$EMailAdresses=[];
$Erinnerung_Outlooks=[];
$Anmerkungen=[];
$TempKunden=[];
while ($obj = $result->fetch_object())
	{
	$ZielKundenIDs[]=intval($obj->ZielKundenID);
	$KundenPRIOs[]=$obj->KundenPRIO;
	$WerKummertSichs[]=$obj->WerKummertSich;
	$Firmennames[]=$obj->Firmenname;
	$NameDesKontakts[]=$obj->NameDesKontakts;
	$RechnungsAdresses[]=$obj->RechnungsAdresse;
	$Orts[]=$obj->Ort;
	$Postleitzahls[]=$obj->Postleitzahl;
	$Land_Regions[]=$obj->Land_Region;
	$Telefonnummers[]=$obj->Telefonnummer;
	$EMailAdresses[]=$obj->EMailAdresse;
	$Erinnerung_Outlooks[]=$obj->Erinnerung_Outlook;
	$Anmerkungens[]=$obj->Anmerkungen;
	$KundenObj=$obj;
	$KundenObj->editable=(($obj->WerKummertSich==$actualUser) ? true : false);
	$TempKunden[]=$KundenObj;
	}

			

function assoc2indexed_withoutAny($arr) 
	{
    $indArr = array();
    foreach($arr as $val) 
		{
		$indArr[] = $val;
        }
    return $indArr;
}
function assoc2indexed($arr) 
	{
    $indArr = ["Any"];
    foreach($arr as $val) 
		{
		$indArr[] = $val;
        }
    return $indArr;
}
function ArrayConvert2Export($inputArray,$months=false)
	{
	asort($inputArray);
	$temp=array_unique($inputArray);
	return assoc2indexed($temp);
	}


 foreach($TempKunden as $kunde) 
		{
		$output->Kunden[]=$kunde;
        }
$output->Lists->ZielKundenList= ArrayConvert2Export($ZielKundenIDs);
$output->Lists->KundenPRIOList= ArrayConvert2Export($KundenPRIOs);
$output->Lists->WerKummertSichList =  ArrayConvert2Export($WerKummertSichs);
$output->Lists->FirmennameList =  ArrayConvert2Export($Firmennames);
$output->Lists->NameDesKontaktsList =  ArrayConvert2Export($NameDesKontakts);
$output->Lists->RechnungsAdresseList =  ArrayConvert2Export($RechnungsAdresses);
$output->Lists->OrtList = ArrayConvert2Export($Orts);
$output->Lists->PostleitzahlList = ArrayConvert2Export($Postleitzahls);
$output->Lists->Land_RegionList = ArrayConvert2Export($Land_Regions);
$output->Lists->TelefonnummersList = ArrayConvert2Export($Telefonnummers);
$output->Lists->EMailAdresseList = ArrayConvert2Export($EMailAdresses);
$output->Lists->Erinnerung_OutlookList = ArrayConvert2Export($Erinnerung_Outlooks);
$output->Lists->AnmerkungenList = ArrayConvert2Export($Anmerkungen);
*/

$response = json_encode($output);
echo $response;

$conn->close();

function checkMemory($info)
	{
	error_log("Memory used (".$info."): ".memory_get_usage(),0);
	}
?> 