import { CST } from "../CST";
export class GamePlayScene extends Phaser.Scene {
  //@ts-ignore
  private gamePlayData: object;
  constructor() {
    super({
      key: CST.SCENES.GAMEPLAY,
    });
  }
  preload() {
    this.gamePlayData = this.cache.json.get("gamePlayData");
  }
  create() {
    let text = this.make
    .text({
      x: this.game.renderer.width-80,
      y: 25,
      origin: { x: 0, y: 0 },
      text: "BACK <",
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
  

    this.tweens.add({
      targets: text,
      alpha: 0,
      ease: 'Cubic.easeOut',  
      duration: 1000,
      repeat: -1,
      yoyo: true
    });
    var searchFunction = this.searchJson;
    var checkComplexity = this.checkComplexity;
    Object.keys(this.gamePlayData).forEach((key) => {
      let keyElement = key as string;
      //@ts-ignore
      if (checkComplexity(this.gamePlayData[keyElement],this.gamePlayData[keyElement])) {
        //@ts-ignore
        return Object.keys(this.gamePlayData[keyElement]).forEach((keyInner) => {
          //@ts-ignore
          searchFunction(this.gamePlayData[keyElement], keyInner,keyElement);
        });
      }else{
        searchFunction(this.gamePlayData, keyElement);
      }
    });
  }

  searchJson = (arr: Object, keyElement: string,parent = null) => {
    //@ts-ignore
    let item = arr[keyElement];
    if (item != null && typeof item == "object"){
    let scaleX =  item.scaleX == undefined ? 0.5 : item.scaleX;
    let ScaleY = item.scaleY == undefined ? 0.5 : item.scaleY;
    let image = this.add.sprite(item.imageX, item.imageY, parent ?? item.name).setScale(scaleX, ScaleY);
    image.play(item.name.toUpperCase() + "_ANIM");
    //image.setInteractive();
    let text = this.make
      .text({
        x: item.textX,
        y: item.imageY-image.height/13,
        origin: { x: 0, y: 0 },
        text: item.description,
        padding: 0,
        style: {
          font: "16px monospace",
          fill: "#ffffff",
        },
      })
      .setDepth(1);
    }
  };

  checkComplexity = (arr: Object,property: any) => {
    //@ts-ignore
    return typeof property === "object" && property !== null && Object.values(property).some(value => typeof value === "object");
  };
  update() {}
}
