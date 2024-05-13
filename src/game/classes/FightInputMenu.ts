import { GameState } from "@/game/classes/GameState";
import { GameObjects, Scene } from "phaser";
import {
    FIGHT_CONSTANTS,
    FIGHT_INPUT_TYPES,
} from "@/game/types/fightConstants";
import { Fight } from "@/game/scenes/Fight";
import { EventBus } from "@/game/EventBus";
import { FIGHT_EVENTS, GAME_EVENTS } from "@/game/types/events";
import { BossFight } from "@/game/scenes/BossFight";
import { Hud } from "@/game/scenes/Hud";
import UppercaseFirst = Phaser.Utils.String.UppercaseFirst;

export default class FightInputMenu {
    public availableInputs: string[];
    public currentInput: string;
    public scene: Hud;
    public inputBoard: any;
    public previousCurrentInput: string;
    private background: Phaser.GameObjects.Image;
    constructor(scene: Hud) {
        this.scene = scene;

        const x = Math.floor(
            scene.scale.width - FIGHT_CONSTANTS.TILE_WIDTH * 7,
        );
        const y = Math.floor(scene.scale.height / 2 + 100);

        this.inputBoard = scene.add.container(x, y);

        // this.background = this.scene.add
        //     .image(-75, -90, "key_ring")
        //     .setOrigin(0, 0)
        //     .setDisplaySize(390, 300);

        // this.inputBoard.add(this.background);
        this.populateInputBoard();

        // initially hidden
        // hide hidden for testing purposes
        // this.hide();

        EventBus.on(GAME_EVENTS.GAME_OVER, () => {
            this.inputBoard.list.forEach((input: Phaser.GameObjects.Text) => {
                input.removeInteractive();
            });
        });
        EventBus.on(FIGHT_EVENTS.USE_LIMITED_INPUT, (inputTypeUse: string) => {
            this.inputBoard.list.forEach(
                (inputText: Phaser.GameObjects.Text) => {
                    if (inputText.name === inputTypeUse + "_NUM") {
                        if (inputTypeUse === FIGHT_INPUT_TYPES.REMOVE_TRASH) {
                            inputText.setText(
                                `${GameState.instanceRemoveTrashNum}`,
                            );
                        } else if (
                            inputTypeUse === FIGHT_INPUT_TYPES.REMOVE_BOMB
                        ) {
                            inputText.setText(
                                `${GameState.instanceRemoveBombNum}`,
                            );
                        } else if (
                            inputTypeUse === FIGHT_INPUT_TYPES.REMOVE_LIES
                        ) {
                            inputText.setText(
                                `${GameState.instanceRemoveLyingNum}`,
                            );
                        }
                    }
                },
            );
        });
        EventBus.on(FIGHT_EVENTS.ADD_INPUT_TYPE, (newInputType: string) => {});
        EventBus.on(FIGHT_EVENTS.CHANGE_INPUT_TYPE, (newInput: string) => {
            switch (newInput) {
                case FIGHT_INPUT_TYPES.REVEAL:
                    this.scene.input.setDefaultCursor(
                        "url(\"data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' height='48' width='48'><text y='32' font-size='32'>🔍</text><path d='M0,4 L0,0 L4,0' fill='red' /></svg>\"), auto",
                    );
                    break;

                case FIGHT_INPUT_TYPES.FLAG:
                    this.scene.input.setDefaultCursor(
                        "url(\"data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' height='48' width='48'><text y='32' font-size='32'>🚩</text><path d='M0,2 L0,0 L2,0' fill='red' /></svg>\"), auto",
                    );
                    break;

                case FIGHT_INPUT_TYPES.QUERY:
                    this.scene.input.setDefaultCursor(
                        "url(\"data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' height='48' width='48'><text y='32' font-size='32'>❓</text><path d='M0,2 L0,0 L2,0' fill='red' /></svg>\"), auto",
                    );
                    break;

                case FIGHT_INPUT_TYPES.REMOVE_BOMB:
                    this.scene.input.setDefaultCursor(
                        "url(\"data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' height='48' width='96'><text y='32' font-size='32'>❌👹</text><path d='M0,2 L0,0 L2,0' fill='red' /></svg>\"), auto",
                    );
                    break;

                case FIGHT_INPUT_TYPES.REMOVE_TRASH:
                    this.scene.input.setDefaultCursor(
                        "url(\"data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' height='48' width='48'><text y='32' font-size='32'>🚯</text><path d='M0,2 L0,0 L2,0' fill='red' /></svg>\"), auto",
                    );
                    break;

                case FIGHT_INPUT_TYPES.REMOVE_LIES:
                    this.scene.input.setDefaultCursor(
                        "url(\"data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' height='48' width='48'><text y='32' font-size='32'>🤥</text><path d='M0,2 L0,0 L2,0' fill='red' /></svg>\"), auto",
                    );
                    break;
                case FIGHT_INPUT_TYPES.BLOCK:
                    this.scene.input.setDefaultCursor(
                        "url(\"data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' height='48' width='48'><text y='32' font-size='32'>🤘</text><path d='M0,2 L0,0 L2,0' fill='red' /></svg>\"), auto",
                    );
                    break;
                case FIGHT_INPUT_TYPES.UMBRELLA:
                    this.scene.input.setDefaultCursor(
                        "url(\"data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' height='48' width='48'><text y='32' font-size='32'>☂</text><path d='M0,2 L0,0 L2,0' fill='red' /></svg>\"), auto",
                    );
                    break;
                case FIGHT_INPUT_TYPES.TOWER:
                    this.scene.input.setDefaultCursor(
                        "url(\"data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' height='48' width='48'><text y='32' font-size='32'>🗼</text><path d='M0,2 L0,0 L2,0' fill='red' /></svg>\"), auto",
                    );
                    break;
                default:
                    break;
            }
            this.inputBoard.list.forEach((inputText: any) => {
                if (inputText.name) {
                    if (
                        inputText.name === newInput ||
                        inputText.name === newInput + "_NUM"
                    ) {
                        inputText.setStyle({
                            // backgroundColor: "white",
                            color: "white",
                        });
                    } else {
                        inputText.setStyle({
                            // backgroundColor: "darkgray",
                            color: "gray",
                        });
                    }
                }
            });
        });
    }

