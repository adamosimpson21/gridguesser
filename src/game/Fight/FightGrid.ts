import FightGridCell from "./FightGridCell";
import {
    FIGHT_EVENTS,
    GAME_EVENTS,
    PLAYER_EVENTS,
    SCENE_EVENTS,
    UI_EVENTS,
} from "@/game/EventBus/events";
import { EventBus } from "@/game/EventBus/EventBus";
import { Fight } from "@/game/Fight/Fight";
import { SCENES } from "@/game/constants/scenes";
import { GameState } from "@/game/GameState/GameState";
import GameObject = Phaser.GameObjects.GameObject;
import {
    FIGHT_CONSTANTS,
    FIGHT_INPUT_TYPES,
} from "@/game/Fight/fightConstants";
import { flavorConstants } from "@/game/constants/flavorConstants";
import { headingText } from "@/game/constants/textStyleConstructor";
import { transitionSceneToOverworld } from "@/game/functions/transitionScene";
import { start } from "node:repl";
import { LocalStorageManager } from "@/game/Settings/LocalStorageManager";
import { SETTING_CONSTANTS } from "@/game/Settings/settingConstants";
import { HUD_CONSTANTS } from "@/game/Hud/hudConstants";

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
    public gridData: FightGridCell[][];
    public moveCounter: number;
    public chordCount: number;
    public chordMoves: number[];
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
    public returnButtonSubtext: Phaser.GameObjects.Text;
    public scrollTop: Phaser.GameObjects.Image;
    public scrollBottom: Phaser.GameObjects.Image;
    public scrollLeft: Phaser.GameObjects.Image;
    public scrollRight: Phaser.GameObjects.Image;
    public isLarge: boolean;

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
        this.moveCounter = 0;
        this.chordCount = 0;
        this.chordMoves = [];
        this.isLarge = false;

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
                key: "dust_bunny_2",
            })
            .setOrigin(0, 0)
            .setDisplaySize(64, 64);

        this.board.add(this.bombsCounterBG);
        this.board.add(this.bombsCounterText);
        this.board.add(this.bombsCounterImage);

        this.createAndHideEndGame();

        // .setDisplaySize(300, 600);
        if (
            this.height >= 18 ||
            this.width >= 18 ||
            (LocalStorageManager.getItem(SETTING_CONSTANTS.isMobile) &&
                (this.height >= 12 || this.width >= 12))
        ) {
            this.isLarge = true;
        }

        EventBus.on(GAME_EVENTS.GAME_OVER, () => {
            this.playing = false;
            this.flagAllBombs();
            this.removalAllLies();
            this.revealAllOpenCells();
        });
    }

    update() {
        if (this.isLarge) {
            const sceneWidth = this.scene.scale.width;
            const sceneHeight = this.scene.scale.height;
            const pointerX = this.scene.input.x;
            const pointerY = this.scene.input.y;
            const edgeSize = 0.8;
            const speed = 3;
            // scroll left
            if (
                pointerX < (sceneWidth - HUD_CONSTANTS.width) / 10 &&
                this.board.x < sceneWidth * (1 - edgeSize)
            ) {
                this.board.setX(this.board.x + speed);
                // scroll right
            } else if (
                pointerX < sceneWidth - HUD_CONSTANTS.width &&
                pointerX > sceneWidth - HUD_CONSTANTS.width - sceneWidth / 10 &&
                this.board.x + this.width * FIGHT_CONSTANTS.TILE_WIDTH >
                    (sceneWidth - HUD_CONSTANTS.width) * edgeSize
            ) {
                this.board.setX(this.board.x - speed);
            }
            // scroll up
            if (
                pointerY < sceneHeight / 10 &&
                this.board.y < sceneHeight * (1 - edgeSize)
            ) {
                this.board.setY(this.board.y + speed);
                // scroll down
            } else if (
                pointerY < sceneHeight &&
                pointerY > sceneHeight - sceneHeight / 10 &&
                this.board.y + this.height * FIGHT_CONSTANTS.TILE_HEIGHT >
                    sceneHeight * edgeSize - 200
            ) {
                this.board.setY(this.board.y - speed);
            }
        }
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
            x: 75,
            y: 150,
            text: `${flavorConstants.FIGHT_NAME} Cleaned! Back to the Lobby`,
            style: headingText({
                wordWrapWidth: 350,
                align: "left",
                lineSpacing: 20,
            }),
        });

        this.trashBG.setInteractive().setDepth(4);

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
        this.endGameBoard.add(
            (this.returnButtonSubtext = this.scene.make.text({
                x: 80,
                y: 350,
                text: `$${GameState.fightGoldReward} earned`,
                style: headingText({}),
            })),
        );
        this.endGameBoard.add(
            this.scene.make.text({
                x: 80,
                y: 400,
                text: `${GameState.bombNumFightIncrement} ${flavorConstants.ENEMY_NAME_PLURAL} added`,
                style: headingText({ wordWrapWidth: 350 }),
            }),
        );

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

    incrementChordMove() {
        this.chordCount++;
        this.chordMoves.push(this.moveCounter);
        if (this.chordCount === 8) {
            if (GameState.hasUpgrade("HARBROOM")) {
                GameState.activateAllUpgrades("HARBROOM");
            }
        } else if (this.chordCount === 12) {
            if (GameState.hasUpgrade("BROOMTAR")) {
                GameState.activateAllUpgrades("BROOMTAR");
            }
        } else if (this.chordCount === 5) {
            if (GameState.hasUpgrade("BROOMOPHONE")) {
                let numBroomophones =
                    GameState.activateAllUpgrades("BROOMOPHONE");
                do {
                    // each broomophone does this 3x
                    this.removeUnflaggedBomb();
                    this.removeUnflaggedBomb();
                    this.removeUnflaggedBomb();
                    numBroomophones--;
                } while (numBroomophones > 0);
                this.checkWinState();
            }
        }
        // TODO: make sure this doesn't trigger multiple times per fight
        if (
            this.chordMoves.length >= 4 &&
            this.chordMoves[this.chordMoves.length - 4] === this.moveCounter - 3
        ) {
            // last 4 consecutive moves are chords
            GameState.activateAllUpgrades("BROOMDRUM");
        }
    }

    updateBombs(loss: number) {
        // if (GameState.bombCounterCanLie) {
        //     // luck chance
        //     if (
        //         GameState.bombCounterCanLiePercent - GameState.luck >
        //         Phaser.Math.Between(1, 100)
        //     ) {
        //         if (Phaser.Math.Between(0, 1)) {
        //             diff++;
        //         } else {
        //             diff--;
        //         }
        //     }
        // }
        this.bombsCounter -= loss;
        this.bombsCounterText.setText(`${this.bombsCounter.toString()}`);
    }

    redistributeBombs(cell: FightGridCell) {
        let bombsToMove = cell.bombNum;
        const closedCells = this.getAllClosedCell();
        do {
            cell.removeBomb();
            closedCells[
                Phaser.Math.Between(0, closedCells.length - 1)
            ].addBomb();
            bombsToMove--;
        } while (bombsToMove > 0);
    }

    removeUnflaggedBomb() {
        let hasRemovedBomb = false;
        Phaser.Utils.Array.Shuffle([...this.getAllClosedCell()]).forEach(
            (cell) => {
                if (
                    !cell.open &&
                    cell.bombNum > 0 &&
                    cell.flagNum <= 0 &&
                    !cell.exploded &&
                    !hasRemovedBomb
                ) {
                    cell.removeBomb();
                    hasRemovedBomb = true;
                    return;
                }
            },
        );
    }

    getAllClosedCell() {
        const allClosedCells = [] as FightGridCell[];
        this.gridData.forEach((row) => {
            row.forEach((cell: FightGridCell) => {
                if (!cell.open) {
                    allClosedCells.push(cell);
                }
            });
        });

        return allClosedCells;
    }

    restart() {
        // this.populated = false;
        // this.playing = false;
        // this.bombsCounter = this.bombQty;
        // this.state = 0;
        //
        // let location = 0;
        //
        // do {
        //     this.getCell(location).reset();
        //
        //     location++;
        // } while (location < this.size);
        //
        // this.scene.scene.stop(SCENES.Fight);
    }

    gameWon(flawless: boolean) {
        this.playing = false;
        this.state = 2;
        this.trashBG.on("pointerdown", () => {
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
                    transitionSceneToOverworld(this.scene);
                },
                callbackScope: this,
            });
        });

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
                        `$${GameState.fightFlawlessGoldReward} Clean Sweep bonus!`,
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

        this.scene.tweens.add({
            targets: this.endGameBoard,
            y: 200,
        });
        this.scene.add.tween({
            targets: [this.endGameTrashCan, this.endGameTrashCanOver],
            y: 600,
        });

        if (GameState.character.id === "CHAR_ONE") {
            EventBus.emit(PLAYER_EVENTS.GAIN_HP, 2);
        }
        EventBus.emit(PLAYER_EVENTS.GAIN_GOLD, GameState.fightGoldReward, true);
        EventBus.emit(FIGHT_EVENTS.FIGHT_WON, false);
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

            if (revealedCells >= this.size) {
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

    revealAllOpenCells() {
        let location = 0;
        do {
            const cell = this.getCell(location);
            if (cell && cell.bombNum === 0 && !cell.open) {
                cell.open = true;
                cell.show();
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

    generate(startCell: FightGridCell) {
        let qty = this.bombQty;
        let trashQuantity = GameState.trashTileNum;
        let lyingQuantity = GameState.lyingTileNum;
        let tentacleQuantity = GameState.tentacleTileNum;
        let hasUsedForcedMultibomb = false;

        let startAreaIndexes: number[] = this.getAllCellsInDiameter(
            this.getCellXY(startCell.x, startCell.y),
            GameState.initialClickSize,
        ).reduce((acc: number[], cell: FightGridCell | null) => {
            if (cell) {
                acc.push(cell.index);
                return acc;
            } else {
                return acc;
            }
        }, []);

        if (GameState.hasUpgrade("INITIAL_CLICK_CORNERS_ONE")) {
            // top left corner, top right corner, bottom left corner, bottom right corner
            console.log("you are in initial click corners 1");
            startAreaIndexes.push(
                0,
                this.width - 1,
                (this.height - 1) * this.width,
                this.size - 1,
            );
            console.log("start area indexes:", startAreaIndexes);
        }

        const bombs = [];

        do {
            this.emergencyGeneratorCutoffNumber++;
            const location = Phaser.Math.Between(0, this.size - 1);

            const cell = this.getCell(location);

            if (
                startAreaIndexes.indexOf(cell.index) === -1 &&
                (cell.bombNum === 0 || GameState.fightCanHaveMultiBombTiles) &&
                cell.bombNum <= 9
            ) {
                // if (!(cell.bombNum > 0) && cell.index !== startIndex)

                cell.bombNum++;
                qty--;
                bombs.push(cell);

                // if it's the fight boss, force one multi-bomb tile
                if (
                    GameState.level === 1 &&
                    !hasUsedForcedMultibomb &&
                    GameState.fightCanHaveMultiBombTiles
                ) {
                    cell.bombNum++;
                    qty--;
                    bombs.push(cell);
                    hasUsedForcedMultibomb = true;
                }
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
                    cell.index !== startCell.index &&
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
            const trustedNum = GameState.trustedNumbers;
            do {
                this.emergencyGeneratorCutoffNumber++;
                const location = Phaser.Math.Between(0, this.size - 1);

                const cell = this.getCell(location);
                // trash tiles must have a value before becoming trash
                if (
                    cell.bombNum <= 0 &&
                    cell.value >= 1 &&
                    !cell.trash &&
                    !cell.lying &&
                    trustedNum.indexOf(cell.value) === -1
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

        if (GameState.fightCanHaveTentacles) {
            do {
                this.emergencyGeneratorCutoffNumber++;
                const location = Phaser.Math.Between(0, this.size - 1);

                const cell = this.getCell(location);
                if (cell.bombNum <= 0 && !cell.trash && !cell.lying) {
                    cell.isTentacle = true;
                    tentacleQuantity--;
                }
            } while (
                tentacleQuantity > 0 &&
                this.emergencyGeneratorCutoffNumber <
                    FIGHT_CONSTANTS.EMERGENCY_GENERATOR_CUTOFF_NUMBER
            );
        }

        this.playing = true;
        this.populated = true;
        EventBus.emit(SCENE_EVENTS.POPULATE_FIGHT);

        this.state = 1;

        startAreaIndexes.forEach((index, i) => {
            const cell = this.getCell(index);
            if (cell) {
                if (i === 0) {
                    cell.onClick();
                } else {
                    // other indexes are not click events
                    cell.onClick(true);
                }
            }
        });

        this.debug();
    }

    getCell(index: number) {
        const pos = Phaser.Math.ToXY(index, this.width, this.height);

        return this.gridData[pos.y][pos.x];
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

    getAllCellsInDiameter(cell: FightGridCell | null, diameterInput?: number) {
        const diameter = diameterInput || 3;
        let width = 0;
        let height = 0;
        let returnArray = [];
        if (cell) {
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
        }
        return returnArray;
    }

    addTentacleFromGrid() {
        const tentacleCells = [] as FightGridCell[];
        this.gridData.forEach((row) => {
            row.forEach((cell: FightGridCell) => {
                if (cell.isTentacle) {
                    cell.addTentacle();
                }
            });
        });
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

    getAdjacentCellBombNumber(cell: FightGridCell, diameter: number) {
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
                            adjacentCell.onClick(true);
                        }
                    } else if (adjacentCell.value === 0) {
                        this.floodFill(adjacentCell.x, adjacentCell.y);
                    } else {
                        adjacentCell.show(true);
                    }
                } else if (adjacentCell && adjacentCell.flagNum > 0) {
                    // chord flagged animation
                    const xyDirection =
                        this.getXYDirectionFromAdjacantCellIndex(index);
                    adjacentCell.tile.setFrame(12);
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
                        adjacentCell.tile.setFrame(11);
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
