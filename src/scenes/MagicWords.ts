import { Container } from "pixi.js";
import type { IUnit } from "../utils/IUnit";

export class MagicWords extends Container implements IUnit {

  constructor() {
    super();

  }

  onEnterUnit(): void {}

  onExitUnit(): void {}
}
