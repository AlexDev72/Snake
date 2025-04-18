// on fait le lien avec le container fluid créé en html
let cf = document.getElementById("container");
// compteur permettant d'afficher les numéro des cellules
let compteurCellule = 0;
// on déclare le tableau du serpent
let snake = [210]; // position de départ plus centrale pour 20x20
// stocke l'instruction (touche appuyée par l'utilisateur)
let instruction = "";
// variable pour stocker la position de la pomme
let pomme = null;
// variable pour gérer le déplacement en cours
let deplacementEnCours = false;
// taille de la grille (20x20)
const tailleGrille = 20;
const nombreCases = tailleGrille * tailleGrille;

// Style du container
container.style.width = "400px";
container.style.margin = "20px auto";
container.style.padding = "0"; // ← Padding à 0
container.style.backgroundColor = "#f0f0f0";
container.style.borderRadius = "10px";
container.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
container.style.overflow = "hidden"; // ← Cache tout débordement

// on fabrique 20 lignes
for(let i=0; i<tailleGrille; i++){
    // on fabrique un element div
    let maRow = document.createElement("div");
    // on lui ajoute la classe css row de bootstrap row
    maRow.classList.add("row");
    maRow.style.margin = "0";
    maRow.style.height = "20px";
    // on fait apparaitre la div dans le container
    container.appendChild(maRow);
    // fabriquer 20 colonnes par ligne
    for(let j =0; j<tailleGrille; j++){
        // à chaque fois qu'on fabrique une cellule, on ajoute 1 au compteur
        compteurCellule = compteurCellule +1;
        let maCol = document.createElement("div");
        // style compact pour les cases
        maCol.style.width = "20px";
        maCol.style.height = "20px";
        maCol.style.padding = "0";
        maCol.style.margin = "0";
        maCol.style.display = "inline-flex";
        maCol.style.justifyContent = "center";
        maCol.style.alignItems = "center";
        maCol.style.fontSize = "8px";
        maCol.textContent = "";
        maCol.id = compteurCellule;
        maRow.appendChild(maCol);
    }
}

// Fonction pour générer une nouvelle pomme
function genererPomme() {
    // Retirer l'ancienne pomme si elle existe
    if (pomme) {
        let anciennePomme = document.getElementById(pomme);
        anciennePomme.classList.remove("pomme");
        anciennePomme.classList.add("white"); // S'assurer qu'elle redevient blanche
    }
    // Augmenter le score seulement si une pomme existait déjà (évite le score au démarrage)
    if (pomme !== null) {
        score += 1;
        document.getElementById('score').textContent = score;
    }
    // Générer nouvelle position
    let nouvellePomme;
    do {
        nouvellePomme = Math.floor(Math.random() * nombreCases) + 1;
    } while (snake.includes(nouvellePomme));
    
    pomme = nouvellePomme;
    let cellulePomme = document.getElementById(pomme);
    cellulePomme.classList.remove("white", "gris"); // Nettoyer avant d'ajouter
    cellulePomme.classList.add("pomme");
}

// Modifier la fonction colorie()
function colorie(){
    for(let i=1; i<=nombreCases; i++){
        let maCel = document.getElementById(i);
        
        // Réinitialiser la cellule
        maCel.classList.remove("white", "gris", "pomme");
        
        if(snake.includes(i)) {
            maCel.classList.add("gris");
        } 
        else if(i === pomme) {
            maCel.classList.add("pomme");
        }
        else {
            maCel.classList.add("white");
        }
    }
}

// Et le CSS doit contenir :
let style = document.createElement("style");
style.innerHTML = `
    .pomme {
        background-color: red !important;
    }
    .gris {
        background-color: #333 !important;
    }
    .white {
        background-color: #3C9742 !important;
    }
`;
document.head.appendChild(style);
genererPomme();
colorie();

function recupLastInstruction(e){
    e = e || window.event;

    if (e.keyCode == '38' && instruction !== "bas") {
        instruction = "haut";
    }
    else if (e.keyCode == '40' && instruction !== "haut") {
        instruction = "bas";
    }
    else if (e.keyCode == '37' && instruction !== "droite") {
        instruction = "gauche";
    }
    else if (e.keyCode == '39' && instruction !== "gauche") {
        instruction = "droite";
    }
}

function deplacement(){
    if (deplacementEnCours || !instruction) return;
    deplacementEnCours = true;
    
    let nouvelleTete;
    let ancienneTete = snake[0];
    
    switch (instruction) {
        case 'haut':
            nouvelleTete = ancienneTete <= tailleGrille ? 
                ancienneTete + (tailleGrille * (tailleGrille-1)) : 
                ancienneTete - tailleGrille;
            break;
        case 'bas':
            nouvelleTete = ancienneTete > (tailleGrille * (tailleGrille-1)) ? 
                ancienneTete - (tailleGrille * (tailleGrille-1)) : 
                ancienneTete + tailleGrille;
            break;
        case 'gauche':
            nouvelleTete = ancienneTete % tailleGrille == 1 ? 
                ancienneTete + (tailleGrille-1) : 
                ancienneTete - 1;
            break;
        case 'droite':
            nouvelleTete = ancienneTete % tailleGrille == 0 ? 
                ancienneTete - (tailleGrille-1) : 
                ancienneTete + 1;
            break;
    }
      
// Vérifier si le serpent a mangé la pomme
if(nouvelleTete == pomme) {
    // On ajoute la nouvelle tête et on garde la queue (le serpent grandit)
    snake.unshift(nouvelleTete);
    // On génère une nouvelle pomme
    genererPomme();
} else {
    // On déplace normalement (nouvelle tête et on retire la queue)
    snake.unshift(nouvelleTete);
    snake.pop();
}
    
    colorie();
    deplacementEnCours = false;
}

let score = 0;


document.getElementById('score').textContent = score;

function restartGame() {
    snake = [210];
    instruction = "";
    score = 0;
    document.getElementById('score').textContent = score;
    genererPomme();
    colorie();
}

// Ajoutez cette fonction à votre code
function changeDirection(dir) {
    const oppositeDirections = {
        'haut': 'bas',
        'bas': 'haut',
        'gauche': 'droite',
        'droite': 'gauche'
    };
    
    if (instruction !== oppositeDirections[dir]) {
        instruction = dir;
    }
}
document.addEventListener('keydown', recupLastInstruction);
setInterval(deplacement, 150); // Vitesse un peu plus rapide