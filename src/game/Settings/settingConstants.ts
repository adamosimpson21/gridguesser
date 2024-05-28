import { GameStateClass } from "@/game/GameState/GameState";
import { Overworld } from "@/game/Overworld/Overworld";
import OverworldGrid from "@/game/Overworld/OverworldGrid";
import FightGrid from "@/game/Fight/FightGrid";
import OverworldCell from "@/game/Overworld/OverworldCell";

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
