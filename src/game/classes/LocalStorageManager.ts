import { GameState } from "@/game/classes/GameState";

class LocalStorageManagerClass {
    getItem(key: string) {
        if (localStorage) {
            const item = localStorage.getItem(JSON.stringify(key));
            console.log("item:", item);
            if (item) {
                return JSON.parse(item);
            }
        }
    }

    setItem(key: string, value: any) {
        if (localStorage) {
            localStorage.setItem(JSON.stringify(key), JSON.stringify(value));
            console.log("localstorage:", localStorage);
        }
    }
}

export const LocalStorageManager = new LocalStorageManagerClass();
