<?php
// Leer los datos del cuerpo de la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);

$url = "https://genka.gbts.com.mx/WsRastreo/rest/WsRastreoOp/";

// Crear el contexto para la solicitud HTTP
$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => json_encode($data),  // Aquí se utilizan los datos del cuerpo de la solicitud POST
    ],
]);

// Enviar la solicitud al API remota y obtener la respuesta
$response = file_get_contents($url, false, $context);

// Comprobar si la solicitud falló
if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch data from API']);
    exit;
}

// Devolver la respuesta del API remota al cliente
header('Content-Type: application/json');
echo $response;
