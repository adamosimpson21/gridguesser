import { Scene } from "phaser";
import { trapOutcomeType, trapType } from "@/game/Trap/trapConstants";
import { SCENES } from "@/game/constants/scenes";
import { GameState } from "@/game/GameState/GameState";
import { EventBus } from "@/game/EventBus/EventBus";
import { PLAYER_EVENTS } from "@/game/EventBus/events";
import {
    headingText,
    paragraphText,
} from "@/game/constants/textStyleConstructor";
import { transitionSceneToOverworld } from "@/game/functions/transitionScene";

export default class TrapDisplay {
    public scene: Phaser.Scene;
    public height: number;
    public width: number;
    public trap: trapType;
    public trapBoard: Phaser.GameObjects.Container;
    public background: Phaser.GameObjects.Image;
    public closeButton: Phaser.GameObjects.Text;
    public dialogBox: Phaser.GameObjects.Container;
    public riskyButton: Phaser.GameObjects.Text;
    public safeButton: Phaser.GameObjects.Text;
    public dialogDescriptionText: Phaser.GameObjects.Text;

    constructor(scene: Scene, trap: trapType) {
        this.scene = scene;
        this.trap = trap;

        this.trapBoard = scene.add.container(400, 100);
        this.background = this.scene.add
            .image(0, 0, trap.background)
            .setOrigin(0, 0)
            .setScale(0.8, 0.8);

        this.dialogBox = scene.add.container(250, 250);
        this.dialogBox.add(
            scene.add
                .image(-50, -100, "clipboard")
                .setDisplaySize(600, 600)
                .setAlpha(1)
                .setOrigin(0, 0),
        );

        this.dialogDescriptionText = scene.add.text(
            0,
            0,
            trap.description,
            paragraphText({ wordWrapWidth: 500 }),
        );
        this.dialogBox.add(this.dialogDescriptionText);

        this.riskyButton = scene.add.text(
            0,
            300,
            this.trap.options[0].text,
            paragraphText({ wordWrapWidth: 500 }),
        );
        this.riskyButton.setInteractive();
        this.riskyButton.on("pointerdown", this.riskyAction, this);

        this.safeButton = scene.add.text(
            0,
            400,
            this.trap.options[1].text,
            paragraphText({ wordWrapWidth: 500 }),
        );
        this.safeButton.setInteractive();
        this.safeButton.on("pointerdown", this.safeAction, this);

        this.dialogBox.add(this.riskyButton);
        this.dialogBox.add(this.safeButton);

        this.trapBoard.add(this.background);
        this.trapBoard.add(this.dialogBox);
    }

    closeTrap() {
        transitionSceneToOverworld(this.scene);
    }

    riskyAction() {
        const rngCall = Phaser.Math.FloatBetween(0, 1);
        // player luck is usually between -1 and 1, trap luck factor is between 0 and 1, rngcall is between 0 and 1
        if (
            GameState.luck * this.trap.luckFactor + rngCall >
            this.trap.options[0].outcomes[0].chance / 100
        ) {
            this.parseOutcome(this.trap.options[0].outcomes[0]);
        } else {
            this.parseOutcome(this.trap.options[0].outcomes[1]);
        }
        this.concludeTrap();
    }

    safeAction() {
        this.parseOutcome(this.trap.options[1].outcomes[0]);
        this.concludeTrap();
    }

    concludeTrap() {
        this.riskyButton.destroy();
        this.safeButton.destroy();
        this.makeCloseButton();
    }

    makeCloseButton() {
        this.closeButton = this.scene.add
            .text(0, 400, "Back to Sweepin'", {
                ...headingText({ wordWrapWidth: 500 }),
                backgroundColor: "lightgray",
            })
            .setInteractive()
            .on("pointerdown", this.closeTrap, this);

        this.dialogBox.add(this.closeButton);
    }

    parseOutcome(trapOutCome: trapOutcomeType) {
        const trapEffects = Object.entries(trapOutCome.effect);
        trapEffects.forEach((effect) => {
            const severity = effect[1];
            switch (effect[0]) {
                case "gold":
                    if (typeof severity === "number" && severity > 0) {
                        EventBus.emit(PLAYER_EVENTS.GAIN_GOLD, severity, true);
                    } else {
                        EventBus.emit(PLAYER_EVENTS.LOSE_GOLD, -severity, true);
                    }
                    break;
                case "health":
                    if (typeof severity === "number" && severity > 0) {
                        EventBus.emit(PLAYER_EVENTS.GAIN_HP, severity, true);
                    } else {
                        EventBus.emit(PLAYER_EVENTS.LOSE_HP, -severity, true);
                    }
                    break;
                case "maxHp":
                    if (typeof severity === "number" && severity > 0) {
                        EventBus.emit(
                            PLAYER_EVENTS.GAIN_MAX_HP,
                            severity,
                            true,
                        );
                    } else {
                        EventBus.emit(
                            PLAYER_EVENTS.LOSE_MAX_HP,
                            -severity,
                            true,
                        );
                    }
                    break;
                case "bombNum":
                    if (typeof severity === "number") {
                        GameState.bombNum += severity;
                    }
                    break;
                case "fightGridSize":
                    if (typeof severity === "number") {
                        GameState.fightGridWidth += severity;
                        GameState.fightGridHeight += severity;
                    }
                    break;
                case "luck":
                    if (typeof severity === "number") {
                        GameState.luck += severity;
                    }
                    break;
                case "item":
                    EventBus.emit(PLAYER_EVENTS.LOSE_UPGRADE, severity, true);
                    break;
                default:
                    break;
            }
        });
        this.dialogDescriptionText.setText(trapOutCome.text);
    }
}
