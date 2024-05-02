import { Scene } from "phaser";
import { SCENES } from "@/game/types/scenes";
import { EventBus } from "@/game/EventBus";
import { GameState } from "@/game/classes/GameState";
import { GAME_EVENTS, PLAYER_EVENTS } from "@/game/types/events";
import { NAME_CHOICES } from "@/game/types/gameConstants";

export class NewGame extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    submitButton: Phaser.GameObjects.Text;
    public nameChoice: string;
    private titleText: Phaser.GameObjects.Text;
    private nameChoiceBoard: any;

    constructor() {
        super(SCENES.NewGame);
        this.nameChoice = "Jan Eator";
    }

    init() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

        EventBus.emit("current-scene-ready", this);

        this.events.on(
            Phaser.Scenes.Events.RESUME,
            () => {
                this.camera.fadeIn(500, 0, 0, 0);
            },
            this,
        );

        this.nameChoiceBoard = this.add.container(512, 250);

        this.titleText = this.add
            .text(512, 170, "Choose your Character", {
                fontFamily: "Arial Black",
                fontSize: 56,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        NAME_CHOICES.forEach((name, index) => {
            this.nameChoiceBoard.add(
                this.add
                    .text(0, index * 50, name, {
                        fontFamily: "Arial Black",
                        fontSize: 36,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                        backgroundColor: index === 0 ? "white" : "",
                    })
                    .setOrigin(0.5)
                    .setDepth(100)
                    .setInteractive()
                    .setName(name)
                    .on("pointerdown", () => this.updateNameBoard(name)),
            );
        });

        this.submitButton = this.add
            .text(512, 550, "Let's Go!", {
                fontFamily: "Arial Black",
                fontSize: 56,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);
        this.submitButton.setInteractive();
        this.submitButton.on("pointerdown", () => this.submit());
    }
    submit() {
        EventBus.emit(GAME_EVENTS.RESET);
        EventBus.emit(PLAYER_EVENTS.CHANGE_NAME, this.nameChoice);
        this.scene.start(SCENES.Overworld);
    }

    updateNameBoard(name: string) {
        this.nameChoice = name;
        this.nameChoiceBoard.list.forEach(
            (textElement: Phaser.GameObjects.Text) => {
                if (textElement.name === name) {
                    textElement.setBackgroundColor("white");
                } else {
                    textElement.setBackgroundColor("transparent");
                }
            },
        );
    }
}
