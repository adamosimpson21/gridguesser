// import HudDisplay from "@/game/Hud/HudDisplay";
// import { Scene } from "phaser";
// import EventDisplay from "@/game/GameState/EventDisplay";
// import { Hud } from "@/game/Hud/Hud";
// import { EventBus } from "@/game/EventBus/EventBus";
// import { PLAYER_EVENTS } from "@/game/EventBus/events";
//
// export default class Trap {
//     private type: string;
//     private severity: number;
//     private scene: Phaser.Scene;
//     private eventDisplay: EventDisplay;
//     private isTrap: boolean;
//
//     constructor(scene: Scene, type: string, severity: number, isTrap: boolean) {
//         this.scene = scene;
//         this.type = type;
//         this.severity = severity;
//         this.isTrap = isTrap;
//     }
//
//     trigger() {
//         switch (this.type) {
//             case "HP":
//                 if (!this.isTrap) {
//                     EventBus.emit(PLAYER_EVENTS.GAIN_HP, this.severity);
//                 } else {
//                     EventBus.emit(PLAYER_EVENTS.LOSE_HP, this.severity);
//                 }
//                 break;
//             case "MONEY":
//                 if (!this.isTrap) {
//                     EventBus.emit(PLAYER_EVENTS.GAIN_GOLD, this.severity);
//                 } else {
//                     EventBus.emit(PLAYER_EVENTS.LOSE_GOLD, this.severity);
//                 }
//                 break;
//             default:
//                 break;
//         }
//     }
//
//     getTrapInfo() {
//         return { type: this.type, severity: this.severity };
//     }
// }
