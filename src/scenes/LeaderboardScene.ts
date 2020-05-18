import { CST } from "../CST";
export class LeaderboardScene extends Phaser.Scene {

  //@ts-ignore
  private background: Phaser.GameObjects.TileSprite;

  //@ts-ignore
  private leaderboard: any;

  constructor() {
    super({
      key: CST.SCENES.LEADERBOARD
    });
  }

  preload() {
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    });
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.game.renderer.width, this.game.renderer.height, CST.IMAGES.BACKGROUND).setOrigin(0, 0).setDepth(0);


    let text = this.make
      .text({
        x: 0,
        y: 10,
        origin: { x: 0, y: 0 },
        text: "<< BACK",
        padding: 0,
        style: {
          font: "20px monospace",
          fill: "#00ffff",
        },
      })
      .setInteractive({
        useHandCursor: true
      }).on("pointerup", () => {
        this.scene.start(CST.SCENES.MAIN);
      })
      .setDepth(1);


    text.x = this.game.renderer.width - text.width - 50;

    let rectG = this.add.graphics().setDepth(0);
    rectG.fillStyle(0x00000000000, .5);
    rectG.fillRect(0, 0, this.game.renderer.width, this.game.renderer.height);

    let loadingText = this.make.text({
      x: 0,
      y: this.game.renderer.height / 2 - 12,
      origin: { x: 0, y: 0 },
      padding: 0,
      text: "Loading Stats...",
      style: {
        font: "33px monospace",
        fill: "#00ffff",
      },
    });
    loadingText.x = this.game.renderer.width / 2 - loadingText.width/2;

    this.facebook.on('getleaderboard', (leaderboard: any) => {

      this.leaderboard = leaderboard;


      this.leaderboard.on('getscores', (scores: []) => {
        if(scores.length == 0){
          loadingText.setText("No stats available yet.")
        }
        else{
          loadingText.destroy();
        }
        let rankTitle = this.make.text({
          x: 50,
          y: 25,
          origin: { x: 0, y: 0 },
          text: "Rank",
          padding: 0,
          style: {
            font: "32px monospace",
            fill: "#00ffff",
          }
        }).setDepth(1);

        let scoreTitle = this.make.text({
          x: rankTitle.width * 2 + rankTitle.x,
          y: 25,
          origin: { x: 0, y: 0 },
          text: "Score",
          padding: 0,
          style: {
            font: "32px monospace",
            fill: "#00ffff",
          }
        }).setDepth(1);

        let nameTitle = this.make.text({
          x: scoreTitle.x + scoreTitle.width * 2 + rankTitle.x,
          y: 25,
          origin: { x: 0, y: 0 },
          text: "Name",
          padding: 0,
          style: {
            font: "32px monospace",
            fill: "#00ffff",
          }
        }).setDepth(1);

        for (let i = 0; i < scores.length; i++) {

          this.make.text({
            x: rankTitle.x,
            y: rankTitle.y + 45 * (i + 1),
            origin: { x: 0, y: 0 },
            //@ts-ignore
            text: scores[i].rank,
            padding: 0,
            style: {
              font: "26px monospace",
              fill: "#ffffff",
            },
          }).setDepth(1);

          this.make.text({
            x: scoreTitle.x,
            y: scoreTitle.y + 45 * (i + 1),
            origin: { x: 0, y: 0 },
            //@ts-ignore
            text: scores[i].score,
            padding: 0,
            style: {
              font: "26px monospace",
              fill: "#ffffff",
            },
          }).setDepth(1);

          this.make.text({
            x: nameTitle.x,
            y: nameTitle.y + 45 * (i + 1),
            origin: { x: 0, y: 0 },
            //@ts-ignore
            text: scores[i].playerName,
            padding: 0,
            style: {
              font: "26px monospace",
              fill: "#ffffff",
            },
          }).setDepth(1);

        }
      });

      this.leaderboard.getScores();

    });
    this.facebook.getLeaderboard('global_board');
  }

  update() {
    this.background.tilePositionX -= 0.1;
    this.background.tilePositionY -= 1;
  }

}