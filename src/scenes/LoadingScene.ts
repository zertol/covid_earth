import { CST } from "../CST";
//@ts-ignore
import LOGO from "../../images/zenvalogo.png";

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.LOAD
    });
  }

  preload() {
    console.log("Working");
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        fill: "#ffffff"
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: "0%",
      style: {
        font: "18px monospace",
        fill: "#ffffff"
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: "",
      style: {
        font: "18px monospace",
        fill: "#ffffff"
      }
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on("progress", function(value: DoubleRange) {
      //@ts-ignore
      percentText.setText(parseInt(value * 100) + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      //@ts-ignore
      progressBar.fillRect(250, 280, 300 * value, 30);
    });
    //@ts-ignore
    var files = [];
    this.load.on("fileprogress", function(file: Phaser.GameObjects.Image) {
      //@ts-ignore
      assetText.setText("Loading asset: " + file.key);
      files.push(file);
    });

    this.load.on("complete", function() {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      for (var i = 0; i < 500; i++) {
        //@ts-ignore
        files[i].destroy();
      }
    });

    this.load.image("logo", LOGO);
    for (var i = 0; i < 500; i++) {
      this.load.image("logo" + i, LOGO);
    }
  }

  create() {
    var logo = this.add.image(400, 300, "logo");
  }
}
