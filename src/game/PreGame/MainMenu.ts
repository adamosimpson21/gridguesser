import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus/EventBus";
import { SCENES } from "@/game/constants/scenes";
import { createBackground } from "@/game/functions/background";
import { mainMenuText } from "@/game/constants/textStyleConstructor";
import {
    cameraFadeIn,
    transitionScene,
    transitionSceneRehydrateCampaign,
} from "@/game/functions/transitionScene";
import { addPauseOverlay } from "@/game/functions/addPauseOverlay";
import { GAME_EVENTS, SCENE_EVENTS, UI_EVENTS } from "@/game/EventBus/events";
import { LocalStorageManager } from "@/game/Settings/LocalStorageManager";
import { SETTING_CONSTANTS } from "@/game/Settings/settingConstants";
export class MainMenu extends Scene {
    background: GameObjects.Image;
    title: Phaser.GameObjects.Image;
    overworldButton: GameObjects.Text;
    public tutorialButton: Phaser.GameObjects.Text;
    public hallOfFameButton: Phaser.GameObjects.Text;
    public settingsButton: Phaser.GameObjects.Text;
    public continueRunButton: Phaser.GameObjects.Text;

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
        addPauseOverlay(this);

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
        this.continueRunButton = this.add
            .text(
                this.scale.width / 2,
                660,
                "Continue Game",
                mainMenuText({ fontSize: "69px" }),
            )
            .setOrigin(0.5)
            .setDepth(100);
        this.continueRunButton.setInteractive();
        this.continueRunButton.on("pointerdown", () => {
            transitionSceneRehydrateCampaign(this, {
                shouldLoadData: true,
            });
            EventBus.emit(GAME_EVENTS.LOAD_CAMPAIGN);
        });

        if (
            !(
                LocalStorageManager.getItem(
                    SETTING_CONSTANTS.hasActiveCampaign,
                ) && LocalStorageManager.getCurrentCampaignItem()
            )
        ) {
            this.continueRunButton.setAlpha(0);
        }

        this.tutorialButton = this.add
            .text(
                this.scale.width / 2,
                760,
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
                830,
                "Employees of the Month",
                mainMenuText({ wordWrapWidth: 1000 }),
            )
            .setOrigin(0.5, 0.5);
        this.hallOfFameButton.setInteractive();
        this.hallOfFameButton.on("pointerdown", () => {
            this.scene.start(SCENES.HallOfFame);
        });

        this.settingsButton = this.add
            .text(
                this.scale.width / 2,
                900,
                "Settings",
                mainMenuText({ wordWrapWidth: 1000 }),
            )
            .setOrigin(0.5, 0.5);
        this.settingsButton.setInteractive();
        this.settingsButton.on("pointerdown", () => {
            this.scene.launch(SCENES.Settings);
        });

        EventBus.emit("current-scene-ready", this);

        if (LocalStorageManager.getItem(SETTING_CONSTANTS.isMobile) === false) {
            window.addEventListener("touchstart", () => {
                LocalStorageManager.setItem(SETTING_CONSTANTS.isMobile, true);
            });
        }

        this.events.on(Phaser.Scenes.Events.CREATE, () => {
            EventBus.emit(SCENE_EVENTS.ENTER_MAIN_MENU);
        });
    }
}
