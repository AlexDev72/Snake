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
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <link href="../css/snake.css" rel="stylesheet" />
</head>

<body>
    <div class="container">

        <?php
        if (!isset($_SESSION['player_name'])): ?>

            <div class="row justify-content-center align-items-center min-vh-50" id="player-form">
                <div class="col-lg-5 col-md-7 col-10">
                    <div class="glass-card p-4 p-md-5 rounded-4 shadow-sm">
                        <div class="text-center mb-4">
                            <h2 class="fw-bold text-gradient">Entrez votre pseudo</h2>
                            <p class=" mt-2">Rejoignez l'aventure</p>
                        </div>

                        <form method="post" class="mt-3">
                            <div class="form-floating mb-3">
                                <input type="text"
                                    name="player_name"
                                    class="form-control border-0 shadow-sm"
                                    id="playerNameInput"
                                    placeholder="Votre nom"
                                    required
                                    maxlength="20">
                                <label for="playerNameInput">Votre pseudo</label>
                            </div>

                            <button type="submit" class="btn btn-primary w-100 py-3 fw-bold shadow">
                                Commencer à jouer
                                <i class="bi bi-arrow-right ms-2"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        <?php else: ?>

            <div class="row" id="game-container">
                <!-- Colonne pour les scores (à gauche) -->
                <div class="tabscore col-lg-3 col-md-4 d-none d-md-block pe-lg-4">
                    <div class="game-glass-card p-4 rounded-4 h-100">
                        <div class="mt-3" id="highscores">
                            <h3 class="text-center mb-4 section-title">
                                <i class="fas fa-trophy me-2"></i>Meilleurs Scores
                            </h3>
                            <div class="table-responsive">
                                <table class="table table-hover table-dark rounded-2 overflow-hidden">
                                    <thead class="table-header-glow">
                                        <tr>
                                            <th class="text-center">
                                                <div class="d-flex flex-column align-items-center">
                                                    <i class="fas fa-user mb-1"></i>
                                                    <span>Joueur</span>
                                                </div>
                                            </th>
                                            <th class="text-center">
                                                <div class="d-flex flex-column align-items-center">
                                                    <i class="fas fa-star mb-1"></i>
                                                    <span>Score</span>
                                                </div>
                                            </th>
                                            <th class="text-center">
                                                <div class="d-flex flex-column align-items-center">
                                                    <i class="fas fa-calendar mb-1"></i>
                                                    <span>Date</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="table-body-glow">
                                        <?php include '../manager/get_scores.php'; ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Colonne principale pour le jeu -->
                <div class="col-lg-6 col-md-8 col-11">
                    <div class="game-glass-card p-4 p-lg-5 rounded-4">
                        <!-- Header avec joueur et score -->
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div class="player-badge bg-dark bg-opacity-25 px-3 py-2 rounded-2">
                                <i class="fas fa-user me-2"></i>
                                <span class="fw-bold"><?php echo htmlspecialchars($_SESSION['player_name']); ?></span>
                            </div>

                            <div class="score-display glow-effect px-4 py-2">
                                <span class="me-2"><i class="fas fa-star"></i> Score:</span>
                                <span id="score" class="fw-bold fs-4">0</span>
                            </div>
                        </div>

                        <!-- Zone de jeu -->
                        <div id="container" class="game-board rounded-3 mb-4"></div>

                        <!-- Contrôles -->
                        <div class="controls mt-4 text-center">
                            <div class="d-inline-block mb-2">
                                <i class="fas fa-arrow-up control-btn btn-control-top" onclick="changeDirection('haut')"></i>
                            </div>
                            <div class="d-inline-block">
                                <i class="fas fa-arrow-left control-btn mx-3" onclick="changeDirection('gauche')"></i>
                                <i class="fas fa-arrow-down control-btn" onclick="changeDirection('bas')"></i>
                                <i class="fas fa-arrow-right control-btn mx-3" onclick="changeDirection('droite')"></i>
                            </div>
                        </div>

                        <!-- Modal game over -->
                        <div id="gameOverModal" class="game-over-modal">
                            <div class="game-over-content">
                                <h2>Game Over !</h2>
                                <p>Score final: <span id="finalScore">0</span></p>
                                <button id="restartButton">Rejouer</button>
                            </div>
                        </div>
                        <!-- Bouton restart -->
                        <div class="text-center mt-4">
                            <button class="btn btn-warning btn-restart rounded-pill px-4 py-2 fw-bold" id="restart-btn">
                                <i class="fas fa-redo me-2"></i>Recommencer
                            </button>
                        </div>
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