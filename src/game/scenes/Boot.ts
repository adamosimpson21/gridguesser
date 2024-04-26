import { Scene } from "phaser";
import { SCENES } from "@/game/types/scenes";

export class Boot extends Scene {
    constructor() {
        super(SCENES.Boot);
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image("background", "assets/bg.png");
        // this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth:16, frameHeight:16, endFrame:16})
        // this.load.spritesheet('digits', 'assets/digits.png', {frameWidth:13, frameHeight:24})
        // this.load.spritesheet('buttons',  'assets/digits.png', {frameWidth: 26, frameHeight: 26, startFrame: 5})
        // this.load.image('mine', 'assets/mine.png')
        // this.load.image('botBg', 'assets/bot-bg.png')
        // this.load.image('left', 'assets/left.png')
        // this.load.image('right', 'assets/right.png')
        // this.load.image('botLeft', 'assets/bot-left.png')
        // this.load.image('botRight', 'assets/bot-right.png')
        // this.load.image('topBg', 'assets/top-bg.png')
        // this.load.image('topLeft', 'assets/top-left.png')
        // this.load.image('topRight', 'assets/top-right.png')
    }

    create() {
        this.scene.start(SCENES.Preloader);
    }
}
