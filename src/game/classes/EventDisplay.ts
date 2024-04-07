import Phaser, {Scene} from "phaser";
import {useRef} from "react";

export default class EventDisplay {

    private scene: Phaser.Scene;
    private event: { type: string; message: string };
    private fadeDelay: string;
    
    constructor(scene: Scene) {
        this.scene = scene;
    }
    
    addEvent(event: {type: string, message: string}, fadeDelay: string){
        const eventText = this.scene.add.text(450, 200, event.message)
        console.log("you are here:", eventText)
        this.scene.add.tween({
            targets: eventText,
            duration: fadeDelay,
            alpha: 0,
        })
    }
}