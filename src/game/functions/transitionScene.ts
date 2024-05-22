import { SCENES } from "@/game/types/scenes";

export const transitionScene = (
    transitionFromScene: Phaser.Scene,
    transitionToScene: string,
    shouldNotFade?: boolean,
    data?: any,
) => {
    if (!shouldNotFade) {
        transitionFromScene.cameras.main.fadeOut(1000, 0, 0, 0);
        transitionFromScene.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            (cam: any) => {
                if (transitionFromScene.scene.key === SCENES.Overworld) {
                    transitionFromScene.scene
                        .launch(transitionToScene, data)
                        .pause(SCENES.Overworld);
                } else {
                    transitionFromScene.scene.start(transitionToScene, data);
                }
            },
        );
    } else {
        if (transitionFromScene.scene.key === SCENES.Overworld) {
            transitionFromScene.scene
                .launch(transitionToScene, data)
                .pause(SCENES.Overworld);
        } else {
            transitionFromScene.scene.start(transitionToScene, data);
        }
    }
};

export const transitionSceneToOverworld = (
    transitionFromScene: Phaser.Scene,
    data?: any,
) => {
    transitionFromScene.cameras.main.fadeOut(1000, 0, 0, 0);
    transitionFromScene.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        (cam: any) => {
            transitionFromScene.scene.resume(SCENES.Overworld);
            transitionFromScene.scene.stop(transitionFromScene.scene.key);
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
            transitionFromScene.scene.stop(transitionFromScene.scene.key);
            transitionFromScene.scene.stop(SCENES.Overworld);
            transitionFromScene.scene.start(SCENES.Overworld);
        },
    );
};

export const cameraFadeIn = (scene: Phaser.Scene) => {
    scene.cameras.main.fadeIn(500, 0, 0, 0);
};
