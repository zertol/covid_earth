export default class PowerUp extends Phaser.Physics.Arcade.Sprite {

    private animation: string;
    private scope : Phaser.Physics.Arcade.Sprite;
    private speed: number;
    
    constructor(scene: Phaser.Scene, x: number, y: number, name: string, animation: string, depth:number, speed: number) {
        super(scene, x, y, name);
        this.scope = this;
        this.animation = animation;
        this.depth = depth;
        this.speed = speed;
        scene.add.existing(this);
        this.setInteractive();
        this.play(this.animation);
        scene.physics.world.enableBody(this);
    }

    movePowerUp = (): void => {
        this.y += this.speed;
        this.rotation += 0.08;
        if (this.y > this.scene.game.renderer.height) {
            this.disablePowerUp();
        }
    }

    disablePowerUp = (): void => {
        this.disableBody(true,true);
    }

    update() {
    }
}