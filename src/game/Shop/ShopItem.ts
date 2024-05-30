import {
    SHOP_CONSTANTS,
    SHOP_ITEMS,
    shopItemType,
} from "@/game/Shop/shopItems";
import ShopGrid from "@/game/Shop/ShopGrid";
import { EventBus } from "@/game/EventBus/EventBus";
import {
    PLAYER_EVENTS,
    UI_EVENTS,
    UI_MESSAGE_TYPES,
} from "@/game/EventBus/events";
import { GameState } from "@/game/GameState/GameState";
import { paragraphText } from "@/game/constants/textStyleConstructor";
import { addTooltip, TOOLTIP_CONSTANTS } from "@/game/functions/addTooltip";

export default class ShopItem {
    public scene: Phaser.Scene;
    public type: string | undefined;
    public item: shopItemType | undefined;
    public x: number;
    public y: number;
    public tile: Phaser.GameObjects.Image;
    public name: Phaser.GameObjects.Text;
    public available: boolean;
    public description: Phaser.GameObjects.Text;
    public cost: Phaser.GameObjects.Text;
    public numPadImage: Phaser.GameObjects.Image;
    public grid: ShopGrid;
    public tooltipName: Phaser.GameObjects.Text;
    public tooltipInnerObject: Phaser.GameObjects.Container;
    public tooltipDescription: Phaser.GameObjects.Text;
    public tooltipCost: Phaser.GameObjects.Text;
    public tooltipImage: Phaser.GameObjects.Image;
    constructor(
        grid: ShopGrid,
        type: string | undefined,
        x: number,
        y: number,
    ) {
        (this.grid = grid), (this.type = type);
        this.item = undefined;
        this.x = x;
        this.y = y;
        this.available = true;

        this.tile = grid.scene.make
            .image({
                x: grid.offset.x + x * SHOP_CONSTANTS.SHOP_TILE_WIDTH,
                y: grid.offset.y + y * SHOP_CONSTANTS.SHOP_TILE_HEIGHT,
                key: "shop_items",
                frame: 1,
            })
            .setDisplaySize(
                SHOP_CONSTANTS.SHOP_TILE_WIDTH,
                SHOP_CONSTANTS.SHOP_TILE_HEIGHT,
            );
        // this.name = grid.scene.make.text({
        //     x:
        //         grid.offset.x +
        //         SHOP_CONSTANTS.SHOP_TILE_OFFSET_X +
        //         x * SHOP_CONSTANTS.SHOP_TILE_WIDTH,
        //     y:
        //         grid.offset.y +
        //         y * SHOP_CONSTANTS.SHOP_TILE_HEIGHT +
        //         SHOP_CONSTANTS.SHOP_TILE_NAME_OFFSET_Y,
        //     text: "",
        //
        //     style: paragraphText({
        //         fontSize: `${SHOP_CONSTANTS.SHOP_TILE_FONT_SIZE}px`,
        //         color: "white",
        //         wordWrapWidth: 225,
        //     }),
        // });
        this.cost = grid.scene.make.text({
            x: grid.offset.x + x * SHOP_CONSTANTS.SHOP_TILE_WIDTH + 12,
            y:
                grid.offset.y +
                y * SHOP_CONSTANTS.SHOP_TILE_HEIGHT +
                SHOP_CONSTANTS.SHOP_TILE_NAME_OFFSET_Y +
                SHOP_CONSTANTS.SHOP_TILE_COST_OFFSET_Y +
                50,
            text: "",
            style: paragraphText({
                fontSize: `${SHOP_CONSTANTS.SHOP_TILE_FONT_SIZE}px`,
                color: "white",
            }),
        });
        // this.description = grid.scene.make.text({
        //     x:
        //         grid.offset.x +
        //         SHOP_CONSTANTS.SHOP_TILE_OFFSET_X +
        //         x * SHOP_CONSTANTS.SHOP_TILE_WIDTH,
        //     y:
        //         grid.offset.y +
        //         y * SHOP_CONSTANTS.SHOP_TILE_HEIGHT +
        //         SHOP_CONSTANTS.SHOP_TILE_NAME_OFFSET_Y +
        //         SHOP_CONSTANTS.SHOP_TILE_COST_OFFSET_Y +
        //         SHOP_CONSTANTS.SHOP_TILE_DESC_OFFSET_Y,
        //     text: "",
        //     style: paragraphText({
        //         fontSize: `${SHOP_CONSTANTS.SHOP_TILE_FONT_SIZE}px`,
        //         color: "white",
        //         wordWrapWidth: 225,
        //         lineSpacing: 18,
        //     }),
        // });
        this.numPadImage = grid.scene.make.image({
            x: x * SHOP_CONSTANTS.NUM_PAD_TILE_WIDTH,
            y: y * SHOP_CONSTANTS.NUM_PAD_TILE_HEIGHT,
            key: "shop_items",
            frame: 1,
        });

        this.tooltipInnerObject = this.grid.scene.add.container(
            TOOLTIP_CONSTANTS.X_OFFSET,
            TOOLTIP_CONSTANTS.Y_OFFSET,
        );

        this.tooltipName = grid.scene.make.text({
            x: 0,
            y: 0,
            text: "",
            style: paragraphText({
                wordWrapWidth: TOOLTIP_CONSTANTS.BASE_WIDTH,
                align: "left",
            }),
        });
        this.tooltipDescription = grid.scene.make.text({
            x: 0,
            y: 128,
            text: "",
            style: paragraphText({
                wordWrapWidth: TOOLTIP_CONSTANTS.BASE_WIDTH,
                align: "left",
            }),
        });
        this.tooltipCost = grid.scene.make.text({
            x: 0,
            y: 96,
            text: "",
            style: paragraphText({
                align: "left",
                wordWrapWidth: TOOLTIP_CONSTANTS.BASE_WIDTH,
            }),
        });
        this.tooltipImage = grid.scene.make
            .image({
                x: 0,
                y: 64,
                key: "shop_items",
                frame: 1,
            })
            .setDisplaySize(32, 32);

        this.tooltipInnerObject.add(this.tooltipName);
        this.tooltipInnerObject.add(this.tooltipDescription);
        this.tooltipInnerObject.add(this.tooltipCost);
        this.tooltipInnerObject.add(this.tooltipImage);

        grid.board.add(this.tile);
        // grid.board.add(this.name);
        // grid.board.add(this.description);
        grid.board.add(this.cost);

        grid.numPadBoard.add(this.numPadImage);
    }

