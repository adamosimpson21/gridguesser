import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Fight } from "./scenes/Fight";
import { MainMenu } from "./scenes/MainMenu";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";
import { Overworld } from "@/game/scenes/Overworld";
import { Hud } from "@/game/scenes/Hud";
import { Shop } from "@/game/scenes/Shop";
import { NewGame } from "@/game/scenes/NewGame";
import { BossFight } from "@/game/scenes/BossFight";
import { GameWon } from "@/game/scenes/GameWon";
import { TrapOverlay } from "@/game/scenes/TrapOverlay";
import { HallOfFame } from "@/game/scenes/HallOfFame";
import { Settings } from "@/game/scenes/Settings";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1920,
    height: 1080,
    parent: "game-container",
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    render: {
        antialiasGL: false,
        pixelArt: true,
        roundPixels: true,
    },
    autoFocus: true,
    // callbacks: {
    //     preBoot: console.trace,
    // },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
        Boot,
        Preloader,
        Overworld,
        TrapOverlay,
        GameWon,
        Shop,
        Fight,
        BossFight,
        Hud,
        HallOfFame,
        NewGame,
        MainMenu,
        GameOver,
        Settings,
    ],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
