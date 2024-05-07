export const TRAPS: { [key: string]: trapType } = {
    GOLD_TRAP: {
        id: "GOLD_TRAP",
        type: "MONEY",
        severity: 2,
        luckFactor: 1,
    },
    HEALTH_TRAP: {
        id: "HEALTH_TRAP",
        type: "HP",
        severity: 2,
        luckFactor: 1,
    },
};

export type trapType = {
    id: string;
    type: string;
    severity: number;
    luckFactor: number;
    details?: any;
};
