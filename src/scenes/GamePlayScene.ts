import { CST } from "../CST";

const COLOR_PRIMARY = 0X000000;
const COLOR_LIGHT = 0X00ffff;
const COLOR_DARK = 0X0F0F0F;

export class GamePlayScene extends Phaser.Scene {
  //@ts-ignore
  private gamePlayData: object;

  //@ts-ignore
  private container: Phaser.GameObjects.Container;

  //@ts-ignore
  private scrollablePanel: any;

  //@ts-ignore
  private sizer: any;

  //@ts-ignore
  private background: Phaser.GameObjects.TileSprite;

  constructor() {
    super({
      key: CST.SCENES.GAMEPLAY,
    });
  }
  preload() {

    this.gamePlayData = this.cache.json.get("gamePlayData");

    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    });
  }
  create() {

    this.background = this.add.tileSprite(0, 0, this.game.renderer.width, this.game.renderer.height, CST.IMAGES.BACKGROUND).setOrigin(0, 0).setDepth(0);

    //@ts-ignore
    this.scrollablePanel = this.rexUI.add.scrollablePanel({
      x: 0,
      y: 0,
      width: this.game.renderer.width,
      height: this.game.renderer.height,

      scrollMode: 0,

      //@ts-ignore
      background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY, .4),

      panel: {
        //@ts-ignore
        child: this.rexUI.add.fixWidthSizer({
          space: {
            left: 1,
            right: 1,
            top: 1,
            bottom: 1,
            line: 25,
            item: 30
          }
        }),

        mask: {
          padding: 1
        },
      },

      slider: {
        //@ts-ignore
        track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK, .7),
        //@ts-ignore
        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT, .7),
      },

      // scroller: true,

      space: {
        left: 10,
        right: 10,
        top: 50,
        bottom: 10,

        panel: 10,
      }
    }).layout().setOrigin(0, 0);

    this.input.setTopOnly(false);

    let text = this.make
      .text({
        x: 0,
        y: 25,
        alpha: 0,
        origin: { x: 0, y: 0 },
        text: "<< BACK",
        padding: 0,
        style: {
          font: "22px monospace",
          fill: "#00ffff",
        },
      })
      .setInteractive({
        useHandCursor: true
      }).on("pointerup", () => {
        this.scene.start(CST.SCENES.MAIN);
      })
      .setDepth(1);


    text.x = this.game.renderer.width - text.width - 40;

    let initialAlpha = 0;

    let textTween = this.tweens.add({
      targets: text,
      alpha: 1,
      ease: 'Expo.easeOut',
      duration: 1000,
      hold: 200,
      repeat: -1,
      yoyo: true
    });

    text.on("pointerover", () => {
      initialAlpha = text.alpha;
      text.setAlpha(1);
      textTween.pause();
    });

    text.on("pointerout", () => {
      textTween.resume();
      text.setAlpha(initialAlpha);
    });

    this.sizer = this.scrollablePanel.getElement('panel');
    this.sizer.clear(true);

    Object.keys(this.gamePlayData).forEach((key) => {
      let keyElement = key as string;
      //@ts-ignore
      if (this.hasChildren(this.gamePlayData[keyElement])) {
        //@ts-ignore
        Object.keys(this.gamePlayData[keyElement]).forEach((keyInner) => {
          //@ts-ignore
          this.searchJson(this.gamePlayData[keyElement], keyInner, keyElement);
        });
      } else {
        //@ts-ignore
        this.searchJson(this.gamePlayData, keyElement);
      }
    });

    this.scrollablePanel.layout();

  }

  // updatePanel = (panel: any) => {


  //   return panel;
  // }

  searchJson = (arr: Object, keyElement: string, parent = null) => {


    //@ts-ignore
    let item = arr[keyElement];
    if (item != null && typeof item == "object") {
      let ScaleX = item.scaleX == undefined ? 0.5 : item.scaleX;
      let ScaleY = item.scaleY == undefined ? 0.5 : item.scaleY;

      let spriteName = (item.name as string).toLowerCase().indexOf("covid19") != -1 ? item.name + "_GAMEPLAY" : item.name;

      let image = this.physics.add.sprite(0, 0, parent ?? item.name).setScale(ScaleX, ScaleY);
      image.play(spriteName.toUpperCase() + "_ANIM");
      if ((item.name as string).toLowerCase().indexOf("covid") != -1) {
        image.frame.setSize(100, 100);
      }
      // image.anims.currentFrame.frame.width = 20;

      // let container = this.add.container(0,0);
      // container.add(image);
      // this.updateSize(container);
      // image.setInteractive();

      this.sizer.add(image);

      let text = this.make
        .text({
          x: 0,
          y: 0,
          origin: { x: 0, y: 0 },
          text: item.description,
          padding: 0,
          style: {
            font: "16px monospace",
            fill: "#ffffff",
          },
        });

      text.setStroke('#fff', .5);
      text.setShadow(0, 1, '#202020', 1, true, true);

      if (CST.WINDOW.ISMOBILE) {
        text.setWordWrapWidth(text.width - 100,true);  
      }
      else{
        text.setWordWrapWidth(500,true);
      }
      
      // container.add(text);
      // this.updateSize(container);

      this.sizer.add(text);
      this.sizer.addNewLine();
    }
  };

  hasChildren = (property: any) => {
    //@ts-ignore
    return typeof property === "object" && property !== null && Object.values(property).some(value => typeof value === "object");
  };

  update() {

    // this.input.on('drag', (pointer: any, gameObject: any, dragX: number, dragY: number) => {
    //   this.container.y = dragY;
    // });

  }


  updateSize = (con: Phaser.GameObjects.Container) => {
    //set the top position to the bottom of the game
    var top = this.game.config.height;
    var bottom = 0;
    //set the left to the right of the game
    var left = this.game.config.width;
    var right = 0;
    //
    //
    //loop through the children
    //@ts-ignore
    con.iterate(function (child) {
      //get the positions of the child
      var childX = child.x;
      var childY = child.y;
      //
      //
      //
      var childW = child.displayWidth;
      var childH = child.displayHeight;
      //
      //
      //calcuate the child position
      //based on the origin
      //
      //
      var childTop = childY - (childH * child.originY);
      var childBottom = childY + (childH * (1 - child.originY));
      var childLeft = childX - (childW * child.originX);
      var childRight = childX + (childW * (1 - child.originY));
      //test the positions against
      //top, bottom, left and right
      //
      if (childBottom > bottom) {
        bottom = childBottom;
      }
      if (childTop < top) {
        top = childTop;
      }
      if (childLeft < left) {
        left = childLeft;
      }
      if (childRight > right) {
        right = childRight;
      }
    }.bind(this));
    //
    //calculate the square
    //@ts-ignore
    var h = Math.abs(top - bottom);
    //@ts-ignore
    var w = Math.abs(right - left);
    //set the container size
    con.setSize(w, h);
  }
}
