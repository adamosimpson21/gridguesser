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
        innerObject: Phaser.GameObjects.Container;
    },
) => {
    const tooltipContainer = scene.add.container(
        scene.input.mousePointer.x,
        scene.input.mousePointer.y,
    );
    object.setInteractive();
    object.on("pointerover", () => {
        let xAnchor = scene.input.mousePointer.x;
        let yAnchor = scene.input.mousePointer.y;
        // anchor right
        if (
            scene.input.mousePointer.x +
                (width ? width : TOOLTIP_CONSTANTS.BASE_WIDTH) >
            scene.scale.width
        ) {
            xAnchor -= width
                ? width + TOOLTIP_CONSTANTS.X_OFFSET * 2
                : TOOLTIP_CONSTANTS.BASE_WIDTH;
        }
        //anchor bottom
        if (
            scene.input.mousePointer.y +
                (height ? height : TOOLTIP_CONSTANTS.BASE_HEIGHT) >
            scene.scale.height
        ) {
            yAnchor -= height
                ? height + TOOLTIP_CONSTANTS.Y_OFFSET * 2
                : TOOLTIP_CONSTANTS.BASE_HEIGHT;
        }
        tooltipContainer.setAlpha(1);
        tooltipContainer.setPosition(xAnchor, yAnchor);
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
