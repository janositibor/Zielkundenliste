<?php
require_once("PrivateDataBase.php");
require_once("DTO.php");

$FilterOptions=(array)json_decode(file_get_contents('php://input', true));
$FilterOptionsKeys=array_keys($FilterOptions);

$dto=new DTO();

//$actualUser="Tibor";
$actualUser="Lars";
//$actualUser="Wolfgang";

$query="SELECT * FROM zielkundenliste_basicData";

if(count($FilterOptions)>0){
	$query.=" WHERE (";
	$index=0;
	foreach ($FilterOptions as $key => $value){
		$index++;
		if($key!="Erinnerung_Outlook"){
			if($index>1){
				$query.=" AND ";
				}
			$query.=$key." = \"".$value."\"";
		}
		else{
			//switch ($value["beforeAfter"]) {
			switch ($value->beforeAfter) {
				case "Before":
					$relationSign="<";
					break;
				case "After":
					$relationSign=">";
					break;
				case "EqualTo":
					$relationSign="=";
					break;
			}
			$query.=$key." ".$relationSign." \"".$value->value."\"";
		}
	}
	$query.=" )";
}

$query.=" ORDER BY ZielKundenID";

error_log($query, 0);
$dto->setQuery($query);

$db=new PrivateDataBase();
$db->connect();
$result=$db->runQuery($query);


while ($obj = $result->fetch_object()){
    foreach(DTO::$listName as $val){
        $dto->addToList($val."List",$obj->$val);
    }
    $obj->editable=(($obj->WerKummertSich==$actualUser) ? true : false);
    $dto->addUser($obj);
    }

			





//
//$output->Lists->ZielKundenIDList= ArrayConvert2Export($ZielKundenIDs);
//$output->Lists->KundenPRIOList= ArrayConvert2Export($KundenPRIOs);
//$output->Lists->WerKummertSichList =  ArrayConvert2Export($WerKummertSichs);
//$output->Lists->FirmennameList =  ArrayConvert2Export($Firmennames);
//$output->Lists->NameDesKontaktsList =  ArrayConvert2Export($NameDesKontakts);
//$output->Lists->RechnungsAdresseList =  ArrayConvert2Export($RechnungsAdresses);
//$output->Lists->OrtList = ArrayConvert2Export($Orts);
//$output->Lists->PostleitzahlList = ArrayConvert2Export($Postleitzahls);
//$output->Lists->Land_RegionList = ArrayConvert2Export($Land_Regions);
//$output->Lists->TelefonnummersList = ArrayConvert2Export($Telefonnummers);
//$output->Lists->EMailAdresseList = ArrayConvert2Export($EMailAdresses);
//$output->Lists->Erinnerung_OutlookList = ArrayConvert2Export($Erinnerung_Outlooks);
//$output->Lists->AnmerkungenList = ArrayConvert2Export($Anmerkungens);

//$output->query=$query;
$output=$dto->getData();
$response = json_encode($output);
echo $response;

$db->closeDataBase();
