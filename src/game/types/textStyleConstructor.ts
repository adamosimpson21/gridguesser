export const paragraphText = ({
    fontSize,
    fontFamily,
    color,
    align,
    lineSpacing,
    wordWrapWidth,
}: {
    fontSize?: string;
    fontFamily?: string;
    color?: string;
    align?: string;
    lineSpacing?: number;
    wordWrapWidth?: number;
}) => {
    return {
        fontSize: fontSize || "24px",
        fontFamily: fontFamily || "Courier",
        color: color || "#000",
        stroke: "#000",
        strokeThickness: 1,
        align: align || "center",
        lineSpacing: lineSpacing || 6,
        wordWrap: {
            width: wordWrapWidth || 450,
            useAdvancedWrap: true,
        },
    };
};

export const headingText = ({
    fontSize,
    fontFamily,
    color,
    align,
    lineSpacing,
    wordWrapWidth,
}: {
    fontSize?: string;
    fontFamily?: string;
    color?: string;
    align?: string;
    lineSpacing?: number;
    wordWrapWidth?: number;
}) => {
    return {
        fontSize: fontSize || "32px",
        fontFamily: fontFamily || "Courier",
        color: color || "#000",
        stroke: "#000",
        strokeThickness: 2,
        align: align || "center",
        lineSpacing: lineSpacing || 16,
        wordWrap: {
            width: wordWrapWidth || 550,
            useAdvancedWrap: true,
        },
    };
};

export const largeText = ({
    fontSize,
    fontFamily,
    color,
    align,
    lineSpacing,
    wordWrapWidth,
}: {
    fontSize?: string;
    fontFamily?: string;
    color?: string;
    align?: string;
    lineSpacing?: number;
    wordWrapWidth?: number;
}) => {
    return {
        fontSize: fontSize || "42px",
        fontFamily: fontFamily || "Courier",
        color: color || "#fff",
        stroke: "#000",
        strokeThickness: 3,
        align: align || "center",
        lineSpacing: lineSpacing || 22,
        wordWrap: {
            width: wordWrapWidth || 650,
            useAdvancedWrap: true,
        },
    };
};

export const mainMenuText = ({
    fontSize,
    fontFamily,
    color,
    align,
    lineSpacing,
    wordWrapWidth,
}: {
    fontSize?: string;
    fontFamily?: string;
    color?: string;
    align?: string;
    lineSpacing?: number;
    wordWrapWidth?: number;
}) => {
    return {
        fontSize: fontSize || "52px",
        fontFamily: fontFamily || "Courier",
        color: color || "#fff",
        stroke: "#000",
        strokeThickness: 8,
        align: align || "center",
        lineSpacing: lineSpacing || 26,
        wordWrap: {
            width: wordWrapWidth || 750,
            useAdvancedWrap: true,
        },
    };
};
