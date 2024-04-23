import {Scene} from "phaser";
import {SCENES} from "@/game/types/scenes";
import {EventBus} from "@/game/EventBus";
import {GameState} from "@/game/classes/GameState";

export class NewGame extends Scene{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    submitButton: Phaser.GameObjects.Text;
    constructor() {
        super(SCENES.NewGame)
    }
    
    init(){
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);


        EventBus.emit('current-scene-ready', this);
        
        this.events.on(Phaser.Scenes.Events.RESUME, () => {
            this.camera.fadeIn(500, 0, 0, 0);
        }, this)

        this.submitButton = this.add.text(512, 250, 'New Game', {
            fontFamily: 'Arial Black', fontSize: 56, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        this.submitButton.setInteractive();
        this.submitButton.on('pointerdown', () => this.submit())
        
    }
    
    submit(){
        this.scene.start(SCENES.Overworld);
        this.scene.start(SCENES.Hud);
        GameState.reset();
    }
}