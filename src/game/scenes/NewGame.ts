import { Scene } from "phaser";
import { SCENES } from "@/game/types/scenes";
import { EventBus } from "@/game/EventBus";
import { GameState } from "@/game/classes/GameState";
import { GAME_EVENTS, PLAYER_EVENTS } from "@/game/types/events";
import { NAME_CHOICES } from "@/game/types/gameConstants";
import { createBackground } from "@/game/functions/background";
import {
    largeText,
    mainMenuText,
    paragraphText,
} from "@/game/types/textStyleConstructor";
import {
    cameraFadeIn,
    transitionScene,
} from "@/game/functions/transitionScene";
import { addPauseOverlay } from "@/game/functions/addPauseOverlay";

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

        this.background = createBackground(this);
        cameraFadeIn(this);
        addPauseOverlay(this);

        EventBus.emit("current-scene-ready", this);

        this.events.on(
            Phaser.Scenes.Events.RESUME,
            () => {
                this.camera.fadeIn(500, 0, 0, 0);
            },
            this,
        );

        this.nameChoiceBoard = this.add.container(this.scale.width / 2, 350);

        this.titleText = this.add
            .text(
                this.scale.width / 2,
                200,
                "Choose your Character",
                mainMenuText({ fontSize: "69px", wordWrapWidth: 1500 }),
            )
            .setOrigin(0.5)
            .setDepth(100);

        NAME_CHOICES.forEach((name, index) => {
            this.nameChoiceBoard.add(
                this.add
                    .text(0, index * 80, name, {
                        backgroundColor: index === 0 ? "#ECA127" : "",
                        ...largeText({}),
                    })
                    .setOrigin(0.5)
                    .setDepth(100)
                    .setInteractive()
                    .setName(name)
                    .on("pointerdown", () => this.updateNameBoard(name)),
            );
        });

        this.submitButton = this.add
            .text(
                this.scale.width / 2,
                850,
                "Begin Sweepin'",
                mainMenuText({ fontSize: "69px" }),
            )
            .setOrigin(0.5)
            .setDepth(100);
        this.submitButton.setInteractive();
        this.submitButton.on("pointerdown", () => this.submit());
    }
    submit() {
        EventBus.emit(GAME_EVENTS.RESET);
        EventBus.emit(PLAYER_EVENTS.CHANGE_NAME, this.nameChoice);
        transitionScene(this, SCENES.Overworld);
    }

    updateNameBoard(name: string) {
        this.nameChoice = name;
        this.nameChoiceBoard.list.forEach(
            (textElement: Phaser.GameObjects.Text) => {
                if (textElement.name === name) {
                    textElement.setBackgroundColor("#ECA127");
                } else {
                    textElement.setBackgroundColor("transparent");
                }
            },
        );
    }
}
