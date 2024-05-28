import { EventBus } from "../EventBus/EventBus";
import { Scene } from "phaser";
import OverworldGrid from "./OverworldGrid";
import HudDisplay from "@/game/Hud/HudDisplay";
import { SCENES } from "@/game/constants/scenes";
import EventDisplay from "@/game/GameState/EventDisplay";
import { FIGHT_EVENTS, GAME_EVENTS } from "@/game/EventBus/events";
import { GameState } from "../GameState/GameState";
import { createBackground } from "@/game/functions/background";
import {
    cameraFadeIn,
    transitionScene,
} from "@/game/functions/transitionScene";
import { addPauseOverlay } from "@/game/functions/addPauseOverlay";
import { mainMenuText } from "@/game/constants/textStyleConstructor";
import { LocalStorageManager } from "@/game/Settings/LocalStorageManager";
import { SETTING_CONSTANTS } from "@/game/Settings/settingConstants";
import { SettingsManager } from "@/game/Settings/SettingsManager";

export class Overworld extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    public overworldGrid: OverworldGrid;
    public Hud: HudDisplay;
    public eventDisplay: EventDisplay;
    public titleText: Phaser.GameObjects.Text;
    public shouldLoadData: boolean;

    constructor() {
        super(SCENES.Overworld);
    }

    init({ shouldLoadData }: { shouldLoadData: boolean }) {
        this.shouldLoadData = shouldLoadData || false;
    }

    preload() {
        this.load.image(
            "overworld_floor",
            "assets/overworld/officeCarpet2.png",
        );
        this.load.spritesheet(
            "overworldBorders",
            "/assets/overworld/overworldBordersSS.png",
            { frameWidth: 64, frameHeight: 64 },
        );
        this.load.image("red_border", "assets/overworld/redBorder.png");
        this.load.image("green_border", "assets/overworld/greenBorder.png");
        this.load.image("white_border", "assets/overworld/whiteBorder.png");
        this.load.image("orange_border", "assets/overworld/orangeBorder.png");
        this.load.image("purple_border", "assets/overworld/purpleBorder.png");
        this.load.image("yellow_border", "assets/overworld/yellowBorder.png");
        this.load.image("dust", "assets/overworld/dustBunny.png");
        this.load.image("player", "assets/overworld/janitor.png");
        this.load.image("carpet_lines", "assets/overworld/carpetLines.png");
        this.load.image("room_cleaned", "assets/overworld/roomCleaned.png");
        this.load.image("clipboard", "assets/hud/longClipboard.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

        this.background = createBackground(this);
        cameraFadeIn(this);
        addPauseOverlay(this);

        const gridWidth = GameState.overworldGridWidth;
        const gridHeight = GameState.overworldGridHeight;
        const numShops = GameState.overworldShops;
        const numFights = GameState.overworldFights;
        const numBuffs = GameState.overworldBuffs;
        const numTraps = GameState.overworldTraps;
        const numBosses = 1;

        this.overworldGrid = new OverworldGrid(this, gridWidth, gridHeight, {
            numBosses,
            numFights,
            numShops,
            numBuffs,
            numTraps,
        });

        this.titleText = this.make.text({
            x: this.scale.width / 2 - 130,
            y: 50,
            text: "Lobby",
            style: mainMenuText({}),
        });

        this.events.on(
            Phaser.Scenes.Events.RESUME,
            () => {
                this.camera.fadeIn(500, 0, 0, 0);
            },
            this,
        );

        // this.loadCurrentCampaignDetails();
        if (this.shouldLoadData) {
            this.loadCurrentCampaignDetails();
        }
        EventBus.on(GAME_EVENTS.GAME_OVER, () => {
            transitionScene(this, SCENES.GameOver, true);
        });

        EventBus.on(GAME_EVENTS.RESET, () => {
            transitionScene(this, SCENES.MainMenu, true);
            this.scene.stop(SCENES.Fight);
            this.scene.stop(SCENES.BossFight);
            this.scene.stop(SCENES.TrapOverlay);
            this.scene.stop(SCENES.Settings);
            this.scene.stop(SCENES.Shop);
        });

        EventBus.on(FIGHT_EVENTS.FIGHT_WON, () => {
            this.saveCurrentCampaignDetails();
        });

        EventBus.emit("current-scene-ready", this);
    }

    saveCurrentCampaignDetails() {
        if (LocalStorageManager.getItem(SETTING_CONSTANTS.hasActiveCampaign)) {
            SettingsManager.saveCurrentCampaignDetails(
                this.overworldGrid.createSkeleton(),
            );
        }
    }

    loadCurrentCampaignDetails() {
        const currentCampaignItem =
            LocalStorageManager.getCurrentCampaignItem();
        if (
            LocalStorageManager.getItem(SETTING_CONSTANTS.hasActiveCampaign) &&
            currentCampaignItem &&
            currentCampaignItem.overworldGrid.width ===
                GameState.overworldGridWidth &&
            currentCampaignItem.overworldGrid.height ===
                GameState.overworldGridHeight
        ) {
            this.overworldGrid.rehydrateFromSkeleton(
                currentCampaignItem.overworldGrid,
            );
            this.overworldGrid.data.forEach((row) => {
                row.forEach((cell) => {
                    this.overworldGrid.paintNeighborBorders(cell);
                });
            });
        }
    }
}
