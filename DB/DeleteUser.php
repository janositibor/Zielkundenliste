<?php
require_once("UserRepository.php");

$FilterOptions=(array)json_decode(file_get_contents('php://input', true));
$userRepository=new UserRepository();
$userRepository->deleteUsers($FilterOptions);

