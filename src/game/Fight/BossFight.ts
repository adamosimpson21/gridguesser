import { EventBus } from "../EventBus/EventBus";
import { Scene } from "phaser";
import FightGrid from "./FightGrid";
import { SCENES } from "@/game/constants/scenes";
import { GameState } from "@/game/GameState/GameState";
import { GAME_EVENTS, SCENE_EVENTS } from "@/game/EventBus/events";
import BossFightGrid from "@/game/Fight/BossFightGrid";
import FightInputMenu from "@/game/Hud/FightInputMenu";
import { Fight } from "@/game/Fight/Fight";
import { createBackground } from "@/game/functions/background";
import { GAME_CONSTANTS } from "@/game/GameState/gameConstants";
import { cameraFadeIn } from "@/game/functions/transitionScene";
import { addPauseOverlay } from "@/game/functions/addPauseOverlay";
import { mainMenuText } from "@/game/constants/textStyleConstructor";
import { ADVANCED_MECHANICS } from "@/game/Fight/fightConstants";

export class BossFight extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    mine: Phaser.GameObjects.Image;
    grid: FightGrid;
    public titleText: Phaser.GameObjects.Text;
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
        this.load.spritesheet("fightTiles", "/assets/fight/fightTileSS.png", {
            frameWidth: 128,
            frameHeight: 128,
        });
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
        this.load.image("dust_bunny_2", "/assets/ideas/dustBunny128.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);
        cameraFadeIn(this);
        addPauseOverlay(this);

        this.background = createBackground(this);

        const gridWidth = Math.floor(GameState.fightGridWidth * 1.25);
        const gridHeight = Math.floor(GameState.fightGridHeight * 1.25);
        // testing nerf
        // const numBombs = Math.floor(GameState.bombNum);
        const numBombs = Math.floor(GameState.bombNum * 2);
        this.grid = new BossFightGrid(this, gridWidth, gridHeight, numBombs);

        this.input.setDefaultCursor(
            "url(/assets/cursors/broomSm.cur), pointer",
        );

        this.createIntroModal();

        this.titleText = this.make.text({
            x: this.scale.width / 2 - 500,
            y: 50,
            text: "",
            style: mainMenuText({}),
        });

        this.events.on(
            Phaser.Scenes.Events.SHUTDOWN,
            () => {
                this.input.setDefaultCursor("default");
                EventBus.emit(SCENE_EVENTS.LEAVE_FIGHT);
            },
            this,
        );

        EventBus.emit("current-scene-ready", this);
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

            const advancedMechanicUnlocked =
                GAME_CONSTANTS.advancedMechanics[
                    Math.floor(
                        Phaser.Math.Between(
                            0,
                            GAME_CONSTANTS.advancedMechanics.length - 1,
                        ),
                    )
                ];
            switch (advancedMechanicUnlocked) {
                case ADVANCED_MECHANICS.FIGHT_CAN_HAVE_TRASH_TILES:
                    GameState.fightCanHaveTrashTiles = true;
                    break;
                case ADVANCED_MECHANICS.FIGHT_CAN_HAVE_LYING_TILES:
                    GameState.fightCanHaveLyingTiles = true;
                    break;
                case ADVANCED_MECHANICS.FIGHT_CAN_HAVE_MULTI_BOMB_TILES:
                    GameState.fightCanHaveMultiBombTiles = true;
                    break;
                case ADVANCED_MECHANICS.BOMB_COUNTER_CAN_LIE:
                    GameState.bombCounterCanLie = true;
                    break;
                case ADVANCED_MECHANICS.FIGHT_CAN_HAVE_TENTACLES:
                    GameState.fightCanHaveTentacles = true;
                    break;

                default:
                    break;
            }
        });
    }
}
