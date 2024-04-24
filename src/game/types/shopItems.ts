export const SHOP_ITEMS: { [key: string]: shopItemType } = {
    HEAL_FULL: {
        id: 'HEAL_FULL',
        name: 'Thanksgiving Dinner',
        description: 'Heals to full life',
        cost: 5,
        effect: {heal: 1000},
        icon: '🍗',
        permanent: false,
        singleton: false,
    },
    HEAL_TWO: {
        id: 'HEAL_TWO',
        name: '2 Potato Chips',
        description: 'Heal 2 life',
        cost: 2,
        effect: {heal: 2},
        icon: '🥔',
        permanent: false,
        singleton: false,
    },
    MAX_HP_TWO: {
        id: 'MAX_HP_TWO',
        name: 'Hearty Snackbar',
        description: 'Adds 2 maximum life',
        cost: 5,
        effect: {maxHp: 2},
        icon: '🍫',
        permanent: true,
        singleton: false,
    },
    REDUCE_DAMAGE_TWO: {
        id: 'REDUCE_DAMAGE_TWO',
        name: 'Gloves',
        description: 'Reduces damage by 2',
        cost: 8,
        effect: {damage_reduce: 2},
        icon: '🧤',
        permanent: true,
        singleton: false,
    },
    GRID_EXPAND_ONE: {
        id: 'GRID_EXPAND_ONE',
        name: 'Wrench',
        description: 'Expand Room grids by 1',
        cost: 5,
        effect: {fightGridExpand: 1},
        icon: '🔧',
        permanent: true,
        singleton: false,
    },
    BOMB_NUMBER_REDUCE_FIVE: {
        id: 'BOMB_NUMBER_REDUCE_FIVE',
        name: 'Water',
        description: 'Removes 3 Bombs per Room',
        cost: 15,
        effect: {bombNumberReduce: 3},
        icon: '💦',
        permanent: true,
        singleton: false,
    },
    FIGHT_GOLD_INCREASE_FIVE: {
        id: 'FIGHT_GOLD_INCREASE_FIVE',
        name: 'Promotion',
        description: 'Gain 5 more gold for cleaned rooms',
        cost: 16,
        effect: {fightGoldIncrease: 5},
        icon: '📈',
        permanent: true,
        singleton: true,
    }
}

export type shopItemType = {
        id : string;
        name: string;
        description: string;
        permanent: boolean;
        singleton: boolean;
        cost: number;
        effect: any;
        icon: string;
}