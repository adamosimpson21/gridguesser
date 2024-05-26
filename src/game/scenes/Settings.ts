import { SCENES } from "@/game/types/scenes";
import { Scene } from "phaser";
import { EventBus } from "@/game/EventBus";
import { SettingsManager } from "@/game/classes/SettingsManager";
import { LocalStorageManager } from "@/game/classes/LocalStorageManager";
import { paragraphText } from "@/game/types/textStyleConstructor";
import { SETTING_CONSTANTS } from "@/game/types/settingConstants";
import { GAME_EVENTS } from "@/game/types/events";
import {
    abandonRunTransitionScene,
    transitionScene,
} from "@/game/functions/transitionScene";

export class Settings extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    public settingsFrame: Phaser.GameObjects.Image;
    public volumeButton: Phaser.GameObjects.Text;
    public volumeNumber: Phaser.GameObjects.Text;
    private controlContainer: Phaser.GameObjects.Container;

    constructor() {
        super(SCENES.Settings);
    }

    preload() {
        this.load.image("black_screen", "/assets/blackScreen.png");
        this.load.image("clipboard", "/assets/hud/longClipboard.png");
    }

    create() {
        this.camera = this.cameras.main;

        this.background = this.make
            .image({ x: 0, y: 0, key: "black_screen" })
            .setAlpha(0.5, 0.5)
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height);

        this.background.setInteractive();
        this.background.on("pointerdown", () => {
            this.scene.stop(SCENES.Settings);
        });

        this.settingsFrame = this.make
            .image({
                x: this.scale.width / 2,
                y: this.scale.height / 2,
                key: "clipboard",
            })
            .setDisplaySize(800, 600);
        this.settingsFrame.setInteractive();

        this.controlContainer = this.add.container(
            this.scale.width / 2 - 325,
            this.scale.height / 2 - 225,
        );

        this.createVolume();
        this.createInputHint();
        this.createMobileControls();
        this.createGoToMainMenuButton();

        EventBus.emit("current-scene-ready", this);
    }

    createVolume() {
        const volumeButton = this.make.text({
            x: 0,
            y: 0,
            text: `Volume:`,
            style: paragraphText({}),
        });
        const volumeNumber = this.make.text({
            x: 100,
            y: 0,
            text: `${SettingsManager.volumeLevel}`,
            style: paragraphText({}),
        });
        volumeNumber.setInteractive();
        volumeNumber.on("pointerdown", () => {
            SettingsManager.volumeLevel = 50;
            volumeNumber.setText(`${SettingsManager.volumeLevel}`);
            LocalStorageManager.setItem(SETTING_CONSTANTS.volumeLevel, 50);
        });

        this.controlContainer.add(volumeButton);
        this.controlContainer.add(volumeNumber);
    }

    createInputHint() {
        const inputHintText = this.make.text({
            x: 0,
            y: 100,
            text: `Input Hint:`,
            style: paragraphText({}),
        });
        const inputHintCheckbox = this.make.text({
            x: 200,
            y: 100,
            text: SettingsManager.inputHint ? "✅" : "⛔",
            style: paragraphText({}),
        });
        inputHintCheckbox.setInteractive();
        inputHintCheckbox.on("pointerdown", () => {
            SettingsManager.inputHint = !SettingsManager.inputHint;
            inputHintCheckbox.setText(SettingsManager.inputHint ? "✅" : "⛔");
            console.log("inputhint:", SettingsManager.inputHint);
            LocalStorageManager.setItem(
                SETTING_CONSTANTS.inputHint,
                SettingsManager.inputHint,
            );
        });

        this.controlContainer.add(inputHintText);
        this.controlContainer.add(inputHintCheckbox);
    }

    createMobileControls() {
        const mobileControlsText = this.make.text({
            x: 0,
            y: 200,
            text: `Mobile Controls:`,
            style: paragraphText({}),
        });
        const mobileControlsCheckbox = this.make.text({
            x: 250,
            y: 200,
            text: SettingsManager.mobileControls ? "✅" : "⛔",
            style: paragraphText({}),
        });
        mobileControlsCheckbox.setInteractive();
        mobileControlsCheckbox.on("pointerdown", () => {
            SettingsManager.mobileControls = !SettingsManager.mobileControls;
            mobileControlsCheckbox.setText(
                SettingsManager.mobileControls ? "✅" : "⛔",
            );
            console.log("inputhint:", SettingsManager.mobileControls);
            LocalStorageManager.setItem(
                SETTING_CONSTANTS.mobileControls,
                SettingsManager.mobileControls,
            );
        });

        this.controlContainer.add(mobileControlsText);
        this.controlContainer.add(mobileControlsCheckbox);
    }

    createGoToMainMenuButton() {
        const abandonRunText = this.make.text({
            x: 0,
            y: 300,
            text: `Abandon Run:`,
            style: paragraphText({}),
        });
        const abandonRunSymbol = this.make.text({
            x: 250,
            y: 300,
            text: "☠",
            style: paragraphText({}),
        });
        abandonRunText.setInteractive();
        abandonRunText.on("pointerdown", () => {
            // this.scene.stop();
            EventBus.emit(GAME_EVENTS.ABANDON_RUN);
            abandonRunTransitionScene(this);
        });
        abandonRunSymbol.setInteractive();
        abandonRunSymbol.on("pointerdown", () => {
            // this.scene.stop();
            EventBus.emit(GAME_EVENTS.ABANDON_RUN);
            abandonRunTransitionScene(this);
        });

        this.controlContainer.add(abandonRunText);
        this.controlContainer.add(abandonRunSymbol);
    }
}
