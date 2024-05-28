import { Boot } from "./Boot";
import { GameOver } from "../GameEnd/GameOver";
import { Fight } from "../Fight/Fight";
import { MainMenu } from "./MainMenu";
import { AUTO, Game } from "phaser";
import { Preloader } from "./Preloader";
import { Overworld } from "@/game/Overworld/Overworld";
import { Hud } from "@/game/Hud/Hud";
import { Shop } from "@/game/Shop/Shop";
import { NewGame } from "@/game/PreGame/NewGame";
import { BossFight } from "@/game/Fight/BossFight";
import { GameWon } from "@/game/GameEnd/GameWon";
import { TrapOverlay } from "@/game/Trap/TrapOverlay";
import { HallOfFame } from "@/game/PreGame/HallOfFame";
import { Settings } from "@/game/Settings/Settings";

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
