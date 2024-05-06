import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import FightGrid from "../classes/FightGrid";
import { SCENES } from "@/game/types/scenes";
import { GameState } from "@/game/classes/GameState";
import { GAME_EVENTS } from "@/game/types/events";
import BossFightGrid from "@/game/classes/BossFightGrid";
import FightInputMenu from "@/game/classes/FightInputMenu";
import { Fight } from "@/game/scenes/Fight";
import { createBackground } from "@/game/functions/background";

export class BossFight extends Scene {
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
        super(SCENES.BossFight);
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

        this.background = createBackground(this);

        const gridWidth = Math.floor(GameState.fightGridWidth * 1.5);
        const gridHeight = Math.floor(GameState.fightGridHeight * 1.5);
        const numBombs = Math.floor(GameState.bombNum * 2);
        this.inputMenu = new FightInputMenu(this);
        this.grid = new BossFightGrid(this, gridWidth, gridHeight, numBombs);

        this.camera.fadeIn(500, 0, 0, 0);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.inputMenu.update();
    }

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
