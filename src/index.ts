import { LoadingScene } from './scenes/LoadingScene';
import { MainScene } from './scenes/MainScene';
import { GameScene } from './scenes/GameScene';
import {CST} from './CST';

//Scaling manually the canvas for a better display on different devices.
let w = window.innerWidth;
let h = window.innerHeight;

if (!CST.WINDOW.ISMOBILE) {
    w = 768;
}

//Start the game object
let game = new Phaser.Game({
    parent: 'game-container',
    height: h,
    width: w,
    scene: [LoadingScene, MainScene, GameScene],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    }
});