import Explosion from "./Explosion";
import Bomb from "./Bomb";

export default class Virus extends Phaser.GameObjects.Sprite {

    private animation: string;
    private speed: number;
    private id: integer;
    private lifespan: integer;
    private bombInterval: integer;

    constructor(scene: Phaser.Scene, x: number, y: number, name: string, animation: string, depth: number, speed: number, id: integer, lifespan: integer, bombInterval: number) {
        super(scene, x, y, name);
        this.animation = animation;
        this.depth = depth;
        this.name = name;
        this.speed = speed;
        this.id = id;
        this.lifespan = lifespan;
        this.bombInterval = bombInterval;
        scene.add.existing(this);
        this.setInteractive();
        this.play(this.animation);
        scene.physics.world.enableBody(this);

    }

    //If we ever needed to differentiate between enemy textures
    getName = (): string => {
        return this.name;
    }

    //Get Virus Id
    getId = (): integer => {
        return this.id;
    }

    //Get Lifespan
    getLifeSpan = () => {
        return this.lifespan;
    }

    //Set speed for viruses. Can be used to increase speed for each level
    setSpeed = (speed: number) => {
        this.speed = speed;
    }

    hitEarth = (explosionName: string, explosionAnimation: string): void => {
        let explosion = new Explosion(this.scene, this.x, this.y, explosionName, explosionAnimation);
        this.resetVirusPos();
    }

    shootBomb = (bombName: string, bombAnimation: string, isMobile: boolean, lastBombFired: number) => {

        //To Not fire on first load
        if (lastBombFired >= this.bombInterval && (this.y <= this.scene.game.renderer.height / 2)) {
            let bomb = new Bomb(this.scene, this.x, this.y + 25, bombName, bombAnimation, 1);

            if (isMobile) {
                bomb.setScale(.3);
            }
            else {
                bomb.setScale(.4);
            }
            //@ts-ignore
            this.scene.bombs.add(bomb);
        }
        return this.bombInterval;
    }

    moveVirus = (): void => {
        this.y += this.speed;
        this.rotation += 0.08;
        if (this.y > this.scene.game.renderer.height) {
            this.resetVirusPos();
        }
    }

    resetVirusPos = (): void => {
        this.y = 0;
        //@ts-ignore
        let randomX = Math.floor(Math.random() * (this.scene.game.renderer.width - this.body.width - 21)) + this.body.width;
        this.x = randomX;
    };

    getBombInterval = (): number => {
        return this.bombInterval;
    }

    update() {

    }
}