import {Scene} from "phaser";

export default class HudDisplay {
    public scene: Phaser.Scene;
    public name: string;
    public hp: number;
    public gold: number;
    public maxHp: number;
    public nameDisplay: Phaser.GameObjects.Text;
    public hpDisplay: Phaser.GameObjects.Text;
    public goldDisplay: Phaser.GameObjects.Text;
    
    constructor(scene: Scene, name:string, hp:number, gold:number, maxHp: number) {
        this.scene = scene;
        this.name = name;
        this.hp = hp;
        this.maxHp = maxHp;
        this.gold = gold;

        this.nameDisplay = this.scene.add.text(48, 48, `Starting Name`)

        this.hpDisplay = this.scene.add.text(448, 48, `Health: ${new Array(maxHp).fill('♥').join(' ')}`)

        this.goldDisplay = this.scene.add.text(748, 48, `Gold: ${gold} 🥇`)


        
    }

    updateGold(goldDifference:number){
        if(goldDifference){
            if(goldDifference + this.gold >= 0){
                this.gold = this.gold + goldDifference;
            } else {
                this.gold = 0;
            }
        }

        this.goldDisplay.setText(`Gold: ${this.gold} 🥇`)
    }
    
    updateHp(hp ? : number, maxHp ? : number) 
    {
        if (maxHp !== undefined) {
            if(maxHp <=0){
                this.maxHp = 1;
            } else {
                this.maxHp = maxHp;
            }
        }
        
        if (hp !== undefined) {
            if(hp <=0){
                this.hp = 0;
            } else if (maxHp !== undefined && hp >= maxHp){
                // TODO: Debug 3/5 => 8/10 hp issue
                this.hp = maxHp;
            } else if (hp >= this.maxHp){
                this.hp = this.maxHp;
            } else {
                this.hp = hp;
            }
        }
        
        
        this.hpDisplay.setText(`Health: ${new Array(this.hp).fill('♥').concat(new Array(this.maxHp - this.hp).fill('💔')).join(' ')}`)
    }

}