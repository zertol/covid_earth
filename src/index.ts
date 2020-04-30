import { LoadingScene } from './scenes/LoadingScene';
import { MainScene } from './scenes/MainScene';
import { GameScene } from './scenes/GameScene';
import { ControlsScene } from './scenes/ControlsScene';
import { GamePlayScene } from './scenes/GamePlayScene';
import { OpeningScene } from './scenes/OpeningScene';
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
    audio: {
        disableWebAudio: true
    },
    scene: [LoadingScene, MainScene, GameScene, ControlsScene, GamePlayScene, OpeningScene],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        },
    },
    plugins: {
        global: [{
            key: 'rexShakePosition',
            plugin: ShakePositionPlugin,
            start: true
        }]
    },
    //@ts-ignore
    clearBeforeRender: false,
    type: Phaser.WEBGL,
    multiTexture: true
});