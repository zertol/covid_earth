import { CST } from "../CST";

export class GameScene extends Phaser.Scene {
  //@ts-ignore
  private background: Phaser.GameObjects.TileSprite;
  //@ts-ignore
  private globe: Phaser.GameObjects.Sprite;
  //@ts-ignore
  private bluevirus: Phaser.GameObjects.Sprite;
  //@ts-ignore
  private greenvirus: Phaser.GameObjects.Sprite;
  //@ts-ignore
  private redvirus: Phaser.GameObjects.Sprite;

  constructor() {
    super({
      key: CST.SCENES.GAME
    });
  }
  preload() {}
  create() {
    this.background = this.add
      .tileSprite(
        0,
        0,
        this.game.renderer.width,
        this.game.renderer.height,
        CST.IMAGES.BACKGROUND
      )
      .setOrigin(0, 0)
      .setDepth(0);
    this.globe = this.add
      .sprite(
        this.game.renderer.width / 2,
        this.game.renderer.height - 25,
        CST.SPRITES.GLOBE
      )
      .setDepth(1)
      .setScale(0.5, 0.5);
    //@ts-ignore
    this.globe.play("earth_anim");
    this.globe.setInteractive();
    this.bluevirus = this.add
      .sprite(this.game.renderer.width / 2 - 100, 25, CST.SPRITES.BLUECOVID19)
      .setDepth(2);
    this.greenvirus = this.add
      .sprite(this.game.renderer.width / 2, 25, CST.SPRITES.GREENCOVID19)
      .setDepth(3);
    this.redvirus = this.add
      .sprite(this.game.renderer.width / 2 + 100, 25, CST.SPRITES.REDCOVID19)
      .setDepth(4);
    this.bluevirus.play("bluevirus_anim");
    this.bluevirus.setInteractive();
    this.greenvirus.play("greenvirus_anim");
    this.greenvirus.setInteractive();
    this.redvirus.play("redvirus_anim");
    this.redvirus.setInteractive();
  }

  moveVirus = (virus: Phaser.GameObjects.Sprite, speed : number) =>{
    virus.y += speed;
    if (virus.y > this.game.renderer.height) {
      this.resetVirusPos(virus);
    }
  }

  resetVirusPos = (virus: Phaser.GameObjects.Sprite) => {
    virus.y = 0;
    var randomX = Phaser.Math.Between(0, this.game.renderer.width);
    virus.x = randomX;
  }

  update() {
    this.background.tilePositionY -= 2;
    this.globe.rotation += 0.009;
    this.moveVirus(this.bluevirus, 3);
    this.moveVirus(this.greenvirus, 3);
    this.moveVirus(this.redvirus, 3);
  }
}
