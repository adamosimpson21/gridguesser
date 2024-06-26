import { LocalStorageManager } from "@/game/Settings/LocalStorageManager";
import { SETTING_CONSTANTS } from "@/game/Settings/settingConstants";
import { SCENES } from "@/game/constants/scenes";
import { Overworld } from "@/game/Overworld/Overworld";
import { GameState } from "@/game/GameState/GameState";
import OverworldGrid from "@/game/Overworld/OverworldGrid";
import OverworldCell from "@/game/Overworld/OverworldCell";
import { EventBus } from "@/game/EventBus/EventBus";
import { GAME_EVENTS, SCENE_EVENTS } from "@/game/EventBus/events";

class SettingsManagerClass {
    public volumeLevel: number;
    public inputHint: boolean;
    public mobileControls: boolean;
    constructor() {
        this.volumeLevel = 100;
        this.inputHint = true;
        this.mobileControls = false;

        this.initializeLocalStorage();

        window.onbeforeunload = () => {
            this.onBeforeUnload();
        };
        EventBus.on(GAME_EVENTS.START_NEW_GAME, () => {
            if (LocalStorageManager.getItem(SETTING_CONSTANTS.uuid) === null) {
                LocalStorageManager.setItem(
                    SETTING_CONSTANTS.uuid,
                    Phaser.Math.RND.uuid(),
                );
            }
        });
    }

    initializeLocalStorage() {
        if (
            LocalStorageManager.getItem(SETTING_CONSTANTS.volumeLevel) !== null
        ) {
            this.volumeLevel = LocalStorageManager.getItem(
                SETTING_CONSTANTS.volumeLevel,
            );
        } else {
            LocalStorageManager.setItem(SETTING_CONSTANTS.volumeLevel, 100);
        }

        if (LocalStorageManager.getItem(SETTING_CONSTANTS.inputHint) !== null) {
            this.inputHint = LocalStorageManager.getItem(
                SETTING_CONSTANTS.inputHint,
            );
        } else {
            LocalStorageManager.setItem(SETTING_CONSTANTS.inputHint, false);
        }

        if (
            LocalStorageManager.getItem(SETTING_CONSTANTS.mobileControls) !==
            null
        ) {
            this.mobileControls = LocalStorageManager.getItem(
                SETTING_CONSTANTS.mobileControls,
            );
        } else {
            LocalStorageManager.setItem(
                SETTING_CONSTANTS.mobileControls,
                false,
            );
        }

        if (
            LocalStorageManager.getItem(SETTING_CONSTANTS.startingDate) === null
        ) {
            LocalStorageManager.setItem(
                SETTING_CONSTANTS.startingDate,
                Date.now(),
            );
        }
        LocalStorageManager.setItem(
            SETTING_CONSTANTS.startSessionTime,
            Date.now(),
        );
        if (
            LocalStorageManager.getItem(SETTING_CONSTANTS.totalSessionTimes) ===
            null
        ) {
            LocalStorageManager.setItem(
                SETTING_CONSTANTS.totalSessionTimes,
                [],
            );
        }
        if (
            LocalStorageManager.getItem(SETTING_CONSTANTS.totalTimePlayed) ===
            null
        ) {
            LocalStorageManager.setItem(SETTING_CONSTANTS.totalTimePlayed, 0);
        }

        if (
            LocalStorageManager.getItem(SETTING_CONSTANTS.currentScene) === null
        ) {
            LocalStorageManager.setItem(
                SETTING_CONSTANTS.currentScene,
                SCENES.MainMenu,
            );
        }
        if (
            LocalStorageManager.getItem(
                SETTING_CONSTANTS.currentActiveScenes,
            ) === null
        ) {
            LocalStorageManager.setItem(
                SETTING_CONSTANTS.currentActiveScenes,
                [],
            );
        }
        if (
            LocalStorageManager.getItem(SETTING_CONSTANTS.unlockProgress) ===
            null
        ) {
            LocalStorageManager.setItem(SETTING_CONSTANTS.unlockProgress, {
                ascension: 0,
            });
        }
        if (
            LocalStorageManager.getItem(SETTING_CONSTANTS.hasActiveCampaign) ===
            null
        ) {
            LocalStorageManager.setItem(
                SETTING_CONSTANTS.hasActiveCampaign,
                false,
            );
        }

        if (LocalStorageManager.getItem(SETTING_CONSTANTS.ascension) === null) {
            LocalStorageManager.setItem(SETTING_CONSTANTS.ascension, {
                ascension: {},
            });
        }

        if (LocalStorageManager.getItem(SETTING_CONSTANTS.isMobile) === null) {
            LocalStorageManager.setItem(SETTING_CONSTANTS.isMobile, false);
        }
    }

    onBeforeUnload() {
        const totalSessionTime =
            Date.now() -
            LocalStorageManager.getItem(SETTING_CONSTANTS.startSessionTime);
        LocalStorageManager.setItem(
            SETTING_CONSTANTS.totalTimePlayed,
            totalSessionTime +
                LocalStorageManager.getItem(SETTING_CONSTANTS.totalTimePlayed),
        );
        LocalStorageManager.setItem(SETTING_CONSTANTS.totalSessionTimes, [
            ...LocalStorageManager.getItem(SETTING_CONSTANTS.totalSessionTimes),
            totalSessionTime,
        ]);
    }

    updateLocalStorageCurrentScene(
        transitionFromScene: Phaser.Scene,
        transitionToSceneKey: string,
    ) {
        // console.log(
        //     "updating local storage current scene:",
        //     transitionToSceneKey,
        // );
        let activeScenes = transitionFromScene.scene.manager.getScenes();
        let scenesToHydrate = [] as string[];
        activeScenes.forEach((value) => {
            if (transitionFromScene.scene.key === value.scene.key) {
                if (transitionFromScene.scene.key === SCENES.Overworld) {
                    scenesToHydrate.push(SCENES.Overworld);
                }
                scenesToHydrate.push(transitionToSceneKey);
            } else {
                scenesToHydrate.push(value.scene.key);
            }
        });
        //remove duplicates/ghosts
        scenesToHydrate = scenesToHydrate.filter((value, index, array) => {
            return array.indexOf(value) === index;
        });
        LocalStorageManager.setItem(
            SETTING_CONSTANTS.currentActiveScenes,
            scenesToHydrate,
        );
        LocalStorageManager.setItem(
            SETTING_CONSTANTS.currentScene,
            transitionToSceneKey,
        );
    }

    saveCurrentCampaignDetails(overworldGridData: any) {
        // console.log("about to save gameState:", GameState);
        LocalStorageManager.setCurrentCampaignItem({
            ascension: 0,
            gameState: GameState,
            overworldGrid: overworldGridData,
        });
    }
}

export const SettingsManager = new SettingsManagerClass();
