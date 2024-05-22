import { SCENES } from "@/game/types/scenes";

export const transitionScene = (
    transitionFromScene: Phaser.Scene,
    transitionToScene: string,
    data?: any,
) => {
    transitionFromScene.cameras.main.fadeOut(1000, 0, 0, 0);
    transitionFromScene.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        (cam: any) => {
            if (transitionToScene === SCENES.Overworld) {
                transitionFromScene.scene
                    .launch(transitionToScene, data)
                    .pause(SCENES.Overworld);
            } else {
                transitionFromScene.scene.start(transitionToScene, data);
            }
        },
    );
};

export const transitionSceneToOverworld = (
    transitionFromScene: Phaser.Scene,
    data?: any,
) => {
    transitionFromScene.cameras.main.fadeOut(1000, 0, 0, 0);
    transitionFromScene.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        (cam: any) => {
            transitionFromScene.scene.stop(transitionFromScene);
            transitionFromScene.scene.resume(SCENES.Overworld);
        },
    );
};

export const transitionSceneToOverworldFromBoss = (
    transitionFromScene: Phaser.Scene,
    data?: any,
) => {
    transitionFromScene.cameras.main.fadeOut(1000, 0, 0, 0);
    transitionFromScene.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        (cam: any) => {
            transitionFromScene.scene.stop(transitionFromScene);
            transitionFromScene.scene.stop(SCENES.Overworld);
            transitionFromScene.scene.start(SCENES.Overworld);
        },
    );
};

export const cameraFadeIn = (scene: Phaser.Scene) => {
    scene.cameras.main.fadeIn(500, 0, 0, 0);
};