    populateInputBoard() {
        GameState.fightInputTypes.forEach((input, index) => {
            const inputIcon = this.scene.make.text({
                x: 28,
                y: index * 64 - 20,
                text: `${UppercaseFirst(input.toLowerCase())}`,
                style: {
                    // backgroundColor:
                    //     this.currentInput === input ? "white" : "darkgray",
                    color:
                        GameState.currentFightInputType === input
                            ? "white"
                            : "gray",
                    fontSize: "38px",
                },
            });
            inputIcon.name = input;

            const inputBackground = this.scene.add
                .image(-50, index * 64 - 48, "black_key")
                .setDisplaySize(350, 100)
                .setOrigin(0, 0);

            inputBackground.setInteractive();
            inputBackground.on("pointerdown", () => {
                EventBus.emit(FIGHT_EVENTS.CHANGE_INPUT_TYPE, input);
                GameState.currentFightInputType = input;
            });

            this.inputBoard.add(inputBackground);
            this.inputBoard.add(inputIcon);

            let usesAvailable = -1;
            if (input === FIGHT_INPUT_TYPES.REMOVE_TRASH) {
                usesAvailable = GameState.removeTrashNum;
            } else if (input === FIGHT_INPUT_TYPES.REMOVE_BOMB) {
                usesAvailable = GameState.removeBombNum;
            } else if (input === FIGHT_INPUT_TYPES.REMOVE_LIES) {
                usesAvailable = GameState.removeLyingNum;
            }
            const inputNumIcon = this.scene.make.text({
                x: -20,
                y: index * 64 - 20,
                text: `${usesAvailable === -1 ? "♾" : usesAvailable}`,
                style: {
                    color:
                        GameState.currentFightInputType === input
                            ? "white"
                            : "gray",
                    fontSize: "40px",
                },
            });

            inputNumIcon.name = input + "_NUM";
            this.inputBoard.add(inputNumIcon);
        });
    }

    hide() {
        this.inputBoard.setAlpha(0);
    }

    show() {
        this.inputBoard.setAlpha(1);
    }
}
