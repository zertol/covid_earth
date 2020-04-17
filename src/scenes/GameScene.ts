import { CST } from "../CST";
import Virus from "../sprites/Virus";
import Beam from "../sprites/Beam";
import Explosion from "../sprites/Explosion";
import PowerUp from "../sprites/PowerUp";
import Shield from "../sprites/Shield";
import { Physics, GameObjects } from "phaser";

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
  private shield: Phaser.Physics.Arcade.Sprite;
  //@ts-ignore
  private playerContainer: Phaser.Physics.Arcade.Group;
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
  //@ts-ignore
  private shieldLevel: integer;

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
    this.shieldLevel = 0;
    this.gameOver = false;
    this.levelsData = this.cache.json.get("levelsData");
    //@ts-ignore
    this.levels = this.levelsData.levels.filter((x: any) => x.levelNumber == this.levelReach);
    this.virusId = 0;
    this.shakePositions = {};
  }

  create() {
    //Background Image
    this.background = this.add.tileSprite(0, 0, this.game.renderer.width, this.game.renderer.height, CST.IMAGES.BACKGROUND).setOrigin(0, 0).setDepth(0);

    //Earth Globe
    this.globe = this.physics.add
      .sprite(this.game.renderer.width / 2, this.game.renderer.height + 450, CST.SPRITES.GLOBE)
      .setDepth(1)
      .setImmovable(true);

    //@ts-ignore
    this.globe.play(CST.ANIMATIONS.EARTH_ANIM);

    this.physics.world.setBoundsCollision();

    this.projectiles = this.add.group();
    this.powerUps = this.add.group();

    //Player ship
    this.player = this.physics.add
      .sprite(this.game.renderer.width / 2 - 8, this.game.renderer.height - 130, CST.SPRITES.PLAYER)
      .setScale(0.2, 0.2)
      .setDepth(1);

    this.playerContainer = this.physics.add.group();
    this.playerContainer.setOrigin(this.player.x, this.player.y);
    this.playerContainer.add(this.player);
    //@ts-ignore
    this.player.initialX = this.player.x;
    //@ts-ignore
    this.player.initialY = this.player.y;

    this.player.play(CST.ANIMATIONS.PLAYER_ANIM);
    this.player.setCollideWorldBounds(true);
    this.player.setInteractive();

    //Add dragging to allow touch events and mobile finger movements
    this.input.setDraggable(this.player);
    this.input.dragTimeThreshold = 50;
    this.input.on('dragend', () => {
      //@ts-ignore
      this.input.removeAllListeners('drag');
    });

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.on('pointerout', () => {
      //@ts-ignore
      this.input.removeAllListeners('pointerdown');
    });

    this.enemies = this.physics.add.group();

    //Load level 1 of the game ---- mode EASY ----
    this.loadEnemiesByLevel();
    this.adjustGlobeBarrier();

    //The single Sprite comes before a group so the order is single,group in the callback function
    //this.physics.add.overlap(this.enemies, this.globe, this.hitEarth, undefined, this);
    this.physics.add.collider(this.enemies, this.globe, this.hitEarth, undefined, this);

    //Disable powerups when they hit earth
    this.physics.add.collider(this.powerUps, this.globe, (powerUp, globe) => {
      //@ts-ignore
      powerUp.disableBody(true, true);
    });

    //Deny player to reach earth limits
    this.physics.add.collider(this.player, this.globe, this.returnToEarth, undefined, this);

    //Enemy collision with Player
    this.physics.add.overlap(
      this.playerContainer,
      this.enemies,
      //@ts-ignore
      this.hurtPlayer,
      null,
      this
    );

    //Powerups are physical objects that logically don't get destroyed upon beam collision\
    //Here the projectile get destroyed not the powerup!!!!!!!
    this.physics.add.collider(this.projectiles, this.powerUps, (projectile, powerUp) => {
      projectile.destroy();
    });

    //Get Powerup
    this.physics.add.overlap(
      this.player,
      this.powerUps,
      //@ts-ignore
      this.pickPowerUp,
      null,
      this
    );

    //Beam collision with the enemy
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
      this.globe.y += 15;
    }

    //Score indicator
    this.score = 0;
    this.scoreLabel = this.make.text({
      x: 10,
      y: 5,
      origin: { x: 0, y: 0 },
      text: "Score: " + this.zeroPad(this.score, 6),
      padding: 0,
      style: {
        font: "16px monospace",
        fill: "#ffffff",
      },
    });

    //Level indicator
    this.levelLabel = this.make.text({
      x: 10,
      y: this.scoreLabel.height + 5,
      origin: { x: 0, y: 0 },
      text: "Level: " + this.levelReach,
      padding: 0,
      style: {
        font: "16px monospace",
        fill: "#ffffff",
      },
    });

    //Heart Icon - Lives Indicator
    let heartIcon = this.add
      .sprite(this.game.renderer.width - 20, 25, CST.IMAGES.HEARTMETER)
      .setDepth(2)
      .setScale(0.6);

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

  }

  /******************************************* End Creation Part *************************************************/

  pickPowerUp = (player: Phaser.Physics.Arcade.Sprite, powerUp: Phaser.Physics.Arcade.Sprite): void => {
    if (player.alpha < 1) return;
    this.addPowerUpEffect(powerUp as PowerUp);
    powerUp.disableBody(true, true);
    powerUp.destroy();
  };

  addPowerUpEffect = (powerUp: PowerUp): void => {
    switch (powerUp.getAnimation()) {
      case CST.ANIMATIONS.LIFEPOWERUP_ANIM:
        this.respawnMeter += 1;
        this.livesLabel.setText(String(this.respawnMeter));
        break;
      case CST.ANIMATIONS.BEAMPOWERUP_ANIM:
        if (this.beamLevel <= 3)
          // here to only augment till level 4 beam no need to add more
          this.beamLevel += 1;
        break;
      case CST.ANIMATIONS.SHIELDPOWERUP_ANIM:
        if (this.shieldLevel <= 1)
          // here to only augment till level 2 shield no need to add more
          this.shieldLevel += 1;
        this.shield = new Shield(this, this.player.x, this.player.y, CST.SPRITES.SHIELDS, CST.ANIMATIONS.SHIELD_ANIM, this.playerContainer).setDepth(1);
        this.shield.setCollideWorldBounds(true);
        break;
    }
  };

  returnToEarth = (player: any, globe: any) => { };

  hurtPlayer = (hitObject: Phaser.Physics.Arcade.Sprite, enemy: Virus): void => {
    enemy.resetVirusPos();

    if (this.player.alpha < 1) {
      return;
    }
    if (this.respawnMeter <= 0) {
      return this.gameOverScene();
    }

    if (this.playerContainer.getChildren().length > 1) {
      //@ts-ignore
      let shieldHit = this.levelsData.shieldDamageHit["level" + String(this.shieldLevel)];
      return (this.shield as Shield).decreaseShieldAlpha(shieldHit);
    }
    this.respawnMeter -= 1;
    this.livesLabel.setText(String(this.respawnMeter));

    let explosion = new Explosion(this, this.player.x, this.player.y, CST.SPRITES.COVID19_EXPLOSION, CST.ANIMATIONS.COVID19_EXPLOSION_ANIM);

    this.player.disableBody(true, true);

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
      stringNumber = "0" + stringNumber;
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
      true
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
    enemy.hitEarth(CST.SPRITES.COVID19_EXPLOSION, CST.ANIMATIONS.COVID19_EXPLOSION_ANIM);
  };

  gameOverScene = (): void => {
    this.make
      .text({
        x: this.game.renderer.width / 2,
        y: this.game.renderer.height / 2,
        origin: { x: 0.5, y: 0.5 },
        text: "GAME OVER",
        padding: 0,
        style: {
          font: "40px monospace",
          fill: "#ffffff",
        },
      })
      .setDepth(10);
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
          CST.ANIMATIONS[key + "COVID19_ANIM"],
          //@ts-ignore
          CST.SPRITES[key + "COVID19"],
          virusDistribution[virusKey],
          speedDistribution[virusKey],
          lifeSpanDistribution[virusKey]
        );
      }

      for (let powerUpKey in level.powerUpDistribution) {
        let key = powerUpKey.toUpperCase();

        this.addPowerUpCollection(
          //@ts-ignore
          CST.ANIMATIONS[key + "POWERUP_ANIM"],
          powerUpDistribution[powerUpKey],
          powerUpDelay[powerUpKey],
          speedDistribution[powerUpKey]
        );
      }
    }
  };

  addVirusCollection = (animationKey: string, virusType: string, numberOfVirusToAdd: integer, speed: number, lifespan: integer) => {
    for (let k = 0; k < numberOfVirusToAdd; k++) {
      let virusToAdd = new Virus(this, 0, Math.floor(Math.random() * 20) + 1, virusType, animationKey, 1, speed, this.virusId++, lifespan);
      //@ts-ignore
      virusToAdd.x = Math.floor(Math.random() * (this.game.renderer.width - virusToAdd.body.width - 21)) + virusToAdd.body.width;
      //@ts-ignore
      virusToAdd.body.setSize(75, 75, true);
      if (CST.WINDOW.ISMOBILE) {
        virusToAdd.setScale(.7);
      }
      this.enemies.add(virusToAdd);
    }
  };

  addPowerUpCollection = (animationKey: string, numberOfPowerUpToAdd: integer, delayToDisplay: number, speed: number) => {
    let localScope = this;

    for (let k = 0; k < numberOfPowerUpToAdd; k++) {
      setTimeout(
        () => {
          let powerUpToAdd = new PowerUp(
            localScope,
            Math.floor(Math.random() * localScope.game.renderer.width) + 1,
            0,
            CST.SPRITES.POWERUPS,
            animationKey,
            1,
            speed
          ).setImmovable(true);
          powerUpToAdd.body.setSize(73, 73, true);
          localScope.powerUps.add(powerUpToAdd);
        },
        //@ts-ignore
        delayToDisplay[k] * 2000
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
        this.player.x + beamsOffsets.sets[index],
        this.player.y - 30,
        CST.SPRITES.BEAM,
        CST.ANIMATIONS.BEAM_ANIM,
        1,
        (beamsOffsets.angles[index] * Math.PI) / 180
      );
      if (this.beamLevel > 2) {
        beam.rotation = beam.rotation + beamsOffsets.rotations[index];
      }
      if (CST.WINDOW.ISMOBILE) {
        beam.setScale(.4);
      }
      else{
        beam.setScale(0.5);
      }
      this.projectiles.add(beam);
    }
    return beamsOffsets.firingTime;
  };

  hitVirus = (projectile: Beam, virus: Virus): void => {
    //@ts-ignore

    if (!this.shakePositions["virus" + String(virus.getId())]) {
      //@ts-ignore
      let shake = this.plugins.get("rexShakePosition").add(virus, {
        mode: 0, // 0|'effect'|1|'behavior'
        duration: virus.getLifeSpan(),
        magnitude: 2,
        magnitudeMode: 0, // 0|'constant'|1|'decay'
      });
      //@ts-ignore
      this.shakePositions["virus" + String(virus.getId())] = 1;
      shake.shake();

      shake.on("complete", (shake: any, gameObject: GameObjects.GameObject) => {
        //@ts-ignore
        delete this.shakePositions["virus" + String(virus.getId())];

        let explosion = new Explosion(this, virus.x, virus.y, CST.SPRITES.COVID19_EXPLOSION, CST.ANIMATIONS.COVID19_EXPLOSION_ANIM);

        virus.resetVirusPos();

        //Update score
        this.score += 15;
        this.scoreLabel.text = "Score: " + this.zeroPad(this.score, 6);

        //@ts-ignore
        if (this.score % this.levelsData.scoreLevelModulo == 0) {
          this.levelReach += 1;
          //@ts-ignore
          if (this.levelReach <= this.levelsData.levels.length) {
            //@ts-ignore
            this.levels = this.levelsData.levels.filter((x: any) => x.levelNumber == this.levelReach);
            this.levelLabel.text = "Level: " + this.levelReach;
            this.enemies.clear(true);
            this.loadEnemiesByLevel();
          } else {
            this.levelReach -= 1;
            //@ts-ignore
            this.levels = this.levelsData.levels.filter((x: any) => x.levelNumber == this.levelReach);
          }
        }
      });
    }
    //@ts-ignore
    projectile.destroy();
    this.projectiles.remove(projectile, true);
  };

  movePlayerManager = () => {
    //@ts-ignore
    let playerSpeed = this.levelsData.player.speed;

    //@ts-ignore
    if (this.cursorKeys.right.isDown) {
      this.playerContainer.setVelocityX(playerSpeed);
    }
    //@ts-ignore
    else if (this.cursorKeys.left.isDown) {
      this.playerContainer.setVelocityX(-playerSpeed);
    } else {
      this.playerContainer.setVelocityX(0);
    }

    //@ts-ignore
    if (this.cursorKeys.up.isDown) {
      this.playerContainer.setVelocityY(-playerSpeed);
    }
    //@ts-ignore
    else if (this.cursorKeys.down.isDown) {
      this.playerContainer.setVelocityY(playerSpeed);
    } else {
      this.playerContainer.setVelocityY(0);
    }
  };

  //Get Time for rapid fire
  update(time: number) {
    //@ts-ignore
    console.log(this.game.renderer.drawCount);
    if (this.gameOver) {
      return;
    }

    this.background.tilePositionY -= 1;
    this.globe.rotation += 0.009;

    let childrenEnemies = this.enemies.getChildren();


    for (let index = 0; index < childrenEnemies.length; index++) {
      const enemy = childrenEnemies[index];
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
        if (time > this.lastFired) {
          this.lastFired = time + this.shootBeam();
        }
      }
    }

    //Dragging with Pointer to allow shooting while moving
    if (this.player.active) {
      let playerContainerChildren = this.playerContainer.getChildren();
      this.input.on('drag', (pointer: any, gameObject: any, dragX: number, dragY: number) => {
        for (let index = 0; index < playerContainerChildren.length; index++) {
          const child = playerContainerChildren[index];
          (child as GameObjects.Sprite).x = dragX;
          (child as GameObjects.Sprite).y = dragY
        }
      });

      let pointer = this.input.activePointer;
      if (pointer && pointer.isDown) {
        if (time > this.lastFired) {
          this.lastFired = time + this.shootBeam();
        }
      }
    }

    let childrenBeams = this.projectiles.getChildren();
    childrenBeams.map((child: GameObjects.GameObject) => {
      let beam = (child as Beam);
      beam.update();
    });
  }
}
