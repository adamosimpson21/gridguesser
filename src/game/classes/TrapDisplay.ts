import { Scene } from "phaser";
import { trapType } from "@/game/types/trapConstants";
import { SCENES } from "@/game/types/scenes";

export default class TrapDisplay {
    public scene: Phaser.Scene;
    public height: number;
    public width: number;
    private trap: trapType;
    private trapBoard: Phaser.GameObjects.Container;
    private background: Phaser.GameObjects.Image;
    private closeButton: Phaser.GameObjects.Text;

    constructor(scene: Scene, trap: trapType) {
        this.scene = scene;
        this.trap = trap;

        this.trapBoard = scene.add.container(400, 100);
        this.background = this.scene.add.image(0, 0, "cubicle").setOrigin(0, 0);

        this.closeButton = this.scene.add
            .text(0, 400, "Close This", {
                backgroundColor: "white",
                fontSize: 64,
                color: "black",
            })
            .setInteractive()
            .on("pointerdown", this.closeTrap, this);

        this.trapBoard.add(this.background);
        this.trapBoard.add(this.closeButton);
    }

    closeTrap() {
        this.scene.scene.stop(SCENES.TrapOverlay);
        this.scene.scene.resume(SCENES.Overworld);
    }
}
