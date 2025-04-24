// Configuration du jeu
const config = {
  containerId: "container", // ID du conteneur HTML qui va afficher la grille
  tailleGrille: 20, // Grille 20x20
  initialPosition: 210, // Position de départ du serpent (cellule 210)
  vitesse: 150, // Vitesse du jeu (intervalle de déplacement en ms)
};

// Variables globales
let snake = []; // Représente le serpent (tableau d'ID de cellules)
let instruction = ""; // Dernière direction enregistrée
let pomme = null; // Position actuelle de la pomme
let deplacementEnCours = false; // Flag pour éviter les doubles déplacements
let score = 0; // Score du joueur
let intervalId = null; // ID de l'intervalle pour pouvoir le clear
let gameConfigGlobal = null; // Stocke les infos de config du joueur

// Initialise le jeu
function initGame(gameConfig) {
  const container = document.getElementById(config.containerId);
  if (!container) return; // Sécurité : si le container n'existe pas, on arrête tout

  gameConfigGlobal = gameConfig;

  // Reset des variables
  snake = [config.initialPosition];
  instruction = "";
  pomme = null;
  deplacementEnCours = false;
  score = 0;

  // Style du conteneur
  container.style.width = "400px";
  container.style.margin = "20px auto";
  container.style.padding = "0";
  container.style.backgroundColor = "#f0f0f0";
  container.style.borderRadius = "10px";
  container.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
  container.style.overflow = "hidden";
  container.innerHTML = ""; // On vide le container au cas où

  // Création de la grille
  let compteurCellule = 0;
  for (let i = 0; i < config.tailleGrille; i++) {
    let maRow = document.createElement("div");
    maRow.classList.add("row");
    maRow.style.margin = "0";
    maRow.style.height = "20px";
    for (let j = 0; j < config.tailleGrille; j++) {
      compteurCellule++;
      let maCol = document.createElement("div");
      maCol.style.width = "20px";
      maCol.style.height = "20px";
      maCol.style.padding = "0";
      maCol.style.margin = "0";
      maCol.style.display = "inline-flex";
      maCol.style.justifyContent = "center";
      maCol.style.alignItems = "center";
      maCol.style.fontSize = "8px";
      maCol.textContent = "";
      maCol.id = compteurCellule; // Chaque cellule a un ID unique
      maRow.appendChild(maCol);
    }
    container.appendChild(maRow);
  }

  // Styles CSS ajoutés dynamiquement
  const style = document.createElement("style");
  style.innerHTML = `
        .pomme { background-color: red !important; }
        .gris { background-color: #333 !important; }
        .white { background-color: #3C9742 !important; }
    `;
  document.head.appendChild(style);

  // Affichage de départ
  genererPomme();
  colorie();
  document.getElementById("score").textContent = score;

  // Events : clavier + bouton restart
  document.addEventListener("keydown", recupLastInstruction);
  document.getElementById("restart-btn").addEventListener("click", restartGame);

  // Reset intervalle si besoin
  clearInterval(intervalId);
  intervalId = setInterval(deplacement, config.vitesse);

  // Message de bienvenue si pseudo fourni
  if (gameConfig.playerName) {
    console.log(`Bienvenue, ${gameConfig.playerName}`);
  }
}

// Gère la génération d'une nouvelle pomme
function genererPomme() {
  if (pomme) {
    document.getElementById(pomme)?.classList.remove("pomme");
  }

  // Incrément du score si ce n'est pas la première pomme
  if (pomme !== null) {
    score++;
    document.getElementById("score").textContent = score;
  }

  // Nouvelle position aléatoire qui n’est pas sur le serpent
  do {
    pomme = Math.floor(Math.random() * config.tailleGrille ** 2) + 1;
  } while (snake.includes(pomme));

  document.getElementById(pomme)?.classList.add("pomme");
}

