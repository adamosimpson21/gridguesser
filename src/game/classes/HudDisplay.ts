import { Scene } from "phaser";
import { EventBus } from "@/game/EventBus";
import { SCENE_EVENTS, UI_EVENTS } from "@/game/types/events";
import { shopItemType } from "@/game/types/shopItems";
import { GameState } from "@/game/classes/GameState";
import FightInputMenu from "@/game/classes/FightInputMenu";
import { Hud } from "@/game/scenes/Hud";
import { headingText, paragraphText } from "@/game/types/textStyleConstructor";

export default class HudDisplay {
    public scene: Hud;
    public name: string;
    public hp: number;
    public gold: number;
    public maxHp: number;
    public nameDisplay: Phaser.GameObjects.Text;
    public hpDisplay: Phaser.GameObjects.Text;
    public goldDisplay: Phaser.GameObjects.Text;
    public upgradeDisplay: Phaser.GameObjects.Text;
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
        this.create();
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
            `$ ${gold} `,
            headingText({}),
        );

        this.upgradeDisplay = this.scene.add.text(
            this.xOffset,
            this.yOffset + this.lineHeight * 4,
            "",
            headingText({}),
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
    }

    create() {
        EventBus.on(UI_EVENTS.UPDATE_NAME, (name: string) => {
            this.nameDisplay.setText(name);
        });
        EventBus.on(UI_EVENTS.UPDATE_GOLD, (gold: number, silent?: boolean) => {
            this.goldDisplay.setText(`$ ${gold} `);
            if (!silent) {
                EventBus.emit(
                    UI_EVENTS.DISPLAY_MESSAGE,
                    {
                        type: UI_EVENTS.UPDATE_GOLD,
                        message: `New money amount $${gold}`,
                    },
                    "5000",
                );
            }
        });
        EventBus.on(
            UI_EVENTS.UPDATE_HEALTH,
            (hp: number, maxHp: number, silent?: boolean) => {
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
                    EventBus.emit(
                        UI_EVENTS.DISPLAY_MESSAGE,
                        {
                            type: UI_EVENTS.UPDATE_HEALTH,
                            message: `New HP amount ${hp}`,
                        },
                        "5000",
                    );
                }
            },
        );
        EventBus.on(
            UI_EVENTS.UPDATE_UPGRADES,
            (upgrades: shopItemType[], silent?: boolean) => {
                this.upgradeDisplay.setText(
                    `${upgrades.map((obj) => obj.icon).join(" ")}`,
                );
                if (!silent) {
                    EventBus.emit(
                        UI_EVENTS.DISPLAY_MESSAGE,
                        {
                            type: UI_EVENTS.UPDATE_UPGRADES,
                            message: `New Upgrade`,
                        },
                        "5000",
                    );
                }
            },
        );
    }
}
