import { CST } from '../CST';

export class ScrollScene extends Phaser.Scene {
   
    constructor() {
        super({
            key: CST.SCENES.SCROLL
        });
    }

    preload(){
        console.log(111);
    }

    create(){
        this.make.text({
            x:0,
            y:200,
            text:" "
        })
    }
}