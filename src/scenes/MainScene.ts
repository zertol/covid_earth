import { CST } from '../CST';
//@ts-ignore
import START_GAME from '../../images/start_game.png';
//@ts-ignore
import controls_GAME from '../../images/controls_game.png';
//@ts-ignore
import PLAYCREDITS_GAME from '../../images/gameplay_button.png';

export class MainScene extends Phaser.Scene {

    constructor() {
        super({
            key: CST.SCENES.MAIN
        });
    }
    preload() {
        this.load.image('play-button',START_GAME);
        this.load.image('options-button',controls_GAME);
        this.load.image('playcredits-button',PLAYCREDITS_GAME);
    }
    create() {

        this.add.tileSprite(0, 0, this.game.renderer.width, this.game.renderer.height, CST.IMAGES.BACKGROUND).setOrigin(0, 0).setDepth(0);

        // let playButton = this.make.text({
        //     x: this.game.renderer.width / 2,
        //     y: this.game.renderer.height / 2 - 25,
        //     origin: { x: 0.5, y: 0.5 },
        //     text: "Start Game",
        //     padding: 10,
        //     style: {
        //         font: "40px monospace",
        //         fill: "#fff",
        //         backgroundColor: "rgba(0,0,0,0.8)"
        //     }
        // }).setDepth(1);

        let playButton = this.add.image(0, 0, 'play-button');
        let controlsButton = this.add.image(0, playButton.height, 'options-button');
        let playCreditsButton = this.add.image(0, playButton.height * 2, 'playcredits-button');
        let container = this.add.container(this.game.renderer.width / 2, this.game.renderer.height / 2 - 25);
        container.add(playButton);
        container.add(controlsButton);
        container.add(playCreditsButton);
        container.y = this.game.renderer.height / 2 - container.height;

        if (CST.WINDOW.ISMOBILE) {
           container.setScale(.7);
        }

        playButton.setInteractive({
            useHandCursor: true
        });

        playCreditsButton.setInteractive({
            useHandCursor: true
        }).on("pointerup", () => {
            this.scene.start(CST.SCENES.GAMEPLAY);
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