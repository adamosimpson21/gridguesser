import { Scene } from "phaser";
import { SCENES } from "@/game/constants/scenes";
import EventDisplay from "@/game/GameState/EventDisplay";
import HudDisplay from "@/game/Hud/HudDisplay";
import { EventBus } from "@/game/EventBus/EventBus";
import OverworldLegend from "@/game/Hud/OverworldLegend";
export class Hud extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    public eventDisplay: EventDisplay | undefined;
    public hudDisplay: HudDisplay | undefined;
    public overworldLegend: OverworldLegend;

    constructor() {
        super(SCENES.Hud);
    }

    preload() {
        this.load.image("clipboard", "assets/hud/longClipboard.png");
        this.load.image("key_ring", "assets/hud/keyRing.png");
        this.load.image("black_key", "assets/hud/blackKey.png");
        this.load.spritesheet("input_hints", "assets/cursors/inputHints.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet(
            "shop_items",
            "/assets/shop/items/shopItemSS.png",
            { frameWidth: 64, frameHeight: 64 },
        );
        this.load.image("red_border", "/assets/overworld/redBorder.png");
        this.load.image("orange_border", "/assets/overworld/orangeBorder.png");
        this.load.image("green_border", "/assets/overworld/greenBorder.png");
        this.load.image("yellow_border", "/assets/overworld/yellowBorder.png");
        this.load.image("purple_border", "/assets/overworld/purpleBorder.png");
        this.load.image("white_border", "/assets/overworld/whiteBorder.png");
        // shader plugin
        this.load.plugin(
            "rexglowfilter2pipelineplugin",
            "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexglowfilter2pipelineplugin.min.js",
            true,
        );
    }

    create() {
        this.camera = this.cameras.main;
        this.hudDisplay = new HudDisplay(this);
        this.overworldLegend = new OverworldLegend(this);
        this.eventDisplay = new EventDisplay(this);
        EventBus.emit("current-scene-ready", this);
    }
}
