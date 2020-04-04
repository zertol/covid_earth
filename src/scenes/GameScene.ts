import { CST } from '../CST';

export class GameScene extends Phaser.Scene {

    //@ts-ignore
    private background: Phaser.GameObjects.TileSprite;
    //@ts-ignore
    private globe: Phaser.GameObjects.Image;

    constructor() {
        super({
            key: CST.SCENES.GAME
        });
    }
    preload() {

    }
    create() {
        this.background = this.add.tileSprite(0, 0, this.game.renderer.width, this.game.renderer.height, CST.IMAGES.BACKGROUND).setOrigin(0, 0).setDepth(0);
        // this.globe = this.add.image(0, 0, CST.IMAGES.GLOBE).setDepth(1);
        // Phaser.Display.Align.In.BottomCenter(this.globe, this.background);

        // this.globe = this.add.sprite(0,0,CST.IMAGES.GLOBE);
        // this.globe.
        // this.scene.add(CST.SCENES.LOAD,this.game..scene.con);
        
    }

    update() {
        this.background.tilePositionY -= 2;
    }
}