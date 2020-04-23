import { CST } from '../CST';

export default class Explosion extends Phaser.GameObjects.Sprite {

    private animation: string;
    // private fxExplosion: Phaser.Sound.BaseSound;

    constructor(scene: Phaser.Scene, x: number, y: number, name: string, animation: string) {
        super(scene, x, y, name);

        // let guid = Phaser.Math.RND.between(1, 500);
        // this.fxExplosion = scene.sound.add(CST.SOUNDS.FX_BEAM + String(guid));

        // this.once(Phaser.Animations.Events.SPRITE_ANIMATION_START, () => {
        //     this.fxExplosion.play();
        // });

        // this.once('destroy', () => {
        //     this.fxExplosion.stop();
        // });

        this.animation = animation;
        scene.add.existing(this);
        this.play(this.animation);
        scene.physics.world.enableBody(this);
    }

    update() {

    }
}