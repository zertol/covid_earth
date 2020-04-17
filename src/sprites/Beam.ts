export default class Beam extends Phaser.GameObjects.Sprite {

    private animation: string;

    constructor(scene: Phaser.Scene, x: number, y: number, name: string, animation: string, depth:number,angle : number) {
        super(scene, x, y, name);
        this.animation = animation;
        this.depth = depth;
        this.name=name;
        scene.add.existing(this);
        this.play(this.animation);
        scene.physics.world.enableBody(this);
        //@ts-ignore
        this.body.velocity.y = - 250;
         //@ts-ignore
        scene.physics.velocityFromRotation(angle, -250, this.body.velocity as Phaser.Math.Vector2);
        
    }

    update(){
        if(this.y <8) {
            this.destroy();
        }
    }
}