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

        // final floor
        if (GameState.level === GAME_CONSTANTS.endLevel) {
            const gameEndButton = this.scene.make.text({
                x: this.scene.scale.width / 2 - 800,
                y: 100,
                text: "Floor Cleaned! You find a portal to a parallel dimension ⏩⏩⏩",
                style: {
                    fontSize: 42,
                },
            });

            gameEndButton.setInteractive();
            gameEndButton.on("pointerdown", () => {
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
                    UI_EVENTS.DISPLAY_MESSAGE,
                    {
                        type: UI_EVENTS.DISPLAY_MESSAGE,
                        message: `Flawless victory! $${GameState.fightFlawlessGoldReward} Extra`,
                    },
                    "15000",
                );
                EventBus.emit(
                    PLAYER_EVENTS.GAIN_GOLD,
                    GameState.fightFlawlessGoldReward,
                    true,
                );
            }

            EventBus.emit(
                PLAYER_EVENTS.GAIN_GOLD,
                GameState.fightGoldReward + GameState.fightBossGoldReward,
            );

            // go to next floor
            const returnButton = this.scene.make.text({
                x: this.scene.scale.width / 2 - 500,
                y: 130,
                text: "Floor Cleaned! You find creepy stairs downward... ↘",
                style: {
                    fontSize: 42,
                },
            });

            returnButton.setInteractive();
            returnButton.on("pointerdown", () => {
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
