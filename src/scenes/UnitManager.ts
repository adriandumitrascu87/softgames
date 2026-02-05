import type { Container } from "pixi.js";

export class UnitManager {
  private currentUnit?: Container;

  loadUnit(nextUnit: Container) {
    this.removeCurrentUnit();
    this.loadNextUnit(nextUnit);
  }

  constructor(private rootParent: Container) {}

  private removeCurrentUnit() {
    if (!this.currentUnit) return;

    this.rootParent.removeChild(this.currentUnit);
    this.currentUnit.destroy({ children: true });
  }

  private loadNextUnit(nextUnit: Container) {
    this.currentUnit = nextUnit;
    this.rootParent.addChild(nextUnit);
  }

  onResize(w: number, h: number) {
    if (this.currentUnit) this.currentUnit.emit("resize",w, h);
  }
}
