import {Scene} from "phaser";
import FightGridCell from './FightGridCell';
import {PLAYER_EVENTS} from "@/game/types/events";
import {EventBus} from "@/game/EventBus";
import {Fight} from "@/game/scenes/Fight";
import {SCENES} from "@/game/types/scenes";
import {GameState} from "@/game/classes/GameState";
import GameObject = Phaser.GameObjects.GameObject;
import FightGrid from "@/game/classes/FightGrid";
import {BossFight} from "@/game/scenes/BossFight";

export default class BossFightGrid extends FightGrid
{

    constructor (scene:BossFight, width:number, height:number, bombs:number)
    {
        super(scene, width, height, bombs);
    }
    
    gameWon() {
        this.scene.transitionScene(SCENES.GameWon)
    }
}