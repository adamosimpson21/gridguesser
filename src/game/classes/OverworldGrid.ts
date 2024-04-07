import {Scene} from "phaser";
import Cell from './Cell';
import OverworldCell from './OverworldCell';
import {CELL_TYPES} from "@/game/types/cells";
import Hud from "@/game/classes/Hud";
import Trap from "@/game/classes/Trap";
import EventDisplay from "@/game/classes/EventDisplay";


export default class OverworldGrid
{
    private scene: Phaser.Scene;
    private width: number;
    private height: number;
    private size: number;
    private offset: Phaser.Math.Vector2;
    private timeCounter: number;
    private bombQty: number;
    private bombsCounter: number;
    private playing: boolean;
    private populated: boolean;
    private timer: Phaser.Time.TimerEvent;
    private state: number;
    private data: any[];
    private board: Phaser.GameObjects.Container;
    private digit1: Phaser.GameObjects.Image;
    private digit2: Phaser.GameObjects.Image;
    private digit3: Phaser.GameObjects.Image;
    private time1: Phaser.GameObjects.Image;
    private time2: Phaser.GameObjects.Image;
    private time3: Phaser.GameObjects.Image;
    private button: any;
    private numBosses: number;
    private numFights: number;
    private numShops: number;
    private numBuffs: number;
    private numTraps: number;
    public Hud: Hud;
    public eventDisplay: EventDisplay;
    constructor (scene:Scene, Hud:Hud, eventDisplay:EventDisplay, width:number, height:number,{numBosses, numFights, numShops, numBuffs, numTraps}:{numBosses:number, numFights:number, numShops:number, numBuffs:number, numTraps:number})
    {
        this.scene = scene;

        this.width = width;
        this.height = height;
        this.size = width * height;
        this.offset = new Phaser.Math.Vector2(12, 55);
        this.Hud = Hud;
        this.eventDisplay = eventDisplay;
        
        this.numBosses = numBosses;
        this.numFights = numFights;
        this.numShops = numShops;
        this.numBuffs = numBuffs;
        this.numTraps = numTraps;

        this.timeCounter = 0;

        this.playing = false;
        this.populated = false;

        this.timer = scene.time.addEvent(new Phaser.Time.TimerEvent({}));

        //  0 = waiting to create the grid
        //  1 = playing
        //  2 = game won
        //  3 = game lost
        this.state = 0;

        this.data = [];

        const x = Math.floor((scene.scale.width / 2) - (20 + (width * 48)) / 2);
        const y = Math.floor((scene.scale.height / 2) - (63 + (height * 48)) / 2);

        this.board = scene.add.container(x, y);

        this.digit1;
        this.digit2;
        this.digit3;

        this.time1;
        this.time2;
        this.time3;

        this.button;

        this.createBackground();
        this.createCells();
    }

    createCells ()
    {
        let i = 0;

        for (let x = 0; x < this.width; x++)
        {
            this.data[x] = [];

            for (let y = 0; y < this.height; y++)
            {
                this.data[x][y] = new OverworldCell(this, i, x, y, CELL_TYPES.empty, {});

                i++;
            }
        }
    }

    createBackground ()
    {
        const board = this.board;
        const factory = this.scene.add;

        //  55 added to the top, 8 added to the bottom (63)
        //  12 added to the left, 8 added to the right (20)
        //  cells.ts start at 12 x 55

        const width = this.width * 48;
        const height = this.height * 48;

        //  Top

        // board.add(factory.image(0, 0, 'topLeft').setOrigin(0));

        // const topBgWidth = (width + 20) - 60 - 56;

        // board.add(factory.tileSprite(60, 0, topBgWidth, 55, 'topBg').setOrigin(0));
        //
        // board.add(factory.image(width + 20, 0, 'topRight').setOrigin(1, 0));

        //  Sides

        // const sideHeight = (height + 63) - 55 - 8;

        // board.add(factory.tileSprite(0, 55, 12, sideHeight, 'left').setOrigin(0));
        // board.add(factory.tileSprite(width + 20, 55, 8, sideHeight, 'right').setOrigin(1, 0));
        //
        // //  Bottom
        //
        // board.add(factory.image(0, height + 63, 'botLeft').setOrigin(0, 1));
        //
        // const botBgWidth = (width + 20) - 12 - 8;
        //
        // board.add(factory.tileSprite(12, height + 63, botBgWidth, 8, 'botBg').setOrigin(0, 1));
        //
        // board.add(factory.image(width + 20, height + 63, 'botRight').setOrigin(1, 1));
        //
        // //  Bombs Digits
        //
        // this.digit1 = factory.image(17, 16, 'digits', 0).setOrigin(0);
        // this.digit2 = factory.image(17 + 13, 16, 'digits', 0).setOrigin(0);
        // this.digit3 = factory.image(17 + 26, 16, 'digits', 0).setOrigin(0);
        //
        // board.add([ this.digit1, this.digit2, this.digit3 ]);
        //
        // //  Timer Digits
        //
        // const x = (width + 20) - 54;
        //
        // this.time1 = factory.image(x, 16, 'digits', 0).setOrigin(0);
        // this.time2 = factory.image(x + 13, 16, 'digits', 0).setOrigin(0);
        // this.time3 = factory.image(x + 26, 16, 'digits', 0).setOrigin(0);
        //
        // board.add([ this.time1, this.time2, this.time3 ]);

        //  Button

        const buttonX = Math.floor(((width + 20) / 2) - 13);

        this.button = factory.image(buttonX, 15, 'buttons', 0).setOrigin(0);

        board.add(this.button);
    }
    
