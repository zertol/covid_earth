import { CST } from '../CST';

export default class Explosion extends Phaser.GameObjects.Sprite {

    private animation: string;
    // private fxExplosion: Phaser.Sound.BaseSound;

    constructor(scene: Phaser.Scene, x: number, y: number, name: string, animation: string) {
        super(scene, x, y, name);

        this.animation = animation;
        scene.add.existing(this);
        //@ts-ignore
        scene.explosions.add(this);
        this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
            this.destroy();
            //@ts-ignore
            scene.explosions.remove(this);
        });

        this.once(Phaser.Animations.Events.SPRITE_ANIMATION_START, () => {
            //@ts-ignore
            scene.playExplosionSound(scene.explosions);
        });

        this.play(this.animation);
        scene.physics.world.enableBody(this);
    }

    update() {

    }
}