    generateItem() {
        const itemToAssign = this.chooseRandomShopItem();
        this.type = itemToAssign.id;
        this.item = itemToAssign;
        this.tile.setFrame(itemToAssign.icon);
        // this.name.setText(itemToAssign.name);
        this.tooltipName.setText(itemToAssign.name);
        this.tooltipImage
            .setFrame(itemToAssign.icon)
            .setPosition(0, this.tooltipName.displayHeight + 8);
        // this.description.setText(itemToAssign.description);
        this.tooltipCost
            .setText(`$${itemToAssign.cost}`)
            .setPosition(
                0,
                this.tooltipImage.y + this.tooltipImage.displayHeight + 8,
            );
        this.tooltipDescription
            .setText(itemToAssign.description)
            .setPosition(
                0,
                this.tooltipCost.y + this.tooltipCost.displayHeight + 8,
            );
        this.cost.setText(`$${itemToAssign.cost}`);

        this.numPadImage.setFrame(itemToAssign.icon);
        this.numPadImage.setInteractive();
        this.numPadImage.on("pointerdown", this.onClick, this);
        this.tile.setInteractive();
        this.tile.on("pointerdown", this.onClick, this);

        const itemTooltip = addTooltip(this.grid.scene, this.tile, {
            // width: 300,
            // height: 500,
            innerObject: this.tooltipInnerObject,
        });
    }

    chooseRandomShopItem(): shopItemType {
        const keys = Object.keys(SHOP_ITEMS);
        const randomIndex = Phaser.Math.Between(0, keys.length - 1);
        const randomKey = keys[randomIndex] as keyof shopItemType;
        this.type = randomKey;
        return SHOP_ITEMS[randomKey];
    }

