import EventDisplay from "@/game/GameState/EventDisplay";
import { SCENES } from "@/game/constants/scenes";
import { GAME_CONSTANTS } from "@/game/GameState/gameConstants";
import { EventBus } from "@/game/EventBus/EventBus";
import { Scene } from "phaser";
import { trapType } from "@/game/Trap/trapConstants";
import TrapDisplay from "@/game/Trap/TrapDisplay";
import { cameraFadeIn } from "@/game/functions/transitionScene";

export class TrapOverlay extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    public trapDisplay: TrapDisplay;
    public trap: trapType;

    constructor() {
        super(SCENES.TrapOverlay);
    }

    init(trap: trapType) {
        this.trap = trap;
    }

    preload() {
        this.load.image("cubicle", "/assets/trap/cubicle.png");
        this.load.image("black_screen", "/assets/blackScreen.png");
        this.load.image("white_screen", "/assets/whiteScreen.png");
    }

    create() {
        const background = this.add
            .image(this.scale.width / 2, this.scale.height / 2, "black_screen")
            .setAlpha(0.66);
        EventBus.emit("current-scene-ready", this);
        cameraFadeIn(this);
        this.trapDisplay = new TrapDisplay(this, this.trap);
    }
}
