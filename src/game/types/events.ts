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
    CHANGE_NAME: "CHANGE_NAME",
};
export const UI_EVENTS = {
    UPDATE_GOLD: "UPDATE_GOLD",
    UPDATE_HEALTH: "UPDATE_HEALTH",
    UPDATE_HEALTH_MAX: "UPDATE_HEALTH_MAX",
    DISPLAY_MESSAGE: "DISPLAY_MESSAGE",
    UPDATE_UPGRADES: "UPDATE_UPGRADES",
    ILLEGAL_ACTION: "ILLEGAL_ACTION",
    UPDATE_NAME: "UPDATE_NAME",
};

export const GAME_EVENTS = {
    GAME_OVER: "GAME_OVER",
    UNLOCK_ITEM: "UNLOCK_ITEM",
    RESET: "RESET",
    INCREMENT_LEVEL: "INCREMENT_LEVEL",
};

export const FIGHT_EVENTS = {
    CHANGE_INPUT_TYPE: "CHANGE_INPUT_TYPE",
    USE_LIMITED_INPUT: "USE_LIMITED_INPUT",
    ADD_INPUT_TYPE: "ADD_INPUT_TYPE",
    REMOVE_INPUT_TYPE: "REMOVE_INPUT_TYPE    ",
};

export const SCENE_EVENTS = {
    LEAVE_FIGHT: "LEAVE_FIGHT",
    ENTER_FIGHT: "ENTER_FIGHT",
};
