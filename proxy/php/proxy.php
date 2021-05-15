<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/json; charset=UTF-8');

if (!isset($_GET['request']) || !isset($_GET['server'])) {
    echo json_encode(["ok" => false, "message" => "Bad request"]);
    exit(0);
}

$servers = include('servers.php');
$server = $_GET['server'];
$request = $_GET['request'];
$target = $servers[$server];

if (!$request) {
    echo json_encode(["ok" => false, "message" => "Bad request"]);
    exit(0);
}

if( $curl = curl_init() ) {
    curl_setopt($curl, CURLOPT_URL, 'http://' . $target . '/' . $request);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
    $out = curl_exec($curl);
    curl_close($curl);

    echo ($out);
}
