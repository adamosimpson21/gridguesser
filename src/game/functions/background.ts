import { Scene } from "phaser";
import { Overworld } from "@/game/scenes/Overworld";

export const createBackground = (scene: any) => {
    const background = scene.add.image(
        scene.scale.width / 2,
        scene.scale.height / 2,
        "background",
    );
    // background.setAlpha(0.5);
    return background;
};
