import { Scene } from "phaser";
import FightGridCell from "../Fight/FightGridCell";
import OverworldCell from "./OverworldCell";
import HudDisplay from "@/game/Hud/HudDisplay";
import Trap from "@/game/Trap/Trap";
import EventDisplay from "@/game/GameState/EventDisplay";
import { Hud } from "@/game/Hud/Hud";
import {
    OVERWORLD_CELL_TYPES,
    OVERWORLD_CONSTANTS,
} from "@/game/Overworld/overworldConstants";
import { TRAPS } from "@/game/Trap/trapConstants";
import { random } from "nanoid";
import { Overworld } from "@/game/Overworld/Overworld";

export default class OverworldGrid {
    public scene: Overworld;
    public width: number;
    public height: number;
    public size: number;
    public offset: Phaser.Math.Vector2;
    public timeCounter: number;
    public bombQty: number;
    public bombsCounter: number;
    public playing: boolean;
    public populated: boolean;
    public timer: Phaser.Time.TimerEvent;
    public state: number;
    public data: OverworldCell[][] | [];
    public board: Phaser.GameObjects.Container;
    public numBosses: number;
    public numFights: number;
    public numShops: number;
    public numBuffs: number;
    public numTraps: number;
    public Hud: Hud;
    public eventDisplay: EventDisplay;
    public playerImage: Phaser.GameObjects.Image;
    constructor(
        scene: Overworld,
        width: number,
        height: number,
        {
            numBosses,
            numFights,
            numShops,
            numBuffs,
            numTraps,
        }: {
            numBosses: number;
            numFights: number;
            numShops: number;
            numBuffs: number;
            numTraps: number;
        },
    ) {
        this.scene = scene;

        this.width = width;
        this.height = height;
        this.size = width * height;
        this.numBosses = numBosses;
        this.numFights = numFights;
        this.numShops = numShops;
        this.numBuffs = numBuffs;
        this.numTraps = numTraps;

        this.timeCounter = 0;

        this.playing = false;
        this.populated = false;

        this.data = [];

        const x = Math.floor(
            scene.scale.width / 2 -
                (width * OVERWORLD_CONSTANTS.TILE_WIDTH) / 2,
        );
        const y = Math.floor(
            scene.scale.height / 2 -
                (height * OVERWORLD_CONSTANTS.TILE_HEIGHT) / 2,
        );

        this.playerImage = this.scene.add
            .image(
                Math.floor(this.width / 2) * OVERWORLD_CONSTANTS.TILE_WIDTH,
                Math.floor(this.height / 2) * OVERWORLD_CONSTANTS.TILE_HEIGHT,
                "player",
            )
            .setDepth(10)
            .setDisplaySize(
                OVERWORLD_CONSTANTS.TILE_WIDTH,
                OVERWORLD_CONSTANTS.TILE_HEIGHT,
            );

        this.scene.tweens.chain({
            targets: this.playerImage,
            loop: -1,
            tweens: [
                { scaleX: 1.5, duration: 1500, flipX: true },
                {
                    scaleX: -1.5,
                    duration: 1500,
                    flipX: true,
                },
            ],
        });

        this.board = scene.add.container(x, y);

        this.createCells();
        this.generate();
        this.board.add(this.playerImage);
    }

    createCells() {
        let i = 0;

        for (let x = 0; x < this.width; x++) {
            this.data[x] = [];

            for (let y = 0; y < this.height; y++) {
                this.data[x][y] = new OverworldCell(
                    this,
                    i,
                    x,
                    y,
                    OVERWORLD_CELL_TYPES.EMPTY,
                    {},
                );

                i++;
            }
        }
    }

    createSkeleton() {
        // console.log("this.data", this.data);
        const cellSkeleton = this.data.map((row, index) => {
            return row.map((cell, index) => {
                return cell.createSkeleton();
            });
        });

        return {
            cellSkeleton: cellSkeleton,
            height: this.height,
            width: this.width,
        };
    }

