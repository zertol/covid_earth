import { CST } from '../CST';

export default class ConfirmationBox extends Phaser.GameObjects.Container {

    private title: string;
    private messageBody: string;
    private callbackFn: any;
    private cancelCallbackFn: any;

    constructor(scene: Phaser.Scene, x: number, y: number, title: string, messageBody: string, callbackFn: any, cancelCallbackFn: any) {
        super(scene, x, y);
        this.title = title;
        this.messageBody = messageBody;
        this.callbackFn = callbackFn;
        this.cancelCallbackFn = cancelCallbackFn;
        this.setDepth(6);
        scene.add.existing(this);





        let titleText = scene.make.text({
            x: 0,
            y: 0,
            padding: 0,
            origin: { x: 0, y: 0 },
            text: title,
            style: {
                font: "30px monospace",
                fill: "#fff",
                align: "center"
            }
        });

        this.add(titleText);

        let bodyText = scene.make.text({
            x: 0,
            y: titleText.y + titleText.height + 25,
            origin: { x: 0, y: 0 },
            text: messageBody,
            padding: 0,
            style: {
                font: "20px monospace",
                fill: "#fff",
                align: "center"
            }
        });

        bodyText.setWordWrapWidth(180, true);
        this.add(bodyText);

        let okBtn = scene.add.image(0, bodyText.y + bodyText.height + 25, CST.IMAGES.OK_BUTTON).setScale(.7).setOrigin(0, 0);
        this.add(okBtn);

        let cancelBtn = scene.add.image(0, bodyText.y + bodyText.height + 25, CST.IMAGES.CANCEL_BUTTON).setScale(.7).setOrigin(0, 0);
        this.add(cancelBtn);

        okBtn.setInteractive({
            useHandCursor: true
        });

        okBtn.on("pointerup", this.callbackFn);
        

        this.updateSize(this);

        this.x = this.scene.game.renderer.width / 2 - this.width / 2;
        this.y = this.scene.game.renderer.height / 2 - this.height / 2;


        titleText.x = this.width / 2;
        bodyText.x = this.width / 2;

        okBtn.x = this.width - okBtn.displayWidth;

        titleText.setOrigin(.5, 0);
        bodyText.setOrigin(.5, 0);

        let rectG = scene.add.graphics().setDepth(0);
        rectG.fillStyle(0x00000000000, .5);
        rectG.fillRect(this.x - 25, this.y - 25, this.width + 50, this.height + 50).setDepth(5);

        cancelBtn.setInteractive({
            useHandCursor: true
        });

        cancelBtn.on("pointerup", () => {
            this.cancelCallbackFn();
            rectG.destroy();
        });

    }

    updateSize = (con: Phaser.GameObjects.Container) => {
        //set the top position to the bottom of the game
        var top = this.scene.game.config.height;
        var bottom = 0;
        //set the left to the right of the game
        var left = this.scene.game.config.width;
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