import {PLAYER_EVENTS} from "@/game/types/events";
import {EventBus} from "@/game/EventBus";
import {FIGHT_CONSTANTS} from "@/game/types/fightConstants";

export default class FightGridCell
{
    private grid: any;
    private index: number;
    private x: number;
    private y: number;
    private open: boolean;
    private bombNum: number;
    private flagNum: number;
    private exploded: boolean;
    private value: number;
    private tile: any;
    private flagOverlay: any;
    constructor (grid:any, index:number, x:number, y:number)
    {
        this.grid = grid;

        this.index = index;
        this.x = x;
        this.y = y;

        this.open = false;
        this.bombNum = 0;

        this.flagNum = 0;
        this.exploded = false;

        //  0 = empty, 1,2,3,4,5,6,7,8 = number of adjacent bombs
        this.value = 0;

        this.tile = grid.scene.make.text({
            x: grid.offset.x + (x * FIGHT_CONSTANTS.TILE_WIDTH),
            y: grid.offset.y + (y * FIGHT_CONSTANTS.TILE_HEIGHT),
            text: '🔲',
            style: {fontSize: `${FIGHT_CONSTANTS.TILE_HEIGHT}px`}
        });
        
        this.flagOverlay = grid.scene.make.text({
            x: grid.offset.x + (x * FIGHT_CONSTANTS.TILE_WIDTH)+12,
            y: grid.offset.y + (y * FIGHT_CONSTANTS.TILE_HEIGHT)+8,
            text: '',
            style: {fontSize: `${FIGHT_CONSTANTS.TILE_HEIGHT-16}px`}
        })

        grid.board.add(this.tile);
        grid.board.add(this.flagOverlay);

        this.tile.setInteractive();

        this.tile.on('pointerdown', this.onPointerDown, this);
        this.tile.on('pointerup', this.onPointerUp, this);
    }

    reset ()
    {
        this.open = false;
        this.bombNum = 0;

        this.flagNum = 0;
        this.exploded = false;

        this.value = 0;

        this.tile.setText('🔲');
    }

    onPointerDown (pointer:any){
        if (!this.grid.populated){
            this.grid.generate(this.index);
        }
        
        // chording
        if(this.open && this.value > 0){
            const numFlagged = this.grid.getAdjacentCellFlaggedAndBombedNumber(this);
            console.log("value, numflag", this.value, numFlagged);
            if(this.value === numFlagged){
                this.grid.chordFill(this.x, this.y);
            }
        }

        if (!this.grid.playing){
            return;
        }
        if (pointer.rightButtonDown() && !this.open){
            //do nothing on right click for exploded bombs
            if(this.exploded){
                return;
            }
            // add first flag
            if (this.flagNum === 0){
                this.flagNum = 1;
                this.grid.updateBombs(1);
                this.setMultiFlagText(this.flagNum);
            } else if(this.flagNum > 0){
                // add multi-flags
                this.flagNum++;
                this.setMultiFlagText(this.flagNum);
                this.grid.updateBombs(1);
            }
        } else if (this.flagNum===0){
            // regular click
            this.onClick();
        } else if(this.flagNum > 0){
            //remove 1 flag with left click
            this.flagNum--;
            this.setMultiFlagText(this.flagNum);
            this.grid.updateBombs(-1);
        }
    }
    
    setMultiFlagText(flagNumber: number){
        if(flagNumber === 0) {
            this.flagOverlay.setText('')
        } else if(flagNumber > 9){
            this.flagOverlay.setText(`${this.flagNum}🚩`)
            this.flagOverlay.setFontSize(`${Math.floor((FIGHT_CONSTANTS.TILE_WIDTH-16))}px`)
        } else {     
            // this.flagOverlay.setText('🚩')
            this.flagOverlay.setText(`${Array.from(new Array(this.flagNum).fill('🚩')).join('')}`)
            this.flagOverlay.setFontSize(`${Math.floor((FIGHT_CONSTANTS.TILE_WIDTH-16)/flagNumber)}px`)
        }
    }

    onClick ()
    {
        if (this.bombNum > 0)
        {
            this.exploded = true;
            this.reveal();
            this.tile.setInteractive(false)
            this.grid.updateBombs(1);
            EventBus.emit(PLAYER_EVENTS.HIT_BOMB, 1);
        }
        else
        {
            if (this.value === 0)
            {
                this.grid.floodFill(this.x, this.y);
            }
            else
            {
                this.show();
            }

            this.grid.checkWinState();
        }
    }

    onPointerUp ()
    {
     
    }

    reveal ()
    {
        if (this.exploded)
        {
            this.tile.setText("💥");
        }
        else if (!(this.bombNum > 0) && (this.flagNum > 0))
        {
            this.tile.setText('🍕');
        }
        else if (this.bombNum > 0)
        {
            this.tile.setText('🐼');
        }
        else
        {
            this.show();
        }
    }

    show ()
    {
        const values = [ '⬜️', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣' ];

        this.tile.setText(values[this.value]);

        this.open = true;
    }

    debug ()
    {
        const values = [ '⬜️', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣' ];

        if (this.bombNum > 0)
        {
            return '💣';
        }
        else
        {
            return values[this.value];
        }
    }
}