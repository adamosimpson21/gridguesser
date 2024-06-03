import { Hud } from "@/game/Hud/Hud";
import { FIGHT_CONSTANTS } from "@/game/Fight/fightConstants";
import { paragraphText } from "@/game/constants/textStyleConstructor";
import { EventBus } from "@/game/EventBus/EventBus";
import { SCENE_EVENTS } from "@/game/EventBus/events";

export default class OverworldLegend {
    private scene: Hud;
    private inputBoard: Phaser.GameObjects.Container;
    constructor(scene: Hud) {
        this.scene = scene;

        this.inputBoard = scene.add.container(
            scene.scale.width - 350,
            Math.floor(scene.scale.height / 2 + 100),
        );

        this.populateInputBoard();
        this.hide();

        EventBus.on(SCENE_EVENTS.ENTER_OVERWORLD, this.show, this);
        EventBus.on(SCENE_EVENTS.LEAVE_OVERWORLD, this.hide, this);
        EventBus.on(SCENE_EVENTS.ENTER_MAIN_MENU, this.hide, this);
    }

    populateInputBoard() {
        this.inputBoard.add(
            this.scene.add
                .image(0, 0, "white_border")
                .setOrigin(0, 0)
                .setDisplaySize(32, 32),
        );
        this.inputBoard.add(
            this.scene.add
                .image(0, 64, "green_border")
                .setOrigin(0, 0)
                .setDisplaySize(32, 32),
        );
        this.inputBoard.add(
            this.scene.add
                .image(0, 128, "yellow_border")
                .setOrigin(0, 0)
                .setDisplaySize(32, 32),
        );
        this.inputBoard.add(
            this.scene.add
                .image(0, 192, "orange_border")
                .setOrigin(0, 0)
                .setDisplaySize(32, 32),
        );
        this.inputBoard.add(
            this.scene.add
                .image(0, 256, "red_border")
                .setOrigin(0, 0)
                .setDisplaySize(32, 32),
        );

        this.inputBoard.add(
            this.scene.add.text(48, 0, "Empty Hallway", paragraphText({})),
        );
        this.inputBoard.add(
            this.scene.add.text(48, 64, "Shop", paragraphText({})),
        );
        this.inputBoard.add(
            this.scene.add.text(48, 128, "Mystery", paragraphText({})),
        );
        this.inputBoard.add(
            this.scene.add.text(48, 192, "Dirty Office", paragraphText({})),
        );
        this.inputBoard.add(
            this.scene.add.text(48, 256, "Boss's Office", paragraphText({})),
        );
    }

    public hide() {
        this.inputBoard.setAlpha(0);
    }

    public show() {
        this.inputBoard.setAlpha(1);
    }
}