    rehydrateFromSkeleton(skeleton: any) {
        Object.entries(skeleton).forEach((keyValue: [string, any]) => {
            // the battery is out of the smoke detector
            if (keyValue[0] === "cellSkeleton") {
                keyValue[1].map((row: OverworldCell[], xIndex: number) => {
                    row.map((cell: OverworldCell, yIndex: number) => {
                        this.data[xIndex][yIndex].rehydrateFromSkeleton(cell);
                        // OverworldCell.rehydrateFromSkeleton(keyValue[1]);
                        // cell.grid = this;
                    });
                });
            } else {
                (this as any)[keyValue[0]] = keyValue[1];
            }
        });
    }

    generate() {
        let qtyFights = this.numFights;

        // Home
        const centerX = Math.floor(this.width / 2);
        const centerY = Math.floor(this.height / 2);
        const homeCell = this.getCellXY(centerX, centerY);
        if (homeCell) {
            homeCell.value = 1;
        }

        // Boss
        const bossWall = Phaser.Math.Between(0, 1);
        // const bossX = Phaser.Math.Between(0, this.width - 1);
        // const bossY = Phaser.Math.Between(0, this.height - 1);
        let bossCell;
        if (bossWall < 0.25) {
            bossCell = this.getCellXY(0, 0);
            if (bossCell) {
                bossCell.value = 4;
            }
        } else if (bossWall < 0.5) {
            bossCell = this.getCellXY(this.width - 1, this.height - 1);
            if (bossCell) {
                bossCell.value = 4;
            }
        } else if (bossWall < 0.75) {
            bossCell = this.getCellXY(this.width - 1, 0);
            if (bossCell) {
                bossCell.value = 4;
            }
        } else {
            bossCell = this.getCellXY(0, this.height - 1);
            if (bossCell) {
                bossCell.value = 4;
            }
        }

        this.populateCell(2, this.numFights);
        this.populateCell(3, this.numShops);
        this.populateCell(5, this.numBuffs);
        this.populateCell(6, this.numTraps);

        // let qty = this.bombQty;
        //
        // const bombs = [];
        //
        // do {
        //     const location = Phaser.Math.Between(0, this.size - 1);
        //
        //     const cell = this.getCell(location);
        //
        //     if (!cell.bomb && cell.index !== startIndex)
        //     {
        //         cell.bomb = true;
        //
        //         qty--;
        //
        //         bombs.push(cell);
        //     }
        //
        // } while (qty > 0);
        //
        // bombs.forEach(cell => {
        //
        //     //  Update the 8 cells.ts around this bomb cell
        //
        //     const adjacent = this.getAdjacentCells(cell);
        //
        //     adjacent.forEach(adjacentCell => {
        //
        //         if (adjacentCell)
        //         {
        //             adjacentCell.value++;
        //         }
        //     });
        // });

        this.data.forEach((row) => {
            row.forEach((cell: OverworldCell) => {
                this.paintNeighborBorders(cell);
            });
        });

        this.playing = true;
        this.populated = true;
        if (homeCell) {
            homeCell.show();
        }

        // testing reveal
        // this.data.forEach((row) => {
        //     row.forEach((cell: OverworldCell) => {
        //         cell.reveal();
        //     });
        // });

        this.debug();
    }

    getCell(index: number) {
        const pos = Phaser.Math.ToXY(index, this.width, this.height);

        return this.data[pos.x][pos.y];
    }

