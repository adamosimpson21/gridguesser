export const KEY_ITEMS: { [key: string]: keyItemType } = {
    REMOVE_TRASH: {
        id: "REMOVE_TRASH",
        name: "Remove Trash",
        description: "Clears a trash spot",
    },
    REMOVE_BOMB: {
        id: "REMOVE_BOMB",
        name: "Remove Dust Bunnies",
        description: "Eliminates a Dust Bunny",
    },
    REMOVE_LIES: {
        id: "REMOVE_LIES",
        name: "Remove Lies",
        description: "Forces spots to tell the truth",
    },
    UMBRELLA: {
        id: "UMBRELLA",
        name: "Towel",
        description: "Reveals number of Dust Bunnies in any 3x3 area",
    },
    TOWER: {
        id: "TOWER",
        name: "Stepstool",
        description:
            "Use on a revealed spot to learn the number of dust Bunnies in a 5x5 area",
    },
    BLOCK: {
        id: "BLOCK",
        name: "Cement",
        description: "Covers a 2x2 area in cement",
    },
};

export type keyItemType = {
    id: string;
    name: string;
    description: string;
};
