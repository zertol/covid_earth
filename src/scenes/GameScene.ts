import { CST } from '../CST';
import Virus from '../sprites/Virus';
import Beam from '../sprites/Beam';
import Explosion from '../sprites/Explosion';
import PowerUp from '../sprites/PowerUp';
import { Physics, GameObjects } from 'phaser';
//@ts-ignore
import Drag from 'phaser3-rex-plugins/plugins/drag.js'

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
  private levels: Array;
  //@ts-ignore
  private lastFired: number;
  //@ts-ignore
  private gameOver: boolean;
  //@ts-ignore
  private powerUps: Phaser.GameObjects.Group;
  //@ts-ignore
  private respawnMeter: integer;
  //@ts-ignore
  private livesLabel: Phaser.GameObjects.Text;
  //@ts-ignore
  private beamLevel: integer;
  //@ts-ignore
  private shakePositions: Object;
  //@ts-ignore
  private virusId: integer;

  constructor() {
    super({
      key: CST.SCENES.GAME,
    });
  }

  preload() {
    this.levelReach = 1;
    this.lastFired = 0;
    this.respawnMeter = 3;
    this.beamLevel = 1;
    this.gameOver = false;
    this.levelsData = this.cache.json.get('levelsData');
    //@ts-ignore
    this.levels = this.levelsData.levels.filter((x: any) => x.levelNumber == this.levelReach);
    this.virusId = 0;
    this.shakePositions = {};
  }

  create() {
    //Background Image
    this.background = this.add
      .tileSprite(
        0,
        0,
        this.game.renderer.width,
        this.game.renderer.height,
        CST.IMAGES.BACKGROUND,
      )
      .setOrigin(0, 0)
      .setDepth(0);

    //Earth Globe
    this.globe = this.physics.add
      .sprite(
        this.game.renderer.width / 2,
        this.game.renderer.height + 450,
        CST.SPRITES.GLOBE,
      )
      .setDepth(1)
      .setImmovable(true);

    //@ts-ignore
    this.globe.play(CST.ANIMATIONS.EARTH_ANIM);

    this.physics.world.setBoundsCollision();

    this.projectiles = this.add.group();
    this.powerUps = this.add.group();

    //Player ship
    this.player = this.physics.add
      .sprite(
        this.game.renderer.width / 2 - 8,
        this.game.renderer.height - 130,
        CST.SPRITES.PLAYER,
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
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    this.enemies = this.physics.add.group();

    //Load level 1 of the game ---- mode EASY ----
    this.loadEnemiesByLevel();
    this.adjustGlobeBarrier();

    //The single Sprite comes before a group so the order is single,group in the callback function
    //this.physics.add.overlap(this.enemies, this.globe, this.hitEarth, undefined, this);
    this.physics.add.collider(
      this.enemies,
      this.globe,
      this.hitEarth,
      undefined,
      this,
    );

    //Disable powerups when they hit earth
    this.physics.add.collider(
      this.powerUps,
      this.globe,
      (powerUp, globe) => {
        //@ts-ignore
        powerUp.disableBody(true, true);
      },
    );

    //Deny player to reach earth limits
    this.physics.add.collider(
      this.player,
      this.globe,
      this.returnToEarth,
      undefined,
      this,
    );

    //Enemy collision with Player
    this.physics.add.overlap(
      this.player,
      this.enemies,
      //@ts-ignore
      this.hurtPlayer,
      null,
      this,
    );

    //Powerups are physical objects that logically don't get destroyed upon beam collision
    // this.physics.add.collider(
    //   this.projectiles,
    //   this.powerUps,
    //   (projectile, powerUp) => {
    //     projectile.destroy();
    //   },
    // );

    //Get Powerup
    this.physics.add.overlap(
      this.player,
      this.powerUps,
      //@ts-ignore
      this.pickPowerUp,
      null,
      this,
    );

    //Beam collision with the enemy
    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      //@ts-ignore
      this.hitVirus,
      null,
      this,
    );

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    if (CST.WINDOW.ISMOBILE) {
      this.globe.y += 15;
    }

    //Score indicator
    this.score = 0;
    this.scoreLabel = this.make.text({
      x: 10,
      y: 5,
      origin: { x: 0, y: 0 },
      text: 'Score: ' + this.zeroPad(this.score, 6),
      padding: 0,
      style: {
        font: '16px monospace',
        fill: '#ffffff',
      },
    });

    //Level indicator

    this.levelLabel = this.make.text({
      x: 10,
      y: this.scoreLabel.height + 5,
      origin: { x: 0, y: 0 },
      text: 'Level: ' + this.levelReach,
      padding: 0,
      style: {
        font: '16px monospace',
        fill: '#ffffff',
      },
    });

    //Heart Icon - Lives Indicator
    let heartIcon = this.add.sprite(
      this.game.renderer.width - 20,
      25,
      CST.IMAGES.HEARTMETER,
    ).setDepth(2).setScale(.6);

    //Lives number indicator
    this.livesLabel = this.make.text({
      x: this.game.renderer.width - 25,
      y: 16,
      origin: { x: 0, y: 0 },
      text: this.respawnMeter,
      padding: 0,
      style: {
        font: '16px monospace',
        fill: '#ffffff',
      },
    }).setDepth(2);

    let drag = new Drag(this.player, {
      enable: true,
      axis: 0,      //0|'both'|'h&v'|1|'horizontal'|'h'|2|'vertical'|'v'
      rotation: Phaser.Math.DegToRad(45)  // axis rotation in rad
    });
    this.player.on('drag', (pointer, dragX, dragY) => {
      console.log(dragX);
      console.log(dragY);
    });
  }

  /******************************************* End Creation Part *************************************************/

  pickPowerUp = (
    player: Phaser.Physics.Arcade.Sprite,
    powerUp: Phaser.Physics.Arcade.Sprite,
  ): void => {

    if (player.alpha < 1) return;
    this.addPowerUpEffect(powerUp as PowerUp);
    powerUp.disableBody(true, true);
  };

  addPowerUpEffect = (powerUp: PowerUp): void => {
    switch (powerUp.getAnimation()) {
      case CST.ANIMATIONS.LIFEPOWERUP_ANIM:
        this.respawnMeter += 1;
        this.livesLabel.setText(String(this.respawnMeter));
        break;
      // case CST.ANIMATIONS.BEAM1POWERUP_ANIM:
      //   if (this.beamLevel > 2) {
      //     break;
      //   }
      //   this.beamLevel = 2;
      //   break;
      // case CST.ANIMATIONS.BEAM2POWERUP_ANIM:
      //   this.beamLevel = 3;
      //   break;
      default:
        this.beamLevel += 1
    }
  };

  returnToEarth = (player: any, globe: any) => { };

  hurtPlayer = (
    player: Phaser.Physics.Arcade.Sprite,
    enemy: Virus,
  ): void => {
    enemy.resetVirusPos();

    if (player.alpha < 1) {
      return;
    }
    if (this.respawnMeter <= 0) {
      return this.gameOverScene();
    }
    this.respawnMeter -= 1;
    this.livesLabel.setText(String(this.respawnMeter));

    let explosion = new Explosion(
      this,
      player.x,
      player.y,
      CST.SPRITES.COVID19_EXPLOSION,
      CST.ANIMATIONS.COVID19_EXPLOSION_ANIM,
    );

    player.disableBody(true, true);

    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false,
    });
  };

  zeroPad = (number: number, size: number) => {
    let stringNumber = String(number);
    while (stringNumber.length < (size || 2)) {
      stringNumber = '0' + stringNumber;
    }
    return stringNumber;
  };

  resetPlayer = () => {
    //@ts-ignore
    this.player.enableBody(
      true,
      //@ts-ignore
      this.player.initialX,
      this.game.renderer.height,
      true,
      true,
    );
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
      callbackScope: this,
    });
  };

  hitEarth = (globe: any, enemy: any): void => {
    globe.setAlpha(globe.alpha - 0.08);
    if (globe.alpha <= 0) {
      this.gameOverScene();
    }

    //@ts-ignore
    enemy.hitEarth(
      CST.SPRITES.COVID19_EXPLOSION,
      CST.ANIMATIONS.COVID19_EXPLOSION_ANIM,
    );
  };

  gameOverScene = (): void => {
    this.make.text({
      x: this.game.renderer.width / 2,
      y: this.game.renderer.height / 2,
      origin: { x: 0.5, y: 0.5 },
      text: 'GAME OVER',
      padding: 0,
      style: {
        font: '40px monospace',
        fill: '#ffffff',
      },
    }).setDepth(10);
    this.physics.pause();
    this.gameOver = true;
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.scene.start(CST.SCENES.MAIN);
      },
      callbackScope: this,
    });
  };

  adjustGlobeBarrier = () => {
    let widthToAjdust = this.game.renderer.width - this.globe.width;
    //@ts-ignore
    this.globe.body.offset.x = -widthToAjdust / 2;
    //@ts-ignore
    this.globe.body.width += widthToAjdust;
  };

  loadEnemiesByLevel = () => {
    if (this.levels.length > 0) {
      let level = this.levels[0];
      //@ts-ignore
      let virusDistribution = level.virusDistribution;
      let speedDistribution = level.speedDistribution;
      let powerUpDistribution = level.powerUpDistribution;
      let powerUpDelay = level.powerUpDelay;
      let lifeSpanDistribution = level.lifeSpanDistribution;

      for (let virusKey in level.virusDistribution) {
        let key = virusKey.toUpperCase();

        this.addVirusCollection(
          //@ts-ignore
          CST.ANIMATIONS[key + 'COVID19_ANIM'],
          //@ts-ignore
          CST.SPRITES[key + 'COVID19'],
          virusDistribution[virusKey],
          speedDistribution[virusKey],
          lifeSpanDistribution[virusKey]
        );
      }

      for (let powerUpKey in level.powerUpDistribution) {
        let key = powerUpKey.toUpperCase();

        this.addPowerUpCollection(
          //@ts-ignore
          CST.ANIMATIONS[key + 'POWERUP_ANIM'],
          powerUpDistribution[powerUpKey],
          powerUpDelay[powerUpKey],
          speedDistribution[powerUpKey],

        );
      }
    }
  };

  addVirusCollection = (
    animationKey: string,
    virusType: string,
    numberOfVirusToAdd: integer,
    speed: number,
    lifespan: integer
  ) => {
    for (let k = 0; k < numberOfVirusToAdd; k++) {
      let virusToAdd = new Virus(
        this,
        0,
        Math.floor(Math.random() * 20) + 1,
        virusType,
        animationKey,
        1,
        speed,
        this.virusId++,
        lifespan
      );
      //@ts-ignore
      virusToAdd.x = Math.floor(Math.random() * (this.game.renderer.width - virusToAdd.body.width - 21)) + virusToAdd.body.width;
      //@ts-ignore
      virusToAdd.body.setSize(75, 75, true);

      this.enemies.add(virusToAdd);
    }
  };

  addPowerUpCollection = (
    animationKey: string,
    numberOfPowerUpToAdd: integer,
    delayToDisplay: number,
    speed: number,
  ) => {
    let localScope = this;

    for (let k = 0; k < numberOfPowerUpToAdd; k++) {
      setTimeout(
        () => {
          let powerUpToAdd = new PowerUp(
            localScope,
            Math.floor(
              Math.random() * localScope.game.renderer.width,
            ) + 1,
            0,
            CST.SPRITES.POWERUPS,
            animationKey,
            1,
            speed,
          ).setImmovable(true);
          powerUpToAdd.body.setSize(73, 73, true);
          localScope.powerUps.add(powerUpToAdd);
        },
        //@ts-ignore
        delayToDisplay[k] * 2000,
      );
    }
  };

  shootBeam = (): number => {

    //@ts-ignore
    let beamsOffsets = this.levelsData.beamLevelOffsets["level" + String(this.beamLevel)];

    //@ts-ignore
    for (let index = 0; index < beamsOffsets.sets.length; index++) {

      let beam = new Beam(
        this,
        //@ts-ignore
        this.player.x + (beamsOffsets.sets[index]),
        this.player.y - 30,
        CST.SPRITES.BEAM,
        CST.ANIMATIONS.BEAM_ANIM,
        1,
        beamsOffsets.angles[index] * Math.PI / 180
      ).setScale(0.5);
      beam.rotation = beam.rotation + beamsOffsets.rotations[index];

      this.projectiles.add(beam);
    }
    return beamsOffsets.firingTime;
  };

  hitVirus = (projectile: Beam, virus: Virus): void => {
    //@ts-ignore

    if (!this.shakePositions["virus" + String(virus.getId())]) {
      //@ts-ignore
      let shake = this.plugins.get('rexShakePosition').add(virus, {
        mode: 0, // 0|'effect'|1|'behavior'
        duration: virus.getLifeSpan(),
        magnitude: 2,
        magnitudeMode: 0, // 0|'constant'|1|'decay'
      });
      //@ts-ignore
      this.shakePositions["virus" + String(virus.getId())] = 1;
      shake.shake();

      shake.on('complete', (shake: any, gameObject: GameObjects.GameObject) => {
        //@ts-ignore
        delete this.shakePositions["virus" + String(virus.getId())];

        let explosion = new Explosion(
          this,
          virus.x,
          virus.y,
          CST.SPRITES.COVID19_EXPLOSION,
          CST.ANIMATIONS.COVID19_EXPLOSION_ANIM,
        );

        virus.resetVirusPos();

        //Update score
        this.score += 10;
        this.scoreLabel.text = 'Score: ' + this.zeroPad(this.score, 6);

        //@ts-ignore
        if (this.score % this.levelsData.scoreLevelModulo == 0) {
          this.levelReach += 1;
          //@ts-ignore
          if (this.levelReach <= this.levelsData.levels.length) {
            //@ts-ignore
            this.levels = this.levelsData.levels.filter(
              (x: any) => x.levelNumber == this.levelReach,
            );
            this.levelLabel.text = 'Level: ' + this.levelReach;
            this.enemies.clear(true);
            this.loadEnemiesByLevel();
          }

          else {
            this.levelReach -= 1;
            //@ts-ignore
            this.levels = this.levelsData.levels.filter(
              (x: any) => x.levelNumber == this.levelReach,
            );
          }
        }
      });
    }
    //@ts-ignore

    projectile.destroy();


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
    if (this.gameOver) {
      return;
    }

    this.background.tilePositionY -= 1;
    this.globe.rotation += 0.009;

    let children = this.enemies.getChildren();

    for (let index = 0; index < children.length; index++) {
      const enemy = children[index];
      //@ts-ignore
      enemy.moveVirus(enemy.speed);
    }

    let powerUps = this.powerUps.getChildren();

    for (let index = 0; index < powerUps.length; index++) {
      const powerUp = powerUps[index];
      //@ts-ignore
      powerUp.movePowerUp();
    }

    this.movePlayerManager();

    //Continuous Spacebar Fire
    if (this.spacebar.isDown && time > this.lastFired) {
      if (this.player.active) {
        this.lastFired = time + this.shootBeam();
      }
    }
    children = this.projectiles.getChildren();

    for (let i = 0; i < children.length; i++) {
      let beam = children[i];
      beam.update();
    }
  }
}
