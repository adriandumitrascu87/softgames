import type { Container } from "pixi.js";

export class LevelManager {
  private currentLevel?: Container;

  loadLevel(nextLevel: Container) {
    this.removeCurrentLevel();
    this.loadNextLevel(nextLevel);
  }

  constructor(private rootParent: Container) {}

  private removeCurrentLevel() {
    if (!this.currentLevel) return;

    if ("destroyUnit" in this.currentLevel) {
      (this.currentLevel as any).destroyUnit();
    }
    this.rootParent.removeChild(this.currentLevel);
    this.currentLevel = undefined;
  }

  private loadNextLevel(nextLevel: Container) {
    this.currentLevel = nextLevel;
    this.rootParent.addChild(nextLevel);
  }

  onResize(w: number, h: number) {
    if (this.currentLevel) this.currentLevel.emit("resize", w, h);
  }
}
