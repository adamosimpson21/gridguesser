import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import FightGrid from "../classes/FightGrid";
import { SCENES } from "@/game/types/scenes";
import { GameState } from "@/game/classes/GameState";
import { FIGHT_EVENTS, GAME_EVENTS, SCENE_EVENTS } from "@/game/types/events";
import FightInputMenu from "@/game/classes/FightInputMenu";
import { createBackground } from "@/game/functions/background";
import { changeInputScrollWheel } from "@/game/functions/changeInputScrollWheel";

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

    preload() {
        this.load.spritesheet(
            "flagOverlay",
            "/assets/fight/flagOverlaySS.png",
            {
                frameWidth: 64,
                frameHeight: 64,
            },
        );
        this.load.image("trash_bag", "/assets/fight/trashBag.png");
        this.load.image("enemy1", "/assets/fight/dustBunny.png");
        this.load.image("clipboard", "/assets/hud/longClipboard.png");
        this.load.image("blank", "/assets/blank.png");
        this.load.image("trash_can", "/assets/fight/trashCan.png");
        this.load.image("trash_can_over", "/assets/fight/trashCanOver.png");
        this.load.image("towel_cover", "/assets/fight/yellowSquare.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

        this.background = createBackground(this);
        this.background.setInteractive();

        this.background.on("wheel", changeInputScrollWheel);

        const gridWidth = GameState.fightGridWidth;
        const gridHeight = GameState.fightGridHeight;
        const numBombs = GameState.bombNum;
        this.grid = new FightGrid(this, gridWidth, gridHeight, numBombs);
        GameState.resetFightConstants();

        this.camera.fadeIn(500, 0, 0, 0);

        EventBus.emit("current-scene-ready", this);

        this.input.setDefaultCursor(
            "url(\"data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' height='48' width='48'><text y='32' font-size='32'>🔍</text><path d='M0,4 L0,0 L4,0' fill='red' /></svg>\"), auto",
        );

        this.events.on(
            Phaser.Scenes.Events.SHUTDOWN,
            () => {
                this.input.setDefaultCursor("default");
                EventBus.emit(SCENE_EVENTS.LEAVE_FIGHT);
            },
            this,
        );

        // scroll wheel to change input type
        this.input.on(
            "gameobjectwheel",
            (
                pointer: Phaser.Input.Pointer,
                gameObj: Phaser.GameObjects.GameObject,
                deltaX: number,
                deltaY: number,
            ) => {
                if (deltaY > 0) {
                } else {
                }
            },
        );
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
