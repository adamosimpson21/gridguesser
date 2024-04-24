import {Scene} from "phaser";
import FightGridCell from './FightGridCell';
import {PLAYER_EVENTS} from "@/game/types/events";
import {EventBus} from "@/game/EventBus";
import {Fight} from "@/game/scenes/Fight";
import {SCENES} from "@/game/types/scenes";
import {Shop} from "@/game/scenes/Shop";
import OverworldCell from "@/game/classes/OverworldCell";
import {CELL_TYPES} from "@/game/types/cells";
import ShopItem from "@/game/classes/ShopItem";
import {GameState} from "@/game/classes/GameState";

export default class ShopGrid{
    public scene: Shop;
    public width: number;
    public height: number;
    public size: number;
    public data: any[];
    public board: Phaser.GameObjects.Container;
    public offset: Phaser.Math.Vector2;
    private returnButton: any;
    
    
    constructor(scene: Shop) {
        this.scene = scene;
        this.width = GameState.shopGridWidth;
        this.height = GameState.shopGridHeight;
        this.size = this.width * this.height;

        this.offset = new Phaser.Math.Vector2(12, 55);

        const x = Math.floor((scene.scale.width / 2) - ((this.width * 64) + 100) / 2);
        const y = Math.floor((scene.scale.height / 2) - ((this.height * 48)+200) / 2);
        
        this.data = [];
        this.board = scene.add.container(x, y)

        this.createBackground();
        this.createCells();
        this.generateShop();

        this.returnButton = this.scene.make.text({
            x: -60,
            y: 0,
            text: "👋 Exit Vending Machine 👋",
            style: {
                fontSize: '32px',
                padding: {y: 6}
            }
        })
        this.returnButton.setInteractive();
        this.returnButton.on('pointerdown', this.handleReturnButton, this);
        
        this.board.add(this.returnButton);
    }
    handleReturnButton(){
        this.scene.scene.stop(SCENES.Shop);
        this.scene.scene.resume(SCENES.Overworld);
    }

    createCells ()
    {
        let i = 0;

        for (let x = 0; x < this.width; x++)
        {
            this.data[x] = [];

            for (let y = 0; y < this.height; y++)
            {
                this.data[x][y] = new ShopItem(this, undefined, x, y);

                i++;
            }
        }
    }
    
    generateShop(){
        let qtyItems = GameState.shopItemNumber;
        if(qtyItems > this.size){
            qtyItems = this.size;
        }
        do{
            const location = Phaser.Math.Between(0, this.size-1);
            const cell = this.getCell(location);
            if(cell.type ===undefined){
                cell.generateItem();
                qtyItems--;
            }
        } while(qtyItems > 0)
    }

    getCell (index:number)
    {
        const pos = Phaser.Math.ToXY(index, this.width, this.height);
    

        return this.data[pos.x][pos.y];
    }

    createBackground ()
    {
        const board = this.board;
        const factory = this.scene.add;
        
        const width = this.width * 48;
        const height = this.height * 48;
    }
}