import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import {Fight} from './scenes/Fight';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import {Overworld} from "@/game/scenes/Overworld";
import {Hud} from "@/game/scenes/Hud";
import SceneWatcherPlugin from '../../';

//  Find out more information about the Fight Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    render: {
        antialiasGL: false,
        pixelArt: true,
    }, 
    autoFocus: true,
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Overworld,
        GameOver,
        Fight,
        Hud
        
    ],
    plugins: {
        global: [
            { key: 'SceneWatcher', plugin: SceneWatcherPlugin, start: true }
        ]
    },
    callbacks: {
        postBoot: function (game) {
            // @ts-ignore
            game.plugins.get('SceneWatcher').watchAll();
        }
    }
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
