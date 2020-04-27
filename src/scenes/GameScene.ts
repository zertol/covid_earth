import { CST } from "../CST";
import Virus from "../sprites/Virus";
import Beam from "../sprites/Beam";
import Explosion from "../sprites/Explosion";
import PowerUp from "../sprites/PowerUp";
import Shield from "../sprites/Shield";
import Bomb from "../sprites/Bomb";
import ConfirmationBox from "../utils/ConfirmationBox";
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
  private explosions: Phaser.Physics.Arcade.Group;
  //@ts-ignore
  private bombs: Phaser.Physics.Arcade.Group;
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
  private lastBombFired: number;
  //@ts-ignore
  private lastPowerUpDeployed: Object;
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
  private beamTotals: Object;
  //@ts-ignore
  private virusId: integer;
  //@ts-ignore
  private shieldLevel: integer;
  //@ts-ignore
  private scoreMultiplication: integer;
  //@ts-ignore
  private fxBeams: any[];
  //@ts-ignore
  private fxExplosions: any[];
  //@ts-ignore
  private fxBombs: any[];
  //@ts-ignore
  private bolt: Phaser.Physics.Arcade.Sprite;
  //@ts-ignore
  private playerGainLossTween: Phaser.Tweens.Tween;

  constructor() {
    super({
      key: CST.SCENES.GAME,
    });
  }

  preload() {
    this.levelReach = 1;
    this.lastFired = 0;
    this.lastBombFired = 0;
    this.respawnMeter = 3;
    this.beamLevel = 1;
    this.scoreMultiplication = 1;
    this.shieldLevel = 0;
    this.gameOver = false;
    this.levelsData = this.cache.json.get("levelsData");
    //@ts-ignore
    this.levels = this.levelsData.levels.filter((x: any) => x.levelNumber == this.levelReach);
    this.virusId = 0;
    this.shakePositions = {};
    this.beamTotals = {};
    this.lastPowerUpDeployed = {};
    this.fxBombs = [];
    this.fxBeams = [];
    this.fxExplosions = [];
  }

  create() {
    this.sound.pauseOnBlur = true;

    //Game Sound
    let gameSound: Phaser.Sound.BaseSound = this.sound.add(CST.SOUNDS.GAME_SOUND)
    gameSound.addMarker({
      name: CST.SOUNDS.MARKERS.GAME_SOUND,
      start: 25,
      config: {
        volume: .3,
        loop: true
      }
    });
    gameSound.play(CST.SOUNDS.MARKERS.GAME_SOUND);

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
    this.bombs = this.physics.add.group();
    this.explosions = this.physics.add.group();

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
    this.physics.add.collider(this.enemies, this.globe, this.hitEarth, undefined, this);

    //Destroy powerups when they hit earth
    this.physics.add.collider(this.powerUps, this.globe, (powerUp, globe) => {
      //@ts-ignore
      (powerUp as PowerUp).destroy();
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
      this.projectiles.remove(projectile);
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

    //Beam collision with the enemy
    this.physics.add.overlap(
      this.projectiles,
      this.bombs,
      //@ts-ignore
      this.hitBomb,
      null,
      this
    );

    //Add collider earth with bombs
    //@ts-ignore
    this.physics.add.overlap(this.bombs, this.globe, this.bombHitEarth, null, this);

    //Add collider player with bombs
    //@ts-ignore
    this.physics.add.overlap(this.playerContainer, this.bombs, this.bombHitPlayer, null, this);

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
    }).setDepth(2);
    this.scoreLabel.setStroke('#fff', .5);
    this.scoreLabel.setShadow(0, 1, '#202020', 1, true, true);

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
    }).setDepth(2);;
    this.levelLabel.setStroke('#fff', .5);
    this.levelLabel.setShadow(0, 1, '#202020', 1, true, true);

    //Exit Button
    let exitBtn = this.add.image(10, this.levelLabel.height + 30, CST.IMAGES.EXIT_BUTTON).setScale(.7).setOrigin(0, 0).setDepth(2);;
    exitBtn.setInteractive({
      useHandCursor: true
    });

    exitBtn.on("pointerdown", () => {
      // this.scene.start(CST.SCENES.MAIN);
      this.physics.pause();
      this.gameOver = true;
      let cfx = new ConfirmationBox(this, this.game.renderer.width / 2, this.game.renderer.height / 2, "Notice", "Are you sure you want to exit the game?", () => {
        this.scene.start(CST.SCENES.MAIN);
      }, () => {
        this.physics.resume();
        this.gameOver = false;
        cfx.destroy();
      });
    });

    //Heart Icon - Lives Indicator
    let heartIcon = this.add
      .sprite(this.game.renderer.width - 25, 25, CST.IMAGES.HEARTMETER)
      .setDepth(2)
      .setScale(0.6);

    //Lives number indicator
    this.livesLabel = this.make.text({
      x: this.game.renderer.width - 30,
      y: 16,
      origin: { x: 0, y: 0 },
      text: this.respawnMeter,
      padding: 0,
      style: {
        font: '16px monospace',
        fill: '#ffffff',
      },
    }).setDepth(2);
    this.livesLabel.setStroke('#fff', .3);
    this.livesLabel.setShadow(0, 1, '#202020', 1, true, true);
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
        this.animatePlayerLossGain("Lives left: " + String(this.respawnMeter - 1), "Lives left: " + String(this.respawnMeter));
        break;
      case CST.ANIMATIONS.BEAMPOWERUP_ANIM:
        if (this.beamLevel <= 3)
          // here to only augment till level 4 beam no need to add more
          this.beamLevel += 1;
        break;
      case CST.ANIMATIONS.SCOREPOWERUP_ANIM:
        if (this.scoreMultiplication <= 3) {
          this.scoreMultiplication += 1;

          this.animatePlayerLossGain("Score Multiplied By: " + String(this.scoreMultiplication - 1) + "X", "Score Multiplied By: " + String(this.scoreMultiplication) + "X");
        }
        break;
      case CST.ANIMATIONS.FINISHLVLPOWERUP_ANIM:
        let enemies = this.enemies.getChildren();

        for (let index = 0; index < enemies.length; index++) {
          const virus = (enemies[index] as Virus);
          let explosion = new Explosion(this, virus.x, virus.y, CST.SPRITES.COVID19_EXPLOSION, CST.ANIMATIONS.COVID19_EXPLOSION_ANIM);

          try {
            virus.resetVirusPos();
          } catch (error) {
            console.log(error);
          }
          //Update score
        }
        this.levelReach += 1;
        //@ts-ignore
        this.score = (this.levelsData.scoreLevelModulo * (this.levelReach - 1));
        this.scoreLabel.text = "Score: " + this.zeroPad(this.score, 6);
        this.processLevel();

        break;
      case CST.ANIMATIONS.SHIELDPOWERUP_ANIM:
        if (this.shieldLevel <= 1)
          // here to only augment till level 2 shield no need to add more
          this.shieldLevel += 1;
        this.shield = new Shield(this, this.player.x, this.player.y, CST.SPRITES.SHIELDS, CST.ANIMATIONS.SHIELD_ANIM, this.playerContainer).setDepth(1);
        this.shield.setCollideWorldBounds(true);
        break;
      case CST.ANIMATIONS.GALACTICLASERPOWERUP_ANIM:
        this.shootBolt();
        break;
    }
  };

  returnToEarth = (player: any, globe: any) => { };

  hurtPlayer = (hitObject: Phaser.Physics.Arcade.Sprite, enemy: Virus): void => {
    enemy.resetVirusPos();

    if (this.player.alpha < 1) {
      return;
    }

    //This is adjusted from <=0 to add the logic that when reaching zero it should be gameover because this function is called afte rthe respawnmeter update
    if (this.respawnMeter <= 1) {
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

  bombHitPlayer = (hitObject: Phaser.Physics.Arcade.Sprite, bomb: Bomb): void => {
    this.bombs.remove(bomb, true);
    bomb.destroy();

    if (this.player.alpha < 1) {
      return;
    }

    //This is adjusted from <=0 to add the logic that when reaching zero it should be gameover because this function is called afte rthe respawnmeter update
    if (this.respawnMeter <= 1) {
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
    //Reset Beams 
    this.beamLevel = 1;

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

    this.animatePlayerLossGain("Lives left: " + String(this.respawnMeter + 1), "Lives left: " + String(this.respawnMeter));

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

    if (this.scoreMultiplication > 1) {
      this.animatePlayerLossGain("Score Multiplied By: " + String(this.scoreMultiplication) + "X", "Score Multiplied By: 1X");
    }

  };


  //Animate Life Value
  animatePlayerLossGain = (textFrom: string, textTo: string) => {
    if (this.playerGainLossTween) {
      this.playerGainLossTween.stop();
      this.tweens.remove(this.playerGainLossTween);
    }
    let lossGainText = this.make
      .text({
        x: this.game.renderer.width / 2,
        y: this.game.renderer.height / 2,
        origin: { x: 0.5, y: 0.5 },
        text: "",
        padding: 0,
        style: {
          font: "25px monospace",
          fill: "#ffffff",
        },
      })
      .setDepth(10).setScale(0.2);

    lossGainText.setStroke('#fff', .5);
    lossGainText.setShadow(0, 1, '#202020', 1, true, true);

    this.playerGainLossTween = this.tweens.add({
      targets: lossGainText,
      scale: 1,
      //@ts-ignore
      duration: 500,
      repeat: 0,
      ease: 'Expo.easeOut',
      yoyo: true,
      hold: 500,
      onComplete: () => {
        lossGainText.setText("");
        lossGainText.destroy();
      },
      onYoyo: () => {
        lossGainText.setText(textTo);
      },
      onStart: () => {
        lossGainText.setText(textFrom);
      },
      callbackScope: this,
    });
  }

  hitEarth = (globe: any, enemy: any): void => {
    globe.setAlpha(globe.alpha - 0.08);
    if (globe.alpha <= 0) {
      this.gameOverScene();
    }
    let explosion = new Explosion(this, enemy.x, enemy.y, CST.SPRITES.COVID19_EXPLOSION, CST.ANIMATIONS.COVID19_EXPLOSION_ANIM);

    //@ts-ignore
    enemy.hitEarth();
  };

  bombHitEarth = (globe: any, bomb: any): void => {
    globe.setAlpha(globe.alpha - 0.08);
    if (globe.alpha <= 0) {
      this.gameOverScene();
    }

    let explosion = new Explosion(this, bomb.x, bomb.y, CST.SPRITES.COVID19_EXPLOSION, CST.ANIMATIONS.COVID19_EXPLOSION_ANIM);

    this.bombs.remove(bomb, true);
    bomb.destroy();
  };

  gameOverScene = (): void => {


    //To not add simultaneous tweens
    this.tweens.shutdown();

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
        if (null != this.sound) {
          this.sound.stopAll();
        }
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
    this.powerUps.clear(true);
    this.lastPowerUpDeployed = {};
    if (this.levels.length > 0) {
      let level = this.levels[0];
      //@ts-ignore
      let virusDistribution = level.virusDistribution;
      let bombIntervals = level.bombIntervals;
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
          lifeSpanDistribution[virusKey],
          bombIntervals[virusKey]
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

  addVirusCollection = (animationKey: string, virusType: string, numberOfVirusToAdd: integer, speed: number, lifespan: integer, bombInterval: number) => {
    for (let k = 0; k < numberOfVirusToAdd; k++) {
      let virusToAdd = new Virus(this, 0, Math.floor(Math.random() * 10) + 1, virusType, animationKey, 1, speed, this.virusId++, lifespan, bombInterval * 1000);
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

    for (let k = 0; k < numberOfPowerUpToAdd; k++) {
      let powerUpToAdd = new PowerUp(
        this,
        Math.floor(Math.random() * this.game.renderer.width) + 1,
        0,
        CST.SPRITES.POWERUPS,
        animationKey,
        1,
        speed,
        //@ts-ignore
        delayToDisplay[k] * 2000
      ).setImmovable(true);

      //@ts-ignore
      powerUpToAdd.initialX = powerUpToAdd.x;
      //@ts-ignore
      powerUpToAdd.initialY = powerUpToAdd.y;

      powerUpToAdd.body.setSize(73, 73, true);
      powerUpToAdd.disableBody(true, true);
      this.powerUps.add(powerUpToAdd);

      //Set a timer at the beginning of each level for each powerup we have
      //the default start time helps us begin from 0 in each level
      //That way we can move the powerup based on time interval from the start of the level and not based on time 
      this.time.addEvent({
        //@ts-ignore
        delay: delayToDisplay[k] * 2000,                // ms
        callback: () => {
          //@ts-ignore
          powerUpToAdd.enableBody(true, powerUpToAdd.initialX, powerUpToAdd.initialY, powerUpToAdd.y, true, true);
          powerUpToAdd.movePowerUp();
        },
        args: [],
        callbackScope: this
      })
    }
  };


  shootBeam = (): number => {
    //@ts-ignore
    let beamsOffsets = this.levelsData.beamLevelOffsets["level" + String(this.beamLevel)];

    if (beamsOffsets) {
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
          beam.setScale(.5);
        }
        else {
          beam.setScale(0.6);
        }
        this.projectiles.add(beam);

      }

      this.playBeamSound(this.projectiles);

      return beamsOffsets.firingTime;
    }
    return 0;

  };


  shootBomb = (bombInterval: number, x: number, y: number): void => {
    //To Not fire on first load
    if (this.lastBombFired >= bombInterval && (y <= this.game.renderer.height / 2)) {
      let bomb = new Bomb(this, x, y + 25, CST.SPRITES.BACERIA_BOMB, CST.ANIMATIONS.BACTERIA_BOMB_ANIM, 1);

      if (CST.WINDOW.ISMOBILE) {
        bomb.setScale(.3);
      }
      else {
        bomb.setScale(.4);
      }
      this.bombs.add(bomb);
      this.playBombSound(this.bombs);
    }


  };

  processLevel = () => {
    //@ts-ignore
    if (this.levelReach <= this.levelsData.levels.length) {
      //@ts-ignore
      this.levels = this.levelsData.levels.filter((x: any) => x.levelNumber == this.levelReach);
      this.levelLabel.text = "Level: " + this.levelReach;
      this.animatePlayerLossGain("Level: " + String(this.levelReach - 1), "Level: " + String(this.levelReach));
      this.enemies.clear(true);
      this.enemies.getChildren().forEach(enemy => enemy.destroy());
      this.loadEnemiesByLevel();
    } else {
      // here it must be game ended !
      this.levelReach -= 1;
      //@ts-ignore
      this.levels = this.levelsData.levels.filter((x: any) => x.levelNumber == this.levelReach);
    }
  };

  //@ts-ignore
  hitVirus = (projectile: Beam, virus: Virus): void => {

    let virusId = virus.getId();

    //@ts-ignore
    if (!this.shakePositions["virus" + String(virusId)]) {
      //@ts-ignore
      let shake = this.plugins.get("rexShakePosition").add(virus, {
        mode: 0, // 0|'effect'|1|'behavior'
        duration: 250,
        magnitude: 2,
        magnitudeMode: 0, // 0|'constant'|1|'decay'
      });
      //@ts-ignore
      this.shakePositions["virus" + String(virus.getId())] = 1;
      shake.shake();

      shake.on("complete", (shake: any, gameObject: GameObjects.GameObject) => {
        //@ts-ignore
        delete this.shakePositions["virus" + String(virus.getId())];
      });
    }

    //@ts-ignore
    if (!this.beamTotals["virus" + String(virusId)]) {
      //@ts-ignore
      this.beamTotals["virus" + String(virusId)] = 1;
    }


    //@ts-ignore
    if (this.beamTotals["virus" + String(virusId)] >= virus.getLifeSpan()) {
      //@ts-ignore
      delete this.beamTotals["virus" + String(virusId)];

      let explosion = new Explosion(this, virus.x, virus.y, CST.SPRITES.COVID19_EXPLOSION, CST.ANIMATIONS.COVID19_EXPLOSION_ANIM);


      virus.resetVirusPos();

      //Update score
      this.score += (25 * this.scoreMultiplication);
      this.scoreLabel.text = "Score: " + this.zeroPad(this.score, 6);

      if (
        //@ts-ignore
        this.score >= this.levelsData.scoreLevelModulo
        &&
        (
          //@ts-ignore
          CST.MOD((this.score - this.levelsData.scoreLevelModulo), this.levelsData.scoreLevelModulo) < (25 * this.scoreMultiplication)
          ||
          //@ts-ignore
          CST.MOD((this.score - this.levelsData.scoreLevelModulo), this.levelsData.scoreLevelModulo) == 0
        )
      ) {
        this.levelReach += 1;
        this.processLevel();
      }
    }
    else {
      //@ts-ignore
      this.beamTotals["virus" + String(virusId)] = this.beamTotals["virus" + String(virusId)] + 1;
    }

    //@ts-ignore
    projectile.destroy();
    this.projectiles.remove(projectile, true);
  };


  //@ts-ignore
  hitBomb = (projectile: Beam, bomb: Bomb): void => {

    let explosion = new Explosion(this, bomb.x, bomb.y, CST.SPRITES.COVID19_EXPLOSION, CST.ANIMATIONS.COVID19_EXPLOSION_ANIM);

    //@ts-ignore
    bomb.destroy();
    this.bombs.remove(bomb, true);

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

  //Play Explosion Sound based on random marker to generate multiple ones at the same time during the game.
  //We are saving the instance so that we can remove specific ones only and not the entire sound
  playExplosionSound = (explosionGroup: Phaser.GameObjects.Group) => {
    let guid = Phaser.Math.RND.between(1, 500);

    let fxExplosionn: Phaser.Sound.BaseSound = this.sound.add(CST.SOUNDS.FX_EXPLOSION);

    while (fxExplosionn.markers[CST.SOUNDS.MARKERS.FX_EXPLOSION + String(guid)]) {
      guid = Phaser.Math.RND.between(1, 500);
    }

    fxExplosionn.addMarker({
      name: CST.SOUNDS.MARKERS.FX_EXPLOSION + String(guid),
      start: 0,
      config: {
        volume: .3
      }
    });

    fxExplosionn.play(CST.SOUNDS.MARKERS.FX_EXPLOSION + String(guid));

    this.fxExplosions.push({
      id: String(guid),
      explosionSound: fxExplosionn
    });

    let explosionss = explosionGroup.getChildren();
    setTimeout(() => {
      let arr = this.fxExplosions.filter(x => x.id === String(guid));
      explosionss.forEach((expl) => {
        expl.once('destroy', () => {
          if (arr.length > 0) {
            let b = arr[0];
            (b.explosionSound as Phaser.Sound.BaseSound).destroy();
            this.fxExplosions = this.fxExplosions.filter(x => x.id !== String(guid));
          }
        });
      });
    }, 500);
  };

  //Play Beam Sound based on random marker to generate multiple ones at the same time during the game.
  //We are saving the instance so that we can remove specific ones only and not the entire sound
  playBeamSound = (beamGroup: Phaser.GameObjects.Group) => {
    let guid = Phaser.Math.RND.between(1, 500);
    let fxBeamm: Phaser.Sound.BaseSound = this.sound.add(CST.SOUNDS.FX_BEAM);

    while (fxBeamm.markers[CST.SOUNDS.MARKERS.FX_BEAM + String(guid)]) {
      guid = Phaser.Math.RND.between(1, 500);
    }

    fxBeamm.addMarker({
      name: CST.SOUNDS.MARKERS.FX_BEAM + String(guid),
      start: 0,
      config: {
        volume: .3
      }
    });

    fxBeamm.play(CST.SOUNDS.MARKERS.FX_BEAM + String(guid));

    this.fxBeams.push({
      id: String(guid),
      beamSound: fxBeamm
    });

    let beams = beamGroup.getChildren();
    let arr = this.fxBeams.filter(x => x.id === String(guid));
    setTimeout(() => {
      beams.forEach((beam) => {
        beam.once('destroy', () => {
          if (arr.length > 0) {
            let b = arr[0];
            (b.beamSound as Phaser.Sound.BaseSound).destroy();
            this.fxBeams = this.fxBeams.filter(x => x.id !== String(guid));
          }
        });
      });
    }, 150);
  };

  //Play Bomb Sound based on random marker to generate multiple ones at the same time during the game.
  //This is different from the first two because it's long and we need to cut it once the object (bomb) has been destroyed
  //and since we need to keep track of the sounds that are in place in order to avoid parallel sounds collision
  //we add them to an array and delete them if they ever show up in the destroy event
  //If 2 bombs were to be active at the same time, this allows us to handle each sound alone.
  playBombSound = (bombGroup: Phaser.GameObjects.Group) => {
    let guid = Phaser.Math.RND.between(1, 500);
    let fxBombb: Phaser.Sound.BaseSound = this.sound.add(CST.SOUNDS.FX_BOMB_FALLING);

    fxBombb.addMarker({
      name: CST.SOUNDS.MARKERS.FX_BOMB_FALLING + String(guid),
      start: 0,
      config: {
        volume: .3
      }
    });

    fxBombb.play(CST.SOUNDS.MARKERS.FX_BOMB_FALLING + String(guid));

    this.fxBombs.push({
      id: String(guid),
      bombSound: fxBombb
    });

    let bombs = bombGroup.getChildren();
    let arr = this.fxBombs.filter(x => x.id === String(guid));
    bombs.forEach((bomb) => {
      bomb.once('destroy', () => {
        if (arr.length > 0) {
          let b = arr[0];
          (b.bombSound as Phaser.Sound.BaseSound).removeMarker(CST.SOUNDS.MARKERS.FX_BOMB_FALLING + String(guid));
          (b.bombSound as Phaser.Sound.BaseSound).stop();
          (b.bombSound as Phaser.Sound.BaseSound).destroy();
          this.fxBombs = this.fxBombs.filter(x => x.id !== String(guid));
        }

      });
    });

  };

  //Shoot horizontal bolt to kill all enemies and destroy the bombs
  shootBolt = () => {
    this.bolt = this.physics.add.sprite(0, this.game.renderer.height, CST.SPRITES.BOLT).setDepth(1);
    this.bolt.setDisplaySize(this.game.renderer.width, this.bolt.height);
    this.bolt.body.setSize(this.game.renderer.width, 50);
    this.bolt.setOrigin(0, 0);
    this.bolt.setVelocityY(-250);
    this.bolt.play(CST.ANIMATIONS.BOLT_ANIM);

    //Enemy collision with Bolt
    this.physics.add.overlap(
      this.bolt,
      this.enemies,
      //@ts-ignore
      this.killAllEnemies,
      //@ts-ignore
      null,
      this
    );

    //Enemy collision with Bolt
    this.physics.add.overlap(
      this.bolt,
      this.bombs,
      //@ts-ignore
      this.killAllBombs,
      //@ts-ignore
      null,
      this
    );
  };

  killAllEnemies = (bolt: any, virus: Virus) => {
    let explosion = new Explosion(this, virus.x, virus.y, CST.SPRITES.COVID19_EXPLOSION, CST.ANIMATIONS.COVID19_EXPLOSION_ANIM);
    // explosion.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
    //   this.explosions.remove(explosion, true);
    //   explosion.destroy();
    // });

    virus.resetVirusPos();
  };

  killAllBombs = (bolt: any, bomb: Bomb) => {
    let explosion = new Explosion(this, bomb.x, bomb.y, CST.SPRITES.COVID19_EXPLOSION, CST.ANIMATIONS.COVID19_EXPLOSION_ANIM);

    bomb.destroy();
  };

  //Get Time for rapid fire
  update(time: number) {
    //@ts-ignore
    if (this.gameOver) {
      return;
    }

    this.background.tilePositionX -= 0.1;
    this.background.tilePositionY -= 1;
    this.globe.rotation += 0.009;

    let childrenEnemies = this.enemies.getChildren();


    for (let index = 0; index < childrenEnemies.length; index++) {
      const enemy = (childrenEnemies[index] as Virus);
      enemy.moveVirus();
      let bombInterval = enemy.getBombInterval();
      if (bombInterval > 0) {
        if (time > this.lastBombFired) {
          this.shootBomb(bombInterval, enemy.x, enemy.y);
          this.lastBombFired = time + bombInterval
        }
      }
    }

    //Move Powerups
    let powerUps = this.powerUps.getChildren();
    if (powerUps.length > 0) {
      for (let index = 0; index < powerUps.length; index++) {
        const powerUp = (powerUps[index] as PowerUp);
        powerUp.movePowerUp();
      }
    }

    //Manage player movement
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

    let childrenBombs = this.bombs.getChildren();
    childrenBombs.map((child: GameObjects.GameObject) => {
      let bomb = (child as Bomb);
      bomb.update();
    });


    if (this.bolt && this.bolt.y < 25) {
      this.bolt.setVelocityY(-50);
      this.bolt.setAlpha(.2);
      this.bolt.destroy();
      //@ts-ignore
      this.bolt = null;
    }
  }
}
