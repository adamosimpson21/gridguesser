export const SHOP_ITEMS: { [key: string]: shopItemType } = {
    HEAL_FULL: {
        id: 'HEAL_FULL',
        name: 'Full Heal',
        cost: 5,
        effect: {heal: 1000},
        icon: '🍞'
    },
    HEAL_TWO: {
        id: 'HEAL_TWO',
        name: '2 Health',
        cost: 2,
        effect: {heal: 2},
        icon: '🍬'
    },
    MAX_HP_TWO: {
        id: 'MAX_HP_TWO',
        name: '2 Max HP',
        cost: 5,
        effect: {maxHp: 2},
        icon: '🐉'
    },
    REDUCE_DAMAGE_TWO: {
        id: '2 Damage Reduction',
        name: 'Full Heal',
        cost: 8,
        effect: {damage_reduce: 2},
        icon: '🛡'
    }
}

export type shopItemType = {
        id : string;
        name: string;
        cost: number;
        effect: any;
        icon: string;
}