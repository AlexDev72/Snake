<?php
session_start();

// Gestion du formulaire de nom
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['player_name'])) {
    $_SESSION['player_name'] = $_POST['player_name'];
    header('Location: index.php'); // Redirection pour éviter le resubmit
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snake Game | Modern</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="../css/snake.css" rel="stylesheet" />
</head>
<body>
<div class="container">
        <?php
        
        if (!isset($_SESSION['player_name'])): ?>
            <div class="row justify-content-center" id="player-form">
                <div class="col-md-6 text-center mt-5">
                    <h2>Entrez votre nom</h2>
                    <form method="post" class="mt-3">
                        <input type="text" name="player_name" class="form-control" required maxlength="20">
                        <button type="submit" class="btn btn-primary mt-3">Commencer à jouer</button>
                    </form>
                </div>
            </div>
        <?php else: ?>
            <div class="row justify-content-center" id="game-container">
                <div class="col-md-8 text-center">
                    <div class="d-flex justify-content-between mb-3">
                        <h2>Joueur: <?php echo htmlspecialchars($_SESSION['player_name']); ?></h2>
                        <div class="score-display">
                            Score: <span id="score">0</span>
                        </div>
                    </div>
                    
                    <div id="container"></div>

                    <div class="controls mt-3">
                        <i class="fas fa-arrow-up" onclick="changeDirection('haut')"></i><br>
                        <i class="fas fa-arrow-left" onclick="changeDirection('gauche')"></i>
                        <i class="fas fa-arrow-down" onclick="changeDirection('bas')"></i>
                        <i class="fas fa-arrow-right" onclick="changeDirection('droite')"></i>
                    </div>
                    
                    <button class="btn btn-warning mt-3" id="restart-btn">
                        <i class="fas fa-redo"></i> Recommencer
                    </button>
                    
                    <div class="mt-5" id="highscores">
                        <h3>Meilleurs Scores</h3>
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Joueur</th>
                                    <th>Score</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php include '../manager/get_scores.php'; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>

    <script src="../js/snake.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Initialisation spécifique à la page
        document.addEventListener('DOMContentLoaded', function() {
            // Passage des données PHP au JS si nécessaire
            const gameConfig = {
                playerName: '<?php echo isset($_SESSION['player_name']) ? addslashes($_SESSION['player_name']) : ""; ?>'
            };
       
            // Initialisation du jeu
            initGame(gameConfig);  
        });

       // Fonction pour les boutons de contrôle tactiles
       function changeDirection(dir) {
            const validMoves = {
                'haut': ['gauche', 'droite'],
                'bas': ['gauche', 'droite'],
                'gauche': ['haut', 'bas'],
                'droite': ['haut', 'bas']
            };
            
            if (validMoves[dir].includes(instruction)) {
                instruction = dir;
            }
        }
        
        // Gestion du bouton restart
        document.getElementById('restart-btn').addEventListener('click', function() {
            // Implémente la logique de redémarrage dans snake.js
            if (typeof restartGame === 'function') {
                restartGame();
            }
        });
    </script>
</body>
</html>


