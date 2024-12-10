//Variable

let iLargeurEcran = window.innerWidth; // On enregistre la hauteur de l'écran
let iHauteurEcran = window.innerHeight; // On enregistre la largeur de l'écran
let iPosX = 0,
  iPosY = 0;
let iInterval;
let iScore = 0;
//liste ennemie etc
let aEnnemis = [];
let aBoss = [];
let personnage = {
  x: 50,
  y: 50,
  largeur: 48,
  hauteur: 71,
  vitesse: 10,
};

let oSon = {
  trameMusicale: new Audio("assets/musique/musique continue jeu.mp3"),
  sonVictoire: new Audio("assets/musique/battue boss final.mp3"),
  sonDefaite: new Audio("assets/musique/Game over.mp3"),
  sonBoss: new Audio("assets/musique/boss theme song.mp3"),
};

let aProjectile = [];
let aProjectileBoss = [];
//Récupérer le canvas, sélection Html
const oBoutonDemarrer = document.querySelector("#btn_demarrage");
const oSectionIntro = document.querySelector("#introduction");
const oSectionJeu = document.querySelector("#jeu");
const oSectionVictoire = document.querySelector("#victoire");
const oSectionDefaite = document.querySelector("#defaite");

const oCanvasHTML = document.querySelector("#monCanvas");
const oContexte = oCanvasHTML.getContext("2d");

oCanvasHTML.height = iHauteurEcran / 1.5;
oCanvasHTML.width = iLargeurEcran / 1.5;

//Créer les médias nécessaires
let oImagesArrierePlan = new Image();
oImagesArrierePlan.src = "assets/images/background/postapocalypse3.png";

let oImagePerso = new Image();
oImagePerso.src = "assets/images/villagers/knight.png";
personnage.img = oImagePerso;

//Function
function initialiser() {
  oBoutonDemarrer.addEventListener("click", demarrerJeu);
  window.addEventListener("keydown", onToucheClavier);
  oCanvasHTML.addEventListener("click", creerProjectile);
}

function afficherDefaite() {
  oSectionJeu.classList.add("invisible");
  oSectionDefaite.classList.remove("invisible");
  setTimeout(redemarrerPage,4000);
}
function afficherVictoire() {
  oSectionJeu.classList.add("invisible");
  oSectionVictoire.classList.remove("invisible");
  setTimeout(redemarrerPage,4000);
}

function redemarrerPage() {
window.location.reload();
}
function demarrerJeu() {
  oSon.trameMusicale.play();
  oSectionIntro.classList.add("invisible");
  oSectionJeu.classList.remove("invisible");
  creerEnnemi();
  creerEnnemi();
  creerEnnemi();
  creerEnnemi();
  dessinerPerso();
  creerBosses();
  iInterval = setInterval(boucleJeu, 1000 / 60);
}
function dessinerArrierePlan() {
  oContexte.drawImage(
    oImagesArrierePlan,
    iPosX,
    0,
    oCanvasHTML.width,
    oCanvasHTML.height
  );
  oContexte.drawImage(
    oImagesArrierePlan,
    iPosX + oCanvasHTML.width,
    0,
    oCanvasHTML.width,
    oCanvasHTML.height
  );
  iPosX--;

  if (iPosX < 0 - oCanvasHTML.width) {
    iPosX = 0;
  }
}

function dessinerPerso() {
  oContexte.drawImage(
    personnage.img,
    personnage.x,
    personnage.y,
    personnage.largeur,
    personnage.hauteur
  );
}

function dessinerUi() {
  oContexte.font = "30px Arial";
  oContexte.fillStyle = "Red";
  oContexte.fillText("Score:", 20, 50);
  oContexte.fillText(iScore, 110, 50);
}

function dessinerEnnemi() {
  for (let index = 0; index < aEnnemis.length; index++) {
    const NouvelEnnemi = aEnnemis[index];

    NouvelEnnemi.image.src = NouvelEnnemi.src;

    oContexte.drawImage(
      NouvelEnnemi.image,
      NouvelEnnemi.x,
      NouvelEnnemi.y,
      NouvelEnnemi.hauteur,
      NouvelEnnemi.largeur
    );
    NouvelEnnemi.x -= NouvelEnnemi.vitesse;
    if (NouvelEnnemi.x < 0 - oCanvasHTML.width) {
      NouvelEnnemi.x = oCanvasHTML.width;
    }
    if (NouvelEnnemi.y < 0 - oCanvasHTML.width) {
      NouvelEnnemi.y = oCanvasHTML.height;
    }
  }
}
function dessinerBoss() {
  const NewBosses = aBoss[0];
  NewBosses.image.src = NewBosses.src;

  oContexte.drawImage(
    NewBosses.image,
    NewBosses.x,
    NewBosses.y,
    NewBosses.largeur,
    NewBosses.hauteur
  );
  NewBosses.y += NewBosses.vitesse;
  if (NewBosses.y < 0 || NewBosses.y > oCanvasHTML.height - NewBosses.hauteur) {
    NewBosses.vitesse = NewBosses.vitesse * -1;
  }
  console.log(NewBosses.y);
  dessinerProjectileBoss();
}