// Met à jour les couleurs de la grille
function colorie() {
  for (let i = 1; i <= config.tailleGrille ** 2; i++) {
    let cel = document.getElementById(i);
    if (!cel) continue;
    cel.classList.remove("white", "gris", "pomme");
    if (snake.includes(i)) cel.classList.add("gris");
    else if (i === pomme) cel.classList.add("pomme");
    else cel.classList.add("white");
  }
}

// Gère les touches directionnelles
function recupLastInstruction(e) {
  e = e || window.event;
  if (e.keyCode == "38" && instruction !== "bas") instruction = "haut";
  else if (e.keyCode == "40" && instruction !== "haut") instruction = "bas";
  else if (e.keyCode == "37" && instruction !== "droite")
    instruction = "gauche";
  else if (e.keyCode == "39" && instruction !== "gauche")
    instruction = "droite";
}

// Gère le déplacement du serpent à chaque tick
function deplacement() {
  if (deplacementEnCours || !instruction) return;
  deplacementEnCours = true;

  let nouvelleTete;
  let ancienneTete = snake[0];
  const taille = config.tailleGrille;

  // Calcul de la nouvelle position de la tête
  switch (instruction) {
    case "haut":
      nouvelleTete =
        ancienneTete <= taille
          ? ancienneTete + taille * (taille - 1)
          : ancienneTete - taille;
      break;
    case "bas":
      nouvelleTete =
        ancienneTete > taille * (taille - 1)
          ? ancienneTete - taille * (taille - 1)
          : ancienneTete + taille;
      break;
    case "gauche":
      nouvelleTete =
        ancienneTete % taille === 1
          ? ancienneTete + (taille - 1)
          : ancienneTete - 1;
      break;
    case "droite":
      nouvelleTete =
        ancienneTete % taille === 0
          ? ancienneTete - (taille - 1)
          : ancienneTete + 1;
      break;
  }
  // Collision avec soi-même = game over
  if (snake.includes(nouvelleTete)) {
    envoyerScore(score, gameConfigGlobal.playerName);

    // Afficher le modal personnalisé
    const gameOverModal = document.getElementById("gameOverModal");
    const finalScoreElement = document.getElementById("finalScore");
    const restartButton = document.getElementById("restartButton");

    finalScoreElement.textContent = score;
    gameOverModal.style.display = "flex";

    // Gérer le clic sur le bouton Rejouer
    restartButton.onclick = function () {
      gameOverModal.style.display = "none";
      window.location.reload();
      restartGame();
    };

    return;
  }

  // Si pomme mangée, on rallonge
  if (nouvelleTete === pomme) {
    snake.unshift(nouvelleTete);
    genererPomme();
  } else {
    // Sinon, déplacement classique
    snake.unshift(nouvelleTete);
    snake.pop();
  }

  colorie();
  deplacementEnCours = false;
}

// Redémarre la partie manuellement
function restartGame() {
  snake = [config.initialPosition];
  instruction = "";
  score = 0;
  document.getElementById("score").textContent = score;
  genererPomme();
  colorie();
}

// Permet de contrôler le jeu avec des boutons (mobile par ex)
function changeDirection(dir) {
  const opposites = {
    haut: "bas",
    bas: "haut",
    gauche: "droite",
    droite: "gauche",
  };
  if (instruction !== opposites[dir]) {
    instruction = dir;
  }
}

function envoyerScore(score, playerName) {
  fetch("../manager/save_scores.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      player_name: playerName,
      score: score,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Rafraîchir les meilleurs scores après envoi
      chargerMeilleursScores(); 
    })
    .catch((error) => console.error("Erreur:", error));
}

// Fonction pour charger les meilleurs scores
function chargerMeilleursScores() {
  fetch("../manager/get_scores.php")
    .then(response => response.text())
    .then(html => {
      document.getElementById('tableau-scores').innerHTML = html;
    })
    .catch(error => console.error("Erreur:", error));
}
