import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import FightGrid from "../classes/FightGrid";
import { SCENES } from "@/game/types/scenes";
import { GameState } from "@/game/classes/GameState";
import { GAME_EVENTS } from "@/game/types/events";
import FightInputMenu from "@/game/classes/FightInputMenu";

export class Fight extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    mine: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    grid: FightGrid;
    inputMenu: FightInputMenu;
    public removeTrashUses: number;
    public removeBombUses: number;
    public removeLyingUses: number;

    constructor() {
        super(SCENES.Fight);
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

        this.background = this.add.image(512, 384, "background");
        this.background.setAlpha(0.5);

        const gridWidth = GameState.fightGridWidth;
        const gridHeight = GameState.fightGridHeight;
        const numBombs = GameState.bombNum;
        this.grid = new FightGrid(this, gridWidth, gridHeight, numBombs);
        this.inputMenu = new FightInputMenu(this);
        this.removeTrashUses = GameState.removeTrashNum;
        this.removeBombUses = GameState.removeBombNum;
        this.removeLyingUses = GameState.removeLyingNum;

        this.camera.fadeIn(500, 0, 0, 0);

        EventBus.emit("current-scene-ready", this);

        this.input.setDefaultCursor(
            "url(\"data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' height='24' width='24'><text y='16' font-size='16'>🔍</text><path d='M0,2 L0,0 L2,0' fill='red' /></svg>\"), auto",
        );

        this.events.on(
            Phaser.Scenes.Events.SHUTDOWN,
            () => {
                this.input.setDefaultCursor("default");
            },
            this,
        );
    }

    update() {
        this.inputMenu.update();
    }

    // transitionScene(scene: string) {
    //     this.camera.fadeOut(1000, 0, 0, 0);
    //     this.camera.once(
    //         Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
    //         (cam: any) => {
    //             this.scene.start(scene);
    //         },
    //     );
    // }

    transitionScene(scene: string) {
        this.camera.fadeOut(1000, 0, 0, 0);
        this.camera.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            (cam: any) => {
                this.scene.start(scene);
            },
        );
    }
}
