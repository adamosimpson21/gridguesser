import { GameState } from "@/game/classes/GameState";
import {
    currentCampaignDetails,
    SETTING_CONSTANTS,
} from "@/game/types/settingConstants";

class LocalStorageManagerClass {
    getItem(key: string) {
        if (localStorage) {
            const item = localStorage.getItem(JSON.stringify(key));
            // console.log("item:", item);
            if (item) {
                return JSON.parse(item);
            } else {
                return null;
            }
        }
    }

    setItem(key: string, value: any) {
        if (localStorage) {
            localStorage.setItem(JSON.stringify(key), JSON.stringify(value));
            // console.log("localstorage:", localStorage);
        }
    }

    removeItem(key: string) {
        if (localStorage) {
            localStorage.removeItem(JSON.stringify(key));
        }
    }

    removeCurrentCampaignItem() {
        if (localStorage) {
            localStorage.removeItem(
                JSON.stringify(SETTING_CONSTANTS.currentCampaignDetails),
            );
        }
    }

    setCurrentCampaignItem(value: currentCampaignDetails) {
        if (localStorage) {
            localStorage.setItem(
                JSON.stringify(SETTING_CONSTANTS.currentCampaignDetails),
                JSON.stringify(value),
            );
        }
    }

    getCurrentCampaignItem(): currentCampaignDetails | null {
        if (localStorage) {
            const item = localStorage.getItem(
                JSON.stringify(SETTING_CONSTANTS.currentCampaignDetails),
            );
            if (item) {
                return JSON.parse(item);
            }
        }
        return null;
    }
}

export const LocalStorageManager = new LocalStorageManagerClass();
