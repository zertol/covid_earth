import { CST } from "../CST";
//@ts-ignore
import PLAYER from "../../sprites/spaceship.png";
//@ts-ignore
import LOGO from "../../images/zenvalogo.png";
//@ts-ignore
import BACKGROUND from "../../images/background.jpg";
//@ts-ignore
import GLOBE from "../../sprites/BreusingGeometric2H.png";
//@ts-ignore
import BLUECOVID19 from "../../sprites/bluevirussprite.png";
//@ts-ignore
import GREENCOVID19 from "../../sprites/greenvirussprite.png";
//@ts-ignore
import REDCOVID19 from "../../sprites/redvirussprite.png";
//@ts-ignore
import LEVELSJSON from "../scripts/gameconfig.json";
//@ts-ignore
import EXPLOSION from "../../sprites/explosion.png";
//@ts-ignore
import BEAM from "../../sprites/bullet.png";
//@ts-ignore
import POWERUPS from "../../sprites/powerupssprite.png";

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

    this.load.json('levelsData', LEVELSJSON);

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

      for (let i = 0; i < 100; i++) {
        //@ts-ignore
        files[i].destroy();
      }

      setTimeout(() => {
        this.scene.start(CST.SCENES.MAIN);
      }, 1000);
    });

    this.load.image(CST.IMAGES.LOGO, LOGO);
    for (let i = 0; i < 100; i++) {
      this.load.image(CST.IMAGES.LOGO + i, LOGO);
    }

    this.load.image(CST.IMAGES.BACKGROUND, BACKGROUND);
    this.load.spritesheet(CST.SPRITES.BEAM, BEAM, {
      frameWidth: 42,
      frameHeight: 72
    });
    this.load.spritesheet(CST.SPRITES.GLOBE, GLOBE, {
      frameWidth: 1000,
      frameHeight: 990
    });
    this.load.spritesheet(CST.SPRITES.BLUECOVID19, BLUECOVID19, {
      frameWidth: 266,
      frameHeight: 266
    });
    this.load.spritesheet(CST.SPRITES.GREENCOVID19, GREENCOVID19, {
      frameWidth: 266,
      frameHeight: 266
    });
    this.load.spritesheet(CST.SPRITES.REDCOVID19, REDCOVID19, {
      frameWidth: 266,
      frameHeight: 266
    });
    this.load.spritesheet(CST.SPRITES.PLAYER, PLAYER, {
      frameWidth: 512,
      frameHeight: 512
    });
    this.load.spritesheet(CST.SPRITES.COVID19_EXPLOSION,EXPLOSION,{
      frameWidth: 128,
      frameHeight:128
    });
    this.load.spritesheet(CST.SPRITES.POWERUPS,POWERUPS,{
      frameWidth: 73,
      frameHeight:73
    });
  }

  create() {
    let logo = this.add.image(
      this.game.renderer.width / 2,
      this.game.renderer.height / 2,
      CST.IMAGES.LOGO
    );
    this.anims.create({
      key: CST.ANIMATIONS.EARTH_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.GLOBE),
      frameRate: 0.7,
      repeat: -1
    });
    this.anims.create({
      key: CST.ANIMATIONS.BLUECOVID19_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.BLUECOVID19, {
        start: 0,
        end: 2
      }),
      frameRate: 15,
      repeat: 0
    });
    this.anims.create({
      key: CST.ANIMATIONS.GREENCOVID19_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.GREENCOVID19, {
        start: 0,
        end: 3
      }),
      frameRate: 15,
      repeat: 0
    });
    this.anims.create({
      key: CST.ANIMATIONS.REDCOVID19_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.REDCOVID19, {
        start: 0,
        end: 4
      }),
      frameRate: 15,
      repeat: 0
    });
    this.anims.create({
      key: CST.ANIMATIONS.PLAYER_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.PLAYER),
      frameRate: 25,
      repeat: -1
    });
    this.anims.create({
      key: CST.ANIMATIONS.COVID19_EXPLOSION_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.COVID19_EXPLOSION),
      frameRate: 128,
      repeat: 0,
      hideOnComplete: true
    });
    this.anims.create({
      key: CST.ANIMATIONS.BEAM_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.BEAM),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: CST.ANIMATIONS.LIFEPOWERUP_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.POWERUPS, {
        start: 0,
        end: 0
      }),
      frameRate: 15,
      repeat: -1
    });
  }
}
