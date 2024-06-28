import { EventBus } from "@/game/EventBus/EventBus";
import { GAME_EVENTS, SCENE_EVENTS, UI_EVENTS } from "@/game/EventBus/events";
import { SHOP_ITEMS, shopItemType } from "@/game/Shop/shopItems";
import { GameState } from "@/game/GameState/GameState";
import FightInputMenu from "@/game/Hud/FightInputMenu";
import { Hud } from "@/game/Hud/Hud";
import {
    headingText,
    paragraphText,
} from "@/game/constants/textStyleConstructor";
import { addTooltip, TOOLTIP_CONSTANTS } from "@/game/functions/addTooltip";
import { SCENES } from "@/game/constants/scenes";

export default class HudDisplay {
    public scene: Hud;
    public nameDisplay: Phaser.GameObjects.Text;
    public hpDisplay: Phaser.GameObjects.Text;
    public goldDisplay: Phaser.GameObjects.Text;
    public settingsGear: Phaser.GameObjects.Text;
    public upgradeDisplay: Phaser.GameObjects.Container;
    public height: number;
    public width: number;
    public hudBoard: Phaser.GameObjects.Container;
    public clipboard: Phaser.GameObjects.Image;
    public xOffset: number;
    public yOffset: number;
    public lineHeight: number;
    public fontSize: string;
    public font: string;
    public strokeWidth: number;
    public fightInputDisplay: FightInputMenu;
    private postFxPlugin: Phaser.Plugins.BasePlugin | Function | null;

