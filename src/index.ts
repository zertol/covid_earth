import { LoadingScene } from './scenes/LoadingScene';
import { MainScene } from './scenes/MainScene';
import { GameScene } from './scenes/GameScene';
import { ControlsScene } from './scenes/ControlsScene';
import { GamePlayScene } from './scenes/GamePlayScene';
import { OpeningScene } from './scenes/OpeningScene';
import { LeaderboardScene } from './scenes/LeaderboardScene';
import { CST } from './CST';
//@ts-ignore
import ShakePositionPlugin from 'phaser3-rex-plugins/plugins/shakeposition-plugin.js';

//Scaling manually the canvas for a better display on different devices.
let w = window.innerWidth;
let h = window.innerHeight;

if (!CST.WINDOW.ISMOBILE) {
    w = 768;
}

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
if (windowWidth > windowHeight) {
    windowWidth = windowHeight / 1.8;
}
let gameWidth = windowWidth * h / windowHeight;
//Start the game object
let game = new Phaser.Game({
    parent: 'game-container',
    height: h,
    width: gameWidth,
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
});

