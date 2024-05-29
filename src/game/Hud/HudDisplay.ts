import { EventBus } from "@/game/EventBus/EventBus";
import { GAME_EVENTS, SCENE_EVENTS, UI_EVENTS } from "@/game/EventBus/events";
import { shopItemType } from "@/game/Shop/shopItems";
import { GameState } from "@/game/GameState/GameState";
import FightInputMenu from "@/game/Hud/FightInputMenu";
import { Hud } from "@/game/Hud/Hud";
import {
    headingText,
    paragraphText,
} from "@/game/constants/textStyleConstructor";
import { addTooltip, TOOLTIP_CONSTANTS } from "@/game/functions/addTooltip";

export default class HudDisplay {
    public scene: Hud;
    public nameDisplay: Phaser.GameObjects.Text;
    public hpDisplay: Phaser.GameObjects.Text;
    public goldDisplay: Phaser.GameObjects.Text;
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
        this.postFxPlugin = this.scene.plugins.get(
            "rexglowfilter2pipelineplugin",
        );

        this.fightInputDisplay = new FightInputMenu(scene);

        this.clipboard = this.scene.add.image(
            this.width / 2,
            this.height / 2,
            "clipboard",
        );

        this.nameDisplay = this.scene.add.text(
            this.xOffset,
            this.yOffset,
            `${GameState.name}`,
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

        this.hudBoard.add(this.clipboard);
        this.hudBoard.add(this.nameDisplay);
        this.hudBoard.add(this.hpDisplay);
        this.hudBoard.add(this.goldDisplay);
        this.hudBoard.add(this.upgradeDisplay);

        EventBus.on(SCENE_EVENTS.LEAVE_FIGHT, () => {
            this.fightInputDisplay.hide();
        });
        EventBus.on(SCENE_EVENTS.POPULATE_FIGHT, () => {
            this.fightInputDisplay.show();
        });
        EventBus.on(GAME_EVENTS.START_NEW_GAME, () => {
            this.upgradeDisplay.removeAll(true);
        });
        EventBus.on(UI_EVENTS.UPDATE_NAME, (name: string) => {
            this.nameDisplay.setText(name);
        });
        EventBus.on(
            UI_EVENTS.UPDATE_GOLD,
            (gold: number, goldDifference: number, silent?: boolean) => {
                this.goldDisplay.setText(`$${gold} `);
                // this.goldDisplay.setText(`$glod `);
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
                    // EventBus.emit(
                    //     UI_EVENTS.DISPLAY_MESSAGE,
                    //     {
                    //         type: UI_EVENTS.UPDATE_GOLD,
                    //         message: `New money amount $${gold}`,
                    //     },
                    //     "5000",
                    // );
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
                // this.hpDisplay.setText(`Health: hps`);

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

                // if (!silent) {
                //     EventBus.emit(
                //         UI_EVENTS.DISPLAY_MESSAGE,
                //         {
                //             type: UI_EVENTS.UPDATE_HEALTH,
                //             message: `New HP amount ${hp}`,
                //         },
                //         "5000",
                //     );
                // }
            },
        );
        EventBus.on(UI_EVENTS.USE_UPGRADE, (upgradeId: string) => {
            const upgradeToBeUsed: Phaser.GameObjects.Text =
                this.upgradeDisplay.getByName(upgradeId);
            // upgradeToBeUsed.postFxPipline("glowColor");
        });
        EventBus.on(
            UI_EVENTS.UPDATE_UPGRADES,
            (
                upgrade: shopItemType,
                index: number,
                gained: boolean,
                silent?: boolean,
            ) => {
                console.log("updating upgrades:", upgrade);
                const upgradeTweenText = this.scene.make
                    .text({
                        x: (index % 6) * 56 + 30,
                        y:
                            Math.floor(index / 6) * 48 +
                            this.upgradeDisplay.displayHeight / 2,
                        text: upgrade.icon,
                        style: headingText({}),
                    })
                    .setOrigin(0.5, 0.5)
                    .setName(upgrade.id);
                this.upgradeDisplay.add(upgradeTweenText);
                // @ts-ignore
                if (upgrade.activated && this.postFxPlugin?.add) {
                    console.log("in activated item", this.postFxPlugin);
                    // @ts-ignore
                    upgradeTweenText.postFxPipline = this.postFxPlugin.add(
                        upgradeTweenText,
                        {
                            distance: 8,
                            outerStrength: 6,
                            innerStrength: 2,
                            glowColor: 0x00ff00,
                        },
                    );
                }

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
                const tooltipImage = this.scene.make.text({
                    x: 0,
                    y: tooltipName.displayHeight + 8,
                    text: upgrade.icon,
                    style: paragraphText({
                        wordWrapWidth: TOOLTIP_CONSTANTS.BASE_WIDTH,
                        fontSize: "32px",
                        align: "left",
                    }),
                });
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
                addTooltip(this.scene, upgradeTweenText, {
                    innerObject: upgradeTooltipInnerObject,
                });

                const upgradeTween = this.scene.tweens.chain({
                    targets: upgradeTweenText,
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
            },
        );
    }
}
