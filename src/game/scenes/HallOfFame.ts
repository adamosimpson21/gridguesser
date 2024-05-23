import { Scene } from "phaser";
import { SCENES } from "@/game/types/scenes";
import { mainMenuText } from "@/game/types/textStyleConstructor";
import { createBackground } from "@/game/functions/background";
import {
    cameraFadeIn,
    transitionScene,
} from "@/game/functions/transitionScene";
import { addPauseOverlay } from "@/game/functions/addPauseOverlay";

export class HallOfFame extends Scene {
    private background: any;
    constructor() {
        super(SCENES.HallOfFame);
    }

    create() {
        this.background = createBackground(this);
        cameraFadeIn(this);
        addPauseOverlay(this);
        const returnButton = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 2,
                "Return to Main Menu",
                mainMenuText({ wordWrapWidth: 800 }),
            )
            .setOrigin(0.5, 0.5);
        returnButton.setInteractive();
        returnButton.on("pointerdown", () => {
            transitionScene(this, SCENES.MainMenu);
        });
    }
}
