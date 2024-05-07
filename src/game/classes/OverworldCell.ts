import { Scene } from "phaser";
import { CELL_TYPES } from "@/game/types/cells";
import { SCENES } from "@/game/types/scenes";
import { OVERWORLD_CONSTANTS } from "@/game/types/overworldConstants";
import { trapType } from "@/game/types/trapConstants";

export default class OverworldCell {
    public grid: any;
    public index: number;
    public x: number;
    public y: number;
    public open: boolean;
    public bomb: boolean;
    public flagged: boolean;
    public query: boolean;
    public exploded: boolean;
    public value: number;
    public tile: any;
    public typeInfo: trapType | {};
    public hasTriggered: boolean;
    public topBorder: Phaser.GameObjects.Triangle;
    public borderRect: Phaser.GameObjects.Image;
    public borderSize: number;
    public borderTop: Phaser.GameObjects.Image;
    public borderLeft: Phaser.GameObjects.Image;
    public borderRight: Phaser.GameObjects.Image;
    public borderBottom: Phaser.GameObjects.Image;
    private tileText: any;
    constructor(
        grid: any,
        index: number,
        x: number,
        y: number,
        type: string,
        typeInfo: trapType | {},
    ) {
        this.grid = grid;

        this.index = index;
        this.x = x;
        this.y = y;

        this.open = false;
        this.bomb = false;
        this.hasTriggered = false;

        this.exploded = false;
        this.typeInfo = typeInfo;

        this.borderSize = 4;

        this.value = 0;
        switch (type) {
            case CELL_TYPES.home:
                this.value = 1;
                break;
            case CELL_TYPES.fight:
                this.value = 2;
                break;

            case CELL_TYPES.shop:
                this.value = 3;
                break;

            case CELL_TYPES.boss:
                this.value = 4;
                break;

            case CELL_TYPES.buff:
                this.value = 5;
                break;

            case CELL_TYPES.trap:
                this.value = 6;
                break;
            case CELL_TYPES.visited:
                this.value = -1;
                break;
            default:
                this.value = 0;
                break;
        }

        this.tileText = grid.scene.add
            .text(
                (x - 0.5) * OVERWORLD_CONSTANTS.TILE_WIDTH,
                (y - 0.5) * OVERWORLD_CONSTANTS.TILE_HEIGHT,
                "",
                {
                    fontSize: `${Math.floor(OVERWORLD_CONSTANTS.TILE_WIDTH * 0.7)}px`,
                    // border: "2px solid black",
                    padding: {
                        top: 14,
                        left: 6,
                    },
                },
            )
            .setDepth(5);

        this.tile = grid.scene.add
            .image(
                x * OVERWORLD_CONSTANTS.TILE_WIDTH,
                y * OVERWORLD_CONSTANTS.TILE_HEIGHT,
                "dust",
            )
            .setDisplaySize(
                OVERWORLD_CONSTANTS.TILE_WIDTH / 2,
                OVERWORLD_CONSTANTS.TILE_HEIGHT / 2,
            );

        this.borderRect = grid.scene.add
            .image(
                x * OVERWORLD_CONSTANTS.TILE_WIDTH,
                y * OVERWORLD_CONSTANTS.TILE_HEIGHT,
                "overworld_floor",
            )
            .setDisplaySize(
                OVERWORLD_CONSTANTS.TILE_WIDTH,
                OVERWORLD_CONSTANTS.TILE_HEIGHT,
            );

        // this.borderTop = grid.scene.add.image(
        //     x * OVERWORLD_CONSTANTS.TILE_WIDTH,
        //     y * OVERWORLD_CONSTANTS.TILE_HEIGHT +
        //         this.borderSize / 2 -
        //         OVERWORLD_CONSTANTS.TILE_HEIGHT / 2,
        //     "red_border",
        // );

        // this.borderBottom = grid.scene.add.image(
        //     x * OVERWORLD_CONSTANTS.TILE_WIDTH,
        //     y * OVERWORLD_CONSTANTS.TILE_HEIGHT -
        //         this.borderSize / 2 +
        //         OVERWORLD_CONSTANTS.TILE_HEIGHT / 2,
        //     "orange_border",
        // );

        // this.borderLeft = grid.scene.add
        //     .image(
        //         x * OVERWORLD_CONSTANTS.TILE_WIDTH +
        //             this.borderSize / 2 -
        //             OVERWORLD_CONSTANTS.TILE_WIDTH / 2,
        //         y * OVERWORLD_CONSTANTS.TILE_HEIGHT,
        //         "green_border",
        //     )
        //     .setAngle(90);

        // this.borderRight = grid.scene.add
        //     .image(
        //         x * OVERWORLD_CONSTANTS.TILE_WIDTH -
        //             this.borderSize / 2 +
        //             OVERWORLD_CONSTANTS.TILE_WIDTH / 2,
        //         y * OVERWORLD_CONSTANTS.TILE_HEIGHT,
        //         "white_border",
        //     )
        //     .setAngle(90);

        grid.board.add(this.borderRect);
        // grid.board.add(this.borderTop);
        // grid.board.add(this.borderLeft);
        // grid.board.add(this.borderBottom);
        // grid.board.add(this.borderRight);
        grid.board.add(this.tileText);
        grid.board.add(this.tile);

        this.tile.setInteractive();

        this.tile.on("pointerdown", this.onPointerDown, this);
        this.tile.on("pointerup", this.onPointerUp, this);

        // testing reveal all
        // this.reveal();
    }

