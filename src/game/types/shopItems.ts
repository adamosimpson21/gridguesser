export const SHOP_ITEMS: { [key: string]: shopItemType } = {
    HEAL_FULL: {
        id: "HEAL_FULL",
        name: "Thanksgiving Dinner",
        description: "Heals to full life",
        cost: 9,
        effect: { heal: 1000 },
        icon: "🍗",
        permanent: false,
        singleton: false,
    },
    HEAL_TWO: {
        id: "HEAL_TWO",
        name: "2 Potato Chips",
        description: "Heal 2 life",
        cost: 2,
        effect: { heal: 2 },
        icon: "🥔",
        permanent: false,
        singleton: false,
    },
    HEAL_EQUAL_TO_HP: {
        id: "HEAL_EQUAL_TO_HP",
        name: "Many Potato Chips",
        description: "Heals equal to Current HP",
        cost: 2,
        effect: { healEqualToHp: 1 },
        icon: "🍟",
        permanent: false,
        singleton: false,
    },
    // MOVE_BOMB_ONE: {
    //     id: "MOVE_BOMB_ONE",
    //     name: "Scary Face",
    //     description:
    //         "The first time you reveal a monster, it runs to a different spot",
    //     cost: 6,
    //     effect: { bombMove: 1 },
    //     icon: "💀",
    //     permanent: true,
    //     singleton: true,
    // },
    MAX_HP_TWO: {
        id: "MAX_HP_TWO",
        name: "Hearty Snackbar",
        description: "Adds 2 life and max life",
        cost: 4,
        effect: { maxHp: 2 },
        icon: "🍫",
        permanent: true,
        singleton: false,
    },
    MAX_HP_DOUBLE: {
        id: "MAX_HP_DOUBLE",
        name: "Pretzels",
        description: "Doubles Max Life only",
        cost: 6,
        effect: { maxHpDouble: 1 },
        icon: "🥨",
        permanent: true,
        singleton: false,
    },
    MAX_HP_PERCENT_TWENTY: {
        id: "MAX_HP_PERCENT_TWENTY",
        name: "Pizza",
        description: "Adds 20% Max Hp, rounded up",
        cost: 5,
        effect: { maxHpPercent: 20 },
        icon: "🍕",
        permanent: true,
        singleton: false,
    },
    REDUCE_DAMAGE_ONE: {
        id: "REDUCE_DAMAGE_ONE",
        name: "Gloves",
        description: "Reduces damage by 1",
        cost: 11,
        effect: { damage_reduce: 1 },
        icon: "🧤",
        permanent: true,
        singleton: false,
    },
    REDUCE_DAMAGE_TWO: {
        id: "REDUCE_DAMAGE_TWO",
        name: "Armor",
        description: "Reduces damage by 2",
        cost: 25,
        effect: { damage_reduce: 2 },
        icon: "🛡",
        permanent: true,
        singleton: false,
    },
    GRID_EXPAND_ONE: {
        id: "GRID_EXPAND_ONE",
        name: "Wrench",
        description: "Expand Room grids by 1",
        cost: 7,
        effect: { fightGridExpand: 1 },
        icon: "🔧",
        permanent: true,
        singleton: false,
    },
    BOMB_NUMBER_REDUCE_FIVE: {
        id: "BOMB_NUMBER_REDUCE_FIVE",
        name: "Water",
        description: "Removes 5 Bombs per Room",
        cost: 11,
        effect: { bombNumberReduce: 5 },
        icon: "💦",
        permanent: true,
        singleton: false,
    },
    FIGHT_GOLD_INCREASE_FIVE: {
        id: "FIGHT_GOLD_INCREASE_FIVE",
        name: "Promotion",
        description: "Gain 5 more gold for cleaned rooms",
        cost: 13,
        effect: { fightGoldIncrease: 5 },
        icon: "📈",
        permanent: true,
        singleton: true,
    },
    // REMOVE_TRASH_TILE_TWO: {
    //     id: "REMOVE_TRASH_TILE_TWO",
    //     name: "Big Trash Can",
    //     description: "Adds 2 uses to Remove Trash Tile",
    //     cost: 9,
    //     effect: { trashTileRemove: 2 },
    //     icon: "🥫",
    //     permanent: true,
    //     singleton: false,
    // },
    LUCK_IMPROVE_15: {
        id: "LUCK_IMPROVE_15",
        name: "Lucky Underpants",
        description: "A little Luckier",
        cost: 10,
        effect: { luckAdd: 15 },
        icon: "🩲",
        permanent: true,
        singleton: false,
    },
    SHOP_ITEMS_ADD_3: {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    FLAWLESS_VICTORY_DOUBLE: {
        id: "FLAWLESS_VICTORY_DOUBLE",
        name: "Flawless Victory Mastery",
        description: "Doubles reward for flawless victories",
        cost: 7,
        effect: { flawlessVictoryDouble: 1 },
        icon: "🌟",
        permanent: true,
        singleton: false,
    },
};

export const testingItems: shopItemType[] = [
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
    {
        id: "SHOP_ITEMS_ADD_3",
        name: "Bigger Vending Machine",
        description: "Adds 3 more items to future vending machines",
        cost: 4,
        effect: { shopItemsAdd: 3 },
        icon: "🥤",
        permanent: true,
        singleton: true,
    },
];

export type shopItemType = {
    id: string;
    name: string;
    description: string;
    permanent: boolean;
    singleton: boolean;
    cost: number;
    effect: any;
    icon: string;
};

export const SHOP_CONSTANTS = {
    SHOP_TILE_WIDTH: 192,
    SHOP_TILE_HEIGHT: 154,
    SHOP_TILE_OFFSET_X: 64,
    SHOP_TILE_NAME_OFFSET_Y: 0,
    SHOP_TILE_COST_OFFSET_Y: 24,
    SHOP_TILE_DESC_OFFSET_Y: 24,
    SHOP_TILE_FONT_SIZE: 32,
    NUM_PAD_TILE_WIDTH: 68,
    NUM_PAD_TILE_HEIGHT: 68,
};
