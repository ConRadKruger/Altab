let donnee;
await fetch("data/data.json")
  .then((response) => response.json())
  .then((data) => {
    donnee = data;
    console.log("Données chargées :", data);
  });

// Charger le template
async function templating(donnee) {
  await fetch("template.html")
    .then((remplissage) => remplissage.text())
    .then((template) => {
      console.log("Template chargé :", template);

      // Sélection de l'élément où injecter les données
      const infos = document.querySelector(".partie");

      // Parcours des données et remplacement dans le template
      donnee.forEach((remplacer) => {
        let blocHTML = template
          .replace(/{{jeuxVideo}}/g, remplacer.jeuxVideo)
          .replace(/{{image}}/g, remplacer.image)
          .replace(/{{Titre}}/g, remplacer.Titre)
          .replace(/{{artiste}}/g, remplacer.artiste)
          .replace(/{{artisteSpotify}}/g, remplacer.artisteSpotify)
          .replace(/{{icon}}/g, remplacer.icon)
          .replace(/{{Precision}}/g, remplacer.Precision)
          .replace(/{{explications}}/g, remplacer.explications)
          .replace(/{{audio}}/g, remplacer.audio)
          .replace(/{{Spotify}}/g, remplacer.Spotify);

        // Ajouter le bloc généré dans le conteneur
        infos.innerHTML += blocHTML;
      });

      console.log("Données injectées avec succès.");
    });
}

/* 
                     /$$                             /$$                                  
                    | $$                            | $$                                  
                    | $$        /$$$$$$   /$$$$$$$ /$$$$$$    /$$$$$$  /$$   /$$  /$$$$$$ 
                    | $$       /$$__  $$ /$$_____/|_  $$_/   /$$__  $$| $$  | $$ /$$__  $$
                    | $$      | $$$$$$$$| $$        | $$    | $$$$$$$$| $$  | $$| $$  \__/
                    | $$      | $$_____/| $$        | $$ /$$| $$_____/| $$  | $$| $$      
                    | $$$$$$$$|  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$|  $$$$$$/| $$      
                    |________/ \_______/ \_______/   \___/   \_______/ \______/ |__/    
*/

await templating(donnee);
function initializeAudio() {
  const sections = document.querySelectorAll(".spotify-container");

  sections.forEach((section) => {
    const playPauseButton = section.querySelector(".play-btn");
    const progressBar = section.querySelector(".progress-bar");
    const audio = section.querySelector(".audio");

    audio.volume = 0.15;

    playPauseButton.addEventListener("click", () => {
      togglePlayPause(audio, playPauseButton);
    });
    audio.addEventListener("timeupdate", () => {
      updateProgressBar(audio, progressBar);
    });
    audio.addEventListener("ended", () => {
      playPauseButton.textContent = "▶"; // Remet le bouton Play à la fin de la piste
      progressBar.value = 0; // Remet la barre de progression à 0
    });
    progressBar.addEventListener("input", () => {
      adjustAudioTime(audio, progressBar);
    });
  });
}
// Fonction pour jouer ou mettre en pause la piste
function togglePlayPause(audio, playPauseButton) {
  if (audio.paused) {
    audio.play();
    playPauseButton.textContent = "II"; // Icône Pause
  } else {
    audio.pause();
    playPauseButton.textContent = "▶"; // Icône Play
  }
}

// Fonction pour mettre à jour la barre de progression
function updateProgressBar(audio, progressBar) {
  if (audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
  }
}

// Fonction pour ajuster le temps de lecture en fonction de la barre de progression
function adjustAudioTime(audio, progressBar) {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
}

initializeAudio();
/* 
            /$$$$$$$$                                          /$$           /$$                    
            | $$_____/                                         | $$          |__/                    
            | $$     /$$$$$$   /$$$$$$  /$$$$$$/$$$$  /$$   /$$| $$  /$$$$$$  /$$  /$$$$$$   /$$$$$$ 
            | $$$$$ /$$__  $$ /$$__  $$| $$_  $$_  $$| $$  | $$| $$ |____  $$| $$ /$$__  $$ /$$__  $$
            | $$__/| $$  \ $$| $$  \__/| $$ \ $$ \ $$| $$  | $$| $$  /$$$$$$$| $$| $$  \__/| $$$$$$$$
            | $$   | $$  | $$| $$      | $$ | $$ | $$| $$  | $$| $$ /$$__  $$| $$| $$      | $$_____/
            | $$   |  $$$$$$/| $$      | $$ | $$ | $$|  $$$$$$/| $$|  $$$$$$$| $$| $$      |  $$$$$$$
            |__/    \______/ |__/      |__/ |__/ |__/ \______/ |__/ \_______/|__/|__/       \_______/
 */

const popupButtonOpen = document.querySelector(".popup-open");
const popupButtonExit = document.querySelector(".popup-exit");

popupButtonExit.addEventListener("click", togglepopup);
popupButtonOpen.addEventListener("click", togglepopup);

function togglepopup() {
  let popup = document.querySelector("#popup-overlay");
  popup.classList.toggle("open");
}
console.log(donnee);
async function sendData(event) {
  event.preventDefault();
  const sectionContainer = document.querySelector(".partie");
  const mail = document.getElementById("mail").value;
  const game = document.getElementById("game").value;
  const title = document.getElementById("title").value;
  const name = document.getElementById("name").value;
  const audio = document.getElementById("audio").value;
  const image = document.getElementById("image").value;
  const icon = document.getElementById("icon").value;
  const spotify = document.getElementById("spotify").value;
  const explications = document.getElementById("explications").value;
  const url = `https://perso-etudiant.u-pem.fr/~gambette/portrait/api.php?format=json&login=chevrieux&courriel=${mail}&message=Titre : ${title} Nom de l'artiste' : ${name} Explication du choix de la musique : ${explications}`;

  const newDonnee = [
    {
      Spotify: spotify,
      Titre: title,
      artiste: name,
      audio: audio,
      explications: explications,
      icon: icon,
      image: image,
      jeuxVideo: game,
    },
  ];
  await templating(newDonnee);
  await fetch(url).then(function (response) {
    response.json().then(function (data) {
      console.log("Réponse reçue : ");
      console.log(data);
    });
  });
  initializeAudio();
  togglepopup();
}
document.getElementById("submit").addEventListener("click", sendData);
