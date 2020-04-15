import { LoadingScene } from './scenes/LoadingScene';
import { MainScene } from './scenes/MainScene';
import { GameScene } from './scenes/GameScene';
import { CST } from './CST';
//@ts-ignore
import ShakePositionPlugin from 'phaser3-rex-plugins/plugins/shakeposition-plugin.js';

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
            debug: true
        },
    },
    plugins: {
        global: [{
            key: 'rexShakePosition',
            plugin: ShakePositionPlugin,
            start: true
        }]
    },
    type: Phaser.CANVAS
});