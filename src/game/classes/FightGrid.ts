import { Scene } from "phaser";
import FightGridCell from "./FightGridCell";
import { GAME_EVENTS, PLAYER_EVENTS, UI_EVENTS } from "@/game/types/events";
import { EventBus } from "@/game/EventBus";
import { Fight } from "@/game/scenes/Fight";
import { SCENES } from "@/game/types/scenes";
import { GameState } from "@/game/classes/GameState";
import GameObject = Phaser.GameObjects.GameObject;
import {
    FIGHT_CONSTANTS,
    FIGHT_INPUT_TYPES,
} from "@/game/types/fightConstants";
import { changeInputScrollWheel } from "@/game/functions/changeInputScrollWheel";

export default class FightGrid extends GameObject {
    public scene: Fight;
    public width: number;
    public height: number;
    public size: number;
    public offset: Phaser.Math.Vector2;
    public timeCounter: number;
    public bombQty: number;
    public bombsCounter: number;
    public playing: boolean;
    public populated: boolean;
    public state: number;
    public gridData: any[];
    public board: Phaser.GameObjects.Container;
    public bombsCounterText: Phaser.GameObjects.Text;
    public emergencyGeneratorCutoffNumber: number;
    public bombsCounterImage: Phaser.GameObjects.Image;
    public bombsCounterBG: Phaser.GameObjects.Image;
    public endGameBoard: Phaser.GameObjects.Container;
    public trashBG: Phaser.GameObjects.Image;
    public endGameBoardUnder: Phaser.GameObjects.Container;
    public endGameTrashCan: Phaser.GameObjects.Image;
    public endGameTrashCanOver: Phaser.GameObjects.Image;
    public returnButton: Phaser.GameObjects.Text;

    constructor(scene: Fight, width: number, height: number, bombs: number) {
        super(scene, "fightGrid");
        this.scene = scene;

        this.width = width;
        this.height = height;
        this.size = width * height;
        this.offset = new Phaser.Math.Vector2(
            Math.floor(FIGHT_CONSTANTS.TILE_WIDTH / 2),
            FIGHT_CONSTANTS.TILE_HEIGHT * 2,
        );

        this.emergencyGeneratorCutoffNumber = 0;

        this.timeCounter = 0;
        if (bombs <= 0) {
            bombs = 1;
        }
        this.bombQty = bombs;
        this.bombsCounter = bombs;

        this.playing = false;
        this.populated = false;

        //  0 = waiting to create the grid
        //  1 = playing
        //  2 = game won
        //  3 = game lost
        this.state = 0;

        this.gridData = [];

        const x = Math.floor(
            scene.scale.width / 2 -
                (width / 2) * FIGHT_CONSTANTS.TILE_WIDTH -
                200,
        );
        const y = Math.floor(
            scene.scale.height / 2 -
                (height / 2) * FIGHT_CONSTANTS.TILE_HEIGHT -
                100,
        );

        this.board = scene.add.container(x, y);

        this.createBackground();
        this.createCells();

        this.bombsCounterBG = this.scene.make
            .image({
                x: 0,
                y: -2,
                key: "clipboard",
            })
            .setOrigin(0, 0)
            .setDisplaySize(180, 90);
        this.bombsCounterText = this.scene.make.text({
            x: 12,
            y: 10,
            text: `${this.bombsCounter}`,
            style: { fontSize: "64px", color: "black", padding: { top: 8 } },
        });
        this.bombsCounterImage = this.scene.make
            .image({
                x: 78,
                y: 10,
                key: "enemy1",
            })
            .setOrigin(0, 0)
            .setDisplaySize(64, 64);

        this.board.add(this.bombsCounterBG);
        this.board.add(this.bombsCounterText);
        this.board.add(this.bombsCounterImage);

        this.createAndHideEndGame();

        // .setDisplaySize(300, 600);

        EventBus.on(GAME_EVENTS.GAME_OVER, () => (this.playing = false));
    }

    createCells() {
        let i = 0;

        for (let x = 0; x < this.width; x++) {
            this.gridData[x] = [];

            for (let y = 0; y < this.height; y++) {
                this.gridData[x][y] = new FightGridCell(this, i, x, y);

                i++;
            }
        }
    }

