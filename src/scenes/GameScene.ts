import { CST } from "../CST";
import Virus from "../sprites/Virus";

export class GameScene extends Phaser.Scene {
  //@ts-ignore
  private background: Phaser.GameObjects.TileSprite;
  //@ts-ignore
  private globe: Phaser.GameObjects.Sprite;
  //@ts-ignore
  private enemies: Phaser.Physics.Arcade.Group;
  //@ts-ignore
  private player: Phaser.Physics.Arcade.Image;

  constructor() {
    super({
      key: CST.SCENES.GAME,
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

    this.player = this.physics.add.image(
      this.game.renderer.width / 2 - 8,
      this.game.renderer.height - 130,
      CST.IMAGES.PLAYER
    ).setScale(0.1,0.1)
    .setDepth(2);

    this.enemies = this.physics.add.group();
    this.LoadingEnemiesByLevel(1);
    this.adjustingEnemyCollisionBox();
    this.adjustingGlobeBarrier();
    //The single Sprite comes before a group so the order is single,group in the callback function
    //this.physics.add.overlap(this.enemies, this.globe, this.hitEarth, undefined, this);
    this.physics.add.collider(
      this.enemies,
      this.globe,
      this.hitEarth,
      undefined,
      this
    );

    if (CST.WINDOW.ISMOBILE) {
      this.globe.y += 55;
    }
  }

  hitEarth = (globe: any, enemy: any): void => {
    globe.setAlpha(globe.alpha - 0.0001);
    if (globe.alpha == 0) {
      this.add.text(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2,
        "you just lost"
      );
      this.enemies.clear(true);
      this.enemies.destroy();
      return;
    }
    this.resetVirusPos(enemy);
  };

  moveVirus = (virus: Phaser.GameObjects.Sprite, speed: number): void => {
    virus.y += speed;
    if (virus.y > this.game.renderer.height) {
      this.resetVirusPos(virus);
    }
  };

  resetVirusPos = (virus: Phaser.GameObjects.Sprite) => {
    virus.y = 0;
    let randomX = Math.random() * this.game.renderer.width;
    virus.x = randomX;
  };

  adjustingGlobeBarrier = () => {
    let widthToAjdust = this.game.renderer.width - this.globe.width;
    //@ts-ignore
    this.globe.body.offset.x = -widthToAjdust / 2;
    //@ts-ignore
    this.globe.body.width += widthToAjdust;
  };

  adjustingEnemyCollisionBox = () => {
    var viruses = this.enemies.getChildren();
    for (let i = 0; i < viruses.length; i++) {
      let virus = viruses[i];
      //@ts-ignore
      virus.body.height -= virus.body.height / 3;
    }
  };

  LoadingEnemiesByLevel = (level: number) => {
    let data = this.cache.json.get("levelData");
    var levelsData = data.levels;
    //@ts-ignore
    var levelToLooad = data.levels.filter((x) => x.levelNumber == level)[0];
    //@ts-ignore
    var virusDistribution = levelToLooad.virusDistribution;
    for (var virusKey in virusDistribution) {
      console.log(virusKey);
      switch (virusKey) {
        case "redVirus":
          this.addVirusByType(
            "redvirus_anim",
            CST.SPRITES.REDCOVID19,
            virusDistribution[virusKey]
          );
          break;
        case "greenVirus":
          this.addVirusByType(
            "greenvirus_anim",
            CST.SPRITES.GREENCOVID19,
            virusDistribution[virusKey]
          );
          break;
        case "blueVirus":
          this.addVirusByType(
            "bluevirus_anim",
            CST.SPRITES.BLUECOVID19,
            virusDistribution[virusKey]
          );
          break;
      }
    }
  };

  addVirusByType = (
    animationKey: string,
    virusType: string,
    numberOfVirusToAdd: integer
  ) => {
    for (let k = 0; k < numberOfVirusToAdd; k++) {
      let virusToAdd = new Virus(
        this,
        (Math.floor(Math.random() * 2) + 1) * this.game.renderer.width,
        0,
        virusType,
        animationKey,
        1
      );
      this.enemies.add(virusToAdd);
    }
  };

  update() {
    this.background.tilePositionY -= 1;
    this.globe.rotation += 0.009;
    this.enemies.getChildren().forEach((element) => {
      //@ts-ignore
      this.moveVirus(element, Math.floor(Math.random() * 4) + 1);
    });
  }
}
