import { FIGHT_EVENTS, PLAYER_EVENTS } from "@/game/types/events";
import { EventBus } from "@/game/EventBus";
import {
    FIGHT_CONSTANTS,
    FIGHT_INPUT_TYPES,
} from "@/game/types/fightConstants";
import { GameState } from "@/game/classes/GameState";
import { Simulate } from "react-dom/test-utils";

export default class FightGridCell {
    public grid: any;
    public index: number;
    public x: number;
    public y: number;
    public open: boolean;
    public bombNum: number;
    public flagNum: number;
    public exploded: boolean;
    public value: number;
    public tile: any;
    public flagOverlay: any;
    public query: boolean;
    public trash: boolean;
    public lying: boolean;
    constructor(grid: any, index: number, x: number, y: number) {
        this.grid = grid;

        this.index = index;
        this.x = x;
        this.y = y;

        this.open = false;
        this.bombNum = 0;

        this.flagNum = 0;
        this.exploded = false;

        this.query = false;
        this.trash = false;
        this.lying = false;

        //  0 = empty, 1,2,3,4,5,6,7,8 = number of adjacent bombs
        this.value = 0;

        this.tile = grid.scene.make.text({
            x: grid.offset.x + x * FIGHT_CONSTANTS.TILE_WIDTH,
            y: grid.offset.y + y * FIGHT_CONSTANTS.TILE_HEIGHT,
            text: "🔲",
            style: { fontSize: `${FIGHT_CONSTANTS.TILE_HEIGHT}px` },
        });

        this.flagOverlay = grid.scene.make
            .image({
                x: grid.offset.x + x * FIGHT_CONSTANTS.TILE_WIDTH + 4,
                y: grid.offset.y + y * FIGHT_CONSTANTS.TILE_HEIGHT,
                key: "flagOverlay",
                frame: 0,
            })
            .setOrigin(0, 0)
            .setDisplaySize(
                FIGHT_CONSTANTS.TILE_WIDTH,
                FIGHT_CONSTANTS.TILE_HEIGHT,
            );

        grid.board.add(this.tile);
        grid.board.add(this.flagOverlay);

        this.tile.setInteractive();

        this.tile.on("pointerdown", this.onPointerDown, this);
        // this.tile.on('pointerup', this.onPointerUp, this);
    }

    reset() {
        this.open = false;
        this.bombNum = 0;

        this.flagNum = 0;
        this.exploded = false;

        this.value = 0;

        this.tile.setText("🔲");
    }

    onPointerDown(pointer: any) {
        if (!this.grid.populated) {
            this.grid.generate(this.index);
        }

        if (!this.grid.playing) {
            return;
        } else if (this.exploded) {
            return;
        }
        if (pointer.rightButtonDown() && !this.open) {
            // add first flag
            this.addFlag();
        } else {
            // regular click
            this.onClick();
        }
    }

    onClick() {
        const inputType = GameState.currentFightInputType;
        if (inputType === FIGHT_INPUT_TYPES.REVEAL) {
            // chording
            if (this.open && this.value > 0 && !this.trash) {
                const numFlagged =
                    this.grid.getAdjacentCellFlaggedAndBombedNumber(this);
                if (this.value === numFlagged) {
                    this.grid.chordFill(this.x, this.y);
                }
            }
            if (this.query) {
                this.toggleQuery();
            } else if (this.flagNum > 0) {
                //remove 1 flag with left click
                this.flagNum--;
                this.setMultiFlagText(this.flagNum);
                this.grid.updateBombs(-1);
            } else if (this.bombNum > 0) {
                this.exploded = true;
                this.reveal();
                this.tile.setInteractive(false);
                this.grid.updateBombs(this.bombNum);
                EventBus.emit(PLAYER_EVENTS.HIT_BOMB, this.bombNum);
            } else {
                if (this.value === 0) {
                    this.grid.floodFill(this.x, this.y);
                } else {
                    this.show();
                }
                // this.grid.checkWinState();
            }
        } else if (inputType === FIGHT_INPUT_TYPES.FLAG) {
            this.addFlag();
        } else if (inputType === FIGHT_INPUT_TYPES.QUERY) {
            this.toggleQuery();
        } else if (inputType === FIGHT_INPUT_TYPES.REMOVE_BOMB) {
            this.removeBomb();
        } else if (inputType === FIGHT_INPUT_TYPES.REMOVE_TRASH) {
            this.removeTrash();
        } else if (inputType === FIGHT_INPUT_TYPES.REMOVE_LIES) {
            this.removeLies();
        } else if (inputType === FIGHT_INPUT_TYPES.BLOCK) {
            this.useBlock();
        } else if (inputType === FIGHT_INPUT_TYPES.TOWER) {
            this.useTower();
        } else if (inputType === FIGHT_INPUT_TYPES.UMBRELLA) {
            this.useUmbrella();
        }
    }

