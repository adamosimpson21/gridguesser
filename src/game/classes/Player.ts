import { EventBus } from "@/game/EventBus";
import { GAME_EVENTS, PLAYER_EVENTS, UI_EVENTS } from "@/game/types/events";
import { shopItemType, testingItems } from "@/game/types/shopItems";
import { GameState } from "@/game/classes/GameState";
import { GAME_CONSTANTS } from "@/game/types/gameConstants";
export class PlayerClass {
    public name: string;
    public hp: number;
    public gold: number;
    public maxHp: number;
    public luck: number;
    private upgrades: shopItemType[];
    constructor() {
        this.initializeOrReset();
        this.create();
    }

    create() {
        EventBus.on(PLAYER_EVENTS.CHANGE_NAME, (name: string) => {
            this.name = name;
            EventBus.emit(UI_EVENTS.UPDATE_NAME, name);
        });
        EventBus.on(
            PLAYER_EVENTS.GAIN_HP,
            (severity: number, silent?: boolean) => {
                this.updateHp(this.hp + severity, this.maxHp, silent);
            },
        );
        EventBus.on(
            PLAYER_EVENTS.LOSE_HP,
            (severity: number, silent?: boolean) => {
                let damageAfterReduction =
                    severity - GameState.playerDamageReduction;
                if (damageAfterReduction <= 0) {
                    severity = 0;
                    silent = true;
                } else {
                    severity = damageAfterReduction;
                }
                this.updateHp(this.hp - severity, this.maxHp, silent);
            },
        );
        EventBus.on(
            PLAYER_EVENTS.GAIN_GOLD,
            (severity: number, silent?: boolean) => {
                this.updateGold(severity, silent);
            },
        );
        EventBus.on(
            PLAYER_EVENTS.LOSE_GOLD,
            (severity: number, silent?: boolean) => {
                this.updateGold(-severity, silent);
            },
        );
        EventBus.on(
            PLAYER_EVENTS.GAIN_MAX_HP,
            (severity: number, addHp: number, silent?: boolean) => {
                this.updateHp(this.hp + addHp, this.maxHp + severity, silent);
            },
        );
        EventBus.on(
            PLAYER_EVENTS.LOSE_MAX_HP,
            (severity: number, silent?: boolean) => {
                this.updateHp(
                    this.hp - severity,
                    this.maxHp - severity,
                    silent,
                );
            },
        );
        EventBus.on(
            PLAYER_EVENTS.GAIN_UPGRADE,
            (upgrade: shopItemType, silent?: boolean) => {
                this.updateUpgrades(upgrade, true, silent);
            },
        );
        EventBus.on(
            PLAYER_EVENTS.LOSE_UPGRADE,
            (upgrade: shopItemType, silent?: boolean) => {
                this.updateUpgrades(upgrade, false, silent);
            },
        );
        EventBus.on(
            PLAYER_EVENTS.HIT_BOMB,
            (numBombs: number, silent?: boolean) => {
                this.hitBomb(numBombs, silent);
            },
        );

        EventBus.on(GAME_EVENTS.RESET, () => {
            this.initializeOrReset();
        });
        EventBus.emit(PLAYER_EVENTS.GAIN_HP, this.hp, this.maxHp, true);
        EventBus.emit(PLAYER_EVENTS.GAIN_GOLD, 0, true);
        this.upgrades.map((upgrade) => {
            EventBus.emit(PLAYER_EVENTS.LOSE_UPGRADE, upgrade, true);
        });
    }

    initializeOrReset() {
        this.name = GAME_CONSTANTS.startingName;
        this.hp = GAME_CONSTANTS.startingHp;
        this.maxHp = GAME_CONSTANTS.startingMaxHp;
        this.gold = GAME_CONSTANTS.startingGold;
        this.luck = GAME_CONSTANTS.startingLuck;
        this.upgrades = [];
        EventBus.emit(UI_EVENTS.UPDATE_HEALTH, this.hp, this.maxHp, 0, true);
        EventBus.emit(UI_EVENTS.UPDATE_GOLD, this.gold, 0, true);
        EventBus.emit(UI_EVENTS.UPDATE_UPGRADES, this.upgrades, true);
    }

    updateUpgrades(upgrade: shopItemType, gained: boolean, silent?: boolean) {
        if (gained) {
            this.upgrades.push(upgrade);
            EventBus.emit(
                UI_EVENTS.UPDATE_UPGRADES,
                this.upgrades,
                upgrade,
                gained,
                silent,
            );
        } else {
            const index = this.upgrades.findIndex(
                (item) => item.id === upgrade.id,
            );
            if (index !== -1) {
                this.upgrades = this.upgrades.splice(index, 1);
                EventBus.emit(
                    UI_EVENTS.UPDATE_UPGRADES,
                    this.upgrades,
                    upgrade,
                    gained,
                    silent,
                );
            }
        }
    }

    hitBomb(numBombs: number, silent?: boolean) {
        const bombDamage = GameState.bombIntensity * numBombs;
        EventBus.emit(PLAYER_EVENTS.LOSE_HP, bombDamage, silent);
    }

    updateHp(hp?: number, maxHp?: number, silent?: boolean) {
        const prevHp = this.hp;
        let hpToUpdate = hp || this.hp;
        // cover corner case where hp === 0
        if (hp === 0) {
            hpToUpdate = hp;
        }
        let maxHpToUpdate = maxHp || this.hp;
        // cover corner case where maxHp === 0
        if (maxHp === 0) {
            maxHpToUpdate = maxHp;
        }
        // if maxhp is somehow 0 or negative, let them live
        if (maxHpToUpdate <= 0) {
            maxHpToUpdate = 1;
        }
        if (hpToUpdate <= 0) {
            EventBus.emit(GAME_EVENTS.GAME_OVER);
        } else if (hpToUpdate >= maxHpToUpdate) {
            hpToUpdate = maxHpToUpdate;
        }

        this.hp = hpToUpdate;
        this.maxHp = maxHpToUpdate;
        const hpChange = this.hp - prevHp;
        EventBus.emit(
            UI_EVENTS.UPDATE_HEALTH,
            hpToUpdate,
            maxHpToUpdate,
            hpChange,
            silent,
        );
    }

    updateGold(goldDifference: number, silent?: boolean) {
        let goldToUpdate = goldDifference;
        if (goldDifference + this.gold >= 0) {
            goldToUpdate = this.gold + goldDifference;
        } else {
            goldToUpdate = 0;
        }

        this.gold = goldToUpdate;

        EventBus.emit(
            UI_EVENTS.UPDATE_GOLD,
            goldToUpdate,
            goldDifference,
            silent,
        );
    }
}
