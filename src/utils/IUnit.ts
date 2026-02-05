import type { Container } from "pixi.js";

export interface IUnit extends Container{

    onEnterUnit():void;
    onExitUnit():void;
    onResize(width:number, height:number):void;
    
}