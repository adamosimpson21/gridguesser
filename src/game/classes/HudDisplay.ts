import {Scene} from "phaser";
import {EventBus} from "@/game/EventBus";
import {UI_EVENTS} from "@/game/types/events";
import {shopItemType} from "@/game/types/shopItems";

export default class HudDisplay {
    public scene: Phaser.Scene;
    public name: string;
    public hp: number;
    public gold: number;
    public maxHp: number;
    public nameDisplay: Phaser.GameObjects.Text;
    public hpDisplay: Phaser.GameObjects.Text;
    public goldDisplay: Phaser.GameObjects.Text;
    public upgradeDisplay: Phaser.GameObjects.Text;
    
    constructor(scene: Scene, name:string, hp:number, gold:number, maxHp: number) {
        this.scene = scene;
        this.name = name;
        this.hp = hp;
        this.maxHp = maxHp;
        this.gold = gold;
        this.create();

        this.nameDisplay = this.scene.add.text(48, 48, `Starting Name`, {fontSize: '24px'})

        this.hpDisplay = this.scene.add.text(448, 48, `Health: ${new Array(maxHp).fill('♥').join(' ')}`, {fontSize: '24px'})

        this.goldDisplay = this.scene.add.text(748, 48, `Gold: ${gold} 🥇`, {fontSize: '24px'})
        
        this.upgradeDisplay = this.scene.add.text(48, 108, '' , {fontSize: '24px'});        
    }
    
    create(){
        EventBus.on(UI_EVENTS.UPDATE_GOLD, (gold:number) => {
            this.goldDisplay.setText(`Gold: ${gold} 🥇`)
            EventBus.emit(UI_EVENTS.DISPLAY_MESSAGE, {type: UI_EVENTS.UPDATE_GOLD, message: `New gold amount ${gold} gold 🥇`},'5000')
        })
        EventBus.on(UI_EVENTS.UPDATE_HEALTH, (hp: number, maxHp: number) => {
            this.hpDisplay.setText(`Health: ${new Array(hp).fill('♥').concat(new Array(maxHp - hp).fill('💔')).join(' ')}`)
            EventBus.emit(UI_EVENTS.DISPLAY_MESSAGE, {type: UI_EVENTS.UPDATE_HEALTH, message: `New HP amount ${hp}`}, '5000')
        })
        EventBus.on(UI_EVENTS.UPDATE_UPGRADES, (upgrades:shopItemType[]) => {
            this.upgradeDisplay.setText(`${upgrades.map(obj => obj.icon).join(' ')}`)
            EventBus.emit(UI_EVENTS.DISPLAY_MESSAGE, {type: UI_EVENTS.UPDATE_UPGRADES, message: `New Upgrade`}, '5000')
        })
    }
}