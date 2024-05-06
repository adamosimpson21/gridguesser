import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { SCENES } from "@/game/types/scenes";
import { createBackground } from "@/game/functions/background";

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;
    restartGameText: Phaser.GameObjects.Text;

    constructor() {
        super(SCENES.GameOver);
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);

        this.background = createBackground(this);

        this.gameOverText = this.add
            .text(800, 400, "Game Over", {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.restartGameText = this.add
            .text(800, 600, "Go To Main Menu", {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);
        this.restartGameText.setInteractive();
        this.restartGameText.on("pointerdown", () => this.resetToMainMenu());

        EventBus.emit("current-scene-ready", this);
    }
    resetToMainMenu() {
        this.scene.switch(SCENES.MainMenu);
    }
}
