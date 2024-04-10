import {Scene} from "phaser";
import {SHOP_ITEMS, shopItemType} from "@/game/types/shopItems";
import {random} from "nanoid";
import ShopGrid from "@/game/classes/ShopGrid";
import {EventBus} from "@/game/EventBus";
import {PLAYER_EVENTS, UI_EVENTS} from "@/game/types/events";
import {Player} from "@/game/classes/Player";
import {Play} from "next/dist/compiled/@next/font/dist/google";

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
    
    playerCanUseItemCheck(item: shopItemType):boolean{
        const itemEffect = item.effect
        if(itemEffect.heal >= 0 && Player.hp === Player.maxHp){
            EventBus.emit(UI_EVENTS.DISPLAY_MESSAGE, {type: UI_EVENTS.ILLEGAL_ACTION, message: "You're already at full life"}, 3000)
            return false;
        }
        return true;
    }
    
    onClick() {
        if(this.type && this.item){
            if(this.item?.effect){
                console.log("item cost:", this.item.cost, "player gold:", Player.gold);
                // check if player has money to  buy item
                if(this.item.cost > Player.gold){
                    EventBus.emit(UI_EVENTS.DISPLAY_MESSAGE, {type: UI_EVENTS.ILLEGAL_ACTION, message: " 💸 Not enough gold! 💸"}, 3000)
                } else if(this.playerCanUseItemCheck(this.item)) {
                    {
                        // player has successfully bought item
                        const effect = this.item.effect;
                        if (effect.heal) {
                            EventBus.emit(PLAYER_EVENTS.GAIN_HP, effect.heal);
                        } else if (effect.maxHp) {
                            EventBus.emit(PLAYER_EVENTS.GAIN_MAX_HP, effect.maxHp)
                        }
                        EventBus.emit(PLAYER_EVENTS.LOSE_GOLD, this.item.cost);
                        EventBus.emit(PLAYER_EVENTS.GAIN_UPGRADE, this.item);
                    }
                }
            }
        }
    }
}