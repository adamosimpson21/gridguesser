import {Scene} from "phaser";
import FightGridCell from './FightGridCell';
import {GAME_EVENTS, PLAYER_EVENTS} from "@/game/types/events";
import {EventBus} from "@/game/EventBus";
import {Fight} from "@/game/scenes/Fight";
import {SCENES} from "@/game/types/scenes";
import {GameState} from "@/game/classes/GameState";
import GameObject = Phaser.GameObjects.GameObject;
import FightGrid from "@/game/classes/FightGrid";
import {BossFight} from "@/game/scenes/BossFight";
import {GAME_CONSTANTS} from "@/game/types/gameConstants";

export default class BossFightGrid extends FightGrid
{

    constructor (scene:BossFight, width:number, height:number, bombs:number)
    {
        super(scene, width, height, bombs);
    }
    
    gameWon() {
        if(GameState.level === GAME_CONSTANTS.endLevel){
            this.scene.transitionScene(SCENES.GameWon)
        } else {
            EventBus.emit(GAME_EVENTS.INCREMENT_LEVEL);
            this.scene.scene.stop(SCENES.Overworld);
            this.scene.transitionScene(SCENES.Overworld);
        }
    }
}