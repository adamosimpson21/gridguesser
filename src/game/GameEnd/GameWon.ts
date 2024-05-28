import { EventBus } from "../EventBus/EventBus";
import { Scene } from "phaser";
import { SCENES } from "@/game/constants/scenes";
import { createBackground } from "@/game/functions/background";
import { cameraFadeIn } from "@/game/functions/transitionScene";
import { addPauseOverlay } from "@/game/functions/addPauseOverlay";
import { mainMenuText } from "@/game/constants/textStyleConstructor";
import { GAME_EVENTS } from "@/game/EventBus/events";

export class GameWon extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;

    constructor() {
        super(SCENES.GameWon);
    }
    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);
        cameraFadeIn(this);
        addPauseOverlay(this);

        this.background = createBackground(this);

        this.gameOverText = this.add
            .text(
                712,
                384,
                "🏆🏆🏆🏆🏆 Game Won. You Win! 🥳🥳🥳🥳🥳",
                mainMenuText({ wordWrapWidth: 1500 }),
            )
            .setOrigin(0.5);

        this.gameOverText = this.add
            .text(712, 684, "Go To Main Menu", mainMenuText({}))
            .setOrigin(0.5);
        this.gameOverText.setInteractive();
        this.gameOverText.on("pointerdown", () => this.resetToMainMenu());

        EventBus.emit("current-scene-ready", this);
    }

    resetToMainMenu() {
        this.scene.stop();
        EventBus.emit(GAME_EVENTS.RESET);
    }
}
