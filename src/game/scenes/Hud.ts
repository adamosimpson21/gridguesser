
import { Scene } from 'phaser';
import {SCENES} from "@/game/types/scenes";
import EventDisplay from "@/game/classes/EventDisplay";
import HudDisplay from "@/game/classes/HudDisplay";
import {EventBus} from "@/game/EventBus";
export class Hud extends Scene {

    camera: Phaser.Cameras.Scene2D.Camera;
    public eventDisplay: EventDisplay;
    public HudDisplay: HudDisplay;

    constructor ()
    {
        super(SCENES.Hud);
    }
    
    create(){
        this.HudDisplay = new HudDisplay(this, 'Starting Name', 5, 5, 5);
        this.eventDisplay = new EventDisplay(this);
        EventBus.emit('current-scene-ready', this);
    }
}