function dessinerProjectilePerso() {
  for (let i = 0; i < aProjectile.length; i++) {
    let projectile = aProjectile[i];
    oContexte.drawImage(
      projectile.image,
      projectile.x,
      projectile.y,
      projectile.largeur,
      projectile.hauteur
    );
    projectile.x += projectile.vitesse;
    if (projectile.x > oCanvasHTML.length) {
      aProjectile.splice(i, 1);
      i--;
    }
  }
}

function onToucheClavier(event) {
  let touche = event.key;
  console.log(touche);
  if (touche == "ArrowUp" || touche == "w") {
    personnage.y -= personnage.vitesse;
    personnage.y = Math.max(0, personnage.y);
  } else if (touche == "ArrowDown" || touche == "s") {
    personnage.y += personnage.vitesse;
    personnage.y = Math.min(
      oCanvasHTML.height - personnage.hauteur + 20,
      personnage.y
    );
  }

  if (touche == " ") {
    creerProjectile();
  }
}

function creerBosses() {
  let BosseAleatoire = Math.floor(Math.random() * 1);
  let NewBosses;
  if (BosseAleatoire == 0) {
    NewBosses = {
      image: new Image(),
      src: "assets/images/bosses/boss1.png",
      x: 600,
      y: Math.floor(Math.random() * (oCanvasHTML.height - 273)),
      largeur: 121,
      hauteur: 273,
      vitesse: 5,
      intervalProjectile: null,
    };
    NewBosses.intervalProjectile = setInterval(
      creerProjectileBoss,
      2000,
      NewBosses
    );
  } else if (BosseAleatoire == 1) {
    NewBosses = {
      image: new Image(),
      src: "assets/images/bosses/boss2.png",
      x: 600,
      y: Math.floor(Math.random() * (oCanvasHTML.height - 295)),
      largeur: 200,
      hauteur: 295,
      vitesse: 5,
      intervalProjectile: null,
    };
    NewBosses.intervalProjectile = setInterval(
      creerProjectileBoss,
      2000,
      NewBosses
    );
  }
  aBoss.push(NewBosses);
}
function creerEnnemi() {
  let indexAleatoire = Math.floor(Math.random() * 4);
  //créer objet avec les ennemies et faire avec if et else
  let NouvelEnnemi;
  if (indexAleatoire == 0) {
    NouvelEnnemi = {
      image: new Image(),
      src: "assets/images/simple_ennemis/ennemi1.png",
      x: Math.floor(Math.random() * oCanvasHTML.width),
      y: Math.floor(Math.random() * oCanvasHTML.height),
      largeur: 32,
      hauteur: 32,
      vitesse: 5,
    };
  } else if (indexAleatoire == 1) {
    NouvelEnnemi = {
      image: new Image(),
      src: "assets/images/simple_ennemis/ennemi2.png",
      x: Math.floor(Math.random() * oCanvasHTML.width),
      y: Math.floor(Math.random() * oCanvasHTML.height),
      largeur: 32,
      hauteur: 32,
      vitesse: 5,
    };
  } else if (indexAleatoire == 2) {
    NouvelEnnemi = {
      image: new Image(),
      src: "assets/images/simple_ennemis/ennemi3.png",
      x: Math.floor(Math.random() * oCanvasHTML.width),
      y: Math.floor(Math.random() * oCanvasHTML.height),
      largeur: 32,
      hauteur: 32,
      vitesse: 5,
    };
  } else if (indexAleatoire == 3) {
    NouvelEnnemi = {
      image: new Image(),
      src: "assets/images/simple_ennemis/ennemi4.png",
      x: Math.floor(Math.random() * oCanvasHTML.width),
      y: Math.floor(Math.random() * oCanvasHTML.height),
      largeur: 32,
      hauteur: 32,
      vitesse: 5,
    };
  } else {
    NouvelEnnemi = {
      image: new Image(),
      src: "assets/images/simple_ennemis/ennemi5.png",
      x: Math.floor(Math.random() * oCanvasHTML.width),
      y: Math.floor(Math.random() * oCanvasHTML.height),
      largeur: 32,
      hauteur: 32,
      vitesse: 5,
    };
  }
  aEnnemis.push(NouvelEnnemi);
}

