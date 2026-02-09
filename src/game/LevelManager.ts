import type { Container } from "pixi.js";
/** Manages loading, unloading, and resizing of game levels */
export class LevelManager {
  private currentLevel?: Container;

   /** Replaces the current level with a new one */
  loadLevel(nextLevel: Container) {
    this.removeCurrentLevel();
    this.loadNextLevel(nextLevel);
  }

   /** Safely removes the active level */
  constructor(private rootParent: Container) {}

  private removeCurrentLevel() {
    if (!this.currentLevel) return;

    // Allow levels to clean up their own resources
    if ("destroyUnit" in this.currentLevel) {
      (this.currentLevel as any).destroyUnit();
    }
    this.rootParent.removeChild(this.currentLevel);
    this.currentLevel = undefined;
  }

   /** Adds and tracks the new level */
  private loadNextLevel(nextLevel: Container) {
    this.currentLevel = nextLevel;
    this.rootParent.addChild(nextLevel);
  }

   /** Forwards resize events to the active level */
  onResize(w: number, h: number) {
    if (this.currentLevel) this.currentLevel.emit("resize", w, h);
  }
}
