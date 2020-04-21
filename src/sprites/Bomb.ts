export default class Bomb extends Phaser.GameObjects.Sprite {

    private animation: string;

    constructor(scene: Phaser.Scene, x: number, y: number, name: string, animation: string, depth: number) {
        super(scene, x, y, name);
        this.animation = animation;
        this.depth = depth;
        this.name = name;

        scene.add.existing(this);
        this.play(this.animation);
        scene.physics.world.enableBody(this);

    }

    update() {
        //@ts-ignore
        this.body.velocity.y = 300;
        this.rotation += 0.08;
    }
}