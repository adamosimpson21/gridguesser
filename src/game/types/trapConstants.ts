export const TRAPS: { [key: string]: trapType } = {
    SLEEP_TRAP: {
        id: "SLEEP_TRAP",
        background: "cubicle",
        benefitIndex: 0.5,
        description:
            "You find an employee sleeping at their desk. You can try to sweep up around them, but they might wake up. Do you...",
        options: [
            {
                text: "Clean up ($3 or -2 Hp)",
                outcomes: [
                    {
                        effect: {
                            gold: 3,
                        },
                        chance: 50,
                        positive: true,
                        text: "You successfully cleaned around the employee, $3",
                    },
                    {
                        effect: {
                            health: -2,
                        },
                        chance: 50,
                        positive: false,
                        text: "Oh no! They wake up and write you a bad review",
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
                            luck: 0.25,
                        },
                        chance: 50,
                        positive: true,
                        text: "This coin sure feels lucky",
                    },
                    {
                        effect: {
                            luck: -0.25,
                        },
                        chance: 50,
                        positive: false,
                        text: "This coin sure is shiny",
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
