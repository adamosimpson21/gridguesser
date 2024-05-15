import { Scene } from "phaser";
import {
    SHOP_CONSTANTS,
    SHOP_ITEMS,
    shopItemType,
} from "@/game/types/shopItems";
import ShopGrid from "@/game/classes/ShopGrid";
import { EventBus } from "@/game/EventBus";
import { GAME_EVENTS, PLAYER_EVENTS, UI_EVENTS } from "@/game/types/events";
import { GameState } from "@/game/classes/GameState";

export default class ShopItem {
    private scene: Phaser.Scene;
    private type: string | undefined;
    private item: shopItemType | undefined;
    private x: number;
    private y: number;
    private tile: Phaser.GameObjects.Text;
    public name: Phaser.GameObjects.Text;
    private available: boolean;
    private description: Phaser.GameObjects.Text;
    private cost: Phaser.GameObjects.Text;
    private numPadImage: Phaser.GameObjects.Text;
    constructor(
        grid: ShopGrid,
        type: string | undefined,
        x: number,
        y: number,
    ) {
        this.type = type;
        this.item = undefined;
        this.x = x;
        this.y = y;
        this.available = true;

        this.tile = grid.scene.make.text({
            x: grid.offset.x + x * SHOP_CONSTANTS.SHOP_TILE_WIDTH,
            y: grid.offset.y + y * SHOP_CONSTANTS.SHOP_TILE_HEIGHT,
            text: "⬜",
            style: {
                fontSize: SHOP_CONSTANTS.SHOP_TILE_FONT_SIZE * 2,
                padding: { y: 10 },
            },
        });
        this.name = grid.scene.make.text({
            x:
                grid.offset.x +
                SHOP_CONSTANTS.SHOP_TILE_OFFSET_X +
                x * SHOP_CONSTANTS.SHOP_TILE_WIDTH,
            y:
                grid.offset.y +
                y * SHOP_CONSTANTS.SHOP_TILE_HEIGHT +
                SHOP_CONSTANTS.SHOP_TILE_NAME_OFFSET_Y,
            text: "",
            style: {
                fontSize: SHOP_CONSTANTS.SHOP_TILE_FONT_SIZE,
                padding: { y: 10 },
            },
        });
        this.cost = grid.scene.make.text({
            x:
                grid.offset.x +
                SHOP_CONSTANTS.SHOP_TILE_OFFSET_X +
                x * SHOP_CONSTANTS.SHOP_TILE_WIDTH,
            y:
                grid.offset.y +
                y * SHOP_CONSTANTS.SHOP_TILE_HEIGHT +
                SHOP_CONSTANTS.SHOP_TILE_NAME_OFFSET_Y +
                SHOP_CONSTANTS.SHOP_TILE_COST_OFFSET_Y,
            text: "",
            style: {
                fontSize: SHOP_CONSTANTS.SHOP_TILE_FONT_SIZE,
                padding: { y: 10 },
            },
        });
        this.description = grid.scene.make.text({
            x:
                grid.offset.x +
                SHOP_CONSTANTS.SHOP_TILE_OFFSET_X +
                x * SHOP_CONSTANTS.SHOP_TILE_WIDTH,
            y:
                grid.offset.y +
                y * SHOP_CONSTANTS.SHOP_TILE_HEIGHT +
                SHOP_CONSTANTS.SHOP_TILE_NAME_OFFSET_Y +
                SHOP_CONSTANTS.SHOP_TILE_COST_OFFSET_Y +
                SHOP_CONSTANTS.SHOP_TILE_DESC_OFFSET_Y,
            text: "",
            style: {
                fontSize: Math.floor(SHOP_CONSTANTS.SHOP_TILE_FONT_SIZE * 0.75),
                padding: { y: 10 },
            },
        });
        this.numPadImage = grid.scene.make.text({
            x: x * SHOP_CONSTANTS.NUM_PAD_TILE_WIDTH,
            y: y * SHOP_CONSTANTS.NUM_PAD_TILE_HEIGHT,
            text: "⬜",
            style: {
                fontSize: SHOP_CONSTANTS.SHOP_TILE_FONT_SIZE * 2,
                padding: { y: 10 },
            },
        });

        grid.board.add(this.tile);
        grid.board.add(this.name);
        grid.board.add(this.description);
        grid.board.add(this.cost);

        grid.numPadBoard.add(this.numPadImage);
    }

    generateItem() {
        const itemToAssign = this.chooseRandomShopItem();
        this.type = itemToAssign.id;
        this.item = itemToAssign;
        this.tile.setText(itemToAssign.icon);
        this.name.setText(itemToAssign.name);
        this.description.setText(itemToAssign.description);
        this.cost.setText(`$${itemToAssign.cost}`);
        this.numPadImage.setText(itemToAssign.icon);
        this.numPadImage.setInteractive();
        this.numPadImage.on("pointerdown", this.onClick, this);
        this.tile.setInteractive();
        this.tile.on("pointerdown", this.onClick, this);
    }

    chooseRandomShopItem(): shopItemType {
        const keys = Object.keys(SHOP_ITEMS);
        const randomIndex = Phaser.Math.Between(0, keys.length);
        const randomKey = keys[randomIndex] as keyof shopItemType;
        this.type = randomKey;
        return SHOP_ITEMS[randomKey];
    }

