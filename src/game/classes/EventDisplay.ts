import { UI_EVENTS } from "@/game/types/events";
import { EventBus } from "../EventBus";
import { largeText } from "@/game/types/textStyleConstructor";

export default class EventDisplay {
    camera: Phaser.Cameras.Scene2D.Camera;
    private scene: Phaser.Scene;
    private event: { type: string; message: string };
    private fadeDelay: string;

    constructor(scene: Phaser.Scene) {
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
            largeText({}),
        );
        this.scene.add.tween({
            targets: eventText,
            duration: fadeDelay || 3000,
            alpha: 0,
        });
    }
}
