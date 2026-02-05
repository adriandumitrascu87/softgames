import { EventEmitter } from "pixi.js";


export type EventMap = {
    START:void;
    LOAD_LEVEL:number;
    BACK: void;
}

export const loadEvents = new EventEmitter<EventMap>();