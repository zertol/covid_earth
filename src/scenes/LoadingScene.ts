import { CST } from "../CST";
//@ts-ignore
import PLAYER from "../../sprites/spaceship.png";
//@ts-ignore
import DEV_LOGO from "../../images/elslogo.png";
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
import GAMEPLAY from "../scripts/gameplay.json";
//@ts-ignore
import EXPLOSION from "../../sprites/explosion.png";
//@ts-ignore
import BEAM from "../../images/needle.png";
//@ts-ignore
import POWERUPS from "../../sprites/powerupssprite.png";
//@ts-ignore
import HEARTMETER from "../../images/heart pixel art 64x64.png";
//@ts-ignore
import SHIELDS from "../../sprites/shieldsprite.png";
//@ts-ignore
import BACTERIA_BOMB from "../../sprites/bacteria_bomb.png";
//@ts-ignore
import BOLT from "../../sprites/bolt.png";
//@ts-ignore
import FX_BEAM from "../../sounds/fx_beam.mp3";
//@ts-ignore
import FX_EXPLOSION from "../../sounds/fx_explosion.mp3";
//@ts-ignore
import FX_BOMB_FALLING from "../../sounds/fx_bomb_falling.mp3";
//@ts-ignore
import GAME_SOUND from "../../sounds/game_sound.mp3";
//@ts-ignore
import INTRO_SOUND from "../../sounds/intro.m4a";
//@ts-ignore
import EXIT_BUTTON from "../../images/exit_button.png";
//@ts-ignore
import OK_BUTTON from "../../images/ok_button.png";
//@ts-ignore
import CANCEL_BUTTON from "../../images/cancel_button.png";


