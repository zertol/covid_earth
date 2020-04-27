import { CST } from '../CST';
//@ts-ignore
import START_GAME from '../../images/start_game.png';
//@ts-ignore
import CONTROLS_GAME from '../../images/controls_game.png';
//@ts-ignore
import UP_ARROW from '../../images/up_arrow.png';
//@ts-ignore
import DOWN_ARROW from '../../images/down_arrow.png';
//@ts-ignore
import LEFT_ARROW from '../../images/left_arrow.png';
//@ts-ignore
import RIGHT_ARROW from '../../images/right_arrow.png';
//@ts-ignore
import SPACEBAR from '../../images/spacebar.png';
//@ts-ignore
import TOUCH_FINGER from '../../images/touch_finger.png';
//@ts-ignore
import SWIPE_FINGER from '../../images/swipe_finger.png';
//@ts-ignore
import BACK_BUTTON from '../../images/back_button.png';

export class MainScene extends Phaser.Scene {
    //@ts-ignore
    private background: Phaser.GameObjects.TileSprite;

    constructor() {
        super({
            key: CST.SCENES.MAIN
        });
    }
    preload() {
        this.load.image('play-button', START_GAME);
        this.load.image('options-button', CONTROLS_GAME);
        this.load.image(CST.IMAGES.BACK_BUTTON, BACK_BUTTON);

        if (!CST.WINDOW.ISMOBILE) {
            this.load.image(CST.IMAGES.UP_ARROW, UP_ARROW);
            this.load.image(CST.IMAGES.DOWN_ARROW, DOWN_ARROW);
            this.load.image(CST.IMAGES.LEFT_ARROW, LEFT_ARROW);
            this.load.image(CST.IMAGES.RIGHT_ARROW, RIGHT_ARROW);
            this.load.image(CST.IMAGES.SPACEBAR, SPACEBAR);
        }
        else {
            this.load.image(CST.IMAGES.TOUCH_FINGER, TOUCH_FINGER);
            this.load.image(CST.IMAGES.SWIPE_FINGER, SWIPE_FINGER);
        }

    }
    create() {

        this.background = this.add.tileSprite(0, 0, this.game.renderer.width, this.game.renderer.height, CST.IMAGES.BACKGROUND).setOrigin(0, 0).setDepth(0);

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
        let container = this.add.container(this.game.renderer.width / 2, this.game.renderer.height / 2 - 25);
        container.add(playButton);
        container.add(controlsButton);
        this.updateSize(container);
        container.y = this.game.renderer.height / 2 - container.height / 2;

        if (CST.WINDOW.ISMOBILE) {
            container.setScale(.7);
        }

        playButton.setInteractive({
            useHandCursor: true
        });

        playButton.on("pointerup", () => {
            this.scene.start(CST.SCENES.GAME);
        });

        controlsButton.setInteractive({
            useHandCursor: true
        });

        controlsButton.on("pointerdown", () => {
            this.scene.start(CST.SCENES.CONTROLS);
        });

        this.input.keyboard.on('keydown-SPACE', () => this.scene.start(CST.SCENES.GAME));


    }

    update() {
        this.background.tilePositionX -= 0.1;
        this.background.tilePositionY -= 1;
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