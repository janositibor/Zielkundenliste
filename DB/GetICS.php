<?php
require_once("ICS.php");
require_once("UserRepository.php");

$ZielKundenID=$_GET["ZielKundenID"];

$userRepository=new UserRepository();
$result=$userRepository->getUser($ZielKundenID);
$zielKunden = $result->fetch_object();

$ZielKundenID=$zielKunden->ZielKundenID;
$Erinnerung_Outlook=$zielKunden->Erinnerung_Outlook;
$NameDesKontakts=$zielKunden->NameDesKontakts;
$EMailAdresse=$zielKunden->EMailAdresse;
$WerKummertSich=$zielKunden->WerKummertSich;

$event = new ICS($Erinnerung_Outlook." 09:00",$Erinnerung_Outlook." 10:00",$NameDesKontakts." ".$EMailAdresse,$WerKummertSich." ".$NameDesKontakts." ".$EMailAdresse." (".$ZielKundenID.")","Online event");
$event->show();