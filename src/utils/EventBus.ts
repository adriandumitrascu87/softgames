import { EventEmitter } from "pixi.js";

/** Global event definitions for level flow */

export type EventMap = {
    START:void; // Start the game
    LOAD_LEVEL:number; // Load a level by id
    BACK: void; // Return to level select
}
/** Shared event bus for loading and navigation */
export const loadEvents = new EventEmitter<EventMap>();