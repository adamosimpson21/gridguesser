import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import {SCENES} from "@/game/types/scenes";

export class GameWon extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;

    constructor ()
    {
        super(SCENES.GameWon);
    }

    create ()
    {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameOverText = this.add.text(512, 384, '🏆🏆🏆🏆🏆 Game Won. You Win! 🥳🥳🥳🥳🥳', {
            fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.gameOverText = this.add.text(512, 484, 'Go To Main Menu', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        this.gameOverText.setInteractive();
        this.gameOverText.on('pointerdown', () => this.resetToMainMenu());



        EventBus.emit('current-scene-ready', this);
    }

    resetToMainMenu(){
        this.scene.stop(SCENES.Fight);
        this.scene.stop(SCENES.Overworld);
        this.scene.stop(SCENES.Shop);
        this.scene.stop(SCENES.Hud);
        this.scene.switch(SCENES.MainMenu)
    }

    changeScene ()
    {
        this.scene.start(SCENES.MainMenu);
    }
}
