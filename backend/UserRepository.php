<?php
require_once("PrivateDataBase.php");
require_once("DTO.php");
class UserRepository{
    private $database;
    private $query;
    private $output;

    private$userTable="zielkundenliste_basicData";

    //private $actualUser="Tibor";
    private $actualUser="Lars";
    //private $actualUser="Wolfgang";
    function __construct() {
        $this->database=new PrivateDataBase();
        $this->database->connect();
        $this->output=new DTO();
    }

    public function getUser($ZielKundenID){
        $FilterOptions=array("ZielKundenID"=>$ZielKundenID);
        $this->query=$this->createQueryForGetUsers($FilterOptions);
        $result=$this->database->runQuery($this->query);
        $this->closeDataBase();
        return $result;
    }

    public function getUsers(array $FilterOptions){
        $this->query=$this->createQueryForGetUsers($FilterOptions);
        $this->processQuery(true);
    }

    public function registerUsers(array $Data){
        $this->query=$this->createQueryForRegisterUsers($Data);
        $this->processQuery(false);
    }
    public function updateUsers(array $Data){
        $this->query=$this->createQueryForUpdateUsers($Data);
        $this->processQuery(false);
    }

    public function deleteUsers(array $FilterOptions){
        $this->query=$this->createQueryForDeleteUsers($FilterOptions);
        $this->processQuery(false);
    }

    private function createQueryForDeleteUsers(array $FilterOptions){
        $query="DELETE FROM ".$this->userTable." WHERE ZielKundenID=".$FilterOptions["userID"];
        return $query;
    }

    private function createQueryForUpdateUsers(array $Data){
        $query="UPDATE ".$this->userTable." SET ";
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
        return $query;
    }



    private function createQueryForRegisterUsers(array $Data){
        $queryPart1="INSERT INTO ".$this->userTable." (";
        $queryPart2="VALUES (";
        $index=0;
        foreach ($Data as $key => $value){
            $index++;
            $queryPart1.=$key;
            $queryPart1.=(($index==count($Data))?") ":", ");
            $queryPart2.="\"".$value."\"";
            $queryPart2.=(($index==count($Data))?") ":", ");
        }
        $query=$queryPart1.$queryPart2;
        return $query;
    }

    private function createQueryForGetUsers($FilterOptions){
        $query="SELECT * FROM ".$this->userTable;

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
        return $query;
    }

    private function processQuery($withResults){
        $this->output->setQuery($this->query);
        $result=$this->database->runQuery($this->query);
        $this->closeDataBase();
        if($withResults){
            $this->resultConvertToExport($result);
        }
        $this->generateOutput();
    }
    private function closeDataBase(){
        $this->database->closeDataBase();
    }

    private function resultConvertToExport($result){
        while ($obj = $result->fetch_object()){
            foreach(DTO::$listName as $val){
//                error_log($val."List => ".$obj->$val, 0);
                $this->output->addToList($val."List",$obj->$val);
            }
            $obj->editable=($obj->WerKummertSich==$this->actualUser);
            $this->output->addUser($obj);
        }
    }

    private function generateOutput(){
        $response = json_encode($this->output->getData());
        echo $response;
    }




}