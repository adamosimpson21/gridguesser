import { Scene } from "phaser";
import { EventBus } from "@/game/EventBus";
import {
    GAME_EVENTS,
    PLAYER_EVENTS,
    SCENE_EVENTS,
    UI_EVENTS,
} from "@/game/types/events";
import { shopItemType, testingItems } from "@/game/types/shopItems";
import { GameState } from "@/game/classes/GameState";
import FightInputMenu from "@/game/classes/FightInputMenu";
import { Hud } from "@/game/scenes/Hud";
import { headingText, paragraphText } from "@/game/types/textStyleConstructor";
import { addTooltip, TOOLTIP_CONSTANTS } from "@/game/functions/addTooltip";

export default class HudDisplay {
    public scene: Hud;
    public name: string;
    public hp: number;
    public gold: number;
    public maxHp: number;
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

    constructor(
        scene: Hud,
        name: string,
        hp: number,
        gold: number,
        maxHp: number,
    ) {
        this.scene = scene;
        this.name = name;
        this.hp = hp;
        this.maxHp = maxHp;
        this.gold = gold;
        this.width = 420;
        this.height = this.scene.scale.height;
        this.xOffset = 40;
        this.yOffset = 160;
        this.lineHeight = 60;
        this.fontSize = "36px";
        this.font = "Courier";
        this.strokeWidth = 5;

        this.hudBoard = this.scene.add.container(1500, 0);

        this.fightInputDisplay = new FightInputMenu(scene);

        this.clipboard = this.scene.add.image(
            this.width / 2,
            this.height / 2,
            "clipboard",
        );

        console.log("creating displays");

        this.nameDisplay = this.scene.add.text(
            this.xOffset,
            this.yOffset,
            `Name: ${this.name}`,
            headingText({}),
        );

        this.hpDisplay = this.scene.add.text(
            this.xOffset,
            this.yOffset + this.lineHeight * 2,
            // `Health: ${new Array(maxHp).fill("♥").join(" ")}`,
            `Health: ${hp}/${maxHp}`,
            headingText({}),
        );

        this.goldDisplay = this.scene.add.text(
            this.xOffset,
            this.yOffset + this.lineHeight * 1,
            `$${gold} `,
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
        EventBus.on(GAME_EVENTS.RESET, () => {
            this.upgradeDisplay.removeAll(true);
        });
        EventBus.on(UI_EVENTS.UPDATE_NAME, (name: string) => {
            this.nameDisplay.setText(name);
        });
        EventBus.on(
            UI_EVENTS.UPDATE_GOLD,
            (gold: number, goldDifference: number, silent?: boolean) => {
                console.log("updating gold", gold);
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
                console.log("updating hp", hp);
                // low hp warning
                if (
                    hp <=
                    GameState.bombIntensity - GameState.playerDamageReduction
                ) {
                    this.hpDisplay.setStyle({ color: "red" });
                } else {
                    this.hpDisplay.setStyle({ color: "black" });
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
        EventBus.on(
            UI_EVENTS.UPDATE_UPGRADES,
            (
                upgrades: shopItemType[],
                upgrade: shopItemType,
                gained: boolean,
                silent?: boolean,
            ) => {
                const upgradeTweenText = this.scene.make
                    .text({
                        x: ((upgrades.length - 1) % 6) * 56 + 30,
                        y:
                            Math.floor((upgrades.length - 1) / 6) * 48 +
                            this.upgradeDisplay.displayHeight / 2,
                        text: upgrade.icon,
                        style: headingText({}),
                    })
                    .setOrigin(0.5, 0.5);
                this.upgradeDisplay.add(upgradeTweenText);

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
