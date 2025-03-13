// on fait le lien avec le container fluid créé en html
let cf = document.getElementById("container");
// compteur permettant d'afficher les numéro des cellules
let compteurCellule = 0;
// on déclare le tableau du serpent
let snake = [25];
// stoke l'instruction (touche appyuer par l'utilisateur)
let instruction ="";

// on fabrique 10 ligne
for(let i=0; i<10; i++){
    // on fabrique un element div
    let maRow = document.createElement("div");
    // on lui ajoute la classe css row de bootstrap row
    maRow.classList.add("row");
    // on fait apparaitre la div dans le container
    container.appendChild(maRow);
    // fabriquer 10 colonne par ligne
    for(let j =0; j<10; j++){
        // à chaque fois qu'on fabique une cellule, on ajoute 1 au compteur
        compteurCellule = compteurCellule +1;
        let maCol = document.createElement("div");
         // on lui ajoute la classe css col de bootstrap row
        maCol.classList.add("col", "bordure");
        maCol.textContent = compteurCellule;
        maCol.id = compteurCellule;
        maRow.appendChild(maCol);
    }
}

// Cette fonction va nous permettre colorier notre grille
function colorie(){
    // comme mes cellules on un id unique de 1 à 100
    // je parcours toutes les cellules
    for(let i=1; i<=100; i++){
        // on séléctionne la cellule en cours
        let maCel = document.getElementById(i);
        // dans mon tableau snake, il y a t'il la valeur i ?
        if(snake.includes(i) == true){
            maCel.classList.add("gris");
            // on supprime les anciennes classes de couleurs pour éviter des conflits d'affichage
            maCel.classList.remove("white");
        }else{
            maCel.classList.add("white");
             // on supprime les anciennes classes de couleurs pour éviter des conflits d'affichage
            maCel.classList.remove("gris");
        }
    }
}

colorie();


// cette fonction est appelé lorque l'utilisateur appuie sur une touche
function recupLastInstruction(e){
    e = e || window.event;

    if (e.keyCode == '38') {
        instruction = "haut";
        deplacement();
        // up arrow
    }
    else if (e.keyCode == '40') {
        instruction = "bas";
        deplacement();
        // down arrow
    }
    else if (e.keyCode == '37') {
        instruction = "gauche";
        deplacement();
    // left arrow
    }
    else if (e.keyCode == '39') {
        instruction = "droite";
        deplacement();
    // right arrow
    }
   
}



function deplacement(){
    switch (instruction) {
        case 'haut':
            if(snake[0]<10 == 0){
                snake[0] = snake[0] -10;
            }else{
                snake[0] = snake[0] +90;
            }
          break;
        case 'bas':
            if(snake[0]>90){
                snake[0] = snake[0] -90;
            }else{
                snake[0] = snake[0] +10;
            }
            break;
        case 'gauche':
            if(snake[0]%10 == 1){
                snake[0] = snake[0] +9;
            }else{
                snake[0] = snake[0] -1;
            }
          break;
        case 'droite':
            // si l'emplacement actuelle de mon serpent est divisible par 10
            if(snake[0]%10 == 0){
                snake[0] = snake[0] -9;
            }else{
                snake[0] = snake[0] +1;
            }
            break;
      }
      colorie();
}