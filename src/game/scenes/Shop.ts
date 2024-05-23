import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import FightGrid from "../classes/FightGrid";
import { SCENES } from "@/game/types/scenes";
import ShopGrid from "@/game/classes/ShopGrid";
import { createBackground } from "@/game/functions/background";
import { cameraFadeIn } from "@/game/functions/transitionScene";
import { addPauseOverlay } from "@/game/functions/addPauseOverlay";

export class Shop extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    private shop: ShopGrid;
    private returnButton: Phaser.GameObjects.Text;

    constructor() {
        super(SCENES.Shop);
    }

    preload() {
        this.load.image(
            "vending_machine",
            "/assets/shop/vendingMachineBlack.png",
        );
        this.load.image("clipboard", "/assets/hud/longClipboard.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);
        //
        cameraFadeIn(this);
        addPauseOverlay(this);

        this.background = createBackground(this);

        this.shop = new ShopGrid(this);
        EventBus.emit("current-scene-ready", this);
    }
}