    generate ()
    {
        let qtyFights = this.numFights;
        
        //some loop
        
        // Home
        const centerX = Math.floor(this.width/2);
        const centerY = Math.floor(this.height/2);
        const homeCell = this.getCellXY(centerX, centerY);
        homeCell.value = 1;
        
        // Boss
        const bossWall = Phaser.Math.Between(0, 1);
        const bossX = Phaser.Math.Between(0, this.width-1);
        const bossY = Phaser.Math.Between(0, this.height-1);
        if(bossWall < 0.25){
            const bossCell = this.getCellXY(0, bossY);
            bossCell.value = 4;
        } else if (bossWall < 0.5){
            const bossCell = this.getCellXY(this.width-1, bossY);
            bossCell.value = 4;
        } else if (bossWall < 0.75){
            const bossCell = this.getCellXY(bossX, 0);
            bossCell.value = 4;
        } else {
            const bossCell = this.getCellXY(bossX, this.height-1);
            bossCell.value = 4;
        }
        
        
        
        this.populateCell(2, this.numFights)
        this.populateCell(3, this.numShops)
        this.populateCell(5, this.numBuffs)
        this.populateCell(6, this.numTraps)
        
        
        
        
        
        
        // let qty = this.bombQty;
        //
        // const bombs = [];
        //
        // do {
        //     const location = Phaser.Math.Between(0, this.size - 1);
        //
        //     const cell = this.getCell(location);
        //
        //     if (!cell.bomb && cell.index !== startIndex)
        //     {
        //         cell.bomb = true;
        //
        //         qty--;
        //
        //         bombs.push(cell);
        //     }
        //
        // } while (qty > 0);
        //
        // bombs.forEach(cell => {
        //
        //     //  Update the 8 cells.ts around this bomb cell
        //
        //     const adjacent = this.getAdjacentCells(cell);
        //
        //     adjacent.forEach(adjacentCell => {
        //
        //         if (adjacentCell)
        //         {
        //             adjacentCell.value++;
        //         }
        //     });
        // });

        this.playing = true;
        this.populated = true;
        this.state = 1;
        
        this.debug();
    }
    
    getCell (index:number)
    {
        const pos = Phaser.Math.ToXY(index, this.width, this.height);

        return this.data[pos.x][pos.y];
    }

    getCellXY (x:number, y:number)
    {
        
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)

        {
            return null;
        }

        return this.data[x][y];
    }

    getAdjacentCells (cell: {x:number, y:number})
    {
        return [
            //  Top-Left, Top-Middle, Top-Right
            this.getCellXY(cell.x - 1, cell.y - 1),
            this.getCellXY(cell.x, cell.y - 1),
            this.getCellXY(cell.x + 1, cell.y - 1),

            //  Left, Right
            this.getCellXY(cell.x - 1, cell.y),
            this.getCellXY(cell.x + 1, cell.y),

            //  Bottom-Left, Bottom-Middle, Bottom-Right
            this.getCellXY(cell.x - 1, cell.y + 1),
            this.getCellXY(cell.x, cell.y + 1),
            this.getCellXY(cell.x + 1, cell.y + 1)
        ];
    }

    floodFill (x:number, y:number)
    {
        const cell = this.getCellXY(x, y);

        if (cell && !cell.open && !cell.bomb)
        {
            cell.show();

            if (cell.value === 0)
            {
                this.floodFill(x, y - 1);
                this.floodFill(x, y + 1);
                this.floodFill(x - 1, y);
                this.floodFill(x + 1, y);
            }
        }
    }
    
    populateCell(type: number, numCells:number){
        do{
            const location = Phaser.Math.Between(0, this.size-1);
            const cell = this.getCell(location);
            if(cell.value === 0){
                cell.value = type;
                if(type===6 || type===5){
                    const rngCall = Math.floor(Phaser.Math.Between(0, 144));
                    const posNeg = type===6 ? -1 : 1;
                    const severity = (rngCall % 3) + 1;
                    if(rngCall > 72){
                        cell.typeInfo = new Trap(this.Hud, this.scene, this.eventDisplay,'MONEY', posNeg *severity);
                    } else {
                        cell.typeInfo = new Trap(this.Hud, this.scene, this.eventDisplay,'HP', posNeg *severity);
                    }
                    // cell.typeInfo = new Trap(this.Hud, 'HP', -1);       
                    }
                numCells--;
            }
        }while(numCells > 0);
    }

    debug ()
    {
        for (let y = 0; y < this.height; y++)
        {
            let row = '';

            for (let x = 0; x < this.width; x++)
            {
                let cell = this.data[x][y];

                if (x === 0)
                {
                    row = row.concat(`|`);
                }

                row = row.concat(`${cell.debug()}|`);
            }

            console.log(row);
        }

        console.log('');
    }
}