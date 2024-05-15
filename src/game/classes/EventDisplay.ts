import Phaser, { Scene } from "phaser";
import { useRef } from "react";
import { UI_EVENTS } from "@/game/types/events";
import { EventBus } from "../EventBus";

export default class EventDisplay {
    camera: Phaser.Cameras.Scene2D.Camera;
    private scene: Phaser.Scene;
    private event: { type: string; message: string };
    private fadeDelay: string;

    constructor(scene: Scene) {
        this.scene = scene;
        this.create();
    }

    create() {
        EventBus.on(UI_EVENTS.DISPLAY_MESSAGE, this.handleDisplayMessage, this);
    }

    handleDisplayMessage(
        event: { type: string; message: string },
        fadeDelay?: string,
    ) {
        const eventText = this.scene.add.text(
            50,
            this.scene.scale.height / 2 + Phaser.Math.Between(350, 500),
            event.message,

            {
                fontSize: 48,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
                align: "center",

                wordWrap: { width: 450, useAdvancedWrap: true },
            },
        );
        this.scene.add.tween({
            targets: eventText,
            duration: fadeDelay || 3000,
            alpha: 0,
        });
    }
}
