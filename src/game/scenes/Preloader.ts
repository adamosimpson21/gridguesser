import { Scene } from "phaser";
import { SCENES } from "@/game/types/scenes";
import { EventBus } from "@/game/EventBus";
import { SCENE_EVENTS } from "@/game/types/events";
import { GameState } from "@/game/classes/GameState";

export class Preloader extends Scene {
    constructor() {
        super(SCENES.Preloader);
    }
    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, "background");

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });
        this.input.mouse?.disableContextMenu();
    }

    preload() {
        this.load.setPath("assets");
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  this one works, don't delete it or mess with it plz
        // this.scene.start(SCENES.MainMenu).launch(SCENES.Hud);
        //
        if (localStorage) {
            GameState.hasLocalStorage = true;
        }

        this.scene
            .launch(SCENES.MainMenu)
            // .launch(SCENES.Settings)
            .launch(SCENES.Hud)
            .remove();
    }
}
