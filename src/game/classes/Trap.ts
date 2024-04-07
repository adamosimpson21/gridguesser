import Hud from "@/game/classes/Hud";
import {Scene} from "phaser";
import EventDisplay from "@/game/classes/EventDisplay";

export default class Trap {
    private type: string;
    private severity: number;
    private Hud: Hud;
    private scene: Phaser.Scene;
    private eventDisplay: EventDisplay;
    
    constructor(Hud: Hud, scene:Scene, eventDisplay: EventDisplay,type: string, severity: number) {
        this.Hud = Hud;
        this.scene = scene;
        this.type = type;
        this.severity = severity;
        this.eventDisplay = eventDisplay;
    }
    
    trigger(){
        switch(this.type){
            case 'HP':
                this.Hud.updateHp(this.Hud.hp + this.severity, this.Hud.maxHp);
                if(this.severity > 0){
                    this.eventDisplay.addEvent({type: "MESSAGE", message: `Yum! You gained ${this.severity} life`}, '5000')
                } else {
                    this.eventDisplay.addEvent({type: "MESSAGE", message: `Ouch! You took ${-this.severity} damage`}, '5000')
                }
                 break;
            case 'MONEY':
                this.Hud.updateGold(this.severity);
                if(this.severity > 0){
                    this.eventDisplay.addEvent({type: "MESSAGE", message: `🥇🥇🥇 You gained ${this.severity} money`}, '5000')
                } else {
                    this.eventDisplay.addEvent({type: "MESSAGE", message: `Ouch! You lost ${-this.severity} money`}, '5000')
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