    reset() {
        this.open = false;
        this.bomb = false;

        this.flagged = false;
        this.query = false;
        this.exploded = false;

        this.value = 0;

        this.tile.setFrame(0);
    }

    onPointerDown(pointer: any) {
        this.onClick();
    }

    setTileToVisited(delay: number) {
        const fadeTween = this.grid.scene.add.tween({
            targets: this.tileText,
            duration: delay,
            alpha: 0,
        });
        fadeTween.on("complete", (tween: any, targets: any) => {
            this.grid.board.add(
                this.grid.scene.add
                    .image(
                        this.x * OVERWORLD_CONSTANTS.TILE_WIDTH,
                        this.y * OVERWORLD_CONSTANTS.TILE_HEIGHT,
                        "room_cleaned",
                    )
                    .setAlpha(0.75)
                    .setDisplaySize(
                        OVERWORLD_CONSTANTS.TILE_WIDTH,
                        OVERWORLD_CONSTANTS.TILE_HEIGHT,
                    ),
            );
        });
    }

    onClick() {
        this.grid.playerImage.setPosition(
            this.x * OVERWORLD_CONSTANTS.TILE_WIDTH,
            this.y * OVERWORLD_CONSTANTS.TILE_HEIGHT,
        );

        if (!this.hasTriggered) {
            switch (this.value) {
                case 0:
                case 1:
                    this.grid.floodFill(this.x, this.y);
                    this.show();
                    break;
                case 2:
                    this.grid.scene.transitionScene(SCENES.Fight);
                    this.setTileToVisited(1000);
                    this.show();
                    break;
                case 5:
                case 6:
                    this.show();
                    this.grid.scene.scene
                        .launch(SCENES.TrapOverlay, this.typeInfo)
                        .pause(SCENES.Overworld);
                    this.setTileToVisited(3000);
                    break;
                case 3:
                    this.grid.scene.transitionScene(SCENES.Shop);
                    this.setTileToVisited(1000);
                    this.show();
                    break;
                case 4:
                    this.setTileToVisited(1000);
                    this.grid.scene.transitionScene(SCENES.BossFight);
                    this.show();
                    break;
                case -1:
                default:
                    this.show();
                    break;
            }
        }
        this.hasTriggered = true;
    }

    onPointerUp() {}

    reveal() {
        const orthogonalCells = this.grid.getOrthogonalCells(this);
        // add unknown or remove known borders
        // above cell
        if (orthogonalCells[0]) {
            if (orthogonalCells[0].open) {
                orthogonalCells[0].borderBottom.setAlpha(0);
            } else {
                this.borderTop && this.borderTop.setAlpha(1);
            }
        }
        // left cell
        if (orthogonalCells[1]) {
            if (orthogonalCells[1].open) {
                orthogonalCells[1].borderRight.setAlpha(0);
            } else {
                this.borderLeft && this.borderLeft.setAlpha(1);
            }
        }
        //right cell
        if (orthogonalCells[2]) {
            if (orthogonalCells[2].open) {
                orthogonalCells[2].borderLeft.setAlpha(0);
            } else {
                this.borderRight && this.borderRight.setAlpha(1);
            }
        }
        //below cell
        if (orthogonalCells[3]) {
            if (orthogonalCells[3].open) {
                orthogonalCells[3].borderTop.setAlpha(0);
            } else {
                this.borderBottom && this.borderBottom.setAlpha(1);
            }
        }

        this.grid.scene.tweens.add({
            targets: this.tile,
            alpha: 0.001,
            duration: 500,
        });

        switch (this.value) {
            case -1:
                this.tileText.setText("🟢");
                break;
            case 0:
                this.tileText.setText("");
                break;
            case 1:
                this.tileText.setText("🏠");
                break;
            case 2:
                this.tileText.setText("⚔");
                break;
            case 3:
                this.tileText.setText("🏪");
                break;
            case 4:
                this.tileText.setText("😈");
                break;
            case 5:
                this.tileText.setText("↗");
                break;
            case 6:
                this.tileText.setText("🕷");
                break;

            default:
                this.tileText.setText("❓");
                break;
        }

        this.open = true;
    }

    show() {
        const values = [1, 8, 9, 10, 11, 12, 13, 14, 15];
        this.hasTriggered = true;

        // show borders
        // this.borderTop && this.borderTop.setAlpha(1);
        // this.borderBottom && this.borderBottom.setAlpha(1);
        // this.borderLeft && this.borderLeft.setAlpha(1);
        // this.borderRight && this.borderRight.setAlpha(1);
        //
        // //remove known borders
        // const orthogonalCells = this.grid.getOrthogonalCells(this);
        // // above cell
        // if (orthogonalCells[0] && orthogonalCells[0].open) {
        //     orthogonalCells[0].borderBottom.setAlpha(0);
        // }
        // // left cell
        // if (orthogonalCells[1] && orthogonalCells[1].open) {
        //     orthogonalCells[1].borderRight.setAlpha(0);
        // }
        // //right cell
        // if (orthogonalCells[2] && orthogonalCells[2].open) {
        //     orthogonalCells[2].borderLeft.setAlpha(0);
        // }
        // //below cell
        // if (orthogonalCells[3] && orthogonalCells[3].open) {
        //     orthogonalCells[3].borderTop.setAlpha(0);
        // }

        // this.tile.setFrame(values[this.value]);
        this.reveal();
        this.open = true;
    }

    debug() {
        const values = ["⬜️", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"];

        if (this.bomb) {
            return "💣";
        } else {
            return values[this.value];
        }
    }
}
