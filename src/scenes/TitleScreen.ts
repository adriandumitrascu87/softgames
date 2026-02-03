import { Container, Graphics } from "pixi.js";
import type { IUnit } from "../utils/IUnit";

export class TitleScreen extends Container implements IUnit {
  onEnterUnit(): void {
    // Example sprite
    const box = new Graphics().rect(0, 0, 100, 100).fill(0x00ff00);

    box.x = 350;
    box.y = 250;

    this.addChild(box);
  }
  onExitUnit(): void {}
}