export class LoadingScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.LOAD
    });
  }

  preload() {

    this.facebook.once('startgame', () => {
      this.scene.start(CST.SCENES.OPENING);
    }, this);
    this.facebook.showLoadProgress(this);

    // let width = this.game.renderer.width;
    // let height = this.game.renderer.height;

    // let progressBar = this.add.graphics();
    // let progressBox = this.add.graphics();

    // progressBox.fillStyle(0x222222, 0.8);
    // progressBox.fillRect(width / 2 - 150, height / 2 - 25, 300, 50);

    this.load.json('levelsData', LEVELSJSON);
    this.load.json('gamePlayData', GAMEPLAY);
    this.load.audio(CST.SOUNDS.FX_BEAM, [FX_BEAM]);
    this.load.audio(CST.SOUNDS.FX_EXPLOSION, [FX_EXPLOSION]);
    this.load.audio(CST.SOUNDS.FX_BOMB_FALLING, [FX_BOMB_FALLING]);
    this.load.audio(CST.SOUNDS.GAME_SOUND, [GAME_SOUND]);
    this.load.audio(CST.SOUNDS.INTRO, [INTRO_SOUND]);

    // let loadingText = this.make.text({
    //   x: width / 2,
    //   y: height / 2 - 50,
    //   text: "Loading...",
    //   style: {
    //     font: "20px monospace",
    //     fill: "#ffffff"
    //   }
    // });
    // loadingText.setOrigin(0.5, 0.5);

    // let percentText = this.make.text({
    //   x: width / 2,
    //   y: height / 2,
    //   text: "0%",
    //   style: {
    //     font: "18px monospace",
    //     fill: "#ffffff"
    //   }
    // });
    // percentText.setOrigin(0.5, 0.5);

    // let assetText = this.make.text({
    //   x: width / 2,
    //   y: height / 2 + 50,
    //   text: "",
    //   style: {
    //     font: "18px monospace",
    //     fill: "#ffffff"
    //   }
    // });
    // assetText.setOrigin(0.5, 0.5);

    // this.load.on("progress", (value: number) => {
    //   //@ts-ignore
    //   percentText.setText(parseInt(value * 100) + "%");
    //   progressBar.clear();
    //   progressBar.fillStyle(0xffffff, 1);
    //   //@ts-ignore
    //   progressBar.fillRect(width / 2 - 140, height / 2 - 15, 280 * value, 30);
    // });
    // //@ts-ignore
    // let files = [];
    // this.load.on("fileprogress", (file: Phaser.GameObjects.Image) => {
    //   //@ts-ignore
    //   assetText.setText("Loading asset: " + file.key);
    //   files.push(file);
    // });

    // this.load.on("complete", () => {
    //   progressBar.destroy();
    //   progressBox.destroy();
    //   loadingText.destroy();
    //   percentText.destroy();
    //   assetText.destroy();

    //   for (let i = 0; i < 10; i++) {
    //     //@ts-ignore
    //     files[i].destroy();
    //   }

    //   setTimeout(() => {
    //     // this.scene.start(CST.SCENES.OPENING);
    //   }, 1000);
    // });

    this.load.image(CST.IMAGES.DEV_LOGO, DEV_LOGO);
    for (let i = 0; i < 50; i++) {
      this.load.image(CST.IMAGES.DEV_LOGO + i, DEV_LOGO);
    }

    this.load.image(CST.IMAGES.BACKGROUND, BACKGROUND);
    this.load.image(CST.IMAGES.HEARTMETER, HEARTMETER);
    this.load.image(CST.IMAGES.EXIT_BUTTON, EXIT_BUTTON);
    this.load.image(CST.IMAGES.OK_BUTTON, OK_BUTTON);
    this.load.image(CST.IMAGES.CANCEL_BUTTON, CANCEL_BUTTON);

    this.load.spritesheet(CST.SPRITES.BEAM, BEAM, {
      frameWidth: 26,
      frameHeight: 82
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
    this.load.spritesheet(CST.SPRITES.COVID19_EXPLOSION, EXPLOSION, {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet(CST.SPRITES.POWERUPS, POWERUPS, {
      frameWidth: 73,
      frameHeight: 73
    });
    this.load.spritesheet(CST.SPRITES.SHIELDS, SHIELDS, {
      frameWidth: 123,
      frameHeight: 152
    });
    this.load.spritesheet(CST.SPRITES.BACERIA_BOMB, BACTERIA_BOMB, {
      frameWidth: 64,
      frameHeight: 54
    });
    this.load.spritesheet(CST.SPRITES.BOLT, BOLT, {
      frameWidth: 400,
      frameHeight: 128
    });
    this.load.spritesheet(CST.SPRITES.BLUECOVID19_GAMEPLAY, BLUECOVID19, {
      frameWidth: 266,
      frameHeight: 266
    });
    this.load.spritesheet(CST.SPRITES.GREENCOVID19_GAMEPLAY, GREENCOVID19, {
      frameWidth: 266,
      frameHeight: 266
    });
    this.load.spritesheet(CST.SPRITES.REDCOVID19_GAMEPLAY, REDCOVID19, {
      frameWidth: 266,
      frameHeight: 266
    });
    // setTimeout(() => {
    //   this.scene.start(CST.SCENES.OPENING);  
    // }, 4000);

  }

  create() {
    let logo = this.add.image(
      this.game.renderer.width / 2,
      this.game.renderer.height / 2,
      CST.IMAGES.DEV_LOGO
    );
    if (CST.WINDOW.ISMOBILE) {
      logo.setScale(.7);
    }
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
      frames: this.anims.generateFrameNumbers(CST.SPRITES.BEAM, {
        start: 0,
        end: 0
      }),
      frameRate: 20,
      repeat: 0
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
    this.anims.create({
      key: CST.ANIMATIONS.BEAMPOWERUP_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.POWERUPS, {
        start: 1,
        end: 1
      }),
      frameRate: 15,
      repeat: -1
    });
    this.anims.create({
      key: CST.ANIMATIONS.SHIELDPOWERUP_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.POWERUPS, {
        start: 2,
        end: 2
      }),
      frameRate: 15,
      repeat: -1
    });
    this.anims.create({
      key: CST.ANIMATIONS.SCOREPOWERUP_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.POWERUPS, {
        start: 3,
        end: 3
      }),
      frameRate: 15,
      repeat: -1
    });
    this.anims.create({
      key: CST.ANIMATIONS.FINISHLVLPOWERUP_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.POWERUPS, {
        start: 4,
        end: 4
      }),
      frameRate: 15,
      repeat: -1
    });
    this.anims.create({
      key: CST.ANIMATIONS.GALACTICLASERPOWERUP_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.POWERUPS, {
        start: 9,
        end: 9
      }),
      frameRate: 15,
      repeat: -1
    });
    this.anims.create({
      key: CST.ANIMATIONS.SHIELD_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.SHIELDS, {
        start: 2,
        end: 2
      }),
      frameRate: 15,
      repeat: -1
    });
    this.anims.create({
      key: CST.ANIMATIONS.BACTERIA_BOMB_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.BACERIA_BOMB, {
        start: 0,
        end: 59
      }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: CST.ANIMATIONS.BOLT_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.BOLT),
      frameRate: 50,
      repeat: -1
    });
    this.anims.create({
      key: CST.ANIMATIONS.BLUECOVID19_GAMEPLAY_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.BLUECOVID19_GAMEPLAY, {
        start: 0,
        end: 2
      }),
      frameRate: 15,
      repeat: 0
    });
    this.anims.create({
      key: CST.ANIMATIONS.GREENCOVID19_GAMEPLAY_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.GREENCOVID19_GAMEPLAY, {
        start: 0,
        end: 3
      }),
      frameRate: 15,
      repeat: 0
    });
    this.anims.create({
      key: CST.ANIMATIONS.REDCOVID19_GAMEPLAY_ANIM,
      //@ts-ignore
      frames: this.anims.generateFrameNumbers(CST.SPRITES.REDCOVID19_GAMEPLAY, {
        start: 0,
        end: 4
      }),
      frameRate: 15,
      repeat: 0
    });
  }
}