    playerCanUseItemCheck(item: shopItemType): boolean {
        const itemEffect = item.effect;
        if (itemEffect.heal >= 0 && GameState.hp === GameState.maxHp) {
            EventBus.emit(
                UI_EVENTS.DISPLAY_MESSAGE,
                {
                    type: UI_EVENTS.ILLEGAL_ACTION,
                    message: "You're already at full life",
                },
                3000,
            );
            return false;
        } else if (item.singleton && GameState.upgrades.includes(item)) {
            EventBus.emit(
                UI_EVENTS.DISPLAY_MESSAGE,
                {
                    type: UI_EVENTS.ILLEGAL_ACTION,
                    message: `You already have ${item.name}`,
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
                    EventBus.emit(PLAYER_EVENTS.GAIN_HP, GameState.hp);
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
                        GameState.maxHp * (itemEffect.maxHpPercent / 100),
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
                        GameState.maxHp,
                        0,
                    );
                    break;
                case "trashTileRemove":
                    GameState.removeTrashNum += itemEffect.trashTileRemove;
                    EventBus.emit(UI_EVENTS.DISPLAY_MESSAGE, {
                        type: UI_MESSAGE_TYPES.SUCCESS,
                        message: `Added ${itemEffect.trashTileRemove} more trash tile removal`,
                    });
                    break;
                case "flawlessVictoryDouble":
                    GameState.fightFlawlessGoldReward += 2;
                    EventBus.emit(UI_EVENTS.DISPLAY_MESSAGE, {
                        type: UI_MESSAGE_TYPES.SUCCESS,
                        message: `Doubled Flawless Victory Reward`,
                    });
                    break;
                case "shopItemsAdd":
                    GameState.shopItemNumber += itemEffect.shopItemsAdd;
                    EventBus.emit(UI_EVENTS.DISPLAY_MESSAGE, {
                        type: UI_MESSAGE_TYPES.SUCCESS,
                        message: `Added ${itemEffect.shopItemsAdd} items to future Vending Machines`,
                    });
                    break;
                case "damage_reduce":
                    GameState.playerDamageReduction += itemEffect.damage_reduce;
                    EventBus.emit(UI_EVENTS.DISPLAY_MESSAGE, {
                        type: UI_MESSAGE_TYPES.SUCCESS,
                        message: "Damage Reduction Increased",
                    });
                    break;
                case "luckAdd":
                    GameState.luck += itemEffect.luckAdd;
                    EventBus.emit(UI_EVENTS.DISPLAY_MESSAGE, {
                        type: UI_MESSAGE_TYPES.SUCCESS,
                        message: "Up all night to get Lucky 🌟",
                    });
                    break;
                case "fightGridExpand":
                    GameState.fightGridHeight += itemEffect.fightGridExpand;
                    GameState.fightGridWidth += itemEffect.fightGridExpand;
                    EventBus.emit(UI_EVENTS.DISPLAY_MESSAGE, {
                        type: UI_MESSAGE_TYPES.SUCCESS,
                        message: "Room size width and height increased",
                    });
                    break;
                case "bombNumberReduce":
                    GameState.bombNum -= itemEffect.bombNumberReduce;
                    EventBus.emit(UI_EVENTS.DISPLAY_MESSAGE, {
                        type: UI_MESSAGE_TYPES.SUCCESS,
                        message: "Reduced Bomb Number",
                    });
                    break;
                case "fightGoldIncrease":
                    GameState.fightGoldReward += itemEffect.fightGoldIncrease;
                    EventBus.emit(UI_EVENTS.DISPLAY_MESSAGE, {
                        type: UI_MESSAGE_TYPES.SUCCESS,
                        message: "Increased Room reward Gold",
                    });
                    break;
            }
        });
    }

    onClick() {
        if (this.type && this.item && this.available) {
            if (this.item?.effect) {
                // check if player has money to  buy item
                if (this.item.cost > GameState.gold) {
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
                        this.tile.setFrame(2);
                        this.numPadImage.setFrame(2);
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
