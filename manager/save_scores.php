<?php
session_start();
require '../includes/connexion.php';

if (isset($_POST['player_name']) && isset($_POST['score'])) {
    // Récupérer les données envoyées en POST
    $playerName = $_POST['player_name'];
    $score = $_POST['score'];

    // Insére les données dans la base
    try {
        $stmt = $pdo->prepare("INSERT INTO scores (player_name, score, created_at) VALUES (?, ?, NOW())");
        $stmt->execute([$playerName, $score]);
        echo json_encode(["success" => true]);  // Réponse JSON
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);  // Réponse JSON avec l'erreur
    }
} else {
    echo json_encode(["success" => false, "error" => "Données manquantes"]);  // Réponse JSON si données manquantes
}
?>
