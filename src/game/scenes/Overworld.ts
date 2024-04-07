import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import OverworldGrid from '../classes/OverworldGrid'
import Hud from "@/game/classes/Hud";
import {SCENES} from "@/game/types/scenes";
import EventDisplay from "@/game/classes/EventDisplay";

export class Overworld extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    private overworldGrid: OverworldGrid;
    private Hud: Hud;
    private eventDisplay: EventDisplay;
    constructor ()
    {
        super(SCENES.Overworld);
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        const gridWidth = 5;
        const gridHeight = 5;
        const numShops = 2;
        const numFights = 5;
        const numBosses = 1;
        const numBuffs = 2;
        const numTraps = 2;
        this.Hud = new Hud(this, 'Starting Name', 5, 5, 5);
        this.eventDisplay = new EventDisplay(this);

        this.overworldGrid = new OverworldGrid(this, this.Hud, this.eventDisplay, gridWidth, gridHeight, {numBosses, numFights, numShops, numBuffs, numTraps})
        
        // this.mine = this.add.image(200, 200, 'mine')
        this.add.text(200, 200, '💣')

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start(SCENES.Fight);
    }
}