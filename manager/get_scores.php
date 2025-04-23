<?php
require_once __DIR__ . '/../includes/connexion.php';


try {
    $stmt = $pdo->query("SELECT player_name, score, created_at FROM scores ORDER BY score DESC LIMIT 10");
    $scores = $stmt->fetchAll();
    
    foreach ($scores as $score) {
        echo "<tr>
                <td>".htmlspecialchars($score['player_name'])."</td>
                <td>".$score['score']."</td>
                <td>".date('d/m/Y H:i', strtotime($score['created_at']))."</td>
              </tr>";
    }
} catch (PDOException $e) {
    echo "<tr><td colspan='3'>Erreur de chargement des scores</td></tr>";
}