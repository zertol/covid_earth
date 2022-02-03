import { CST } from "../CST"

export class OpeningScene extends Phaser.Scene {

  //@ts-ignore
  private crawlText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: CST.SCENES.OPENING
    })
  }


  preload() {
  }

  create() {

    this.make.text({ x: 0, y: 0, text: " " });

    let container = document.getElementById("game-container");
    if (container) {
      container.focus();
    }

    let gameContainer = document.getElementById("game-container") ?? document.createElement("div");

    gameContainer.className = "game-opening";

    let content = document.getElementById("content") ?? document.createElement("div");

    let introAudio = content.getElementsByTagName("audio")[0];
    introAudio.volume = .2;
    introAudio.currentTime=3;

    let divMute = document.createElement("div");
    divMute.className = "div-mute";

    divMute.onclick=()=>{
      divMute.classList.toggle("unmuted");
      introAudio.play();
      if(!divMute.classList.contains("unmuted")){
        introAudio.pause();
      }
    };

    document.body.appendChild(divMute);    

    let btnSkip = document.createElement("button");
    btnSkip.innerText = "Skip Intro >>";
    btnSkip.className = "skip-intro";

    btnSkip.onclick = () => {
      document.body.removeChild(btnSkip);
      gameContainer.className = "";
      content.innerHTML = "";
      introAudio.remove();
      divMute.remove();
      this.scene.start(CST.SCENES.MAIN);
    };

    document.body.appendChild(btnSkip);

    setTimeout(() => {
      btnSkip.className += " in";
    }, 3000);


    let fullText = "Once upon a time in a far away galaxy, an abnoxious virus decided to come and conquer our planet. This virus in particular was discovered first when " +
      "our very own scientists were looking upon the skies and sightseeing the universe. It shaped like a normal virus would have, yet its long reaching envelops " +
      "grabs your genes and infects your body without you even realizing it. During close contact, you may exhibit a lot of symptoms that may be the result of the virus's " +
      "droplets. The destructive force can generate coughing, sneezing, low oxygen, chest pain, which lead to catastrophic results and the normal human might die. " +
      "Filled with fear, humans and galaxy residents alike, decided to stay away from each other and take precautions to compensate their weaknesses.\nHowever, a brave soldier of the planet earth, " +
      "has taken upon himself to fight and restore peace once more to his galaxy, especially planet earth.\nThe fight is still on going despite the years passing by, the brave soldier named Lataka " +
      "is still not giving up, and the virus has finally revealed itself as 'COVID'...";


    content.getElementsByTagName("p")[0].innerHTML = fullText;
    content.getElementsByTagName("h1")[0].innerHTML = CST.TITLE;

    // Code for Chrome, Safari and Opera
    content.addEventListener("webkitAnimationEnd", () => {
      document.body.removeChild(btnSkip);
      gameContainer.className = "";
      content.innerHTML = "";
      introAudio.remove();
      divMute.remove();
      this.scene.start(CST.SCENES.MAIN);
    });

    // Standard syntax
    content.addEventListener("animationend", () => {
      document.body.removeChild(btnSkip);
      gameContainer.className = "";
      content.innerHTML = "";
      introAudio.remove();
      divMute.remove();
      this.scene.start(CST.SCENES.MAIN);
    });

  }

  update() {
  }
}
