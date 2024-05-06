import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";
import { SCENES } from "@/game/types/scenes";
import { createBackground } from "@/game/functions/background";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    title: GameObjects.Text;
    overworldButton: GameObjects.Text;
    fightSceneButton: GameObjects.Text;

    constructor() {
        super(SCENES.MainMenu);
    }

    create() {
        this.background = createBackground(this);
        this.title = this.add
            .text(this.scale.width / 2, 250, "Broom Sweeper", {
                fontFamily: "Arial Black",
                fontSize: 96,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.overworldButton = this.add
            .text(this.scale.width / 2, 560, "New Game", {
                fontFamily: "Arial Black",
                fontSize: 96,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);
        this.overworldButton.setInteractive();
        this.overworldButton.on("pointerdown", () =>
            this.scene.start(SCENES.NewGame),
        );

        this.overworldButton = this.add
            .text(this.scale.width / 2, 700, "Minesweeper Tutorial", {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);
        this.overworldButton.setInteractive();
        this.overworldButton.on(
            "pointerdown",
            () =>
                (window.location.href =
                    "https://minesweepergame.com/strategy/how-to-play-minesweeper.php"),
        );

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
