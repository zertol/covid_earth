import { CST } from '../CST';

export class MainScene extends Phaser.Scene {

    constructor() {
        super({
            key: CST.SCENES.MAIN
        });
    }
    preload() {

    }
    create() {

        this.add.tileSprite(0, 0, this.game.renderer.width, this.game.renderer.height, CST.IMAGES.BACKGROUND).setOrigin(0, 0).setDepth(0);

        let playButton = this.make.text({
            x: this.game.renderer.width / 2,
            y: this.game.renderer.height / 2 - 25,
            origin: { x: 0.5, y: 0.5 },
            text: "Start Game",
            padding: 10,
            style: {
                font: "40px monospace",
                fill: "#fff",
                backgroundColor: "rgba(0,0,0,0.8)"
            }
        }).setDepth(1);


        if (CST.WINDOW.ISMOBILE) {
            playButton.setFontSize(30);
        }

        playButton.setInteractive({
            useHandCursor: true
        });

        playButton.on("pointerup", () => {
            this.scene.start(CST.SCENES.GAME);
        });

        // let spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // if (spacebar.isDown) {
        //     this.scene.start(CST.SCENES.GAME);
        // }

        this.input.keyboard.on('keydown-SPACE', () => this.scene.start(CST.SCENES.GAME));


    }
}