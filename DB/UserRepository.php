<?php
require_once("PrivateDataBase.php");
require_once("DTO.php");
class UserRepository{
    private $database;
    private $query;
    private $output;

    //private $actualUser="Tibor";
    private $actualUser="Lars";
    //private $actualUser="Wolfgang";
    function __construct() {
        $this->database=new PrivateDataBase();
        $this->database->connect();
        $this->output=new DTO();
    }

    function getUsers($FilterOptions){
        error_log("UserRepository->getUsers elindult", 0);
        $this->query=$this->createQueryForGetUsers($FilterOptions);
        $this->output->setQuery($this->query);
        $result=$this->database->runQuery($this->query);
        $this->closeDataBase();
        $this->resultConvertToExport($result);
        $this->generateOutput();
    }


    private function createQueryForGetUsers($FilterOptions){
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
        return $query;
    }
    private function resultConvertToExport($result){
        while ($obj = $result->fetch_object()){
            foreach(DTO::$listName as $val){
//                error_log($val."List => ".$obj->$val, 0);
                $this->output->addToList($val."List",$obj->$val);
            }
            $obj->editable=(($obj->WerKummertSich==$this->actualUser) ? true : false);
            $this->output->addUser($obj);
        }
//        error_log($this->output->toString());
    }
    private function generateOutput(){
        $response = json_encode($this->output->getData());
        echo $response;
    }
    function getOutput(){
        $response = json_encode($this->output);
        return $response;
    }
    private function closeDataBase(){
        $this->database->closeDataBase();

    }
}