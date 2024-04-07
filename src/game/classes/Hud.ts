import {Scene} from "phaser";

export default class Hud {
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

        this.hpDisplay = this.scene.add.text(448, 48, `Health: ${new Array(maxHp).fill('♥')}`)

        this.goldDisplay = this.scene.add.text(748, 48, `Gold: ${gold} 🥇`)


        
    }

    updateHp(hp ? : number, maxHp ? : number) 
    {
        if (hp) {
            this.hp = hp;
        }
        if (maxHp) {
            this.maxHp = maxHp;
        }
        this.hpDisplay.setText(`Health: ${new Array(this.maxHp).fill('♥').splice(this.maxHp - this.hp, this.maxHp, '💔')}`)
    }

}