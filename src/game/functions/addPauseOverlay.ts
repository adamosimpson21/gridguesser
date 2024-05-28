import { SCENES } from "@/game/constants/scenes";

export const addPauseOverlay = (scene: Phaser.Scene) => {
    if (scene.input.keyboard) {
        scene.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes["ESC"])
            .on("down", () => {
                scene.scene.launch(SCENES.Settings);
            });
    }
};
