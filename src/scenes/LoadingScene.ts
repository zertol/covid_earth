import { CST } from '../CST';

export class LoadingScene extends Phaser.Scene{
    constructor() {
        super({
            key: CST.SCENES.LOAD
        })
    }

    preload(){
        console.log("Working");
    }
}