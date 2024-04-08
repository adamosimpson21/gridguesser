import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import OverworldGrid from '../classes/OverworldGrid'
import HudDisplay from "@/game/classes/HudDisplay";
import {SCENES} from "@/game/types/scenes";
import EventDisplay from "@/game/classes/EventDisplay";
import Player from "@/game/classes/Player";

export class Overworld extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    private overworldGrid: OverworldGrid;
    public Hud: HudDisplay;
    public eventDisplay: EventDisplay;
    public Player: Player;
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

        this.overworldGrid = new OverworldGrid(this, gridWidth, gridHeight, {numBosses, numFights, numShops, numBuffs, numTraps})
        this.Player = new Player('New name', 5, 5);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start(SCENES.Fight);
    }
    
    transitionScene(scene: string){
        this.camera.fadeOut(1000, 0, 0, 0);
        this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam: any) => {
            this.scene.start(scene)
        })
    }
    
    
}