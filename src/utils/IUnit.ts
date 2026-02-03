import type { Container } from "pixi.js";

export interface IUnit extends Container{

    onEnterUnit():void;
    onExitUnit():void;
    
}