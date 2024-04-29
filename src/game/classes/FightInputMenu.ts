import { GameState } from "@/game/classes/GameState";
import { GameObjects, Scene } from "phaser";
import { FIGHT_CONSTANTS } from "@/game/types/fightConstants";

export default class FightInputMenu {
    public availableInputs: string[];
    public currentInput: string;
    private scene: Phaser.Scene;
    private inputBoard: any;
    private previousCurrentInput: string;
    constructor(scene: Scene) {
        this.scene = scene;
        this.availableInputs = GameState.fightInputTypes;
        this.currentInput = GameState.currentFightInputType;
        this.previousCurrentInput = this.currentInput;

        const x = Math.floor(
            scene.scale.width - FIGHT_CONSTANTS.TILE_WIDTH * 3,
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
        });
    }
}
