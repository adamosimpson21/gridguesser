import { Scene } from "phaser";
import { SCENES } from "@/game/constants/scenes";
import { EventBus } from "@/game/EventBus/EventBus";
import { GameState } from "@/game/GameState/GameState";
import {
    GAME_EVENTS,
    PLAYER_EVENTS,
    SCENE_EVENTS,
} from "@/game/EventBus/events";
import {
    CHARACTER_CHOICES,
    characterType,
} from "@/game/GameState/gameConstants";
import { createBackground } from "@/game/functions/background";
import {
    headingText,
    largeText,
    mainMenuText,
    paragraphText,
} from "@/game/constants/textStyleConstructor";
import {
    cameraFadeIn,
    transitionScene,
} from "@/game/functions/transitionScene";
import { addPauseOverlay } from "@/game/functions/addPauseOverlay";

export class NewGame extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    submitButton: Phaser.GameObjects.Text;
    public characterChoice: characterType;
    public titleText: Phaser.GameObjects.Text;
    public nameChoiceBoard: Phaser.GameObjects.Container;

    constructor() {
        super(SCENES.NewGame);
        this.characterChoice = CHARACTER_CHOICES["CHAR_ONE"];
    }

    preload() {
        this.load.spritesheet("characters", "/assets/overworld/janitorSS.png", {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.image("clipboard", "/assets/hud/longClipboard.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00000);

        this.background = createBackground(this);
        cameraFadeIn(this);
        addPauseOverlay(this);

        EventBus.emit("current-scene-ready", this);

        this.events.on(
            Phaser.Scenes.Events.RESUME,
            () => {
                this.camera.fadeIn(500, 0, 0, 0);
            },
            this,
        );

        this.nameChoiceBoard = this.add.container(80, 100);

        this.titleText = this.add
            .text(
                this.scale.width / 2,
                50,
                "Choose your Character",
                mainMenuText({ fontSize: "69px", wordWrapWidth: 1500 }),
            )
            .setOrigin(0.5)
            .setDepth(100);

        Object.entries(CHARACTER_CHOICES).forEach((character, index) => {
            this.createCharacterProfile(character[1], index);
            // this.nameChoiceBoard.add(
            //     this.add
            //         .image(-150, index * 80, "characters", 1)
            //         .setOrigin(0, 0)
            //         .setDisplaySize(128, 128)
            //         .setName(`${character[1].id}_IMG`),
            // );
            // this.nameChoiceBoard.add(
            //     this.add
            //         .text(0, index * 80, character[1].name, {
            //             backgroundColor: index === 0 ? "#ECA127" : "",
            //             ...largeText({}),
            //         })
            //         .setOrigin(0.5)
            //         .setDepth(100)
            //         .setInteractive()
            //         .setName(character[1].id)
            //         .on("pointerdown", () =>
            //             this.updateNameBoard(character[1].id),
            //         ),
            // );
        });

        this.submitButton = this.add
            .text(
                this.scale.width / 2,
                1000,
                "Begin Sweepin'",
                mainMenuText({ fontSize: "69px" }),
            )
            .setOrigin(0.5)
            .setDepth(100);
        this.submitButton.setInteractive();
        this.submitButton.on("pointerdown", () => this.submit());
    }
    submit() {
        transitionScene(this, SCENES.Overworld);
        EventBus.emit(GAME_EVENTS.START_NEW_GAME);
        EventBus.emit(PLAYER_EVENTS.CHANGE_CHARACTER, this.characterChoice);
        EventBus.emit(SCENE_EVENTS.ENTER_OVERWORLD);
    }

    handleCharacterClick(character: characterType) {
        if (character.unlocked) {
            this.characterChoice = character;

            this.nameChoiceBoard
                .getAll()
                // name choice board is a container of containers
                // @ts-ignore
                .forEach((gameObject: Phaser.GameObjects.Container) => {
                    if (gameObject.name === character.id) {
                        gameObject.setAlpha(1);
                    } else {
                        gameObject.setAlpha(0.5);
                    }
                });
        }
    }

    createCharacterProfile(character: characterType, index: number) {
        const xOffset = (index % 4) * 420;
        const yOffset = Math.floor(index / 4) * 440;
        const unlocked = character.unlocked;
        const characterBoard = this.add
            .container(xOffset, yOffset)
            .setName(character.id)
            .setAlpha(index === 0 ? 1 : 0.5);

        const profileBackground = this.make
            .image({
                x: 0,
                y: 0,
                key: "clipboard",
            })
            .setOrigin(0, 0)
            .setDisplaySize(380, 420)
            .setInteractive()
            .on("pointerdown", () => {
                this.handleCharacterClick(character);
            })
            .on("pointerover", () => {
                characterBoard.setAlpha(1);
            })
            .on("pointerout", () => {
                if (this.characterChoice !== character) {
                    characterBoard.setAlpha(0.5);
                }
            });
        const profileName = this.make.text({
            x: 36,
            y: 58,
            text: character.name,
            style: headingText({}),
        });
        const profilePicture = this.make
            .image({
                x: 36,
                y: 92,
                key: "characters",
                frame: unlocked ? character.imageFrame : 10,
            })
            .setOrigin(0, 0);
        const abilityName = this.make.text({
            x: 36,
            y: 220,
            text: unlocked ? character.specialPower.name : "????",
            style: headingText({}),
        });
        const abilityDescription = this.make.text({
            x: 36,
            y: 256,
            text: unlocked ? character.specialPower.description : "????",
            style: paragraphText({
                lineSpacing: 5,
                wordWrapWidth: 332,
                fontSize: "18px",
                align: "left",
            }),
        });
        characterBoard.add(profileBackground);
        characterBoard.add(profileName);
        characterBoard.add(profilePicture);
        characterBoard.add(abilityName);
        characterBoard.add(abilityDescription);
        this.nameChoiceBoard.add(characterBoard);
    }
}
