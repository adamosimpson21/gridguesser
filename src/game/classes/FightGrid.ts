import { Scene } from "phaser";
import FightGridCell from "./FightGridCell";
import { PLAYER_EVENTS } from "@/game/types/events";
import { EventBus } from "@/game/EventBus";
import { Fight } from "@/game/scenes/Fight";
import { SCENES } from "@/game/types/scenes";
import { GameState } from "@/game/classes/GameState";
import GameObject = Phaser.GameObjects.GameObject;
import {
    FIGHT_CONSTANTS,
    FIGHT_INPUT_TYPES,
} from "@/game/types/fightConstants";

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
    private emergencyGeneratorCutoffNumber: number;

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
            scene.scale.width / 2 - (width / 2) * FIGHT_CONSTANTS.TILE_WIDTH,
        );
        const y = Math.floor(
            scene.scale.height / 2 - (height / 2) * FIGHT_CONSTANTS.TILE_HEIGHT,
        );

        this.board = scene.add.container(x, y);

        this.createBackground();
        this.createCells();

        this.bombsCounterText = this.scene.make.text({
            x: 12,
            y: 10,
            text: `${this.bombsCounter}💣`,
            style: { fontSize: "32px" },
        });

        this.board.add(this.bombsCounterText);
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

    createBackground() {
        const board = this.board;
        const factory = this.scene.add;

        //  55 added to the top, 8 added to the bottom (63)
        //  12 added to the left, 8 added to the right (20)
        //  cells.ts start at 12 x 55

        const width = this.width * 16;
        const height = this.height * 16;

        //  Top

        // board.add(factory.image(0, 0, 'topLeft').setOrigin(0));
        //
        // const topBgWidth = (width + 20) - 60 - 56;
        //
        // board.add(factory.tileSprite(60, 0, topBgWidth, 55, 'topBg').setOrigin(0));
        //
        // board.add(factory.image(width + 20, 0, 'topRight').setOrigin(1, 0));
        //
        // //  Sides
        //
        // const sideHeight = (height + 63) - 55 - 8;
        //
        // board.add(factory.tileSprite(0, 55, 12, sideHeight, 'left').setOrigin(0));
        // board.add(factory.tileSprite(width + 20, 55, 8, sideHeight, 'right').setOrigin(1, 0));
        //
        // //  Bottom
        //
        // board.add(factory.image(0, height + 63, 'botLeft').setOrigin(0, 1));
        //
        // const botBgWidth = (width + 20) - 12 - 8;
        //
        // board.add(factory.tileSprite(12, height + 63, botBgWidth, 8, 'botBg').setOrigin(0, 1));
        //
        // board.add(factory.image(width + 20, height + 63, 'botRight').setOrigin(1, 1));
        //
        // const x = (width + 20) - 54;
    }

    updateBombs(diff: number) {
        this.bombsCounter -= diff;
        this.bombsCounterText.setText(`${this.bombsCounter.toString()}💣`);
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

    gameWon() {
        this.playing = false;
        this.state = 2;

        EventBus.emit(PLAYER_EVENTS.GAIN_GOLD, 5);
        GameState.updateFieldBy("bombNum", 4);

        const returnButton = this.scene.make.text({
            x: this.scene.scale.width / 2 - 100,
            y: 200,
            text: "Room Cleaned! Back to the office 👆",
        });

        returnButton.setInteractive();
        returnButton.on("pointerdown", () => {
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
    }

    checkWinState() {
        let correctBombs = 0;
        let location = 0;
        let revealedCells = 0;

        do {
            const cell = this.getCell(location);

            if (cell.open) {
                if (cell.exploded) {
                    console.log("calculating exploded bombs");
                    correctBombs += cell.bombNum;
                }
                revealedCells++;
            } else if (
                cell.bombNum > 0 &&
                cell.flagNum > 0 &&
                cell.bombNum === cell.flagNum
            ) {
                revealedCells++;
                correctBombs += cell.bombNum;
            }
            // if(cell.bombNum > 0 && cell.open){
            //     open++;
            // }

            location++;
        } while (location < this.size);

        console.log("correct bombs", correctBombs);
        console.log("this.bombQty", this.bombQty);
        console.log("revealedCells", revealedCells);

        // if ((correctBombs === this.bombQty && revealedCells === this.size))
        if (
            (correctBombs === this.bombQty && revealedCells === this.size) ||
            revealedCells + this.bombQty - correctBombs >= this.size
        ) {
            console.log(
                "revealedCells + this.bombQrt - correctBombs:",
                revealedCells + this.bombQty - correctBombs,
            );
            this.flagAllBombs();
            this.gameWon();
        }
    }

    flagAllBombs() {
        let location = 0;
        do {
            const cell = this.getCell(location);
            if (cell && cell.bombNum > 0) {
                cell.flagNum = cell.bombNum;
                cell.setMultiFlagText(cell.bombNum);
            }
            location++;
        } while (location < this.size);
    }

    generate(startIndex: number) {
        let qty = this.bombQty;

        const bombs = [];

        do {
            this.emergencyGeneratorCutoffNumber++;
            const location = Phaser.Math.Between(0, this.size - 1);

            const cell = this.getCell(location);

            if (
                cell.index !== startIndex &&
                (cell.bombNum === 0 || GameState.fightCanHaveMultiBombTiles)
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

        let trashQuantity = GameState.trashTileNum;

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

    floodFill(x: number, y: number) {
        const cell = this.getCellXY(x, y);

        if (cell && !cell.open && !(cell.bombNum > 0 && !cell.trash)) {
            if (cell.flagNum <= 0) {
                cell.show();
            }

            if (cell.value === 0) {
                this.floodFill(x, y - 1);
                this.floodFill(x, y + 1);
                this.floodFill(x - 1, y);
                this.floodFill(x + 1, y);
                this.floodFill(x + 1, y + 1);
                this.floodFill(x - 1, y + 1);
                this.floodFill(x - 1, y - 1);
                this.floodFill(x + 1, y - 1);
            }
        }
    }

    chordFill(x: number, y: number) {
        const cell = this.getCellXY(x, y);
        if (cell && cell.open && cell.bombNum <= 0) {
            this.getAdjacentCells({ x, y }).forEach((adjacentCell) => {
                if (adjacentCell && !(adjacentCell.flagNum > 0)) {
                    if (adjacentCell.bombNum > 0) {
                        if (!adjacentCell.exploded) {
                            adjacentCell.onClick();
                        }
                    } else if (adjacentCell.value === 0) {
                        this.floodFill(adjacentCell.x, adjacentCell.y);
                    } else {
                        adjacentCell.show();
                    }
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
