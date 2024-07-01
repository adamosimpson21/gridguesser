import { EventBus } from "../EventBus/EventBus";
import { Scene } from "phaser";
import FightGrid from "./FightGrid";
import { SCENES } from "@/game/constants/scenes";
import { GameState } from "@/game/GameState/GameState";
import {
    FIGHT_EVENTS,
    GAME_EVENTS,
    SCENE_EVENTS,
} from "@/game/EventBus/events";
import FightInputMenu from "@/game/Hud/FightInputMenu";
import { createBackground } from "@/game/functions/background";
import { changeInputScrollWheel } from "@/game/functions/changeInputScrollWheel";
import { cameraFadeIn } from "@/game/functions/transitionScene";
import { addPauseOverlay } from "@/game/functions/addPauseOverlay";
import { mainMenuText } from "@/game/constants/textStyleConstructor";
import { flavorConstants } from "@/game/constants/flavorConstants";

export class Fight extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    mine: Phaser.GameObjects.Image;
    grid: FightGrid;
    public titleText: Phaser.GameObjects.Text;

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
        this.load.spritesheet("fightTiles", "/assets/fight/fightTileSS.png", {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.image("trash_bag", "/assets/fight/trashBag.png");
        this.load.image("enemy1", "/assets/fight/dustBunny.png");
        this.load.image("clipboard", "/assets/hud/longClipboard.png");
        this.load.image("blank", "/assets/blank.png");
        this.load.image("trash_can", "/assets/fight/trashCan.png");
        this.load.image("trash_can_over", "/assets/fight/trashCanOver.png");
        this.load.image("towel_cover", "/assets/fight/yellowSquare.png");
        this.load.image("brown_square", "/assets/fight/brownSquare.png");
        this.load.image("ladder", "/assets/fight/ladder.png");
        this.load.image("dust_bunny_2", "/assets/ideas/dustBunny128.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

        this.background = createBackground(this);
        this.background.setInteractive();
        cameraFadeIn(this);
        addPauseOverlay(this);

        this.background.on("wheel", changeInputScrollWheel);

        const gridWidth = GameState.fightGridWidth;
        const gridHeight = GameState.fightGridHeight;
        const numBombs = GameState.bombNum;
        this.grid = new FightGrid(this, gridWidth, gridHeight, numBombs);

        this.titleText = this.make.text({
            x: this.scale.width / 2 - 500,
            y: 50,
            text: `Clean this dirty ${flavorConstants.FIGHT_NAME}`,
            style: mainMenuText({}),
        });

        EventBus.emit("current-scene-ready", this);

        this.input.setDefaultCursor(
            "url(/assets/cursors/broomSm.cur), pointer",
        );

        this.events.on(
            Phaser.Scenes.Events.SHUTDOWN,
            () => {
                this.input.setDefaultCursor("default");
                EventBus.emit(SCENE_EVENTS.LEAVE_FIGHT);
            },
            this,
        );
    }

    update() {
        this.grid.update();
    }
}
