import { loadEvents } from "../utils/EventBus";
import { AceOfShadows } from "./AceOfShadows";
import type { LevelManager } from "./LevelManager";
import { LevelSelect } from "./LevelSelect";
import { MagicWords } from "./MagicWords";
import { PhoenixFlame } from "./PhoenixFlame";

export class LevelLoader {
  constructor(private levelManager: LevelManager) {}

  init() {
    this.registerLoadLevelEvents();
  }

  private registerLoadLevelEvents() {
    loadEvents.on("START", () => {
      this.load(new LevelSelect());
    });

    loadEvents.on("BACK", () => {
      this.load(new LevelSelect());
    });

    loadEvents.on("LOAD_LEVEL", (levelId: string) => {
      this.loadGameLevel(levelId);
    });
  }

  private load(unit: any) {
    this.levelManager.loadLevel(unit);
    this.levelManager.onResize(window.innerWidth, window.innerHeight);
  }

  private loadGameLevel(levelId: string) {
    switch (levelId) {
      case "lvl_1":
        this.load(new AceOfShadows());
        break;
      case "lvl_2":
        this.load(new MagicWords());
        break;
      case "lvl_3":
        this.load(new PhoenixFlame());
        break;
    }
  }
}
