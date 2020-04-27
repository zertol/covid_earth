import { CST } from '../CST';

export class ControlsScene extends Phaser.Scene {

    constructor() {
        super({
            key: CST.SCENES.CONTROLS
        });
    }

    preload() { }

    create() {
        //Background Image
        let background = this.add.tileSprite(0, 0, this.game.renderer.width, this.game.renderer.height, CST.IMAGES.BACKGROUND).setOrigin(0, 0).setDepth(0);
        let container = this.add.container(this.game.renderer.width / 2, this.game.renderer.height / 2)
            .setDepth(1);

        /************************** Desktop Controls *************************/
        if (!CST.WINDOW.ISMOBILE) {


            // Up Arrow
            let upArrow = this.add.image(0, 0, CST.IMAGES.UP_ARROW).setScale(.25).setOrigin(0, 0);
            container.add(upArrow);
            let upText = this.make.text({
                x: upArrow.x + upArrow.displayWidth + 15,
                y: 0,
                origin: { x: 0, y: 0 },
                text: "Move Up",
                padding: 0,
                style: {
                    font: "20px monospace",
                    fill: "#ffffff",
                },
            });
            
            upText.y = upArrow.y + upArrow.displayHeight / 2 - upText.height / 2;
            container.add(upText);
            // Up Arrow

            // Down Arrow
            let downArrow = this.add.image(0, upArrow.y + upArrow.displayHeight + 15, CST.IMAGES.DOWN_ARROW).setScale(.25).setOrigin(0, 0);
            container.add(downArrow);
            let downText = this.make.text({
                x: downArrow.x + downArrow.displayWidth + 15,
                y: 0,
                origin: { x: 0, y: 0 },
                text: "Move Down",
                padding: 0,
                style: {
                    font: "20px monospace",
                    fill: "#ffffff",
                },
            });
            downText.y = downArrow.y + downArrow.displayHeight / 2 - downText.height / 2;
            container.add(downText);
            // Down Arrow


            // Left Arrow
            let leftArrow = this.add.image(0, downArrow.y + downArrow.displayHeight + 15, CST.IMAGES.LEFT_ARROW).setScale(.25).setOrigin(0, 0);
            container.add(leftArrow);
            let leftText = this.make.text({
                x: leftArrow.x + leftArrow.displayWidth + 15,
                y: 0,
                origin: { x: 0, y: 0 },
                text: "Move Left",
                padding: 0,
                style: {
                    font: "20px monospace",
                    fill: "#ffffff",
                },
            });
            leftText.y = leftArrow.y + leftArrow.displayHeight / 2 - leftText.height / 2;
            container.add(leftText);
            // Left Arrow


            // Right Arrow
            let rightArrow = this.add.image(0, leftArrow.y + leftArrow.displayHeight + 15, CST.IMAGES.RIGHT_ARROW).setScale(.25).setOrigin(0, 0);
            container.add(rightArrow);
            let rightText = this.make.text({
                x: rightArrow.x + rightArrow.displayWidth + 15,
                y: 0,
                origin: { x: 0, y: 0 },
                text: "Move Right",
                padding: 0,
                style: {
                    font: "20px monospace",
                    fill: "#ffffff",
                },
            });
            rightText.y = rightArrow.y + rightArrow.displayHeight / 2 - rightText.height / 2;
            container.add(rightText);
            // Right Arrow


            // Spacebar Key
            let spacebarKey = this.add.image(0, rightArrow.y + rightArrow.displayHeight + 15, CST.IMAGES.SPACEBAR)
                .setScale(.4).setOrigin(0, 0);
            container.add(spacebarKey);
            let spacebarText = this.make.text({
                x: spacebarKey.x + spacebarKey.displayWidth + 15,
                y: 0,
                origin: { x: 0, y: 0 },
                text: "Shoot Beam",
                padding: 0,
                style: {
                    font: "20px monospace",
                    fill: "#ffffff",
                },
            });
            spacebarText.y = spacebarKey.y + spacebarKey.displayHeight / 2 - spacebarText.height / 2;
            container.add(spacebarText);
            // Spacebar Key

            upText.x = upArrow.x + spacebarKey.displayWidth + 15;
            downText.x = downArrow.x + spacebarKey.displayWidth + 15;
            leftText.x = leftArrow.x + spacebarKey.displayWidth + 15;
            rightText.x = rightArrow.x + spacebarKey.displayWidth + 15;

            upText.setStroke('#fff',.2);
            upText.setShadow(0, 1, '#202020', 1, true, true);

            downText.setStroke('#fff',.2);
            downText.setShadow(0, 1, '#202020', 1, true, true);

            leftText.setStroke('#fff',.2);
            leftText.setShadow(0, 1, '#202020', 1, true, true);

            rightText.setStroke('#fff',.2);
            rightText.setShadow(0, 1, '#202020', 1, true, true);

        }/************************** End Desktop Controls *************************/

        else { /************************** Mobile Controls *************************/
            // Finger Touch
            let fingerTouch = this.add.image(0, 0, CST.IMAGES.TOUCH_FINGER).setScale(.15).setOrigin(0, 0);
            container.add(fingerTouch);
            let fingerTouchText = this.make.text({
                x: fingerTouch.x + fingerTouch.displayWidth + 15,
                y: 0,
                origin: { x: 0, y: 0 },
                text: "Shoot Beam",
                padding: 0,
                style: {
                    font: "14px monospace",
                    fill: "#ffffff",
                },
            });
            fingerTouchText.y = fingerTouch.y + fingerTouch.displayHeight / 2 - fingerTouchText.height / 2;
            container.add(fingerTouchText);
            // Finger Touch

            // Swipe Touch
            let swipeTouch = this.add.image(0, fingerTouch.y + fingerTouch.displayHeight + 15,
                CST.IMAGES.SWIPE_FINGER).setScale(.15).setOrigin(0, 0);
            container.add(swipeTouch);
            let swipeTouchText = this.make.text({
                x: swipeTouch.x + swipeTouch.displayWidth + 15,
                y: 0,
                origin: { x: 0, y: 0 },
                text: "Shoot Beam/Move Player",
                padding: 0,
                style: {
                    font: "14px monospace",
                    fill: "#ffffff",
                },
            });
            swipeTouchText.y = swipeTouch.y + swipeTouch.displayHeight / 2 - swipeTouchText.height / 2;
            container.add(swipeTouchText);
            // Swipe Touch

            fingerTouchText.x = swipeTouch.x + swipeTouch.displayWidth + 15;

            swipeTouchText.setStroke('#fff',.2);
            swipeTouchText.setShadow(0, 1, '#202020', 1, true, true);

            fingerTouchText.setStroke('#fff',.2);
            fingerTouchText.setShadow(0, 1, '#202020', 1, true, true);


        }/************************** End Mobile Controls *************************/


        //Updating container size
        this.updateSize(container);

        container.x = this.game.renderer.width / 2 - container.width / 2;
        container.y = this.game.renderer.height / 2 - container.height / 2;

        let rectG = this.add.graphics().setDepth(0);
        rectG.fillStyle(0x00000000000, .5);
        rectG.fillRect(container.x - 25, container.y - 25, container.width + 50, container.height + 50);

        //Add Back Button
        let backButton = this.add.image(this.game.renderer.width / 2, container.y - 75, CST.IMAGES.BACK_BUTTON).setScale(.5);
        backButton.setInteractive({
            useHandCursor: true
        });

        backButton.on("pointerdown", () => {
            this.scene.start(CST.SCENES.MAIN);
        });

    }

    updateSize = (con: Phaser.GameObjects.Container) => {
        //set the top position to the bottom of the game
        var top = this.game.config.height;
        var bottom = 0;
        //set the left to the right of the game
        var left = this.game.config.width;
        var right = 0;

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