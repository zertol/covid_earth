export default class Explosion extends Phaser.GameObjects.Sprite {

    private animation: string;

    constructor(scene: Phaser.Scene, x: number, y: number, name: string, animation: string) {
        super(scene, x, y, name);
        this.animation = animation;
        scene.add.existing(this);
        this.play(this.animation);
        scene.physics.world.enableBody(this);
        
        let localScope = this;
        this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
            localScope.destroy();
        })
    }

    update(){
        
    }
}