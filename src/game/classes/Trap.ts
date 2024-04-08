import HudDisplay from "@/game/classes/HudDisplay";
import {Scene} from "phaser";
import EventDisplay from "@/game/classes/EventDisplay";
import {Hud} from "@/game/scenes/Hud";
import {EventBus} from "@/game/EventBus";
import {PLAYER_EVENTS} from "@/game/types/events";

export default class Trap {
    private type: string;
    private severity: number;
    private scene: Phaser.Scene;
    private eventDisplay: EventDisplay;
    
    constructor(scene:Scene, type: string, severity: number) {
        this.scene = scene;
        this.type = type;
        this.severity = severity;
        
    }
    
    trigger(){
        console.log('triggered trap', this.type, this.severity);
        switch(this.type){
            case 'HP':
                if(this.severity > 0){
                    EventBus.emit(PLAYER_EVENTS.GAIN_HP, this.severity)
                } else {
                    console.log("you are in lose hp")
                    EventBus.emit(PLAYER_EVENTS.LOSE_HP, this.severity)
                }
                 break;
            case 'MONEY':
                if(this.severity > 0){
                    EventBus.emit(PLAYER_EVENTS.GAIN_GOLD, this.severity)
                } else {
                    console.log("you are in lose gold")
                    EventBus.emit(PLAYER_EVENTS.LOSE_GOLD, this.severity)
                }
                break;
            default:
                break;
        }
    }
    
    getTrapInfo(){
        return({type: this.type, severity: this.severity})
    }
}