    createAndHideEndGame() {
        this.endGameBoard = this.scene.add.container(80, 200);
        this.trashBG = this.scene.add
            .image(0, 0, "trash_bag")
            .setOrigin(0, 0)
            .setDepth(3);

        this.returnButton = this.scene.make.text({
            x: 80,
            y: 150,
            text: "Room Cleaned! Back to the office",
            style: {
                fontSize: 38,
                color: "black",
                wordWrap: {
                    width: 350,
                    useAdvancedWrap: true,
                },
            },
        });

        this.returnButton.setInteractive().setDepth(4);
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
                    this.scene.scene.stop(SCENES.Fight);
                    this.scene.scene.resume(SCENES.Overworld);
                },
                callbackScope: this,
            });
        });

        (this.endGameTrashCan = this.scene.add
            .image(0, 2000, "trash_can")
            .setOrigin(0, 0)
            .setDepth(0)),
            (this.endGameTrashCanOver = this.scene.add
                .image(0, 2000, "trash_can_over")
                .setOrigin(0, 0)
                .setDepth(5)),
            this.endGameBoard.add(this.endGameTrashCan);

        this.endGameBoard.add(this.trashBG);
        this.endGameBoard.add(this.returnButton);

        this.endGameBoard.add(this.endGameTrashCanOver);

        //hide

        this.endGameBoard.setPosition(80, -800);
    }

    createBackground() {
        const board = this.board;
        const factory = this.scene.add;
        const width = this.width * 16;
        const height = this.height * 16;
    }

    updateBombs(diff: number) {
        this.bombsCounter -= diff;
        this.bombsCounterText.setText(`${this.bombsCounter.toString()}`);
    }

    restart() {
        this.populated = false;
        this.playing = false;
        this.bombsCounter = this.bombQty;
        this.state = 0;

        let location = 0;

        do {
            this.getCell(location).reset();

            location++;
        } while (location < this.size);

        this.scene.scene.stop(SCENES.Fight);
    }

    gameWon(flawless: boolean) {
        this.playing = false;
        this.state = 2;

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

        this.scene.tweens.add({
            targets: this.endGameBoard,
            y: 200,
        });
        this.scene.add.tween({
            targets: [this.endGameTrashCan, this.endGameTrashCanOver],
            y: 600,
        });

        EventBus.emit(PLAYER_EVENTS.GAIN_GOLD, GameState.fightGoldReward, true);
        GameState.bombNum += FIGHT_CONSTANTS.BOMB_NUM_INCREMENT;
    }

    checkWinState() {
        if (this.playing) {
            let correctBombs = 0;
            let location = 0;
            let revealedCells = 0;
            let correctBombCells = 0;
            let flawless = true;

            do {
                const cell = this.getCell(location);

                // if (cell.open) {
                //     // exploded bomb
                //     if (cell.exploded) {
                //         console.log("calculating exploded bombs");
                //         correctBombs += cell.bombNum;
                //         correctBombCells++;
                //     }
                //
                //     // exploded or normal reveal
                //     revealedCells++;
                // } else if (
                //     cell.bombNum > 0 &&
                //     cell.flagNum > 0 &&
                //     cell.bombNum === cell.flagNum
                // ) {
                //     // flag number matches bomb number
                //     correctBombs += cell.bombNum;
                //     correctBombCells++;
                // }
                // // if(cell.bombNum > 0 && cell.open){
                // //     open++;
                // // }
                if (cell.open) {
                    revealedCells++;
                } else if (cell.bombNum > 0) {
                    revealedCells++;
                }

                if (cell.exploded) {
                    flawless = false;
                }

                location++;
            } while (location < this.size);

            // console.log("correct bombs", correctBombs);
            // console.log("this.bombQty", this.bombQty);
            // console.log("revealedCells", revealedCells);

            // if ((correctBombs === this.bombQty && revealedCells === this.size))
            // if (
            //     (correctBombs === this.bombQty && revealedCells === this.size) ||
            //     revealedCells + this.bombQty - correctBombs >= this.size
            // ) {

            // unsure if something is wrong here
            if (revealedCells >= this.size) {
                // console.log(
                //     "revealedCells + this.bombQrt - correctBombs:",
                //     revealedCells + this.bombQty - correctBombs,
                // );
                this.playing = false;
                this.flagAllBombs();
                this.removalAllLies();
                this.gameWon(flawless);
            }
        }
    }

    flagAllBombs() {
        let location = 0;
        this.updateBombs(this.bombsCounter);
        do {
            const cell = this.getCell(location);
            if (cell && cell.bombNum > 0) {
                cell.flagNum = cell.bombNum;
                cell.setMultiFlagText(cell.bombNum);
            }
            location++;
        } while (location < this.size);
    }

    removalAllLies() {
        let location = 0;
        do {
            const cell = this.getCell(location);
            if (cell && cell.lying) {
                cell.lying = false;
                // add flip over animation
                cell.show();
            }
            location++;
        } while (location < this.size);
    }

    generate(startIndex: number) {
        let qty = this.bombQty;
        let trashQuantity = GameState.trashTileNum;
        let lyingQuantity = GameState.lyingTileNum;

        const bombs = [];

        do {
            this.emergencyGeneratorCutoffNumber++;
            const location = Phaser.Math.Between(0, this.size - 1);

            const cell = this.getCell(location);

            if (
                cell.index !== startIndex &&
                (cell.bombNum === 0 || GameState.fightCanHaveMultiBombTiles) &&
                cell.bombNum <= 9
            ) {
                // if (!(cell.bombNum > 0) && cell.index !== startIndex)
                cell.bombNum++;

                qty--;

                bombs.push(cell);
            }
        } while (
            qty > 0 &&
            this.emergencyGeneratorCutoffNumber <
                FIGHT_CONSTANTS.EMERGENCY_GENERATOR_CUTOFF_NUMBER
        );

        bombs.forEach((cell) => {
            //  Update the 8 cells.ts around this bomb cell

            const adjacent = this.getAdjacentCells(cell);

            adjacent.forEach((adjacentCell) => {
                if (adjacentCell) {
                    adjacentCell.value++;
                }
            });
        });

        if (GameState.fightCanHaveTrashTiles) {
            do {
                this.emergencyGeneratorCutoffNumber++;
                const location = Phaser.Math.Between(0, this.size - 1);

                const cell = this.getCell(location);
                // trash tiles must have a value before becoming trash
                if (
                    cell.index !== startIndex &&
                    cell.bombNum <= 0 &&
                    cell.value >= 1 &&
                    !cell.trash
                ) {
                    cell.trash = true;
                    trashQuantity--;
                }
            } while (
                trashQuantity > 0 &&
                this.emergencyGeneratorCutoffNumber <
                    FIGHT_CONSTANTS.EMERGENCY_GENERATOR_CUTOFF_NUMBER
            );
        }

        if (GameState.fightCanHaveLyingTiles) {
            do {
                this.emergencyGeneratorCutoffNumber++;
                const location = Phaser.Math.Between(0, this.size - 1);

                const cell = this.getCell(location);
                // trash tiles must have a value before becoming trash
                if (
                    cell.bombNum <= 0 &&
                    cell.value >= 1 &&
                    !cell.trash &&
                    !cell.lying
                ) {
                    cell.lying = true;
                    lyingQuantity--;
                }
            } while (
                lyingQuantity > 0 &&
                this.emergencyGeneratorCutoffNumber <
                    FIGHT_CONSTANTS.EMERGENCY_GENERATOR_CUTOFF_NUMBER
            );
        }

        this.playing = true;
        this.populated = true;
        this.state = 1;

        this.debug();
    }

    getCell(index: number) {
        const pos = Phaser.Math.ToXY(index, this.width, this.height);

        return this.gridData[pos.x][pos.y];
    }

    getCellXY(x: number, y: number) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }

        return this.gridData[x][y];
    }

    getAdjacentCells(cell: { x: number; y: number }) {
        return [
            //  Top-Left, Top-Middle, Top-Right
            this.getCellXY(cell.x - 1, cell.y - 1),
            this.getCellXY(cell.x, cell.y - 1),
            this.getCellXY(cell.x + 1, cell.y - 1),

            //  Left, Right
            this.getCellXY(cell.x - 1, cell.y),
            this.getCellXY(cell.x + 1, cell.y),

            //  Bottom-Left, Bottom-Middle, Bottom-Right
            this.getCellXY(cell.x - 1, cell.y + 1),
            this.getCellXY(cell.x, cell.y + 1),
            this.getCellXY(cell.x + 1, cell.y + 1),
        ];
    }

    getAllCellsInDiameter(cell: FightGridCell, diameterInput?: number) {
        const diameter = diameterInput || 3;
        let width = 0;
        let height = 0;
        let returnArray = [];
        do {
            do {
                returnArray.push(
                    this.getCellXY(
                        cell.x -
                            Math.floor(diameter / 2) +
                            height +
                            ((diameter + 1) % 2),
                        cell.y -
                            Math.floor(diameter / 2) +
                            width +
                            ((diameter + 1) % 2),
                    ),
                );
                height++;
            } while (height < diameter);
            height = 0;
            width++;
        } while (width < diameter);
        return returnArray;
    }

    getXYDirectionFromAdjacantCellIndex(index: number) {
        switch (index) {
            case 0:
                return [-1, -1];
            case 1:
                return [0, -1];
            case 2:
                return [+1, -1];
            case 3:
                return [-1, 0];
            case 4:
                return [+1, 0];
            case 5:
                return [-1, +1];
            case 6:
                return [0, +1];
            case 7:
                return [+1, +1];
            default:
                return [0, 0];
        }
    }

    getAdjacentCellFlaggedAndBombedNumber(cell: { x: number; y: number }) {
        const adjacentCells = this.getAdjacentCells(cell);
        let numFlagAndBombed = 0;
        adjacentCells.forEach((cell) => {
            if (cell && cell.flagNum > 0) {
                numFlagAndBombed += cell.flagNum;
            } else if (cell && cell.bombNum > 0 && cell.exploded) {
                numFlagAndBombed += cell.bombNum;
            }
        });
        return numFlagAndBombed;
    }

    getAdjacentCellBombNumber(
        cell: { x: number; y: number; bombNum: number },
        diameter: number,
    ) {
        const adjacentCells = this.getAllCellsInDiameter(cell, diameter);
        let numBombs = 0;
        adjacentCells.forEach((cell) => {
            if (cell && cell.bombNum > 0) {
                numBombs += cell.bombNum;
            }
        });
        return numBombs;
    }

    floodFill(x: number, y: number) {
        const cell = this.getCellXY(x, y);

        if (cell && !cell.open && !(cell.bombNum > 0 && !cell.trash)) {
            if (cell.flagNum <= 0) {
                cell.show();
            }

            if (cell.value === 0) {
                this.scene.time.addEvent({
                    delay: 100,
                    callback: () => {
                        this.floodFill(x, y - 1);
                        this.floodFill(x, y + 1);
                        this.floodFill(x - 1, y);
                        this.floodFill(x + 1, y);
                        this.floodFill(x + 1, y + 1);
                        this.floodFill(x - 1, y + 1);
                        this.floodFill(x - 1, y - 1);
                        this.floodFill(x + 1, y - 1);
                    },
                    callbackScope: this,
                });
            }
        }
    }

    chordFill(x: number, y: number) {
        const cell = this.getCellXY(x, y);
        if (cell && cell.open && cell.bombNum <= 0) {
            this.getAdjacentCells({ x, y }).forEach((adjacentCell, index) => {
                if (adjacentCell && !(adjacentCell.flagNum > 0)) {
                    if (adjacentCell.bombNum > 0) {
                        if (!adjacentCell.exploded) {
                            adjacentCell.onClick();
                        }
                    } else if (adjacentCell.value === 0) {
                        this.floodFill(adjacentCell.x, adjacentCell.y);
                    } else {
                        adjacentCell.show(true);
                    }
                } else if (adjacentCell && adjacentCell.flagNum > 0) {
                    // chord flagged animation
                    const previousText = adjacentCell.tile.text;
                    const xyDirection =
                        this.getXYDirectionFromAdjacantCellIndex(index);
                    adjacentCell.tile.setText("🟩");
                    const yRaiseIndex = 3;
                    const chordFillTween = this.scene.tweens.chain({
                        targets: adjacentCell.tile,
                        tweens: [
                            {
                                y: `-=${yRaiseIndex}`,
                                ease: "power3",
                                duration: 300,
                            },

                            {
                                x: `-=${xyDirection[0] * 4}`,
                                y: `-=${xyDirection[1] * 4 - yRaiseIndex}`,
                                ease: "power3",
                                duration: 300,
                            },
                            {
                                x: `+=${xyDirection[0] * 4}`,
                                y: `+=${xyDirection[1] * 4 - yRaiseIndex}`,
                                ease: "power3",
                                duration: 100,
                            },
                            {
                                y: `+=${yRaiseIndex}`,
                                ease: "power3",
                                duration: 100,
                            },
                        ],
                    });
                    chordFillTween.on("complete", () => {
                        adjacentCell.tile.setText(previousText);
                    });
                }
            });
        }
    }

    debug() {
        for (let y = 0; y < this.height; y++) {
            let row = "";

            for (let x = 0; x < this.width; x++) {
                let cell = this.gridData[x][y];

                if (x === 0) {
                    row = row.concat(`|`);
                }

                row = row.concat(`${cell.debug()}|`);
            }

            console.log(row);
        }

        console.log("");
    }
}
