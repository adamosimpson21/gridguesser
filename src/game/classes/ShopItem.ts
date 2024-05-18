import { Scene } from "phaser";
import {
    SHOP_CONSTANTS,
    SHOP_ITEMS,
    shopItemType,
} from "@/game/types/shopItems";
import ShopGrid from "@/game/classes/ShopGrid";
import { EventBus } from "@/game/EventBus";
import {
    GAME_EVENTS,
    PLAYER_EVENTS,
    UI_EVENTS,
    UI_MESSAGE_TYPES,
} from "@/game/types/events";
import { GameState } from "@/game/classes/GameState";
import { paragraphText } from "@/game/types/textStyleConstructor";
import { addTooltip, TOOLTIP_CONSTANTS } from "@/game/functions/addTooltip";

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
    private grid: ShopGrid;
    private tooltipName: Phaser.GameObjects.Text;
    private tooltipInnerObject: Phaser.GameObjects.Container;
    private tooltipDescription: Phaser.GameObjects.Text;
    private tooltipCost: Phaser.GameObjects.Text;
    private tooltipImage: Phaser.GameObjects.Text;
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

        this.tile = grid.scene.make.text({
            x: grid.offset.x + x * SHOP_CONSTANTS.SHOP_TILE_WIDTH,
            y: grid.offset.y + y * SHOP_CONSTANTS.SHOP_TILE_HEIGHT,
            text: "⬜",
            style: {
                fontSize: SHOP_CONSTANTS.SHOP_TILE_FONT_SIZE * 2,
                padding: { y: 10 },
            },
        });
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
        this.numPadImage = grid.scene.make.text({
            x: x * SHOP_CONSTANTS.NUM_PAD_TILE_WIDTH,
            y: y * SHOP_CONSTANTS.NUM_PAD_TILE_HEIGHT,
            text: "⬜",
            style: {
                fontSize: SHOP_CONSTANTS.SHOP_TILE_FONT_SIZE * 2,
                padding: { y: 10 },
            },
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
        this.tooltipImage = grid.scene.make.text({
            x: 0,
            y: 64,
            text: "",
            style: paragraphText({
                wordWrapWidth: TOOLTIP_CONSTANTS.BASE_WIDTH,
                fontSize: "32px",
                align: "left",
            }),
        });

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
        this.tile.setText(itemToAssign.icon);
        // this.name.setText(itemToAssign.name);
        this.tooltipName.setText(itemToAssign.name);
        this.tooltipImage
            .setText(itemToAssign.icon)
            .setPosition(0, this.tooltipName.displayHeight + 8);
        // this.description.setText(itemToAssign.description);
        this.tooltipDescription
            .setText(itemToAssign.description)
            .setPosition(
                0,
                this.tooltipImage.y + this.tooltipImage.displayHeight + 8,
            );
        this.cost.setText(`$${itemToAssign.cost}`);
        this.tooltipCost
            .setText(`$${itemToAssign.cost}`)
            .setPosition(
                0,
                this.tooltipDescription.y +
                    this.tooltipDescription.displayHeight +
                    8,
            );
        this.numPadImage.setText(itemToAssign.icon);
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
                    GameState.player.luck += itemEffect.luckAdd;
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
