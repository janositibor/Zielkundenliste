<?php
class PrivateDataBase{
    private $servername = "localhost";
    private $username = "zielkundenliste_user";
    private $password = "pass_for_zielkundenliste_user";
    private $database="zielkundenliste_DB";
    private $conn;

    function connect(){
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->database);
        $this->conn->set_charset('utf8');
        if ($this->conn->connect_error) {
            error_log("Connection failed: " . $this->conn->connect_error, 0);
            die("Connection failed: " . $this->conn->connect_error);
        }
    }
    function runQuery($query){
        $result = $this->conn->query($query);
        return $result;
    }
    function closeDataBase(){
        $this->conn->close();
    }
}