import { GameState } from "@/game/classes/GameState";
import { GameObjects, Scene } from "phaser";
import {
    FIGHT_CONSTANTS,
    FIGHT_INPUT_TYPES,
} from "@/game/types/fightConstants";
import { Fight } from "@/game/scenes/Fight";
import { EventBus } from "@/game/EventBus";
import { FIGHT_EVENTS, GAME_EVENTS, SCENE_EVENTS } from "@/game/types/events";
import { BossFight } from "@/game/scenes/BossFight";
import { Hud } from "@/game/scenes/Hud";
import UppercaseFirst = Phaser.Utils.String.UppercaseFirst;
import {
    getInputInstanceUsesAvailable,
    getInputUsesAvailable,
} from "@/game/functions/getInputUsesAvailable";
import { translateNumberToString } from "@/game/functions/translateNumberToString";
import { changeInputScrollWheel } from "@/game/functions/changeInputScrollWheel";
import { KEY_ITEMS } from "@/game/types/keyItems";
import { SettingsManager } from "@/game/classes/SettingsManager";

export default class FightInputMenu {
    public availableInputs: string[];
    public currentInput: string;
    public scene: Hud;
    public inputBoard: any;
    public previousCurrentInput: string;
    private background: Phaser.GameObjects.Image;
    public inputHint: GameObjects.Image;
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
        this.hide();

        this.inputHint = this.scene.make.image({
            x: this.scene.input.mousePointer.x,
            y: this.scene.input.mousePointer.y,
            key: "input_hints",
            frame: 0,
        });

        if (!SettingsManager.inputHint) {
            this.hideInputHint();
        }

