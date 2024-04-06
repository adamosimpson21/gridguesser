import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Grid from '../classes/Grid'

export class Fight extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    mine: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    private grid: Grid;

    constructor ()
    {
        super('Fight');
    }

    
    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);
        

        // this.gameText = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5).setDepth(100);
        
        const gridWidth = 8;
        const gridHeight = 8;
        const numBombs = 4   
        this.grid = new Grid(this, gridWidth, gridHeight, numBombs)

        // this.mine = this.add.image(200, 200, 'mine')
        this.add.text(200, 200, '💣')

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
