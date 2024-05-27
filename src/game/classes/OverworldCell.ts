import { Scene } from "phaser";
import { CELL_TYPES } from "@/game/types/cells";
import { SCENES } from "@/game/types/scenes";
import { OVERWORLD_CONSTANTS } from "@/game/types/overworldConstants";
import { trapType } from "@/game/types/trapConstants";
import { EventBus } from "@/game/EventBus";
import { SCENE_EVENTS } from "@/game/types/events";
import { transitionScene } from "@/game/functions/transitionScene";
import OverworldGrid from "@/game/classes/OverworldGrid";

export default class OverworldCell {
    public grid: OverworldGrid;
    public index: number;
    public x: number;
    public y: number;
    public open: boolean;
    public value: number;
    public tile: Phaser.GameObjects.Image;
    public typeInfo: trapType | {};
    public hasTriggered: boolean;
    // public topBorder: Phaser.GameObjects.Triangle;
    public borderRect: Phaser.GameObjects.Image;
    public borderSize: number;
    public borderTop: Phaser.GameObjects.Image;
    public borderLeft: Phaser.GameObjects.Image;
    public borderRight: Phaser.GameObjects.Image;
    public borderBottom: Phaser.GameObjects.Image;
    public tileText: Phaser.GameObjects.Text;
    constructor(
        grid: OverworldGrid,
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
        this.hasTriggered = false;

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
                OVERWORLD_CONSTANTS.TILE_WIDTH * 0.8,
                OVERWORLD_CONSTANTS.TILE_HEIGHT * 0.8,
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
    }

    createSkeleton() {
        return {
            x: this.x,
            y: this.y,
            index: this.index,
            open: this.open,
            value: this.value,
            // tile: this.tile,
            hasTriggered: this.hasTriggered,
            typeInfo: this.typeInfo,
            // borderRect: this.borderRect,
            // borderSize: this.borderSize,
            // borderTop: this.borderTop,
            // borderBottom: this.borderBottom,
            // borderLeft: this.borderLeft,
            // borderRight: this.borderRight,
            // tileText: this.tileText,
        };
    }

    rehydrateFromSkeleton(skeleton: any) {
        Object.entries(skeleton).forEach((keyValue: [string, any]) => {
            // the battery is out of the smoke detector
            (this as any)[keyValue[0]] = keyValue[1];
        });
        // this.grid.paintNeighborBorders(this);
        // this.revealBorders();
        // this.borderRight.setAlpha(0);
        // this.borderBottom.setAlpha(0);
        // this.borderTop.setAlpha(0);
        // this.borderLeft.setAlpha(0);

        if (this.hasTriggered) {
            // console.log("opening tile:", this);
            if (this.value !== 0) {
                this.setTileToVisited(0);
            }
            this.reveal();
        }
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
                    transitionScene(this.grid.scene, SCENES.Fight);
                    EventBus.emit(SCENE_EVENTS.ENTER_FIGHT);
                    this.setTileToVisited(1000);
                    this.show();
                    break;
                case 5:
                case 6:
                    this.show();
                    transitionScene(
                        this.grid.scene,
                        SCENES.TrapOverlay,
                        true,
                        this.typeInfo,
                    );
                    this.setTileToVisited(3000);
                    break;
                case 3:
                    transitionScene(this.grid.scene, SCENES.Shop);
                    this.setTileToVisited(1000);
                    this.show();
                    break;
                case 4:
                    this.setTileToVisited(1000);
                    transitionScene(this.grid.scene, SCENES.BossFight);
                    EventBus.emit(SCENE_EVENTS.ENTER_FIGHT);
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
        this.revealBorders();

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
        // console.log("this.grid.scene", this.grid.scene);
        // do not save during home because
        // this saves many times, could introduce bugs later
        if (this.grid.scene.overworldGrid && this.value !== 1) {
            this.grid.scene.saveCurrentCampaignDetails();
        }
    }

    revealBorders() {
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
    }

    show() {
        this.hasTriggered = true;
        this.reveal();
        this.open = true;
    }

    debug() {
        const values = ["⬜️", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"];
        return values[this.value];
    }
}
