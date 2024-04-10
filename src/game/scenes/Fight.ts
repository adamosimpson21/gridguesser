import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import FightGrid from '../classes/FightGrid'
import {SCENES} from "@/game/types/scenes";

export class Fight extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    mine: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    grid: FightGrid;

    constructor ()
    {
        super(SCENES.Fight);
    }

    
    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);
                
        const gridWidth = 8;
        const gridHeight = 8;
        const numBombs = 4   
        this.grid = new FightGrid(this, gridWidth, gridHeight, numBombs)


        this.camera.fadeIn(500, 0, 0, 0)

        EventBus.emit('current-scene-ready', this);
    }
    

    changeScene ()
    {
        this.scene.start(SCENES.GameOver);
    }

    transitionScene(scene: string){
        this.camera.fadeOut(1000, 0, 0, 0);
        this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam: any) => {
            this.scene.start(scene)
        })
    }
}
