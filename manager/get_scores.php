<?php
require_once __DIR__ . '/../includes/connexion.php';

try {
    // Récupère les 5 meilleurs scores (les plus élevés)
    $stmt = $pdo->query("SELECT player_name, score, DATE_FORMAT(created_at, '%d/%m/%Y') as date_fr 
                         FROM scores 
                         ORDER BY score DESC 
                         LIMIT 5");
    
    if ($stmt->rowCount() > 0) {
        foreach ($stmt as $score) {
            echo "<tr>
                    <td class='text-center'>".htmlspecialchars($score['player_name'])."</td>
                    <td class='text-center'>".$score['score']."</td>
                    <td class='text-center'>".$score['date_fr']."</td>
                  </tr>";
        }
    } else {
        echo "<tr><td colspan='3' class='text-center'>Aucun score enregistré</td></tr>";
    }
} catch (PDOException $e) {
    echo "<tr><td colspan='3' class='text-center'>Erreur de chargement des scores</td></tr>";
    // Pour le débogage (à enlever en production) :
    // error_log("Erreur lors de la récupération des scores: " . $e->getMessage());
}
?>