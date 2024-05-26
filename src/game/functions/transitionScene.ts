import { SCENES } from "@/game/types/scenes";
import OverworldLegend from "@/game/classes/OverworldLegend";
import { EventBus } from "@/game/EventBus";
import { SCENE_EVENTS } from "@/game/types/events";
import { SettingsManager } from "@/game/classes/SettingsManager";
import { Overworld } from "@/game/scenes/Overworld";

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
                    EventBus.emit(SCENE_EVENTS.LEAVE_OVERWORLD);
                    transitionFromScene.scene
                        .launch(transitionToScene, data)
                        .pause(SCENES.Overworld);
                    SettingsManager.updateLocalStorageCurrentScene(
                        transitionFromScene,
                        transitionToScene,
                    );
                } else {
                    transitionFromScene.scene.start(transitionToScene, data);
                    SettingsManager.updateLocalStorageCurrentScene(
                        transitionFromScene,
                        transitionToScene,
                    );
                }
            },
        );
    } else {
        if (transitionFromScene.scene.key === SCENES.Overworld) {
            EventBus.emit(SCENE_EVENTS.LEAVE_OVERWORLD);
            transitionFromScene.scene
                .launch(transitionToScene, data)
                .pause(SCENES.Overworld);
            SettingsManager.updateLocalStorageCurrentScene(
                transitionFromScene,
                transitionToScene,
            );
        } else {
            transitionFromScene.scene.start(transitionToScene, data);
            SettingsManager.updateLocalStorageCurrentScene(
                transitionFromScene,
                transitionToScene,
            );
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
            EventBus.emit(SCENE_EVENTS.ENTER_OVERWORLD);
            transitionFromScene.scene.resume(SCENES.Overworld);
            transitionFromScene.scene.stop(transitionFromScene.scene.key);
            SettingsManager.updateLocalStorageCurrentScene(
                transitionFromScene,
                SCENES.Overworld,
            );
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
            SettingsManager.updateLocalStorageCurrentScene(
                transitionFromScene,
                SCENES.Overworld,
            );
            EventBus.emit(SCENE_EVENTS.ENTER_OVERWORLD);
        },
    );
};

export const abandonRunTransitionScene = (
    transitionFromScene: Phaser.Scene,
    data?: any,
) => {
    transitionFromScene.scene.stop(transitionFromScene.scene.key);
    transitionFromScene.scene.stop(SCENES.Overworld);
    transitionFromScene.scene.start(SCENES.MainMenu).launch(SCENES.Hud);
    SettingsManager.updateLocalStorageCurrentScene(
        transitionFromScene,
        SCENES.MainMenu,
    );
};

export const cameraFadeIn = (scene: Phaser.Scene) => {
    scene.cameras.main.fadeIn(500, 0, 0, 0);
};
