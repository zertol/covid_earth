import Explosion from "./Explosion";

export default class Virus extends Phaser.GameObjects.Sprite {

    private animation: string;
    private speed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, name: string, animation: string, depth: number, speed: number) {
        super(scene, x, y, name);
        this.animation = animation;
        this.depth = depth;
        this.name = name;
        this.speed = speed;
        scene.add.existing(this);
        this.setInteractive();
        this.play(this.animation);
        scene.physics.world.enableBody(this);
    }

    //If we ever needed to differentiate between enemy textures
    getName = (): string => {
        return this.name;
    }

    //Set speed for viruses. Can be used to increase speed for each level
    setSpeed = (speed: number) => {
        this.speed = speed;
    }

    hitEarth = (explosionName: string, explosionAnimation: string): void => {
        let explosion = new Explosion(this.scene, this.x, this.y, explosionName, explosionAnimation);
        this.resetVirusPos();
    }

    moveVirus = (): void => {
        this.y += this.speed;
        this.rotation += 0.08;
        if (this.y > this.scene.game.renderer.height) {
            this.resetVirusPos();
        }
    }

    resetVirusPos = () => {
        this.y = 0;
        let randomX = (Math.floor(Math.random() * this.scene.game.renderer.width) + 10);
        this.x = randomX;
    };

    update() {

    }
}