    constructor(scene: Hud) {
        this.scene = scene;
        this.width = 420;
        this.height = this.scene.scale.height;
        this.xOffset = 40;
        this.yOffset = 160;
        this.lineHeight = 60;

        this.hudBoard = this.scene.add.container(1500, 0);

        this.fightInputDisplay = new FightInputMenu(scene);

        this.clipboard = this.scene.add.image(
            this.width / 2,
            this.height / 2,
            "clipboard",
        );

        this.nameDisplay = this.scene.add.text(
            this.xOffset,
            this.yOffset,
            `${GameState.character.name}`,
            headingText({}),
        );

        this.goldDisplay = this.scene.add.text(
            this.xOffset,
            this.yOffset + this.lineHeight * 1,
            `$${GameState.gold} `,
            headingText({}),
        );

        this.hpDisplay = this.scene.add.text(
            this.xOffset,
            this.yOffset + this.lineHeight * 2,
            // `Health: ${new Array(maxHp).fill("♥").join(" ")}`,
            `Health: ${GameState.hp}/${GameState.maxHp}`,
            headingText({}),
        );

        this.upgradeDisplay = this.scene.add.container(
            this.xOffset,
            this.yOffset + this.lineHeight * 4,
        );

        this.settingsGear = this.scene.add.text(
            350,
            this.yOffset - 50,
            "⚙",
            headingText({}),
        );
        this.settingsGear.setInteractive();
        this.settingsGear.on("pointerdown", () => {
            this.scene.scene.launch(SCENES.Settings);
        });

        this.hudBoard.add(this.clipboard);
        this.hudBoard.add(this.nameDisplay);
        this.hudBoard.add(this.hpDisplay);
        this.hudBoard.add(this.goldDisplay);
        this.hudBoard.add(this.upgradeDisplay);
        this.hudBoard.add(this.settingsGear);

        EventBus.on(SCENE_EVENTS.LEAVE_FIGHT, () => {
            this.fightInputDisplay.hide();
        });
        EventBus.on(SCENE_EVENTS.POPULATE_FIGHT, () => {
            this.fightInputDisplay.show();
        });
        EventBus.on(GAME_EVENTS.START_NEW_GAME, () => {
            this.upgradeDisplay.removeAll(true);
            this.show();
        });
        EventBus.on(UI_EVENTS.UPDATE_NAME, (name: string) => {
            this.nameDisplay.setText(name);
        });

        EventBus.on(SCENE_EVENTS.LEAVE_FIGHT, () => {
            //reset activated item
            this.upgradeDisplay
                .getAll()
                // @ts-ignore
                .forEach((upgrade: Phaser.GameObjects.Image) => {
                    if (
                        SHOP_ITEMS[upgrade.name] &&
                        SHOP_ITEMS[upgrade.name].activated
                    ) {
                        upgrade.setFrame(SHOP_ITEMS[upgrade.name].icon + 1);
                    }
                });
        });
        EventBus.on(
            UI_EVENTS.UPDATE_GOLD,
            (gold: number, goldDifference: number, silent?: boolean) => {
                this.goldDisplay.setText(`$${gold} `);
                if (!silent) {
                    const goldChangeTween = this.scene.make
                        .text({
                            x: 0,
                            y: 0,
                            text: `${goldDifference}`,
                            style: headingText({ fontSize: "40px" }),
                        })
                        .setPosition(
                            this.goldDisplay.x + 30,
                            this.goldDisplay.y + 30,
                        );

                    if (goldDifference >= 0) {
                        // gain life
                        goldChangeTween.setColor("green");
                    } else {
                        // lose life
                        goldChangeTween.setColor("red");
                    }
                    this.hudBoard.add(goldChangeTween);
                    this.scene.tweens.add({
                        targets: goldChangeTween,
                        y: goldDifference >= 0 ? "-=75" : "+=75",
                        alpha: 0,
                        duration: 3500,
                    });
                }
            },
        );
        EventBus.on(
            UI_EVENTS.UPDATE_HEALTH,
            (hp: number, maxHp: number, hpChange: number, silent?: boolean) => {
                // low hp warning
                if (
                    hp <=
                    GameState.bombIntensity - GameState.playerDamageReduction
                ) {
                    this.hpDisplay.setColor("red");
                } else {
                    this.hpDisplay.setColor("black");
                }
                this.hpDisplay.setText(`Health: ${hp}/${maxHp}`);

                if (!silent) {
                    const hpChangeTween = this.scene.make
                        .text({
                            x: 0,
                            y: 0,
                            text: `${hpChange}`,
                            style: headingText({ fontSize: "40px" }),
                        })
                        .setPosition(
                            this.hpDisplay.x + 150,
                            this.hpDisplay.y + 30,
                        );

                    if (hpChange >= 0) {
                        // gain life
                        hpChangeTween.setColor("green");
                    } else {
                        // lose life
                        hpChangeTween.setColor("red");
                    }
                    this.hudBoard.add(hpChangeTween);
                    this.scene.tweens.add({
                        targets: hpChangeTween,
                        y: hpChange >= 0 ? "-=75" : "+=75",
                        alpha: 0,
                        duration: 3500,
                    });
                }
            },
        );
        EventBus.on(UI_EVENTS.USE_UPGRADE, (index: number) => {
            // @ts-ignore
            const upgradeToBeUsed: Phaser.GameObjects.Image =
                this.upgradeDisplay.getAll()[index];
            upgradeToBeUsed.setFrame(SHOP_ITEMS[upgradeToBeUsed.name].icon + 2);
        });
        EventBus.on(
            UI_EVENTS.UPDATE_UPGRADES,
            (
                upgrade: shopItemType,
                index: number,
                gained: boolean,
                silent?: boolean,
            ) => {
                // uses update
                this.scene.events.once("update", () => {
                    const upgradeTweenImage = this.scene.make
                        .image({
                            x: (index % 6) * 60 + 30,
                            y:
                                Math.floor(index / 6) * 52 +
                                this.upgradeDisplay.displayHeight / 2,
                            key: "shop_items",
                            frame: upgrade.activated
                                ? upgrade.icon + 1
                                : upgrade.icon,
                        })
                        .setDisplaySize(32, 32)
                        .setOrigin(0.5, 0.5)
                        .setName(upgrade.id);
                    this.upgradeDisplay.add(upgradeTweenImage);

                    const upgradeTooltipInnerObject = this.scene.add.container(
                        TOOLTIP_CONSTANTS.X_OFFSET,
                        TOOLTIP_CONSTANTS.Y_OFFSET,
                    );
                    const tooltipName = this.scene.make.text({
                        x: 0,
                        y: 0,
                        text: upgrade.name,
                        style: paragraphText({
                            wordWrapWidth: TOOLTIP_CONSTANTS.BASE_WIDTH,
                            align: "left",
                        }),
                    });
                    const tooltipImage = this.scene.make
                        .image({
                            x: 0,
                            y: tooltipName.displayHeight + 8,
                            key: "shop_items",
                            frame: upgrade.icon,
                        })
                        .setDisplaySize(48, 48)
                        .setOrigin(0, 0);
                    const tooltipCost = this.scene.make.text({
                        x: 0,
                        y: tooltipImage.y + tooltipImage.displayHeight + 8,
                        text: `$${upgrade.cost}`,
                        style: paragraphText({
                            align: "left",
                            wordWrapWidth: TOOLTIP_CONSTANTS.BASE_WIDTH,
                        }),
                    });
                    const tooltipDescription = this.scene.make.text({
                        x: 0,
                        y: tooltipCost.y + tooltipCost.displayHeight + 8,
                        text: upgrade.description,
                        style: paragraphText({
                            wordWrapWidth: TOOLTIP_CONSTANTS.BASE_WIDTH,
                            align: "left",
                        }),
                    });

                    upgradeTooltipInnerObject.add([
                        tooltipName,
                        tooltipDescription,
                        tooltipCost,
                        tooltipImage,
                    ]);
                    addTooltip(this.scene, upgradeTweenImage, {
                        innerObject: upgradeTooltipInnerObject,
                    });

                    const upgradeTween = this.scene.tweens.chain({
                        targets: upgradeTweenImage,
                        tweens: [
                            {
                                duration: 250,
                                scaleX: 2,
                                scaleY: 2,
                            },
                            {
                                duration: 250,
                                angle: 45,
                            },
                            {
                                duration: 500,
                                angle: -45,
                            },
                            {
                                duration: 250,
                                angle: 0,
                            },
                            {
                                duration: 500,
                                scaleX: 1,
                                scaleY: 1,
                            },
                        ],
                    });
                });
            },
        );
        EventBus.on(SCENE_EVENTS.ENTER_MAIN_MENU, () => {
            this.hide();
        });
        EventBus.on(SCENE_EVENTS.SHOW_HUD, () => {
            this.show();
        });

        // initially hidden
        this.hide();
    }

    show() {
        this.hudBoard.setAlpha(1);
    }

    hide() {
        this.hudBoard.setAlpha(0);
    }
}
