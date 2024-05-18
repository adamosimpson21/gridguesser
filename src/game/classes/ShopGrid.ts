import { Scene } from "phaser";
import FightGridCell from "./FightGridCell";
import { PLAYER_EVENTS } from "@/game/types/events";
import { EventBus } from "@/game/EventBus";
import { Fight } from "@/game/scenes/Fight";
import { SCENES } from "@/game/types/scenes";
import { Shop } from "@/game/scenes/Shop";
import OverworldCell from "@/game/classes/OverworldCell";
import { CELL_TYPES } from "@/game/types/cells";
import ShopItem from "@/game/classes/ShopItem";
import { GameState } from "@/game/classes/GameState";
import { headingText } from "@/game/types/textStyleConstructor";

export default class ShopGrid {
    public scene: Shop;
    public width: number;
    public height: number;
    public size: number;
    public data: any[];
    public board: Phaser.GameObjects.Container;
    public offset: Phaser.Math.Vector2;
    public returnButton: any;
    public vendingMachine: Phaser.GameObjects.Image;
    public numPadBoard: Phaser.GameObjects.Container;

    constructor(scene: Shop) {
        this.scene = scene;
        this.width = GameState.shopGridWidth;
        this.height = GameState.shopGridHeight;
        this.size = this.width * this.height;

        this.offset = new Phaser.Math.Vector2(64, 36);

        const x = Math.floor((scene.scale.width - 950) / 2);
        const y = Math.floor(80);

        this.data = [];
        this.board = scene.add.container(x, y);
        this.numPadBoard = scene.add.container(
            1250,
            (scene.scale.height - 300) / 2,
        );

        this.createBackground();

        this.returnButton = this.scene.make.text({
            x: 600,
            y: 800,
            text: "Exit Vending Machine",
            style: { ...headingText({}), backgroundColor: "green" },
        });
        this.returnButton.setInteractive();
        this.returnButton.on("pointerdown", this.handleReturnButton, this);
        this.vendingMachine = this.scene.add
            .image(-30, -30, "vending_machine")
            .setOrigin(0, 0)
            .setScale(2, 1.3)
            .setDepth(0);

        this.board.add(this.vendingMachine);

        this.createCells();
        this.generateShop();
    }
    handleReturnButton() {
        this.scene.scene.stop(SCENES.Shop);
        this.scene.scene.resume(SCENES.Overworld);
    }

    createCells() {
        let i = 0;

        for (let x = 0; x < this.width; x++) {
            this.data[x] = [];

            for (let y = 0; y < this.height; y++) {
                this.data[x][y] = new ShopItem(this, undefined, x, y);

                i++;
            }
        }
    }

    generateShop() {
        let qtyItems = GameState.shopItemNumber;
        if (qtyItems > this.size) {
            qtyItems = this.size;
        }
        do {
            const location = Phaser.Math.Between(0, this.size - 1);
            const cell = this.getCell(location);
            if (cell.type === undefined) {
                cell.generateItem();
                qtyItems--;
            }
        } while (qtyItems > 0);
    }

    getCell(index: number) {
        const pos = Phaser.Math.ToXY(index, this.width, this.height);

        return this.data[pos.x][pos.y];
    }

    createBackground() {
        const board = this.board;
        const factory = this.scene.add;

        const width = this.width * 48;
        const height = this.height * 48;
    }
}