        this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            this.inputHint.setPosition(pointer.x, pointer.y);
        });

        EventBus.on(GAME_EVENTS.GAME_OVER, () => {
            this.inputBoard.list.forEach((input: Phaser.GameObjects.Text) => {
                input.removeInteractive();
            });
        });
        EventBus.on(SCENE_EVENTS.LEAVE_FIGHT, () => {
            this.hideInputHint();
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
                        } else if (
                            inputTypeUse === FIGHT_INPUT_TYPES.UMBRELLA
                        ) {
                            inputText.setText(
                                `${GameState.instanceUmbrellaNum}`,
                            );
                        } else if (inputTypeUse === FIGHT_INPUT_TYPES.TOWER) {
                            inputText.setText(`${GameState.instanceTowerNum}`);
                        } else if (inputTypeUse === FIGHT_INPUT_TYPES.BLOCK) {
                            inputText.setText(`${GameState.instanceBlockNum}`);
                        }
                    }
                },
            );
        });
        EventBus.on(FIGHT_EVENTS.ADD_INPUT_TYPE, (newInputType: string) => {
            this.createInputKey(
                newInputType,
                GameState.fightInputTypes.length - 1,
            );
        });
        EventBus.on(FIGHT_EVENTS.CHANGE_INPUT_TYPE, (newInput: string) => {
            if (getInputInstanceUsesAvailable(newInput) != 0) {
                switch (newInput) {
                    case FIGHT_INPUT_TYPES.REVEAL:
                        this.scene.input.setDefaultCursor(
                            "url(/assets/cursors/broomSm.cur), pointer",
                        );
                        if (SettingsManager.inputHint) {
                            this.showInputHint(4, 3);
                        } else {
                            this.hideInputHint();
                        }
                        break;

                    case FIGHT_INPUT_TYPES.FLAG:
                        this.scene.input.setDefaultCursor(
                            "url(/assets/cursors/cautionSm.cur), pointer",
                        );
                        this.hideInputHint();
                        break;

                    case FIGHT_INPUT_TYPES.QUERY:
                        this.scene.input.setDefaultCursor(
                            "url(\"data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' height='48' width='48'><text y='32' font-size='32'>❓</text><path d='M0,2 L0,0 L2,0' fill='red' /></svg>\"), auto",
                        );
                        this.hideInputHint();
                        break;

                    case FIGHT_INPUT_TYPES.REMOVE_BOMB:
                        this.scene.input.setDefaultCursor(
                            "url(/assets/cursors/featherDusterSm.cur), pointer",
                        );
                        this.hideInputHint();
                        break;

                    case FIGHT_INPUT_TYPES.REMOVE_TRASH:
                        this.scene.input.setDefaultCursor(
                            "url(/assets/cursors/trashCanSm.cur), pointer",
                        );
                        this.hideInputHint();
                        break;

                    case FIGHT_INPUT_TYPES.REMOVE_LIES:
                        this.scene.input.setDefaultCursor(
                            "url(/assets/cursors/removeLieSm.cur), pointer",
                        );
                        this.hideInputHint();
                        break;
                    case FIGHT_INPUT_TYPES.BLOCK:
                        this.scene.input.setDefaultCursor(
                            "url(/assets/cursors/concreteSm.cur), pointer",
                        );
                        this.showInputHint(1, GameState.blockSize);
                        break;
                    case FIGHT_INPUT_TYPES.UMBRELLA:
                        this.scene.input.setDefaultCursor(
                            "url(/assets/cursors/yellowSquaresm.cur), pointer",
                        );

                        this.showInputHint(2, GameState.umbrellaSize);
                        break;
                    case FIGHT_INPUT_TYPES.TOWER:
                        this.scene.input.setDefaultCursor(
                            "url(/assets/cursors/ladder2Sm.cur), pointer",
                        );

                        this.showInputHint(3, GameState.towerSize);
                        break;
                    default:
                        this.hideInputHint();
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
            }
        });

        EventBus.on(GAME_EVENTS.RESET_FIGHT_INPUT_MENU, () => {
            this.populateInputBoard();
            this.resetInputUses();
        });
    }

    populateInputBoard() {
        GameState.fightInputTypes.forEach(this.createInputKey, this);
    }

    resetInputUses() {
        this.inputBoard.list.forEach((inputText: Phaser.GameObjects.Text) => {
            if (inputText.name.slice(-4) === "_NUM") {
                const inputType = inputText.name.slice(0, -4);
                if (inputType === FIGHT_INPUT_TYPES.REMOVE_TRASH) {
                    inputText.setText(`${GameState.instanceRemoveTrashNum}`);
                } else if (inputType === FIGHT_INPUT_TYPES.REMOVE_BOMB) {
                    inputText.setText(`${GameState.instanceRemoveBombNum}`);
                } else if (inputType === FIGHT_INPUT_TYPES.REMOVE_LIES) {
                    inputText.setText(`${GameState.instanceRemoveLyingNum}`);
                } else if (inputType === FIGHT_INPUT_TYPES.UMBRELLA) {
                    inputText.setText(`${GameState.instanceUmbrellaNum}`);
                } else if (inputType === FIGHT_INPUT_TYPES.TOWER) {
                    inputText.setText(`${GameState.instanceTowerNum}`);
                } else if (inputType === FIGHT_INPUT_TYPES.BLOCK) {
                    inputText.setText(`${GameState.instanceBlockNum}`);
                }
            }
        });
    }

    hideInputHint() {
        this.inputHint.setFrame(0).setAlpha(0).setDisplaySize(0, 0);
    }

    showInputHint(frame: number, size: number) {
        let anchorPoint = 0.5;
        if (size % 2 === 0) {
            anchorPoint = 0.5 - 1 / (size * 2);
        }
        this.inputHint
            .setFrame(frame)
            .setAlpha(0.4)
            .setDisplaySize(
                FIGHT_CONSTANTS.TILE_WIDTH * size,
                FIGHT_CONSTANTS.TILE_HEIGHT * size,
            )
            .setOrigin(anchorPoint, anchorPoint);
    }

    createInputKey(input: string, index: number) {
        const displayName = KEY_ITEMS[input].name;
        const inputIcon = this.scene.make.text({
            x: 28,
            y: index * 64 - 20,
            text: `${displayName}`,
            style: {
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
        inputBackground.on("wheel", changeInputScrollWheel);
        if (this.scene.input.keyboard) {
            this.scene.input.keyboard
                .addKey(
                    Phaser.Input.Keyboard.KeyCodes[
                        translateNumberToString(index + 1)
                    ],
                )
                .on("down", () => {
                    EventBus.emit(FIGHT_EVENTS.CHANGE_INPUT_TYPE, input);
                    GameState.currentFightInputType = input;
                });
        }

        this.inputBoard.add(inputBackground);
        this.inputBoard.add(inputIcon);

        const usesAvailable = getInputUsesAvailable(input);
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
    }

    hide() {
        this.inputBoard.setAlpha(0);
    }

    show() {
        this.inputBoard.setAlpha(1);
    }
}
