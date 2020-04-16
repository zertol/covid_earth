export default class Shield extends Phaser.Physics.Arcade.Sprite {

    private animation: string;

    constructor(scene: Phaser.Scene, x: number, y: number, name: string, animation: string,parent: any) {
        super(scene, x, y, name);
        this.animation = animation;
        this.alpha = 1;
        scene.add.existing(this);
        this.play(this.animation);
        scene.physics.world.enableBody(this);
        parent.add(this);
    }

    getShieldPercentage = (): number  => this.alpha;

    decreaseShieldAlpha = (newValue : number): void =>{
        this.alpha -= newValue;
        if (this.alpha <= 0) this.destroy();
    }

    update(){
        
    }
}