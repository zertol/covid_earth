import { LoadingScene } from './scenes/LoadingScene';

let game = new Phaser.Game({
    scale: {
        parent: 'game-container',
        mode: Phaser.Scale.FIT
    },
    scene: [LoadingScene]
})