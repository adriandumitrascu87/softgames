import type { Container } from "pixi.js";
import type { IUnit } from "../utils/IUnit";

export class UnitManager {
  private currentUnit?: IUnit;

  loadUnit(nextUnit: IUnit) {
    this.removeCurrentUnit();
    this.loadNextUnit(nextUnit);

  }

  constructor(private rootParent: Container) {}

  private removeCurrentUnit() {
    if (!this.currentUnit) return;
    this.currentUnit.onExitUnit();
    this.rootParent.removeChild(this.currentUnit);
    this.currentUnit.destroy({ children: true });
  }

  private loadNextUnit(nextUnit: IUnit) {
    this.currentUnit = nextUnit;
    this.rootParent.addChild(nextUnit);
    nextUnit.onEnterUnit();
    nextUnit.onResize(this.rootParent.app, this.rootParent.height);
  }

  onResize(w: number, h: number) {
    if (this.currentUnit) this.currentUnit.onResize(w, h);
  }
}
