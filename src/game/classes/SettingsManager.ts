import { LocalStorageManager } from "@/game/classes/LocalStorageManager";
import { SETTING_CONSTANTS } from "@/game/types/settingConstants";

class SettingsManagerClass {
    public volumeLevel: number;
    public inputHint: boolean;
    public mobileControls: boolean;
    constructor() {
        this.volumeLevel = 100;
        this.inputHint = true;
        this.mobileControls = false;

        if (
            LocalStorageManager.getItem(SETTING_CONSTANTS.volumeLevel) !== null
        ) {
            // if (LocalStorageManager.getItem("volumeLevel")) {
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
            LocalStorageManager.setItem(SETTING_CONSTANTS.inputHint, true);
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
    }
}

export const SettingsManager = new SettingsManagerClass();
