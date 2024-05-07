import { Scene } from "phaser";
import FightGridCell from "./FightGridCell";
import OverworldCell from "./OverworldCell";
import { CELL_TYPES } from "@/game/types/cells";
import HudDisplay from "@/game/classes/HudDisplay";
import Trap from "@/game/classes/Trap";
import EventDisplay from "@/game/classes/EventDisplay";
import { Hud } from "@/game/scenes/Hud";
import { OVERWORLD_CONSTANTS } from "@/game/types/overworldConstants";
import { TRAPS } from "@/game/types/trapConstants";

export default class OverworldGrid {
    private scene: Phaser.Scene;
    private width: number;
    private height: number;
    private size: number;
    private offset: Phaser.Math.Vector2;
    private timeCounter: number;
    private bombQty: number;
    private bombsCounter: number;
    private playing: boolean;
    private populated: boolean;
    private timer: Phaser.Time.TimerEvent;
    private state: number;
    private data: any[];
    private board: Phaser.GameObjects.Container;
    private numBosses: number;
    private numFights: number;
    private numShops: number;
    private numBuffs: number;
    private numTraps: number;
    public Hud: Hud;
    public eventDisplay: EventDisplay;
    public playerImage: Phaser.GameObjects.Image;
    constructor(
        scene: Scene,
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
        // this.offset = new Phaser.Math.Vector2(
        //     0,
        //     OVERWORLD_CONSTANTS.TILE_HEIGHT,
        // );

        this.numBosses = numBosses;
        this.numFights = numFights;
        this.numShops = numShops;
        this.numBuffs = numBuffs;
        this.numTraps = numTraps;

        this.timeCounter = 0;

        this.playing = false;
        this.populated = false;

        //  0 = waiting to create the grid
        //  1 = playing
        //  2 = game won
        //  3 = game lost
        this.state = 0;

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

        this.createBackground();
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
                    CELL_TYPES.empty,
                    {},
                );

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

        const width = this.width * OVERWORLD_CONSTANTS.TILE_WIDTH;
        const height = this.height * OVERWORLD_CONSTANTS.TILE_HEIGHT;
    }

    generate() {
        let qtyFights = this.numFights;

        //some loop

        // Home
        const centerX = Math.floor(this.width / 2);
        const centerY = Math.floor(this.height / 2);
        const homeCell = this.getCellXY(centerX, centerY);
        homeCell.value = 1;

        // Boss
        const bossWall = Phaser.Math.Between(0, 1);
        // const bossX = Phaser.Math.Between(0, this.width - 1);
        // const bossY = Phaser.Math.Between(0, this.height - 1);
        let bossCell;
        if (bossWall < 0.25) {
            bossCell = this.getCellXY(0, 0);
            bossCell.value = 4;
        } else if (bossWall < 0.5) {
            bossCell = this.getCellXY(this.width - 1, this.height - 1);
            bossCell.value = 4;
        } else if (bossWall < 0.75) {
            bossCell = this.getCellXY(this.width - 1, 0);
            bossCell.value = 4;
        } else {
            bossCell = this.getCellXY(0, this.height - 1);
            bossCell.value = 4;
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
        this.state = 1;
        homeCell.show();

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
        let borderImgToPaint: string;
        if (cell.value === 2) {
            borderImgToPaint = "orange_border";
        } else if (cell.value === 4) {
            borderImgToPaint = "red_border";
        } else if (cell.value === 5 || cell.value === 6) {
            borderImgToPaint = "yellow_border";
        } else if (cell.value === 3) {
            borderImgToPaint = "green_border";
        } else {
            borderImgToPaint = "white_border";
        }

        // cell above
        if (orthogonalCells[0]) {
            const cellAbove = orthogonalCells[0];
            const borderBottom = this.scene.add
                .image(
                    cellAbove.x * OVERWORLD_CONSTANTS.TILE_WIDTH,
                    cellAbove.y * OVERWORLD_CONSTANTS.TILE_HEIGHT -
                        cellAbove.borderSize / 2 +
                        OVERWORLD_CONSTANTS.TILE_HEIGHT / 2,
                    borderImgToPaint,
                )
                .setAlpha(0)
                .setDisplaySize(OVERWORLD_CONSTANTS.TILE_WIDTH, 4);
            cellAbove.borderBottom = borderBottom;
            this.board.add(borderBottom);
        }
        // left
        if (orthogonalCells[1]) {
            const cellLeft = orthogonalCells[1];
            const borderRight = this.scene.add
                .image(
                    cellLeft.x * OVERWORLD_CONSTANTS.TILE_WIDTH -
                        cellLeft.borderSize / 2 +
                        OVERWORLD_CONSTANTS.TILE_WIDTH / 2,
                    cellLeft.y * OVERWORLD_CONSTANTS.TILE_HEIGHT,
                    borderImgToPaint,
                )
                .setDisplaySize(OVERWORLD_CONSTANTS.TILE_HEIGHT, 4)
                .setAngle(90)
                .setAlpha(0);
            cellLeft.borderRight = borderRight;
            this.board.add(borderRight);
        }

        // right
        if (orthogonalCells[2]) {
            const cellRight = orthogonalCells[2];
            const borderLeft = this.scene.add
                .image(
                    cellRight.x * OVERWORLD_CONSTANTS.TILE_WIDTH +
                        cellRight.borderSize / 2 -
                        OVERWORLD_CONSTANTS.TILE_WIDTH / 2,
                    cellRight.y * OVERWORLD_CONSTANTS.TILE_HEIGHT,
                    borderImgToPaint,
                )
                .setDisplaySize(OVERWORLD_CONSTANTS.TILE_HEIGHT, 4)
                .setAngle(90)
                .setAlpha(0);
            cellRight.borderLeft = borderLeft;
            this.board.add(borderLeft);
        }

        // bottom
        if (orthogonalCells[3]) {
            const cellBottom = orthogonalCells[3];
            const borderTop = this.scene.add
                .image(
                    cellBottom.x * OVERWORLD_CONSTANTS.TILE_WIDTH,
                    cellBottom.y * OVERWORLD_CONSTANTS.TILE_HEIGHT +
                        cellBottom.borderSize / 2 -
                        OVERWORLD_CONSTANTS.TILE_HEIGHT / 2,
                    borderImgToPaint,
                )
                .setAlpha(0)
                .setDisplaySize(OVERWORLD_CONSTANTS.TILE_WIDTH, 4);
            cellBottom.borderTop = borderTop;
            this.board.add(borderTop);
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
                if (type === 6 || type === 5) {
                    const rngCall = Math.floor(Phaser.Math.Between(0, 144));
                    // const severity = (rngCall % 3) + 1;
                    cell.typeInfo =
                        rngCall > 72 ? TRAPS.GOLD_TRAP : TRAPS.HEALTH_TRAP;
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
