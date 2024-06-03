export const PLAYER_EVENTS = {
    LOSE_HP: "LOSE_HP",
    GAIN_HP: "GAIN_HP",
    LOSE_GOLD: "LOSE_GOLD",
    GAIN_GOLD: "GAIN_GOLD",
    GAIN_UPGRADE: "GAIN_UPGRADE",
    LOSE_UPGRADE: "LOSE_UPGRADE",
    GAIN_MAX_HP: "GAIN_MAX_HP",
    LOSE_MAX_HP: "LOSE_MAX_HP",
    HIT_BOMB: "HIT_BOMB",
    CHANGE_CHARACTER: "CHANGE_CHARACTER",
};
export const UI_EVENTS = {
    UPDATE_GOLD: "UPDATE_GOLD",
    UPDATE_HEALTH: "UPDATE_HEALTH",
    UPDATE_HEALTH_MAX: "UPDATE_HEALTH_MAX",
    DISPLAY_MESSAGE: "DISPLAY_MESSAGE",
    UPDATE_UPGRADES: "UPDATE_UPGRADES",
    ILLEGAL_ACTION: "ILLEGAL_ACTION",
    UPDATE_NAME: "UPDATE_NAME",
    USE_UPGRADE: "USE_UPGRADE",
};

export const UI_MESSAGE_TYPES = {
    ERROR: "ERROR",
    INFO: "INFO",
    SUCCESS: "SUCCESS",
    UNLOCK: "UNLOCK",
    WARNING: "WARNING",
};

export const GAME_EVENTS = {
    GAME_OVER: "GAME_OVER",
    ABANDON_RUN: "ABANDON_RUN",
    START_NEW_GAME: "START_NEW_GAME",
    UNLOCK_ITEM: "UNLOCK_ITEM",
    RESET: "RESET",
    RESET_FIGHT_INPUT_MENU: "RESET_FIGHT_INPUT_MENU",
    INCREMENT_LEVEL: "INCREMENT_LEVEL",
    LOAD_CAMPAIGN: "LOAD_CAMPAIGN",
    GAME_WON: "GAME_WON",
};

export const FIGHT_EVENTS = {
    CHANGE_INPUT_TYPE: "CHANGE_INPUT_TYPE",
    USE_LIMITED_INPUT: "USE_LIMITED_INPUT",
    ADD_INPUT_TYPE: "ADD_INPUT_TYPE",
    REMOVE_INPUT_TYPE: "REMOVE_INPUT_TYPE",
    FIGHT_WON: "FIGHT_WON",
};

export const SCENE_EVENTS = {
    LEAVE_FIGHT: "LEAVE_FIGHT",
    ENTER_FIGHT: "ENTER_FIGHT",
    POPULATE_FIGHT: "POPULATE_FIGHT",
    ENTER_OVERWORLD: "ENTER_OVERWORLD",
    LEAVE_OVERWORLD: "LEAVE_OVERWORLD",
};

export const ITEM_EVENTS = {
    REVEAL_OVERWORLD: "REVEAL_OVERWORLD",
};
