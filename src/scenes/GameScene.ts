import { CST } from "../CST";
import Virus from "../sprites/Virus";
import Beam from "../sprites/Beam";
import Explosion from "../sprites/Explosion";

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
  //@ts-ignore
  private projectiles: Phaser.Arcade.Group;
  //@ts-ignore
  private spacebar: Phaser.Input.Keyboard;
  //@ts-ignore
  private scoreLabel: Phaser.GameObjects.Text;
  //@ts-ignore
  private score: number;
  //@ts-ignore
  private levelLabel: Phaser.GameObjects.Text;
  //@ts-ignore
  private levelReach: number;
  //@ts-ignore
  private levelsData: object;
  //@ts-ignore
  private lastFired: number;

  constructor() {
    super({
      key: CST.SCENES.GAME,
    });
  }

  preload() {
    this.levelsData = this.cache.json.get("levelsData");
    this.lastFired = 0;
  }

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
        this.game.renderer.height + 450,
        CST.SPRITES.GLOBE
      )
      .setDepth(1)
      .setImmovable(true);

    //@ts-ignore
    this.globe.play(CST.ANIMATIONS.EARTH_ANIM);
    this.projectiles = this.add.group();

    this.player = this.physics.add
      .sprite(
        this.game.renderer.width / 2 - 8,
        this.game.renderer.height - 130,
        CST.SPRITES.PLAYER
      )
      .setScale(0.2, 0.2)
      .setDepth(1);

    //@ts-ignore
    this.player.initialX = this.player.x;
    //@ts-ignore
    this.player.initialY = this.player.y;
    this.player.play(CST.ANIMATIONS.PLAYER_ANIM);
    this.player.setCollideWorldBounds(true);
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.enemies = this.physics.add.group();

    //Load level 1 of the game ---- mode EASY ----
    this.loadEnemiesByLevel(1);
    this.adjustGlobeBarrier();

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
    this.physics.add.overlap(
      this.player,
      this.enemies,
      //@ts-ignore
      this.hurtPlayer,
      null,
      this
    );
    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      //@ts-ignore
      this.hitVirus,
      null,
      this
    );

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    if (CST.WINDOW.ISMOBILE) {
      this.globe.y += 60;
    }

    this.score = 0;
    this.scoreLabel = this.make.text({
      x: 10,
      y: 5,
      origin: { x: 0, y: 0 },
      text: "Score: " + this.zeroPad(this.score, 6),
      padding: 0,
      style: {
        font: "16px monospace",
        fill: "#ffffff"
      }
    });

    this.levelReach = 1;
    this.levelLabel = this.make.text({
      x: 10,
      y: this.scoreLabel.height + 5,
      origin: { x: 0, y: 0 },
      text: "Level: " + this.levelReach,
      padding: 0,
      style: {
        font: "16px monospace",
        fill: "#ffffff"
      }
    });

  }

  /******************************************* End Creation Part *************************************************/

  returnToEarth = (player: any, globe: any) => { };

  hurtPlayer = (player: Phaser.Physics.Arcade.Sprite, enemy: Virus): void => {

    enemy.resetVirusPos();

    if (player.alpha < 1) {
      return;
    }

    let explosion = new Explosion(
      this,
      player.x,
      player.y,
      CST.SPRITES.COVID19_EXPLOSION,
      CST.ANIMATIONS.COVID19_EXPLOSION_ANIM
    );

    player.disableBody(true, true);

    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });
  };

  zeroPad = (number: number, size: number) => {
    let stringNumber = String(number);
    while (stringNumber.length < (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }

  resetPlayer = () => {

    //@ts-ignore
    this.player.enableBody(true, this.player.initialX, this.game.renderer.height, true, true);
    this.player.alpha = 0.5;

    let tween = this.tweens.add({
      targets: this.player,
      //@ts-ignore
      y: this.player.initialY,
      duration: 1500,
      repeat: 0,
      onComplete: () => {
        //@ts-ignore
        this.player.alpha = 1;
      },
      callbackScope: this
    });
  };

  hitEarth = (globe: any, enemy: any): void => {
    globe.setAlpha(globe.alpha - 0.1);
    if (globe.alpha <= 0) {
      this.add.text(
        this.game.renderer.width / 2 - this.player.body.width / 2,
        this.game.renderer.height / 2,
        "You just lost :("
      );
      this.enemies.clear(true);
      return;
    }

    //@ts-ignore
    enemy.hitEarth(
      CST.SPRITES.COVID19_EXPLOSION,
      CST.ANIMATIONS.COVID19_EXPLOSION_ANIM
    );
  };

  adjustGlobeBarrier = () => {
    let widthToAjdust = this.game.renderer.width - this.globe.width;
    //@ts-ignore
    this.globe.body.offset.x = -widthToAjdust / 2;
    //@ts-ignore
    this.globe.body.width += widthToAjdust;
  };

  loadEnemiesByLevel = (levelNumber: number) => {
    //@ts-ignore
    let levels = this.levelsData.levels.filter((x) => x.levelNumber == levelNumber);

    if (levels.length > 0) {
      let level = levels[0];
      //@ts-ignore
      let virusDistribution = level.virusDistribution;
      let speedDistribution = level.speedDistribution;

      for (let virusKey in level.virusDistribution) {
        let key = virusKey.toUpperCase();

        this.addVirusCollection(
          //@ts-ignore
          CST.ANIMATIONS[key + "COVID19_ANIM"],
          //@ts-ignore
          CST.SPRITES[key + "COVID19"],
          virusDistribution[virusKey],
          speedDistribution[virusKey]
        );
      }
    }
  };

  addVirusCollection = (
    animationKey: string,
    virusType: string,
    numberOfVirusToAdd: integer,
    speed: number
  ) => {
    for (let k = 0; k < numberOfVirusToAdd; k++) {
      let virusToAdd = new Virus(
        this,
        Math.floor(Math.random() * this.game.renderer.width) + 10,
        //@ts-ignore
        Math.floor(Math.random() * 50) + 1,
        virusType,
        animationKey,
        1,
        speed
      );
      //@ts-ignore
      virusToAdd.body.setSize(75, 75, true);
      this.enemies.add(virusToAdd);
    }
  };

  shootBeam = (): void => {

    let beam1 = new Beam(
      this,
      this.player.x + 20,
      this.player.y - 30,
      CST.SPRITES.BEAM,
      CST.ANIMATIONS.BEAM_ANIM,
      1
    ).setScale(0.5);
    this.projectiles.add(beam1);

    let beam2 = new Beam(
      this,
      this.player.x - 20,
      this.player.y - 30,
      CST.SPRITES.BEAM,
      CST.ANIMATIONS.BEAM_ANIM,
      1
    ).setScale(0.5);
    this.projectiles.add(beam2);

  };

  hitVirus = (projectile: Beam, virus: Virus): void => {
    let explosion = new Explosion(
      this,
      virus.x,
      virus.y,
      CST.SPRITES.COVID19_EXPLOSION,
      CST.ANIMATIONS.COVID19_EXPLOSION_ANIM
    );
    projectile.destroy();
    virus.resetVirusPos();

    //Update score
    this.score += 10;
    this.scoreLabel.text = "Score: " + this.zeroPad(this.score, 6);

    //@ts-ignore
    if (this.score % this.levelsData.scoreLevelModulo == 0) {
      this.levelReach += 1;

      //@ts-ignore
      let levels = this.levelsData.levels.filter((x) => x.levelNumber == this.levelReach);
      if (levels.length > 0) {

        this.levelLabel.text = "Level: " + this.levelReach;
        this.enemies.clear(true);
        this.loadEnemiesByLevel(this.levelReach);
      }
    }

  };

  movePlayerManager = () => {

    //@ts-ignore
    let playerSpeed = this.levelsData.player.speed;

    //@ts-ignore
    if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(playerSpeed);
    }
    //@ts-ignore
    else if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }

    //@ts-ignore
    if (this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-playerSpeed);
    }
    //@ts-ignore
    else if (this.cursorKeys.down.isDown) {
      this.player.setVelocityY(playerSpeed);
    } else {
      this.player.setVelocityY(0);
    }
  };

  //Get Time for rapid fire
  update(time: number) {
    this.background.tilePositionY -= 1;
    this.globe.rotation += 0.009;

    let children =  this.enemies.getChildren();

    for (let index = 0; index < children.length; index++) {
      const enemy = children[index];
      //@ts-ignore
      enemy.moveVirus(enemy.speed);
    }

    this.movePlayerManager();

    //Continuous Spacebar Fire
    if (this.spacebar.isDown && time > this.lastFired) {
      if (this.player.active) {

        this.shootBeam();
        this.lastFired = time + 150;
      };
    }
    children = this.projectiles.getChildren();

    for (let i = 0; i < children.length; i++) {
      let beam = children[i];
      beam.update();
    }
  }
}
