export const addTooltip = (
    scene: Phaser.Scene,
    object: Phaser.GameObjects.GameObject,
    {
        width,
        height,
        innerObject,
    }: {
        width?: number;
        height?: number;
        innerObject: Phaser.GameObjects.GameObject;
    },
) => {
    const tooltipContainer = scene.add.container(
        scene.input.mousePointer.x,
        scene.input.mousePointer.y,
    );
    object.setInteractive();
    object.on("pointerover", () => {
        tooltipContainer.setAlpha(1);
        tooltipContainer.setPosition(
            scene.input.mousePointer.x,
            scene.input.mousePointer.y,
        );
    });
    object.on("pointerout", () => {
        tooltipContainer.setAlpha(0);
    });

    // scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
    //     tooltipContainer.setPosition(pointer.x, pointer.y);
    // });
    const clipboardBackground = scene.make
        .image({ x: 0, y: 0, key: "clipboard" })
        .setOrigin(0, 0)
        .setDisplaySize(
            width
                ? width + TOOLTIP_CONSTANTS.X_OFFSET * 2
                : TOOLTIP_CONSTANTS.BASE_WIDTH + TOOLTIP_CONSTANTS.X_OFFSET * 2,
            height
                ? height + TOOLTIP_CONSTANTS.Y_OFFSET * 2
                : TOOLTIP_CONSTANTS.BASE_HEIGHT +
                      TOOLTIP_CONSTANTS.Y_OFFSET * 2,
        );

    tooltipContainer.add(clipboardBackground);
    tooltipContainer.add(innerObject);
    tooltipContainer.setAlpha(0);

    return tooltipContainer;
};

export const TOOLTIP_CONSTANTS = {
    X_OFFSET: 25,
    Y_OFFSET: 40,
    BASE_WIDTH: 250,
    BASE_HEIGHT: 300,
};
