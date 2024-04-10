import {Scene} from "phaser";
import {SHOP_ITEMS, shopItemType} from "@/game/types/shopItems";
import {random} from "nanoid";
import ShopGrid from "@/game/classes/ShopGrid";
import {EventBus} from "@/game/EventBus";
import {PLAYER_EVENTS} from "@/game/types/events";

export default class ShopItem{
    private scene: Phaser.Scene;
    private type: string | undefined;
    private item: shopItemType | undefined;
    private x: number;
    private y: number;
    private tile: Phaser.GameObjects.Text;
    constructor(grid: ShopGrid, type: string | undefined, x: number, y: number) {
        this.type = type;
        this.item = undefined;
        this.x = x;
        this.y = y;
        

        this.tile = grid.scene.make.text({
            x: grid.offset.x + (x * 48),
            y: grid.offset.y + (y * 48),
            text: '⬜',
            style: {fontSize: '32px', padding: {y: 6}},
        })
        
        grid.board.add(this.tile);
    }
    
    generateItem(){
        const itemToAssign = this.chooseRandomShopItem();
        this.type = itemToAssign.id;
        this.item = itemToAssign;
        this.tile.setText(itemToAssign.icon);
        this.tile.setInteractive();
        this.tile.on('pointerdown', this.onClick, this);
    }
    
    chooseRandomShopItem() : shopItemType{
        const keys = Object.keys(SHOP_ITEMS);
        const randomIndex = Math.floor(Math.random() * keys.length);
        const randomKey = keys[randomIndex] as keyof shopItemType;
        this.type = randomKey;
        console.log("random shop item:", 'keys',keys,'randomIndex', randomIndex, 'combo:',keys[randomIndex]);
        return SHOP_ITEMS[randomKey];
    }
    
    onClick() {
        console.log("you are clicking on item")
        if(this.type){

            console.log("you are clicking on item 2", this.type, this.item);
            EventBus.emit(PLAYER_EVENTS.GAIN_UPGRADE, this.item);
        }
    }
}