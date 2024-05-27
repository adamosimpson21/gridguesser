import { GameStateClass } from "@/game/classes/GameState";
import { Overworld } from "@/game/scenes/Overworld";
import OverworldGrid from "@/game/classes/OverworldGrid";
import FightGrid from "@/game/classes/FightGrid";
import OverworldCell from "@/game/classes/OverworldCell";

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
};

export type currentCampaignDetails = {
    ascension: number;
    gameState: GameStateClass;
    overworldGrid: any;
    currentFight?: FightGrid;
};

export type unlockProgressType = {
    ascension: number;
};
