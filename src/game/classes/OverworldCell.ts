import {Scene} from "phaser";

export default class OverworldCell
{
    private grid: any;
    private index: number;
    private x: number;
    private y: number;
    private open: boolean;
    private bomb: boolean;
    private flagged: boolean;
    private query: boolean;
    private exploded: boolean;
    private value: number;
    private tile: any;
    constructor (grid:any, index:number, x:number, y:number, type: string)
    {
        this.grid = grid;

        this.index = index;
        this.x = x;
        this.y = y;

        this.open = false;
        this.bomb = false;

        this.flagged = false;
        this.query = false;
        this.exploded = false;

        //  0 = empty, 1,2,3,4,5,6,7,8 = number of adjacent bombs
        this.value = 0;
        switch(type){
            case 'HOME':
                this.value=1;
                break;
            case 'FIGHT':
                this.value=2;
                break;

            case 'SHOP':
                this.value=3;
                break;

            case 'BOSS':
                this.value=4;
                break;

            case 'BUFF':
                this.value=5;
                break;

            case 'TRAP':
                this.value=6;
                break;
            case 'VISITED':
                this.value = -1;
                break;
            default:
                this.value=0;               
                break;
        }

        // this.tile = grid.scene.make.image({
        //     key: 'tiles',
        //     frame: 0,
        //     x: grid.offset.x + (x * 48),
        //     y: grid.offset.y + (y * 48),
        //     origin: 0
        // });
        this.tile = grid.scene.make.text({
            x: grid.offset.x + (x * 48),
            y: grid.offset.y + (y * 48), 
            text: 'EMP', style: {fontSize: '32px'}
            })

        grid.board.add(this.tile);

        this.tile.setInteractive();

        this.tile.on('pointerdown', this.onPointerDown, this);
        this.tile.on('pointerup', this.onPointerUp, this);
    }

    reset ()
    {
        this.open = false;
        this.bomb = false;

        this.flagged = false;
        this.query = false;
        this.exploded = false;

        this.value = 0;

        this.tile.setFrame(0);
    }

    onPointerDown (pointer:any)
    {
        
        if (!this.grid.populated)
        {
            this.grid.generate(this.index);
        }

        else if (!this.flagged && !this.query)
        {
            this.onClick();
        }
    }

    onClick ()
    {
        switch(this.value){
            case 0:
            case 1:
                this.grid.floodFill(this.x, this.y);
                break;
            case 2:
                this.grid.scene.scene.start('Game')
                this.show();
                break;
            case -1:
            case 3:
            case 4:
            case 5:
            case 6:
                this.show();
                break;
            default:
                this.show();
                break;
        }
    }

    onPointerUp ()
    {
        if (this.grid.button.frame.name === 2)
        {
            this.grid.button.setFrame(0);
        }
    }

    reveal ()
    {
        
        switch(this.value){
            case -1:
                this.tile.setText('🟢');
                break;
            case 0:
                this.tile.setText('⚪');
                break;
            case 1:
                this.tile.setText('🏠');
                break;
            case 2:
                this.tile.setText('⚔');
                break;
            case 3:
                this.tile.setText('🏪');
                break;
            case 4:
                this.tile.setText('😈');
                break;
            case 5:
                this.tile.setText('↗');
                break;
            case 6:
                this.tile.setText('🕷');
                break;
                
            default:
                this.tile.setText('❓');
                break;
                
                
                
        }
        
        this.open = true;
    }

    show ()
    {
        const values = [ 1, 8, 9, 10, 11, 12, 13, 14, 15 ];

        // this.tile.setFrame(values[this.value]);
        this.reveal()
        this.open = true;
    }

    debug ()
    {
        const values = [ '⬜️', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣' ];

        if (this.bomb)
        {
            return '💣';
        }
        else
        {
            return values[this.value];
        }
    }
}