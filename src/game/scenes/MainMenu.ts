import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";
import { SCENES } from "@/game/types/scenes";
import { createBackground } from "@/game/functions/background";
import { mainMenuText } from "@/game/types/textStyleConstructor";
import {
    cameraFadeIn,
    transitionScene,
} from "@/game/functions/transitionScene";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    title: Phaser.GameObjects.Image;
    overworldButton: GameObjects.Text;
    fightSceneButton: GameObjects.Text;
    private tutorialButton: Phaser.GameObjects.Text;
    public hallOfFameButton: Phaser.GameObjects.Text;

    constructor() {
        super(SCENES.MainMenu);
    }

    preload() {
        this.load.image("title_logo", "/assets/titleLogo.png");
    }

    create() {
        this.background = createBackground(this);
        this.title = this.add
            .image(this.scale.width / 2, 250, "title_logo")
            .setDisplaySize(1400, 400)
            .setOrigin(0.5)
            .setDepth(100);
        cameraFadeIn(this);

        this.overworldButton = this.add
            .text(
                this.scale.width / 2,
                560,
                "New Game",
                mainMenuText({ fontSize: "69px" }),
            )
            .setOrigin(0.5)
            .setDepth(100);
        this.overworldButton.setInteractive();
        this.overworldButton.on("pointerdown", () =>
            transitionScene(this, SCENES.NewGame),
        );

        this.tutorialButton = this.add
            .text(
                this.scale.width / 2,
                700,
                "Minesweeper Tutorial",
                mainMenuText({ wordWrapWidth: 800 }),
            )
            .setOrigin(0.5)
            .setDepth(100);
        this.tutorialButton.setInteractive();
        this.tutorialButton.on(
            "pointerdown",
            () =>
                (window.location.href =
                    "https://minesweepergame.com/strategy/how-to-play-minesweeper.php"),
        );

        this.hallOfFameButton = this.add
            .text(
                this.scale.width / 2,
                800,
                "Employees of the Month",
                mainMenuText({ wordWrapWidth: 1000 }),
            )
            .setOrigin(0.5, 0.5);
        this.hallOfFameButton.setInteractive();
        this.hallOfFameButton.on("pointerdown", () => {
            this.scene.start(SCENES.HallOfFame);
        });

        // this.fightSceneButton = this.add
        //     .text(this.scale.width/2, 580, "Go To Fight", {
        //         fontFamily: "Arial Black",
        //         fontSize: 38,
        //         color: "#ffffff",
        //         stroke: "#000000",
        //         strokeThickness: 8,
        //         align: "center",
        //     })
        //     .setOrigin(0.5)
        //     .setDepth(100);
        // this.fightSceneButton.setInteractive();
        // this.fightSceneButton.on("pointerdown", () =>
        //     this.scene.start(SCENES.Fight),
        // );

        EventBus.emit("current-scene-ready", this);
    }
}
