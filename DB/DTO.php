<?php

class DTO{
    private $lists=array();
    private $users=array();
    private $query=array();

    public static $listName=array("ZielKundenID","KundenPRIO","WerKummertSich","Firmenname","NameDesKontakts","RechnungsAdresse","Ort","Postleitzahl","Land_Region","Telefonnummer","EMailAdresse","Anmerkungen");

    function __construct() {
        foreach(DTO::$listName as $val){
            $this->lists[$val."List"] = array();
        }
    }

    function addUser($user){
        $this->users[]=$user;
    }

    function addToList($listName,$value){
        $this->lists[$listName][]=$value;
    }

    function setQuery($query){
        $this->query=$query;
    }

    function getData(){
        $this->convertListsForOutput();
        return (array("Lists"=>$this->lists,"Users"=>$this->users,"query"=>$this->query));
    }

    private function convertListsForOutput(){
        foreach(DTO::$listName as $val){
            $listName=$val."List";
            $listToConvert=$this->lists[$listName];
            $this->lists[$listName]=$this->ArrayConvert2Export($listToConvert);
        }
    }

    private function assoc2indexed($arr){
        $indArr = ["Any"];
        foreach($arr as $val){
            $indArr[] = $val;
        }
        return $indArr;
    }
    private function ArrayConvert2Export($inputArray){
        asort($inputArray);
        $temp=array_unique($inputArray);
        return $this->assoc2indexed($temp);
    }
}