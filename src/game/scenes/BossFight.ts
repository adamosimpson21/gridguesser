import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import FightGrid from "../classes/FightGrid";
import { SCENES } from "@/game/types/scenes";
import { GameState } from "@/game/classes/GameState";
import { GAME_EVENTS, SCENE_EVENTS } from "@/game/types/events";
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

    preload() {
        this.load.spritesheet(
            "flagOverlay",
            "/assets/fight/flagOverlaySS.png",
            {
                frameWidth: 64,
                frameHeight: 64,
            },
        );
        this.load.image("black_screen", "/assets/blackScreen.png");
        this.load.image("enemy1", "/assets/fight/dustBunny.png");
        this.load.image("clipboard", "/assets/hud/longClipboard.png");
        this.load.image("blank", "/assets/blank.png");
        this.load.image("trash_bag", "/assets/fight/trashBag.png");
        this.load.image("trash_can", "/assets/fight/trashCan.png");
        this.load.image("trash_can_over", "/assets/fight/trashCanOver.png");
        this.load.image("boss_desk", "/assets/fight/bossDesk.png");
        this.load.image("black_key", "/assets/hud/blackKey.png");
        this.load.image("towel_cover", "/assets/fight/yellowSquare.png");
        this.load.image("brown_square", "/assets/fight/brownSquare.png");
        this.load.image("ladder", "/assets/fight/ladder.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

        this.background = createBackground(this);

        const gridWidth = Math.floor(GameState.fightGridWidth * 1.25);
        const gridHeight = Math.floor(GameState.fightGridHeight * 1.25);
        // testing nerf
        const numBombs = Math.floor(GameState.bombNum * 2);
        // const numBombs = Math.floor(GameState.bombNum);
        this.grid = new BossFightGrid(this, gridWidth, gridHeight, numBombs);

        this.input.setDefaultCursor(
            "url(/assets/cursors/broomSm.cur), pointer",
        );

        this.camera.fadeIn(500, 0, 0, 0);

        this.createIntroModal();

        EventBus.emit("current-scene-ready", this);
        this.events.on(
            Phaser.Scenes.Events.SHUTDOWN,
            () => {
                this.input.setDefaultCursor("default");
                EventBus.emit(SCENE_EVENTS.LEAVE_FIGHT);
            },
            this,
        );
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

    createIntroModal() {
        const deskImage = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            "boss_desk",
        );

        deskImage.setInteractive();

        const background = this.add
            .image(this.scale.width / 2, this.scale.height / 2, "black_screen")
            .setAlpha(0.66);

        const introText = this.add.text(
            600,
            250,
            "As you enter the boss's corner office, something seems amiss. It's dirtier, smellier, and is in disarray. You stay alert while you begin cleaning...",
            {
                fontSize: "40px",
                wordWrap: { width: 800, useAdvancedWrap: true },
            },
        );

        const introButton = this.add.text(900, 850, "Continue", {
            fontSize: "40px",
            backgroundColor: "gray",
        });

        deskImage.on("pointerdown", () => {
            deskImage.setAlpha(0);
            background.setAlpha(0);
            introText.setAlpha(0);
            introButton.setAlpha(0);
        });
    }
}
