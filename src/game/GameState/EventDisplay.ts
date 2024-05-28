import { UI_EVENTS } from "@/game/EventBus/events";
import { EventBus } from "../EventBus/EventBus";
import { largeText } from "@/game/constants/textStyleConstructor";

export default class EventDisplay {
    camera: Phaser.Cameras.Scene2D.Camera;
    private scene: Phaser.Scene;
    private event: { type: string; message: string };
    private fadeDelay: string;
    private displayArray: Phaser.GameObjects.Container[];
    private displayContainer: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.create();
        this.displayContainer = this.scene.add.container(50, 1020);
        this.displayArray = [] as Phaser.GameObjects.Container[];
        this.displayContainer.add(this.displayArray);
    }

    create() {
        EventBus.on(UI_EVENTS.DISPLAY_MESSAGE, this.handleDisplayMessage, this);
    }

    handleDisplayMessage(
        event: { type: string; message: string },
        fadeDelay?: string,
    ) {
        const eventContainer = this.scene.add.container(0, 0);
        const eventText = this.scene.add
            .text(30, -30, event.message, largeText({ wordWrapWidth: 450 }))
            .setOrigin(0, 1);
        const eventBackground = this.scene.add
            .image(0, 0, "clipboard")
            .setOrigin(0, 1)
            .setDisplaySize(500, eventText.height + 50);

        eventContainer.add(eventBackground);
        eventContainer.add(eventText);

        this.displayContainer.add(eventContainer);
        this.displayArray.push(eventContainer);
        this.displayArray.forEach((item, index) => {
            item.setPosition(
                0,
                index === this.displayArray.length - 1
                    ? 0
                    : (item.y -= eventBackground.displayHeight + 15),
            );
        });
        this.scene.add.tween({
            targets: eventContainer,
            duration: fadeDelay || 1000,
            delay: 2000,
            alpha: 0,
        });
    }
}
