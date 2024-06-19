import { EventBus } from "../EventBus/EventBus";
import { Scene } from "phaser";
import { SCENES } from "@/game/constants/scenes";
import { largeText } from "@/game/constants/textStyleConstructor";
import { GAME_EVENTS } from "@/game/EventBus/events";

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;
    restartGameText: Phaser.GameObjects.Text;
    gameOverFrame: Phaser.GameObjects.Image;
    private gameOverContainer: Phaser.GameObjects.Container;

    constructor() {
        super(SCENES.GameOver);
    }

    preload() {
        // this.load.image("black_screen", "/assets/blackScreen.png");
        this.load.image("clipboard", "/assets/hud/longClipboard.png");
    }

    create() {
        this.camera = this.cameras.main;

        // this.background = this.make
        //     .image({ x: 0, y: 0, key: "black_screen" })
        //     .setAlpha(0.5, 0.5)
        //     .setOrigin(0, 0)
        //     .setDisplaySize(this.scale.width, this.scale.height);

        this.gameOverContainer = this.add.container(50, 200);

        this.gameOverFrame = this.make
            .image({
                x: 0,
                y: 0,
                key: "clipboard",
            })
            .setDisplaySize(300, 600)
            .setOrigin(0, 0);
        this.gameOverFrame.setInteractive();
        this.gameOverFrame.on("pointerdown", () => {
            this.resetToMainMenu();
        });

        this.gameOverText = this.add
            .text(160, 130, "Game Over", largeText({}))
            .setOrigin(0.5);

        this.restartGameText = this.add
            .text(160, 300, "Main Menu", {
                ...largeText({}),
                backgroundColor: "white",
            })
            .setOrigin(0.5);
        this.restartGameText.setInteractive();
        this.restartGameText.on("pointerdown", () => this.resetToMainMenu());

        this.gameOverContainer.add(this.gameOverFrame);
        this.gameOverContainer.add(this.gameOverText);
        this.gameOverContainer.add(this.restartGameText);

        EventBus.emit("current-scene-ready", this);
    }
    resetToMainMenu() {
        this.scene.stop();
        EventBus.emit(GAME_EVENTS.RESET);
    }
}
