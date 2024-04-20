import {EventBus} from "@/game/EventBus";
import {GAME_EVENTS, PLAYER_EVENTS, UI_EVENTS} from "@/game/types/events"
import {shopItemType} from "@/game/types/shopItems";
import {Scene} from "phaser";
import {SCENES} from "@/game/types/scenes";
import {PlayerClass} from "@/game/classes/Player";
import {GAME_CONSTANTS} from "@/game/types/gameConstants";

class GameStateClass{
    // stores information about current run
    public level: number;
    public bombIntensity: number;
    public isPlaying: boolean;
    public player: any;
    public bombNum: number;
    public overworldGridWidth: number;
    public overworldGridHeight: number;
    public fightGridWidth: number;
    public shopGridHeight: number;
    public shopGridWidth: number;
    public fightGridHeight: number;
    
    constructor() {
        this.isPlaying = true;
        this.player = new PlayerClass();
        this.initializeNewGameConstants();
        this.create();
    }
    
    create(){
       
    }
    
    gameOver(scene: Scene){
        this.isPlaying = false;
        console.log("you are in mission game over");
        scene.scene.stop(SCENES.Fight);
        scene.scene.start(SCENES.GameOver);
    }
    
    reset(){
        this.initializeNewGameConstants();
        this.isPlaying = true;
        this.player = undefined;
        this.player = new PlayerClass();
        EventBus.emit(GAME_EVENTS.RESET);
    }
    
    initializeNewGameConstants(){
        this.level = GAME_CONSTANTS.startingLevel;
        this.bombIntensity = GAME_CONSTANTS.startingBombIntensity;
        this.bombNum = GAME_CONSTANTS.startingBombNum;
        this.overworldGridWidth = GAME_CONSTANTS.startingOverworldGridWidth;
        this.overworldGridHeight = GAME_CONSTANTS.startingOverworldGridHeight;
        this.fightGridWidth = GAME_CONSTANTS.startingFightGridWidth;
        this.fightGridHeight = GAME_CONSTANTS.startingFightGridHeight;
        this.shopGridWidth = GAME_CONSTANTS.startingShopGridWidth;
        this.shopGridHeight = GAME_CONSTANTS.startingShopGridHeight;
    }
    
    setLevel(level: number){
        this.level = level;
    }
    
    incrementLevel(){
        this.level += 1;
    }
    
    setBombIntensity(intensity: number){
        this.bombIntensity = intensity;
    }
    
    updateFieldBy(field: string, intensity: number){
        if(this.hasOwnProperty(field)){
            // @ts-ignore
            this[field] += intensity;
        }
    }
    
}

export const GameState = new GameStateClass();