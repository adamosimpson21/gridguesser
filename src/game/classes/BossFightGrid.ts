import { Game, Scene } from "phaser";
import FightGridCell from "./FightGridCell";
import {
    FIGHT_EVENTS,
    GAME_EVENTS,
    PLAYER_EVENTS,
    UI_EVENTS,
} from "@/game/types/events";
import { EventBus } from "@/game/EventBus";
import { Fight } from "@/game/scenes/Fight";
import { SCENES } from "@/game/types/scenes";
import { GameState } from "@/game/classes/GameState";
import GameObject = Phaser.GameObjects.GameObject;
import FightGrid from "@/game/classes/FightGrid";
import { BossFight } from "@/game/scenes/BossFight";
import { GAME_CONSTANTS } from "@/game/types/gameConstants";
import {
    FIGHT_CONSTANTS,
    FIGHT_INPUT_TYPES,
} from "@/game/types/fightConstants";
import { KEY_ITEMS, keyItemType } from "@/game/types/keyItems";
import { getInputUsesAvailable } from "@/game/functions/getInputUsesAvailable";
import { headingText } from "@/game/types/textStyleConstructor";
import {
    transitionScene,
    transitionSceneToOverworldFromBoss,
} from "@/game/functions/transitionScene";

export default class BossFightGrid extends FightGrid {
    constructor(
        scene: BossFight,
        width: number,
        height: number,
        bombs: number,
    ) {
        super(scene, width, height, bombs);
    }

    gameWon(flawless: boolean) {
        this.playing = false;
        this.state = 2;
        this.returnButton.setText("Descend down the creepy staircase...");

        // final floor
        if (GameState.level === GAME_CONSTANTS.endLevel) {
            this.returnButton.setText(
                "Floor Cleaned! You find a portal to a parallel dimension ⏩⏩⏩",
            );

            this.returnButton.setInteractive();
            this.returnButton.on("pointerdown", () => {
                this.scene.time.addEvent({
                    delay: 1000,
                    loop: false,
                    callback: () => {
                        transitionScene(this.scene, SCENES.GameWon);
                    },
                    callbackScope: this,
                });
            });
        } else {
            if (GameState.level === 1) {
                //unleash all advanced mechanics
                GameState.fightCanHaveTrashTiles = true;
                GameState.fightCanHaveLyingTiles = true;
                GameState.fightCanHaveMultiBombTiles = true;
                GameState.bombCounterCanLie = true;
            }
            this.createBossEndModal(flawless);
        }
    }

    afterEndBossModal(flawless: boolean) {
        if (flawless) {
            EventBus.emit(
                PLAYER_EVENTS.GAIN_GOLD,
                GameState.fightFlawlessGoldReward,
                true,
            );

            this.endGameBoard.add(
                this.scene.add
                    .text(
                        80,
                        300,
                        `Clean Sweep! $${GameState.fightFlawlessGoldReward} extra`,
                        headingText({
                            wordWrapWidth: 350,
                            lineSpacing: 24,
                            fontSize: "24px",
                        }),
                    )
                    .setDepth(3),
            );

            this.returnButtonSubtext.setText(
                `$${GameState.fightGoldReward} + $${GameState.fightFlawlessGoldReward} earned`,
            );
        }

        EventBus.emit(
            PLAYER_EVENTS.GAIN_GOLD,
            GameState.fightGoldReward + GameState.fightBossGoldReward,
            true,
        );

        EventBus.emit(FIGHT_EVENTS.FIGHT_WON, true);

        this.scene.tweens.add({
            targets: this.endGameBoard,
            y: 200,
        });
        this.scene.add.tween({
            targets: [this.endGameTrashCan, this.endGameTrashCanOver],
            y: 600,
        });

        this.trashBG.on(
            "pointerdown",
            () => {
                this.scene.tweens.add({
                    targets: this.endGameBoard,
                    y: 800,
                });
                this.scene.tweens.add({
                    targets: [this.endGameTrashCan, this.endGameTrashCanOver],
                    y: 0,
                });
                this.scene.time.addEvent({
                    delay: 1000,
                    loop: false,
                    callback: () => {
                        transitionSceneToOverworldFromBoss(this.scene);
                    },
                    callbackScope: this,
                });
            },
            this,
        );
    }

    createBossEndModal(flawless: boolean) {
        const bossDeskImage = this.scene.add
            .image(
                this.scene.scale.width / 2,
                this.scene.scale.height / 2,
                "boss_desk",
            )
            .setAlpha(1);
        const background = this.scene.add
            .image(
                this.scene.scale.width / 2,
                this.scene.scale.height / 2,
                "black_screen",
            )
            .setAlpha(0.66);
        const modalContainer = this.scene.add.container(
            this.scene.scale.width / 2 - 200,
            this.scene.scale.height / 2 - 200,
        );

        modalContainer.add(
            this.scene.add.text(
                -200,
                -200,
                "After cleaning the Boss's office, you find 3 keys to add to your wonderous key ring. Choose one.",
                {
                    fontSize: "40px",
                    wordWrap: { width: 800, useAdvancedWrap: true },
                },
            ),
        );

        const totalKeysAvailable = Object.entries(KEY_ITEMS).filter(
            (item) => !GameState.fightInputTypes.includes(item[1].id),
        );
        let threeKeys = [] as [string, keyItemType][];
        if (totalKeysAvailable.length <= 3) {
            threeKeys = totalKeysAvailable;
        } else {
            do {
                const keyToAdd =
                    totalKeysAvailable[
                        Math.floor(
                            Phaser.Math.Between(
                                0,
                                totalKeysAvailable.length - 1,
                            ),
                        )
                    ];
                if (!threeKeys.includes(keyToAdd)) {
                    threeKeys.push(keyToAdd);
                }
            } while (threeKeys.length < 3);
        }

        threeKeys.forEach((key, index) => {
            const keyImage = this.scene.add
                .image(-100, index * 200, "black_key")
                .setOrigin(0, 0)
                .setDisplaySize(350, 100);
            keyImage.setInteractive();
            keyImage.on("pointerdown", () => {
                EventBus.emit(FIGHT_EVENTS.ADD_INPUT_TYPE, key[0]);
                modalContainer.setAlpha(0);
                background.setAlpha(0);
                bossDeskImage.setAlpha(0);
                this.afterEndBossModal(flawless);
            });
            const keyName = this.scene.add.text(
                -8,
                index * 200 + 26,
                key[1].name,
                {
                    fontSize: "40px",
                },
            );
            const keyDescription = this.scene.add.text(
                -100,
                index * 200 + 100,
                key[1].description,
                {
                    fontSize: "40px",
                    wordWrap: { width: 800, useAdvancedWrap: true },
                },
            );

            const usesAvailable = getInputUsesAvailable(key[0]);

            const keyNumIcon = this.scene.make.text({
                x: -56,
                y: index * 200 + 28,
                text: `${usesAvailable === -1 ? "♾" : usesAvailable}`,
                style: {
                    color: "white",
                    fontSize: "40px",
                },
            });

            modalContainer.add(keyImage);
            modalContainer.add(keyName);
            modalContainer.add(keyDescription);
            modalContainer.add(keyNumIcon);
        });
    }
}
