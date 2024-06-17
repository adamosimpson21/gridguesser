import { flavorConstants } from "@/game/constants/flavorConstants";

export const TRAPS: { [key: string]: trapType } = {
    SLEEP_TRAP: {
        id: "SLEEP_TRAP",
        background: "cubicle",
        benefitIndex: 0.5,
        description:
            "You find an employee sleeping at their desk. You can try to sweep up around them, but they might wake up. Do you...",
        options: [
            {
                text: "Clean up ($6 or -2 Hp)",
                outcomes: [
                    {
                        effect: {
                            gold: 6,
                        },
                        chance: 50,
                        positive: true,
                        text: "You successfully cleaned around the employee, $6",
                    },
                    {
                        effect: {
                            health: -2,
                        },
                        chance: 50,
                        positive: false,
                        text: "Oh no! They wake up and write you a bad review, -2hp",
                    },
                ],
            },
            {
                text: "Leave them alone",
                outcomes: [
                    {
                        chance: 100,
                        positive: true,
                        text: "You leave them alone and wander off.",
                        effect: {},
                    },
                ],
            },
        ],
        luckFactor: 1,
    },
    FIND_SNACK: {
        id: "FIND_SNACK",
        background: "cubicle",
        benefitIndex: 0.5,
        description:
            "While sweeping up some dust, you see a bag of potato chips. If it's unopened, they're probably still good",
        options: [
            {
                text: `Eat the chips (+2hp or Add one ${flavorConstants.ENEMY_NAME})`,
                outcomes: [
                    {
                        effect: {
                            health: 2,
                        },
                        chance: 50,
                        positive: true,
                        text: "Yum! +2hp",
                    },
                    {
                        effect: {
                            bombNum: 1,
                        },
                        chance: 50,
                        positive: false,
                        text: `They taste worse than dust, +1${flavorConstants.ENEMY_NAME}`,
                    },
                ],
            },
            {
                text: "Sell them to a passerby ($1)",
                outcomes: [
                    {
                        chance: 100,
                        positive: true,
                        text: "You weren't that hungry anyway, +$1",
                        effect: {
                            gold: 1,
                        },
                    },
                ],
            },
        ],
        luckFactor: 1,
    },
    CARPET_TRIP: {
        id: "CARPET_TRIP",
        background: "cubicle",
        benefitIndex: 0.5,
        description:
            "Whoopsie Doodles! You tripped over some carpet, but I bet that weird purple figure has some band-aids",
        options: [
            {
                text: `Consult the purple figure (-$5 and maybe +5hp)`,
                outcomes: [
                    {
                        effect: {
                            health: 5,
                            gold: -5,
                        },
                        chance: 50,
                        positive: true,
                        text: "Nice guy, that band aid tastes like rawberry, -$5 and +5hp",
                    },
                    {
                        effect: {
                            gold: -5,
                        },
                        chance: 50,
                        positive: true,
                        text: "What a scam!, -$5",
                    },
                ],
            },
            {
                text: "Better not mess with it (-1hp)",
                outcomes: [
                    {
                        chance: 100,
                        positive: true,
                        text: "It'll stop bleeding soon, -1hp",
                        effect: {
                            health: -1,
                        },
                    },
                ],
            },
        ],
        luckFactor: 1,
    },
    DRUG_TRIP: {
        id: "DRUG_TRIP",
        background: "cubicle",
        benefitIndex: 0.5,
        description:
            "You find a big drawer of unlabeled spray bottles. They might be useful",
        options: [
            {
                text: `Add them to your cart (-3 ${flavorConstants.ENEMY_NAME_PLURAL} or -1 ${flavorConstants.FIGHT_NAME} grid size)`,
                outcomes: [
                    {
                        effect: {
                            bombNum: -3,
                        },
                        chance: 50,
                        positive: true,
                        text: `That is some tasty water, -3 ${flavorConstants.ENEMY_NAME_PLURAL}`,
                    },
                    {
                        effect: {
                            fightGridSize: -1,
                        },
                        chance: 50,
                        positive: false,
                        text: `After using the bottle, you start to feel sick, -1 ${flavorConstants.FIGHT_NAME}`,
                    },
                ],
            },
            {
                text: "That could be dangerous, I'll just avoid them",
                outcomes: [
                    {
                        chance: 100,
                        positive: true,
                        text: "Time to get back to sweepin'",
                        effect: {},
                    },
                ],
            },
        ],
        luckFactor: 1,
    },
    LUCKY_COIN: {
        id: "LUCKY_COIN",
        background: "cubicle",
        benefitIndex: 0.5,
        description: "Oh wow, what a shiny coin, maybe I should pick it up 🤔 ",
        options: [
            {
                text: "Pick up the very shiny coin",
                outcomes: [
                    {
                        effect: {
                            luck: 0.22,
                            gainItem: "LUCKY_COIN",
                        },
                        chance: 50,
                        positive: true,
                        text: "This coin sure feels lucky",
                    },
                    {
                        effect: {
                            luck: -0.2,
                            gainItem: "UNLUCKY_COIN",
                        },
                        chance: 50,
                        positive: false,
                        text: "This coin sure is rusty",
                    },
                ],
            },
            {
                text: "Leave it alone",
                outcomes: [
                    {
                        chance: 100,
                        positive: true,
                        text: "That coin probably wasn't lucky at all.",
                        effect: {},
                    },
                ],
            },
        ],
        luckFactor: 2,
    },
};

export type trapType = {
    id: string;
    background: string;
    description: string;
    benefitIndex: number;
    options: trapOptionsType[];
    luckFactor: number;
};

export type trapOptionsType = {
    text: string;
    outcomes: trapOutcomeType[];
};

export type trapOutcomeType = {
    chance: number;
    positive: boolean;
    text: string;
    effect: { [key: string]: number | string };
};
