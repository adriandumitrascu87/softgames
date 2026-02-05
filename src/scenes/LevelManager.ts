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

    this.rootParent.removeChild(this.currentLevel);
    this.currentLevel.destroy({ children: true });
  }

  private loadNextLevel(nextLevel: Container) {
    this.currentLevel = nextLevel;
    this.rootParent.addChild(nextLevel);
  }

  onResize(w: number, h: number) {
    if (this.currentLevel) this.currentLevel.emit("resize",w, h);
  }
}
