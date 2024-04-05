import {Scene} from "phaser";
import Cell from './Cell';

export default class Grid
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
    constructor (scene:Scene, width:number, height:number, bombs:number)
    {
        this.scene = scene;

        this.width = width;
        this.height = height;
        this.size = width * height;
        this.offset = new Phaser.Math.Vector2(12, 55);

        this.timeCounter = 0;
        this.bombQty = bombs;
        this.bombsCounter = bombs;

        this.playing = false;
        this.populated = false;

        this.timer = scene.time.addEvent(new Phaser.Time.TimerEvent({}));

        //  0 = waiting to create the grid
        //  1 = playing
        //  2 = game won
        //  3 = game lost
        this.state = 0;

        this.data = [];

        const x = Math.floor((scene.scale.width / 2) - (20 + (width * 16)) / 2);
        const y = Math.floor((scene.scale.height / 2) - (63 + (height * 16)) / 2);

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
        this.updateDigits();

        this.button.setInteractive();

        this.button.on('pointerdown', this.onButtonDown, this);
        this.button.on('pointerup', this.onButtonUp, this);
    }

    createCells ()
    {
        let i = 0;

        for (let x = 0; x < this.width; x++)
        {
            this.data[x] = [];

            for (let y = 0; y < this.height; y++)
            {
                this.data[x][y] = new Cell(this, i, x, y);

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
        //  cells start at 12 x 55

        const width = this.width * 16;
        const height = this.height * 16;

        //  Top

        board.add(factory.image(0, 0, 'topLeft').setOrigin(0));

        const topBgWidth = (width + 20) - 60 - 56;

        board.add(factory.tileSprite(60, 0, topBgWidth, 55, 'topBg').setOrigin(0));

        board.add(factory.image(width + 20, 0, 'topRight').setOrigin(1, 0));

        //  Sides

        const sideHeight = (height + 63) - 55 - 8;

        board.add(factory.tileSprite(0, 55, 12, sideHeight, 'left').setOrigin(0));
        board.add(factory.tileSprite(width + 20, 55, 8, sideHeight, 'right').setOrigin(1, 0));

        //  Bottom

        board.add(factory.image(0, height + 63, 'botLeft').setOrigin(0, 1));

        const botBgWidth = (width + 20) - 12 - 8;

        board.add(factory.tileSprite(12, height + 63, botBgWidth, 8, 'botBg').setOrigin(0, 1));

        board.add(factory.image(width + 20, height + 63, 'botRight').setOrigin(1, 1));

        //  Bombs Digits

        this.digit1 = factory.image(17, 16, 'digits', 0).setOrigin(0);
        this.digit2 = factory.image(17 + 13, 16, 'digits', 0).setOrigin(0);
        this.digit3 = factory.image(17 + 26, 16, 'digits', 0).setOrigin(0);

        board.add([ this.digit1, this.digit2, this.digit3 ]);

        //  Timer Digits

        const x = (width + 20) - 54;

        this.time1 = factory.image(x, 16, 'digits', 0).setOrigin(0);
        this.time2 = factory.image(x + 13, 16, 'digits', 0).setOrigin(0);
        this.time3 = factory.image(x + 26, 16, 'digits', 0).setOrigin(0);

        board.add([ this.time1, this.time2, this.time3 ]);

        //  Button

        const buttonX = Math.floor(((width + 20) / 2) - 13);

        this.button = factory.image(buttonX, 15, 'buttons', 0).setOrigin(0);

        board.add(this.button);
    }

    updateBombs (diff:number)
    {
        this.bombsCounter -= diff;

        this.updateDigits();
    }

    updateDigits ()
    {
        const count = Phaser.Utils.String.Pad(this.bombsCounter.toString(), 3, '0', 1);

        this.digit1.setFrame(parseInt(count[0]));
        this.digit2.setFrame(parseInt(count[1]));
        this.digit3.setFrame(parseInt(count[2]));
    }

    onButtonDown ()
    {
        this.button.setFrame(1);
    }

    onButtonUp ()
    {
        if (this.state > 0)
        {
            this.button.setFrame(0);

            this.restart();
        }
    }

    restart ()
    {
        this.populated = false;
        this.playing = false;
        this.bombsCounter = this.bombQty;
        this.state = 0;
        this.timeCounter = -1;
        this.timer.paused = true;

        let location = 0;

        do {

            this.getCell(location).reset();

            location++;

        } while (location < this.size);

        this.updateDigits();

        this.time1.setFrame(0);
        this.time2.setFrame(0);
        this.time3.setFrame(0);
    }

    gameOver ()
    {
        this.playing = false;
        this.state = 3;
        this.timer.paused = true;

        this.button.setFrame(4);

        let location = 0;

        do {

            this.getCell(location).reveal();

            location++;

        } while (location < this.size);
    }

    gameWon ()
    {
        this.playing = false;
        this.state = 2;
        this.timer.paused = true;

        this.button.setFrame(3);
    }

    checkWinState ()
    {
        let correct = 0;
        let location = 0;
        let open = 0;

        do {

            const cell = this.getCell(location);

            if (cell.open)
            {
                open++;
            }

            if (cell.bomb && cell.flagged)
            {
                open++;
                correct++;
            }

            location++;

        } while (location < this.size);

        // console.log('Check', correct, 'out of', this.bombQty, 'open', open, 'of', this.size);

        if (correct === this.bombQty && open === this.size)
        {
            this.gameWon();
        }
    }

    generate (startIndex:number)
    {
        let qty = this.bombQty;

        const bombs = [];

        do {
            const location = Phaser.Math.Between(0, this.size - 1);

            const cell = this.getCell(location);

            if (!cell.bomb && cell.index !== startIndex)
            {
                cell.bomb = true;

                qty--;

                bombs.push(cell);
            }

        } while (qty > 0);

        bombs.forEach(cell => {

            //  Update the 8 cells around this bomb cell

            const adjacent = this.getAdjacentCells(cell);

            adjacent.forEach(adjacentCell => {

                if (adjacentCell)
                {
                    adjacentCell.value++;
                }
            });
        });

        this.playing = true;
        this.populated = true;
        this.state = 1;

        this.timer.reset({ delay: 1000, callback: this.onTimer, callbackScope: this, loop: true });

        this.debug();
    }

    onTimer ()
    {
        this.timeCounter++;

        if (this.timeCounter < 1000)
        {
            const count = Phaser.Utils.String.Pad(this.timeCounter.toString(), 3, '0', 1);

            this.time1.setFrame(parseInt(count[0]));
            this.time2.setFrame(parseInt(count[1]));
            this.time3.setFrame(parseInt(count[2]));
        }
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