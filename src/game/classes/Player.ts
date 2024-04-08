import {EventBus} from "@/game/EventBus";
import {PLAYER_EVENTS, UI_EVENTS} from "@/game/types/events"
export default class Player {
    public name: string;
    public hp: number;
    public gold: number;
    public maxHp: number;
    constructor(name: string, gold: number, maxHp: number) {
        this.name = name;
        this.hp = maxHp;
        this.maxHp = maxHp;
        this.gold = gold;
        this.create();
    }
    
    create () {
        EventBus.on(PLAYER_EVENTS.GAIN_HP, (severity: number) => {
            this.updateHp(this.hp+severity, this.maxHp)
        })
        EventBus.on(PLAYER_EVENTS.LOSE_HP, (severity: number) => {
            this.updateHp(this.hp+severity, this.maxHp)
        })
        EventBus.on(PLAYER_EVENTS.GAIN_GOLD, (severity: number) => {
            this.updateGold(severity)
        })
        EventBus.on(PLAYER_EVENTS.LOSE_GOLD, (severity: number) => {
            this.updateGold(severity)
        })
    }

    updateHp(hp ? : number, maxHp ? : number)
    {
        let hpToUpdate = hp || this.hp;
        let maxHpToUpdate = maxHp || this.maxHp;
       
        if(maxHpToUpdate <=0){
            maxHpToUpdate = 1;
        }
        if(hpToUpdate <=0){
            hpToUpdate = 0;
        } else if (hpToUpdate >= maxHpToUpdate){
            hpToUpdate = maxHpToUpdate;
        }
        
        this.hp = hpToUpdate;
        this.maxHp = maxHpToUpdate;
        EventBus.emit(UI_EVENTS.UPDATE_HEALTH, hpToUpdate, maxHpToUpdate);
    }
    
    updateGold(goldDifference:number){
        let goldToUpdate = goldDifference;
        if((goldDifference + this.gold) >= 0){
            goldToUpdate = this.gold + goldDifference;
        } else {
            goldToUpdate = 0;
        }

        this.gold = goldToUpdate;

        EventBus.emit(UI_EVENTS.UPDATE_GOLD, goldToUpdate);
    }
}