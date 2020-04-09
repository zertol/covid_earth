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
  private player: Phaser.Physics.Arcade.Sprite;
  //@ts-ignore
  private exhaust: Phaser.GameObjects.Sprite;
  //@ts-ignore
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({
      key: CST.SCENES.GAME,
    });
  }

  preload() { }

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
        this.game.renderer.height + 410,
        CST.SPRITES.GLOBE
      )
      .setDepth(1).setImmovable(true);

    //@ts-ignore
    this.globe.play(CST.ANIMATIONS.EARTH_ANIM);

    this.player = this.physics.add.sprite(
      this.game.renderer.width / 2 - 8,
      this.game.renderer.height - 130,
      CST.SPRITES.PLAYER
    ).setScale(0.2, 0.2).setDepth(1);

    this.player.play(CST.ANIMATIONS.PLAYER_ANIM);
    this.player.setCollideWorldBounds(true);

    this.enemies = this.physics.add.group();

    //Load level 1 of the game ---- mode EASY ----
    this.loadEnemiesByLevel(1);
    this.adjustGlobeBarrier();
    this.adjustEnemyCollisionBox();

    //The single Sprite comes before a group so the order is single,group in the callback function
    //this.physics.add.overlap(this.enemies, this.globe, this.hitEarth, undefined, this);
    this.physics.add.collider(
      this.enemies,
      this.globe,
      this.hitEarth,
      undefined,
      this
    );

    this.physics.add.collider(
      this.player,
      this.globe,
      this.returnToEarth,
      undefined,
      this
    );

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    if (CST.WINDOW.ISMOBILE) {
      this.globe.y += 60;
    }
  }

  returnToEarth = (player: any, globe: any) => {
  }

  hitEarth = (globe: any, enemy: any): void => {
    globe.setAlpha(globe.alpha - 0.1);
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

    //@ts-ignore
    enemy.hitEarth(CST.SPRITES.COVID19_EXPLOSION, CST.ANIMATIONS.COVID19_EXPLOSION_ANIM);
  };



  adjustGlobeBarrier = () => {
    let widthToAjdust = this.game.renderer.width - this.globe.width;
    //@ts-ignore
    this.globe.body.offset.x = -widthToAjdust / 2;
    //@ts-ignore
    this.globe.body.width += widthToAjdust;
  };

  adjustEnemyCollisionBox = () => {
    var viruses = this.enemies.getChildren();
    for (let i = 0; i < viruses.length; i++) {
      let virus = viruses[i];
      //@ts-ignore
      virus.body.height -= virus.body.height / 3;
    }
  };

  loadEnemiesByLevel = (levelNumber: number) => {
    let data = this.cache.json.get("levelsData");
    //@ts-ignore
    let level = data.levels.filter((x) => x.levelNumber == levelNumber)[0];

    if (level) {
      //@ts-ignore
      var virusDistribution = level.virusDistribution;
      for (let virusKey in level.virusDistribution) {

        let key = virusKey.toUpperCase();

        //@ts-ignore
        this.addVirusCollection(CST.ANIMATIONS[key + "COVID19_ANIM"], CST.SPRITES[key + "COVID19"], virusDistribution[virusKey]);

      }
    }

  };

  addVirusCollection = (
    animationKey: string,
    virusType: string,
    numberOfVirusToAdd: integer
  ) => {
    for (let k = 0; k < numberOfVirusToAdd; k++) {
      let virusToAdd = new Virus(
        this,
        (Math.floor(Math.random() * this.game.renderer.width) + 10),
        //@ts-ignore
        (Math.floor(Math.random() * 50) + 1),
        virusType,
        animationKey,
        1
      );
      this.enemies.add(virusToAdd);
    }
  };

  movePlayerManager = () => {
    let data = this.cache.json.get("levelsData");

    let playerSpeed = data.player.speed;

    //@ts-ignore
    if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(playerSpeed);
    }
    //@ts-ignore
    else if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-playerSpeed);
    }
    else {
      this.player.setVelocityX(0);
    }

    //@ts-ignore
    if (this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-playerSpeed);
    }
    //@ts-ignore
    else if (this.cursorKeys.down.isDown) {
      this.player.setVelocityY(playerSpeed);
    }
    else {
      this.player.setVelocityY(0);
    }
  }

  update() {
    this.background.tilePositionY -= 1;
    this.globe.rotation += 0.009;
    this.enemies.getChildren().forEach((enemy) => {
      //@ts-ignore
      enemy.moveVirus(Math.floor(Math.random() * 4) + 1);
    });
    this.movePlayerManager();
  }
}