    getCellXY(x: number, y: number) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }

        return this.data[x][y];
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

    getOrthogonalCells(cell: { x: number; y: number }) {
        return [
            //  Top-Middle
            this.getCellXY(cell.x, cell.y - 1),

            //  Left, Right
            this.getCellXY(cell.x - 1, cell.y),
            this.getCellXY(cell.x + 1, cell.y),

            // Bottom-Middle
            this.getCellXY(cell.x, cell.y + 1),
        ];
    }

    paintNeighborBorders(cell: OverworldCell) {
        const orthogonalCells = this.getOrthogonalCells(cell);
        let frame: number;
        if (cell.value === 2) {
            frame = 2;
        } else if (cell.value === 4) {
            frame = 1;
        } else if (cell.value === 5 || cell.value === 6) {
            frame = 3;
        } else if (cell.value === 3) {
            frame = 4;
        } else {
            frame = 7;
        }

        // cell above
        if (orthogonalCells[0]) {
            const cellAbove = orthogonalCells[0];
            if (cellAbove.borderBottom) {
                cellAbove.borderBottom.setFrame(frame);
            } else {
                const borderBottom = this.scene.add
                    .image(
                        cellAbove.x * OVERWORLD_CONSTANTS.TILE_WIDTH,
                        cellAbove.y * OVERWORLD_CONSTANTS.TILE_HEIGHT -
                            cellAbove.borderSize / 2 +
                            OVERWORLD_CONSTANTS.TILE_HEIGHT / 2,
                        "overworldBorders",
                        frame,
                    )
                    .setAlpha(0)
                    .setDisplaySize(OVERWORLD_CONSTANTS.TILE_WIDTH, 4);
                cellAbove.borderBottom = borderBottom;
                this.board.add(borderBottom);
            }
        }
        // left
        if (orthogonalCells[1]) {
            const cellLeft = orthogonalCells[1];
            if (cellLeft.borderRight) {
                cellLeft.borderRight.setFrame(frame);
            } else {
                const borderRight = this.scene.add
                    .image(
                        cellLeft.x * OVERWORLD_CONSTANTS.TILE_WIDTH -
                            cellLeft.borderSize / 2 +
                            OVERWORLD_CONSTANTS.TILE_WIDTH / 2,
                        cellLeft.y * OVERWORLD_CONSTANTS.TILE_HEIGHT,
                        "overworldBorders",
                        frame,
                    )
                    .setDisplaySize(OVERWORLD_CONSTANTS.TILE_HEIGHT, 4)
                    .setAngle(90)
                    .setAlpha(0);
                cellLeft.borderRight = borderRight;
                this.board.add(borderRight);
            }
        }

        // right
        if (orthogonalCells[2]) {
            const cellRight = orthogonalCells[2];
            if (cellRight.borderLeft) {
                cellRight.borderLeft.setFrame(frame);
            } else {
                const borderLeft = this.scene.add
                    .image(
                        cellRight.x * OVERWORLD_CONSTANTS.TILE_WIDTH +
                            cellRight.borderSize / 2 -
                            OVERWORLD_CONSTANTS.TILE_WIDTH / 2,
                        cellRight.y * OVERWORLD_CONSTANTS.TILE_HEIGHT,
                        "overworldBorders",
                        frame,
                    )
                    .setDisplaySize(OVERWORLD_CONSTANTS.TILE_HEIGHT, 4)
                    .setAngle(90)
                    .setAlpha(0);
                cellRight.borderLeft = borderLeft;
                this.board.add(borderLeft);
            }
        }

        // bottom
        if (orthogonalCells[3]) {
            const cellBottom = orthogonalCells[3];
            if (cellBottom.borderTop) {
                cellBottom.borderTop.setFrame(frame);
            } else {
                const borderTop = this.scene.add
                    .image(
                        cellBottom.x * OVERWORLD_CONSTANTS.TILE_WIDTH,
                        cellBottom.y * OVERWORLD_CONSTANTS.TILE_HEIGHT +
                            cellBottom.borderSize / 2 -
                            OVERWORLD_CONSTANTS.TILE_HEIGHT / 2,
                        "overworldBorders",
                        frame,
                    )
                    .setAlpha(0)
                    .setDisplaySize(OVERWORLD_CONSTANTS.TILE_WIDTH, 4);
                cellBottom.borderTop = borderTop;
                this.board.add(borderTop);
            }
        }
    }

    floodFill(x: number, y: number) {
        const cell = this.getCellXY(x, y);

        if (cell && cell.value === 0 && !cell.open) {
            cell.show();

            this.floodFill(x, y - 1);
            this.floodFill(x, y + 1);
            this.floodFill(x - 1, y);
            this.floodFill(x + 1, y);
        }
    }

    populateCell(type: number, numCells: number) {
        do {
            const location = Phaser.Math.Between(0, this.size - 1);
            const cell = this.getCell(location);
            if (cell.value === 0) {
                cell.value = type;
                // generate traps
                if (type === 6 || type === 5) {
                    const trapOptions = Object.values(TRAPS);
                    const randomTrap =
                        trapOptions[
                            Phaser.Math.Between(0, trapOptions.length - 1)
                        ];
                    cell.typeInfo = randomTrap;
                }
                numCells--;
            }
        } while (numCells > 0);
    }

    debug() {
        for (let y = 0; y < this.height; y++) {
            let row = "";

            for (let x = 0; x < this.width; x++) {
                let cell = this.data[x][y];

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