    playerCanUseItemCheck(item: shopItemType): boolean {
        const itemEffect = item.effect;
        if (
            itemEffect.heal >= 0 &&
            GameState.player.hp === GameState.player.maxHp
        ) {
            EventBus.emit(
                UI_EVENTS.DISPLAY_MESSAGE,
                {
                    type: UI_EVENTS.ILLEGAL_ACTION,
                    message: "You're already at full life",
                },
                3000,
            );
            return false;
        } else if (item.singleton && GameState.player.upgrades.includes(item)) {
            EventBus.emit(
                UI_EVENTS.DISPLAY_MESSAGE,
                {
                    type: UI_EVENTS.ILLEGAL_ACTION,
                    message: `You're already have ${item.name}`,
                },
                3000,
            );
            return false;
        }
        return true;
    }

    useItem(item: shopItemType) {
        const itemEffect = item.effect;
        Object.keys(itemEffect).forEach((effect) => {
            switch (effect) {
                case "heal":
                    EventBus.emit(PLAYER_EVENTS.GAIN_HP, itemEffect.heal);
                    break;
                case "healEqualToHp":
                    EventBus.emit(PLAYER_EVENTS.GAIN_HP, GameState.player.hp);
                    break;
                case "maxHp":
                    EventBus.emit(
                        PLAYER_EVENTS.GAIN_MAX_HP,
                        itemEffect.maxHp,
                        itemEffect.maxHp,
                    );
                    break;
                case "maxHpPercent":
                    const severity = Math.ceil(
                        GameState.player.maxHp *
                            (itemEffect.maxHpPercent / 100),
                    );
                    EventBus.emit(
                        PLAYER_EVENTS.GAIN_MAX_HP,
                        severity,
                        severity,
                    );
                    break;
                case "maxHpDouble":
                    EventBus.emit(
                        PLAYER_EVENTS.GAIN_MAX_HP,
                        GameState.player.maxHp,
                        0,
                    );
                    break;
                case "trashTileRemove":
                    GameState.removeTrashNum += itemEffect.trashTileRemove;
                    EventBus.emit(
                        UI_EVENTS.DISPLAY_MESSAGE,
                        `Added ${itemEffect.trashTileRemove} more trash tile removal`,
                    );
                    break;
                case "flawlessVictoryDouble":
                    GameState.fightFlawlessGoldReward += 2;
                    EventBus.emit(
                        UI_EVENTS.DISPLAY_MESSAGE,
                        `Doubled Flawless Victory Reward`,
                    );
                    break;
                case "shopItemsAdd":
                    GameState.shopItemNumber += itemEffect.shopItemsAdd;
                    EventBus.emit(
                        UI_EVENTS.DISPLAY_MESSAGE,
                        `Added ${itemEffect.trashTileRemove} items to future Vending Machines`,
                    );
                    break;
                case "damage_reduce":
                    GameState.playerDamageReduction += itemEffect.damage_reduce;
                    EventBus.emit(
                        UI_EVENTS.DISPLAY_MESSAGE,
                        "Damage Reduction Increased",
                    );
                    break;
                case "luckAdd":
                    GameState.player.luck += itemEffect.luckAdd;
                    EventBus.emit(
                        UI_EVENTS.DISPLAY_MESSAGE,
                        "Up all night to get Lucky 🌟",
                    );
                    break;
                case "fightGridExpand":
                    GameState.fightGridHeight += itemEffect.fightGridExpand;
                    GameState.fightGridWidth += itemEffect.fightGridExpand;
                    EventBus.emit(
                        UI_EVENTS.DISPLAY_MESSAGE,
                        "Room size width and height increased",
                    );
                    break;
                case "bombNumberReduce":
                    GameState.bombNum -= itemEffect.bombNumberReduce;
                    EventBus.emit(
                        UI_EVENTS.DISPLAY_MESSAGE,
                        "Reduced Bomb Number",
                    );
                    break;
                case "fightGoldIncrease":
                    GameState.fightGoldReward += itemEffect.fightGoldIncrease;
                    EventBus.emit(
                        UI_EVENTS.DISPLAY_MESSAGE,
                        "Increased Room reward Gold",
                    );
                    break;
            }
        });
    }

    onClick() {
        if (this.type && this.item && this.available) {
            if (this.item?.effect) {
                // check if player has money to  buy item
                if (this.item.cost > GameState.player.gold) {
                    EventBus.emit(
                        UI_EVENTS.DISPLAY_MESSAGE,
                        {
                            type: UI_EVENTS.ILLEGAL_ACTION,
                            message: " 💸 Not enough gold! 💸",
                        },
                        3000,
                    );
                } else if (this.playerCanUseItemCheck(this.item)) {
                    {
                        // player has successfully bought item
                        this.available = false;
                        this.tile.setText("✅");
                        this.numPadImage.setText("✅");
                        // logic for using item
                        this.useItem(this.item);
                        EventBus.emit(PLAYER_EVENTS.LOSE_GOLD, this.item.cost);
                        if (this.item.permanent) {
                            EventBus.emit(
                                PLAYER_EVENTS.GAIN_UPGRADE,
                                this.item,
                            );
                        }
                    }
                }
            }
        }
    }
}
