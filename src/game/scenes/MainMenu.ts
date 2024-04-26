import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import {SCENES} from "@/game/types/scenes";

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    title: GameObjects.Text;
    overworldButton: GameObjects.Text;
    fightSceneButton: GameObjects.Text;

    constructor ()
    {
        super(SCENES.MainMenu);
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'background');

        this.title = this.add.text(512, 250, 'Broom Sweeper', {
            fontFamily: 'Arial Black', fontSize: 56, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.overworldButton = this.add.text(512, 460, 'New Game', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        this.overworldButton.setInteractive();
        this.overworldButton.on('pointerdown', () => this.scene.start(SCENES.NewGame))

        this.overworldButton = this.add.text(512, 520, 'Minesweeper Tutorial', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        this.overworldButton.setInteractive();
        this.overworldButton.on('pointerdown', () => window.location.href = "https://minesweepergame.com/strategy/how-to-play-minesweeper.php")


        this.fightSceneButton = this.add.text(512, 580, 'Go To Fight', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        this.fightSceneButton.setInteractive();
        this.fightSceneButton.on('pointerdown', () => this.scene.start(SCENES.Fight))

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        this.scene.start(SCENES.Overworld);
    }

}
