export default class FightGridCell
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
    constructor (grid:any, index:number, x:number, y:number)
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

        this.tile = grid.scene.make.image({
            key: 'tiles',
            frame: 0,
            x: grid.offset.x + (x * 16),
            y: grid.offset.y + (y * 16),
            origin: 0
        });

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

        if (this.open || !this.grid.playing)
        {
            return;
        }

        if (pointer.rightButtonDown())
        {
            if (this.query)
            {
                this.query = false;
                this.tile.setFrame(0);
            }
            else if (this.flagged)
            {
                this.query = true;
                this.flagged = false;
                this.grid.updateBombs(-1);
                this.tile.setFrame(3);
            }
            else if (!this.flagged)
            {
                this.flagged = true;
                this.tile.setFrame(2);
                this.grid.updateBombs(1);
                this.grid.checkWinState();
            }
        }
        else if (!this.flagged && !this.query)
        {
            this.onClick();
        }
    }

    onClick ()
    {
        if (this.bomb)
        {
            this.exploded = true;

            this.grid.gameOver();
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

            this.grid.button.setFrame(2);
            this.grid.checkWinState();
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
        if (this.exploded)
        {
            this.tile.setFrame(6);
        }
        else if (!this.bomb && (this.flagged || this.query))
        {
            this.tile.setFrame(7);
        }
        else if (this.bomb)
        {
            this.tile.setFrame(5);
        }
        else
        {
            this.show();
        }
    }

    show ()
    {
        const values = [ 1, 8, 9, 10, 11, 12, 13, 14, 15 ];

        this.tile.setFrame(values[this.value]);

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