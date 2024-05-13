export const angryShakeTween = (
    target: Phaser.GameObjects.GameObject,
    scene: Phaser.Scene,
) => {
    return scene.tweens.chain({
        targets: target,
        tweens: [
            {
                x: "-=5",
                duration: 40,
            },
            {
                x: "+=12",
                duration: 80,
            },
            {
                x: "-=12",
                duration: 80,
            },
            {
                x: "+=12",
                duration: 80,
            },
            {
                x: "-=12",
                duration: 80,
            },
            {
                x: "+=5",
                duration: 40,
            },
        ],
    });
};
