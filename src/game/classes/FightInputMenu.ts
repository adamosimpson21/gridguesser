import { GameState } from "@/game/classes/GameState";
import { GameObjects, Scene } from "phaser";
import {
    FIGHT_CONSTANTS,
    FIGHT_INPUT_TYPES,
} from "@/game/types/fightConstants";
import { Fight } from "@/game/scenes/Fight";

export default class FightInputMenu {
    public availableInputs: string[];
    public currentInput: string;
    private scene: Fight;
    private inputBoard: any;
    private previousCurrentInput: string;
    constructor(scene: Fight) {
        this.scene = scene;
        this.availableInputs = GameState.fightInputTypes;
        this.currentInput = GameState.currentFightInputType;
        this.previousCurrentInput = this.currentInput;

        const x = Math.floor(
            scene.scale.width - FIGHT_CONSTANTS.TILE_WIDTH * 7,
        );
        const y = Math.floor(scene.scale.height / 2 + 100);

        this.inputBoard = scene.add.container(x, y);

        this.populateInputBoard();
    }

    update() {
        if (this.previousCurrentInput !== this.currentInput) {
            //update background
            this.inputBoard.list.forEach(
                (inputText: Phaser.GameObjects.Text) => {
                    if (inputText.name === this.currentInput) {
                        inputText.setStyle({
                            backgroundColor: "white",
                            color: "black",
                        });
                    } else {
                        inputText.setStyle({
                            backgroundColor: "darkgray",
                            color: "white",
                        });
                    }
                },
            );

            this.previousCurrentInput = this.currentInput;
        }
        this.inputBoard.list.forEach((inputText: Phaser.GameObjects.Text) => {
            if (inputText.name === this.currentInput + "_NUM") {
                if (this.currentInput === FIGHT_INPUT_TYPES.REMOVE_TRASH) {
                    inputText.setText(`${this.scene.removeTrashUses}`);
                } else if (
                    this.currentInput === FIGHT_INPUT_TYPES.REMOVE_BOMB
                ) {
                    inputText.setText(`${this.scene.removeBombUses}`);
                } else if (
                    this.currentInput === FIGHT_INPUT_TYPES.REMOVE_LIES
                ) {
                    inputText.setText(`${this.scene.removeLyingUses}`);
                }
            }
        });
    }

    populateInputBoard() {
        this.availableInputs.forEach((input, index) => {
            const inputIcon = this.scene.make.text({
                x: 0,
                y: index * 32,
                text: `${input}`,
                style: {
                    backgroundColor:
                        this.currentInput === input ? "white" : "darkgray",
                    color: this.currentInput === input ? "black" : "white",
                    fontSize: "16px",
                },
            });
            inputIcon.name = input;
            inputIcon.setInteractive();
            inputIcon.on("pointerdown", () => {
                this.currentInput = input;
                GameState.currentFightInputType = input;
            });
            this.inputBoard.add(inputIcon);

            let usesAvailable = -1;
            if (input === FIGHT_INPUT_TYPES.REMOVE_TRASH) {
                usesAvailable = GameState.removeTrashNum;
            } else if (input === FIGHT_INPUT_TYPES.REMOVE_BOMB) {
                usesAvailable = GameState.removeBombNum;
            } else if (input === FIGHT_INPUT_TYPES.REMOVE_LIES) {
                usesAvailable = GameState.removeLyingNum;
            }
            if (usesAvailable > -1) {
                const inputNumIcon = this.scene.make.text({
                    x: 120,
                    y: index * 32,
                    text: `${usesAvailable}`,
                    style: {
                        backgroundColor: "darkgray",
                        color: "white",
                        fontSize: "16px",
                    },
                });

                inputNumIcon.name = input + "_NUM";
                this.inputBoard.add(inputNumIcon);
            }
        });
    }
}
