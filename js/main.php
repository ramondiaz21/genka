<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Leer los datos del cuerpo de la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);

$url = "https://genka.gbts.com.mx/WsRastreo/rest/WsRastreoOp/rastreoGuia";

try {
    // Preparar la solicitud
    $ch = curl_init($url);
    $payload = json_encode([
        'trackingNumber' => $data['trackingNumber'],
        'usrLogin' => "RASTREO",
        'passLogin' => "1l2RzGrKCep8ea/SsVIKpA==",
    ]);

    // Configurar opciones de curl
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type:application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Enviar la solicitud y obtener la respuesta
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
        var_dump($error_msg);
    }
    

    // Comprobar si la solicitud falló
    if ($response === false) {
        throw new Exception('Failed to fetch data from API');
    }

    // Cerrar el manejador de curl
    curl_close($ch);

    // Devolver la respuesta del API remota al cliente
    header('Content-Type: application/json');
    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
