import { Scene } from "phaser";
import FightGridCell from "./FightGridCell";
import { GAME_EVENTS, PLAYER_EVENTS, UI_EVENTS } from "@/game/types/events";
import { EventBus } from "@/game/EventBus";
import { Fight } from "@/game/scenes/Fight";
import { SCENES } from "@/game/types/scenes";
import { GameState } from "@/game/classes/GameState";
import GameObject = Phaser.GameObjects.GameObject;
import FightGrid from "@/game/classes/FightGrid";
import { BossFight } from "@/game/scenes/BossFight";
import { GAME_CONSTANTS } from "@/game/types/gameConstants";
import { FIGHT_CONSTANTS } from "@/game/types/fightConstants";

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
        this.returnButton.setText(
            "Floor Cleaned! You find 3 keys inside the Boss's desk. Choose one to take and descend down the creepy staircase...",
        );

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
                        this.scene.transitionScene(SCENES.GameWon);
                    },
                    callbackScope: this,
                });
            });
        } else {
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
                            {
                                fontSize: 38,
                                color: "black",
                                wordWrap: {
                                    width: 350,
                                    useAdvancedWrap: true,
                                },
                            },
                        )
                        .setDepth(3),
                );
            }

            EventBus.emit(
                PLAYER_EVENTS.GAIN_GOLD,
                GameState.fightGoldReward + GameState.fightBossGoldReward,
                true,
            );

            this.scene.tweens.add({
                targets: this.endGameBoard,
                y: 200,
            });
            this.scene.add.tween({
                targets: [this.endGameTrashCan, this.endGameTrashCanOver],
                y: 600,
            });

            this.returnButton.on("pointerdown", () => {
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
                        EventBus.emit(GAME_EVENTS.INCREMENT_LEVEL);
                        this.scene.scene.stop(SCENES.Overworld);
                        this.scene.transitionScene(SCENES.Overworld);
                    },
                    callbackScope: this,
                });
            });
        }
    }
}
