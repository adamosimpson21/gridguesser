import Hud from "@/game/classes/Hud";

export default class Trap {
    private type: string;
    private severity: number;
    private Hud: Hud;
    
    constructor(Hud: Hud, type: string, severity: number) {
        this.Hud = Hud;
        this.type = type;
        this.severity = severity;
    }
    
    trigger(){
        switch(this.type){
            case 'HP':
                this.Hud.updateHp(this.Hud.hp - this.severity, this.Hud.maxHp)
                break;
            default:
                break;
        }
    }
}