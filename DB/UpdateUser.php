<?php
require_once("UserRepository.php");

$Data=(array)json_decode(file_get_contents('php://input', true));
$userRepository=new UserRepository();
$userRepository->updateUsers($Data);