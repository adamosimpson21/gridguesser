import {EventBus} from "@/game/EventBus";
import {GAME_EVENTS, PLAYER_EVENTS, UI_EVENTS} from "@/game/types/events"
import {shopItemType} from "@/game/types/shopItems";
import {Scene} from "phaser";
import {SCENES} from "@/game/types/scenes";
import {PlayerClass} from "@/game/classes/Player";

class MissionClass{
    // stores information about current run
    
    public level: number;
    public bombIntensity: number;
    public isPlaying: boolean;
    public player: any;
    
    constructor() {
        this.level = 1;
        this.bombIntensity = 3;
        this.isPlaying = true;
        this.player = new PlayerClass();
        this.create();
    }
    
    create(){
       
    }
    
    gameOver(scene: Scene){
        this.isPlaying = false;
        console.log("you are in mission game over");
        scene.scene.stop(SCENES.Fight);
        scene.scene.start(SCENES.GameOver);
    }
    
}

export const Mission: MissionClass = new MissionClass();