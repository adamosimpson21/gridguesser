import { GameStateClass } from "@/game/GameState/GameState";
import FightGrid from "@/game/Fight/FightGrid";

export const SETTING_CONSTANTS = {
    volumeLevel: "volumeLevel",
    inputHint: "inputHint",
    mobileControls: "mobileControls",
    uuid: "uuid",
    startingDate: "startingDate",
    startSessionTime: "startSessionTime",
    endSessionTime: "endSesstionTime",
    totalTimePlayed: "totalTimePlayed",
    totalSessionTimes: "totalSessionTimes",
    currentScene: "currentScene",
    currentActiveScenes: "currentActiveScenes",
    unlockProgress: "unlockProgress",
    hasActiveCampaign: "hasActiveCampaign",
    currentCampaignDetails: "currentCampaignDetails",
    highestAscensionBeaten: "highestAscensionBeaten",
    ascension: "ascension",
    isMobile: "isMobile",
};

export type currentCampaignDetails = {
    ascension: number;
    gameState: GameStateClass;
    overworldGrid: any;
    currentFight?: FightGrid;
};

export type unlockProgressType = {
    ascension: {
        // character name
        [key: string]: number;
    };
};