function dessinerProjectileBoss() {
  for (let i = 0; i < aProjectileBoss.length; i++) {
    let projectile = aProjectileBoss[i];
    oContexte.drawImage(
      projectile.image,
      projectile.x,
      projectile.y,
      projectile.largeur,
      projectile.hauteur
    );
    projectile.x -= projectile.vitesse;
    if (projectile.x < 0) {
      aProjectileBoss.splice(i, 1);
      i--;
    }
  }
}

function creerProjectileBoss(BosseAleatoire) {
  let imageProjectileBoss = new Image();
  imageProjectileBoss.src = "assets/images/Projectile/projectile_boss.png";

  let projectileBoss = {
    image: imageProjectileBoss,
    x: BosseAleatoire.x + BosseAleatoire.largeur,
    y: BosseAleatoire.y + BosseAleatoire.hauteur / 3,
    hauteur: 60,
    largeur: 60,
    vitesse: 7,
  };
  //objet pour le projectile avec le x et y de ennemi
  aProjectileBoss.push(projectileBoss);
}
function creerProjectile() {
  let imageProjectile = new Image();
  imageProjectile.src = "assets/images/Projectile/projectile_perso.png";

  let projectile = {
    image: imageProjectile,
    x: personnage.x + personnage.largeur,
    y: personnage.y + personnage.hauteur / 3,
    hauteur: 60,
    largeur: 60,
    vitesse: 7,
  };
  aProjectile.push(projectile);
}

function CollisionPersoEnnemi(objet, autreObjet) {
  if (objet === undefined || autreObjet === undefined) {
    return false;
  }

  if (
    objet.x < autreObjet.x + autreObjet.largeur &&
    objet.x + objet.largeur > autreObjet.x &&
    objet.y < autreObjet.y + autreObjet.hauteur &&
    objet.y + objet.hauteur > autreObjet.y
  ) {
    // Les objets sont en collision
    return true;
  } else {
    // Les objets ne sont pas en collision
    return false;
  }
}
// function CollisionProjectileEnnemi(projectile, ennemi) {
//   if (
//     projectile.x < ennemi.x + ennemi.largeur &&
//     projectile.x + projectile.largeur > ennemi.x &&
//     projectile.y < ennemi.y + ennemi.hauteur &&
//     projectile.y + projectile.hauteur > ennemi.y
//   ) {
//     console.log("aLLO");
//     // Les objets sont en collision
//     return true;
//   } else {
//     // Les objets ne sont pas en collision
//     return false;
//   }
// }

function CollisionProjectileEnnemi() {
  for (let i = 0; i < aProjectile.length; i++) {
    let projectile = aProjectile[i];

    for (let j = 0; j < aEnnemis.length; j++) {
      let ennemi = aEnnemis[j];

      let collision = CollisionPersoEnnemi(projectile, ennemi);
      if (collision == true) {
        aProjectile.splice(i, 1);
        aEnnemis.splice(j, 1);
        i--;
        j--;
      }
    }
  }
}

function CollisionProjectileBoss() {
  for (let i = 0; i < aProjectile.length; i++) {
    let projectile = aProjectile[i];

    for (let j = 0; j < aBoss.length; j++) {
      let Boss = aBoss[j];
      let collision = CollisionPersoEnnemi(projectile, Boss);
      if (collision == true) {
        aProjectile.splice(i, 1);
        aBoss.splice(j, 1);
        i--;
        j--;
      }
    }
  }
}
function boucleJeu() {
  oContexte.clearRect(0, 0, oCanvasHTML.width, oCanvasHTML.height);
  dessinerArrierePlan();
  dessinerUi();

  dessinerPerso();
  dessinerProjectilePerso();

  if (aEnnemis.length > 0) {
    dessinerEnnemi();
    CollisionProjectileEnnemi(aProjectile, aEnnemis);

    for (let index = 0; index < aEnnemis.length; index++) {
      const ennemi = aEnnemis[index];
      if (CollisionPersoEnnemi(personnage, ennemi) == true) {
        oSon.trameMusicale.pause();
        oSon.sonDefaite.play();
        clearInterval(iInterval);
        afficherDefaite();
      }
    }
  } else if(aBoss.length>0) {    
    dessinerBoss();
    CollisionProjectileBoss(aProjectile, aBoss);
    oSon.trameMusicale.pause();
    oSon.sonBoss.play();
  

    for (let index = 0; index < aProjectileBoss.length; index++) {
      const projectile = aProjectileBoss[index];
      if (CollisionPersoEnnemi(personnage, projectile) == true) {
        oSon.trameMusicale.pause();
        oSon.sonBoss.pause();
        oSon.sonDefaite.play();
        clearInterval(iInterval);
        afficherDefaite();
      }
    }
  }else{
    dessinerUi()
   oSon.trameMusicale.pause();
   oSon.sonBoss.pause();
    oSon.sonVictoire.play();
    afficherVictoire();

  }
  

  

}

initialiser();
