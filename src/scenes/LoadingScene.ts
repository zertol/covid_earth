import { CST } from "../CST";
//@ts-ignore
import LOGO from "../../images/zenvalogo.png";
//@ts-ignore
import BACKGROUND from "../../images/background.jpg";
//@ts-ignore
import GLOBE from "../../images/BreusingGeometric2H.png";
export class LoadingScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.LOAD
    });
  }

  preload() {
    let width = this.game.renderer.width;
    let height = this.game.renderer.height;

    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();

    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 150, height / 2 - 25, 300, 50);

    let loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        fill: "#ffffff"
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    let percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: "0%",
      style: {
        font: "18px monospace",
        fill: "#ffffff"
      }
    });
    percentText.setOrigin(0.5, 0.5);

    let assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: "",
      style: {
        font: "18px monospace",
        fill: "#ffffff"
      }
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on("progress", (value: number) => {
      //@ts-ignore
      percentText.setText(parseInt(value * 100) + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      //@ts-ignore
      progressBar.fillRect(width / 2 - 140, height / 2 - 15, 280 * value, 30);
    });
    //@ts-ignore
    let files = [];
    this.load.on("fileprogress", (file: Phaser.GameObjects.Image) => {
      //@ts-ignore
      assetText.setText("Loading asset: " + file.key);
      files.push(file);
    });

    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();

      for (let i = 0; i < 500; i++) {
        //@ts-ignore
        files[i].destroy();
      }

      setTimeout(() => {
        this.scene.start(CST.SCENES.MAIN);
      }, 1000);
    });

    this.load.image(CST.IMAGES.LOGO, LOGO);
    for (let i = 0; i < 500; i++) {
      this.load.image(CST.IMAGES.LOGO + i, LOGO);
    }

    this.load.image(CST.IMAGES.BACKGROUND, BACKGROUND);
    this.load.spritesheet(CST.IMAGES.GLOBE, GLOBE, {
      frameWidth: 1000,
      frameHeight: 1000
    });
  }

  create() {
    let logo = this.add.image(
      this.game.renderer.width / 2,
      this.game.renderer.height / 2,
      CST.IMAGES.LOGO
    );
    this.anims.create({
      key: "earth_anim",
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.IMAGES.GLOBE),
      frameRate: 0.2,
      repeat: -1
    });
  }
}
