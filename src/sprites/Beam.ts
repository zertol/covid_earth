export default class Beam extends Phaser.GameObjects.Sprite {

    private animation: string;

    constructor(scene: Phaser.Scene, x: number, y: number, name: string, animation: string, depth:number) {
        super(scene, x, y, name);
        this.animation = animation;
        this.depth = depth;
        scene.add.existing(this);
        this.play(this.animation);
        scene.physics.world.enableBody(this);
        //@ts-ignore
        this.setVelocity(-250);
    }

    update(){
        if(this.y < 8) {
            this.destroy();
        }
    }
}