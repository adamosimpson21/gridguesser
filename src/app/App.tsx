import { useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "../game/PreGame/PhaserGame";
function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default App;