    addFlag() {
        this.query = false;
        if (!this.open) {
            if (this.flagNum === 0) {
                this.flagNum = 1;
                this.grid.updateBombs(1);
                this.setMultiFlagText(this.flagNum);
            } else if (this.flagNum > 0 && this.flagNum < 9) {
                // add multi-flags
                this.flagNum++;
                this.setMultiFlagText(this.flagNum);
                this.grid.updateBombs(1);
            }
        }
    }

    toggleQuery() {
        if (!this.open) {
            if (this.query) {
                this.query = false;
                this.flagOverlay.setFrame(0);
            } else {
                this.query = true;
                this.flagOverlay.setFrame(10);
            }
        }
    }

    removeBomb() {
        if (this.grid.scene.removeBombUses > 0 && !this.open) {
            EventBus.emit(
                FIGHT_EVENTS.USE_LIMITED_INPUT,
                FIGHT_INPUT_TYPES.REMOVE_BOMB,
            );
            if (this.bombNum > 0) {
                this.bombNum--;
                // update grid
                this.grid.bombQty--;
                this.grid.updateBombs(1);

                //update adjacent cells
                const adjacentCells = this.grid.getAdjacentCells({
                    x: this.x,
                    y: this.y,
                });
                adjacentCells.forEach((cell: any) => {
                    if (cell) {
                        cell.value--;
                        if (cell.open) {
                            cell.show();
                        }
                    }
                });
                if (this.bombNum === 0) {
                    this.show();
                }
                this.grid.checkWinState();
            }
        }
    }

    removeLies() {
        EventBus.emit(
            FIGHT_EVENTS.USE_LIMITED_INPUT,
            FIGHT_INPUT_TYPES.REMOVE_LIES,
        );
    }
    removeTrash() {
        if (this.trash && this.grid.scene.removeTrashUses > 0) {
            this.trash = false;
            EventBus.emit(
                FIGHT_EVENTS.USE_LIMITED_INPUT,
                FIGHT_INPUT_TYPES.REMOVE_TRASH,
            );
            this.show();
        }
    }

    useBlock() {}

    useTower() {}
    useUmbrella() {}

    setMultiFlagText(flagNumber: number) {
        if (flagNumber === 0) {
            this.flagOverlay.setFrame(0);
            // } else if (flagNumber > 9) {
            //     this.flagOverlay.setImage(`${this.flagNum}🚩`);
            //     this.flagOverlay.setFontSize(
            //         `${Math.floor(FIGHT_CONSTANTS.TILE_WIDTH - 16)}px`,
            //     );
        } else {
            // this.flagOverlay.setText('🚩')
            this.flagOverlay.setFrame(flagNumber);
        }
    }

    // onPointerUp ()
    // {
    //
    // }

    reveal() {
        if (this.exploded) {
            this.flagOverlay.setFrame(this.bombNum + 10);
            this.tile.setText("🟧");
        } else if (!(this.bombNum > 0) && this.flagNum > 0) {
            this.tile.setText("🍕");
        } else if (this.bombNum > 0) {
            this.tile.setText("🐼");
        } else {
            this.show();
        }
    }

    show(shouldNotAnimate?: boolean) {
        const values = [
            "⬜️",
            "1️⃣",
            "2️⃣",
            "3️⃣",
            "4️⃣",
            "5️⃣",
            "6️⃣",
            "7️⃣",
            "8️⃣",
            "9️⃣",
            "🔟",
        ];

        let textToSet = "" as string;
        if (this.trash) {
            textToSet = "🚮";
        } else {
            if (values[this.value]) {
                textToSet = values[this.value].toString();
            } else {
                textToSet = this.value.toString();
            }
        }
        if (!shouldNotAnimate) {
            const bumpTween = this.grid.scene.tweens.chain({
                targets: this.tile,
                tweens: [
                    {
                        y: "-=6",
                        ease: "power3",
                        duration: 150,
                    },
                    {
                        y: "+=8",
                        ease: "power3",
                        duration: 300,
                    },
                    {
                        y: "-=2",
                        ease: "power3",
                        duration: 150,
                    },
                ],
            });
            bumpTween.on("complete", (tween: any, targets: any) => {
                this.tile.setText(textToSet);
                this.tile.setY(
                    this.grid.offset.y + this.y * FIGHT_CONSTANTS.TILE_HEIGHT,
                );
            });
        } else {
            this.tile.setText(textToSet);
        }

        this.open = true;
        this.grid.checkWinState();
    }

    debug() {
        const values = [
            "⬜️",
            "1️⃣",
            "2️⃣",
            "3️⃣",
            "4️⃣",
            "5️⃣",
            "6️⃣",
            "7️⃣",
            "8️⃣",
            "9️⃣",
            "🔟",
        ];

        if (this.bombNum > 0) {
            return `${this.bombNum}💣`;
        } else {
            if (values[this.value]) {
                return values[this.value];
            } else {
                return this.value;
            }
        }
    }
}
