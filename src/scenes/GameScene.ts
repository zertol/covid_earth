import { CST } from "../CST";
import Virus from '../sprites/Virus';

export class GameScene extends Phaser.Scene {
  //@ts-ignore
  private background: Phaser.GameObjects.TileSprite;
  //@ts-ignore
  private globe: Phaser.GameObjects.Sprite;
  //@ts-ignore
  private bluevirus: Phaser.GameObjects.Sprite;
  //@ts-ignore
  private bluevirusR: Phaser.GameObjects.Sprite;
  //@ts-ignore
  private greenvirus: Phaser.GameObjects.Sprite;
  //@ts-ignore
  private greenvirusR: Phaser.GameObjects.Sprite;
  //@ts-ignore
  private redvirus: Phaser.GameObjects.Sprite;
  //@ts-ignore
  private enemies: Phaser.Physics.Arcade.Group;

  constructor() {
    super({
      key: CST.SCENES.GAME
    });
  }

  preload() { }

  create() {

    this.background = this.add.tileSprite(0, 0,
      this.game.renderer.width,
      this.game.renderer.height,
      CST.IMAGES.BACKGROUND
    )
      .setOrigin(0, 0)
      .setDepth(0);

    this.globe = this.physics.add
      .sprite(
        this.game.renderer.width / 2,
        this.game.renderer.height + 400,
        CST.SPRITES.GLOBE
      )
      .setDepth(1);

    //@ts-ignore
    this.globe.play("earth_anim");

    // let graphics = this.add.graphics();
    // let line = new Phaser.Geom.Line(0, this.globe.y - this.globe.height/2, this.game.renderer.width, this.globe.y - this.globe.height/2);

    // graphics.lineStyle(2, 0xffff, 0.5);

    // // graphics.beginPath();

    // // graphics.strokePath();

    // graphics.strokeLineShape(line);
    // this.physics.world.enable(graphics);
    // let graphPhysics = this.physics.add.group();
    // graphPhysics.add(graphics);

    this.enemies = this.physics.add.group();

    this.bluevirus = new Virus(this, Math.random() * this.game.renderer.width, 0, CST.SPRITES.BLUECOVID19, "bluevirus_anim", 1);
    this.bluevirusR = new Virus(this, Math.random() * this.game.renderer.width, 0, CST.SPRITES.BLUECOVID19, "bluevirus_anim", 1);
    this.greenvirus = new Virus(this, Math.random() * this.game.renderer.width, 0, CST.SPRITES.GREENCOVID19, "greenvirus_anim", 1);
    this.greenvirusR = new Virus(this, Math.random() * this.game.renderer.width, 0, CST.SPRITES.GREENCOVID19, "greenvirus_anim", 1);
    this.redvirus = new Virus(this, Math.random() * this.game.renderer.width, 0, CST.SPRITES.REDCOVID19, "redvirus_anim", 1);

    this.enemies.add(this.bluevirus);
    this.enemies.add(this.bluevirusR);
    this.enemies.add(this.greenvirus);
    this.enemies.add(this.greenvirusR);
    this.enemies.add(this.redvirus);

    //The single Sprite comes before a group so the order is single,group in the callback function
    this.physics.add.overlap(this.enemies, this.globe, this.hitEarth, undefined, this);

    if (CST.WINDOW.ISMOBILE) {
      this.globe.y += 55;
    }

  }

  hitEarth = (globe: any,enemy: any): void => {
    globe.setAlpha(globe.alpha - 0.0001);
    this.resetVirusPos(enemy);
  }

  moveVirus = (virus: Phaser.GameObjects.Sprite, speed: number): void => {
    virus.y += speed;
    if (virus.y > this.game.renderer.height) {
      this.resetVirusPos(virus);
    }
  }

  resetVirusPos = (virus: Phaser.GameObjects.Sprite) => {
    virus.y = 0;
    let randomX = Math.random() * this.game.renderer.width;
    virus.x = randomX;
  }

  update() {
    this.background.tilePositionY -= 1;
    this.globe.rotation += 0.009;
    this.moveVirus(this.bluevirus, 1.8);
    this.moveVirus(this.bluevirusR, 2.4);
    this.moveVirus(this.greenvirus, 3);
    this.moveVirus(this.greenvirusR, 4.6);
    this.moveVirus(this.redvirus, 5);
  }
}
