import { Shop } from "@/game/Shop/Shop";
import ShopItem from "@/game/Shop/ShopItem";
import { GameState } from "@/game/GameState/GameState";
import { headingText } from "@/game/constants/textStyleConstructor";
import { transitionSceneToOverworld } from "@/game/functions/transitionScene";
import { SHOP_ITEMS, shopItemType } from "@/game/Shop/shopItems";

export default class ShopGrid {
    public scene: Shop;
    public width: number;
    public height: number;
    public size: number;
    public data: any[];
    public board: Phaser.GameObjects.Container;
    public offset: Phaser.Math.Vector2;
    public returnButton: any;
    public availableItems: shopItemType[];
    public vendingMachine: Phaser.GameObjects.Image;
    public numPadBoard: Phaser.GameObjects.Container;

    constructor(scene: Shop) {
        this.scene = scene;
        this.width = GameState.shopGridWidth;
        this.height = GameState.shopGridHeight;
        this.size = this.width * this.height;
        this.availableItems = this.generateAvailableItems();

        this.offset = new Phaser.Math.Vector2(64, 36);

        const x = Math.floor((scene.scale.width - 950) / 2);
        const y = Math.floor(80);

        this.data = [];
        this.board = scene.add.container(x, y);
        this.numPadBoard = scene.add
            .container(1250, (scene.scale.height - 300) / 2)
            // hide for now
            .setAlpha(0);

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
        transitionSceneToOverworld(this.scene);
    }

    generateAvailableItems() {
        const singletonItemsPlayerHas = GameState.upgrades.filter((upgrade) => {
            return upgrade.singleton;
        });

        return Phaser.Utils.Array.Shuffle(
            Object.values(SHOP_ITEMS).reduce(
                (accumulator: shopItemType[], shopItem: shopItemType) => {
                    if (singletonItemsPlayerHas.indexOf(shopItem) >= 0) {
                        return accumulator;
                    } else if (this.filterIteByRestrictions(shopItem)) {
                        accumulator.push(shopItem);
                    }
                    return accumulator;
                },
                [] as shopItemType[],
            ),
        );
    }

    // returns true if item should be included, false if restrictions mean it shouldn't
    filterIteByRestrictions(shopItem: shopItemType) {
        const restrictions = Object.entries(shopItem.restrictions);
        if (restrictions.length <= 0) {
            return true;
        }
        let shouldBeIncluded = true;
        restrictions.forEach((restriction) => {
            switch (restriction[0]) {
                case "level":
                    if (GameState.level < restriction[1]) {
                        shouldBeIncluded = false;
                    }
                    break;
                case "key":
                    if (
                        GameState.fightInputTypes.indexOf(restriction[1]) === -1
                    ) {
                        shouldBeIncluded = false;
                    }
                    break;
                case "advancedMechanics":
                    // @ts-ignore
                    if (!GameState[restriction[1]]) {
                        shouldBeIncluded = false;
                    }
                    break;
                case "item":
                    if (!GameState.hasUpgrade(restriction[1])) {
                        shouldBeIncluded = false;
                    }
                    break;
                default:
                    break;
            }
        });

        return shouldBeIncluded;
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
}
