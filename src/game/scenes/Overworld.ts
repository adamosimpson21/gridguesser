import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Grid from '../classes/Grid'

export class Overworld extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    private grid: Grid;
    constructor ()
    {
        super('Overworld');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        const gridWidth = 5;
        const gridHeight = 5;
        const numBombs = 0;
        this.grid = new Grid(this, gridWidth, gridHeight, numBombs)

        // this.mine = this.add.image(200, 200, 'mine')
        this.add.text(200, 200, '💣')

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('Game');
    }
}