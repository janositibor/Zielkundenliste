<?php
require_once("UserRepository.php");
//require_once("DTO.php");

$FilterOptions=(array)json_decode(file_get_contents('php://input', true));

$userRepository=new UserRepository();
$userRepository->getUsers($FilterOptions);
//echo $userRepository->getOutput();