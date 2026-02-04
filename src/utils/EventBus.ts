import { EventEmitter } from "pixi.js";


export type EventMap = {
    START:void;
    LOAD_UNIT:number;
    BACK: void;
}

export const loadEvents = new EventEmitter<EventMap>();