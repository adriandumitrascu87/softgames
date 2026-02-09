import { loadEvents } from "../utils/EventBus";

import type { LevelManager } from "./LevelManager";
import { LevelSelect } from "../scenes/LevelSelect";
import { MagicWords } from "../scenes/MagicWords";
import { PhoenixFlame } from "../scenes/PhoenixFlame";
import { AceOfShadows } from "../scenes/AceOfShadows";
import { CardAssets } from "../objects/CardAssets";
import type { Application } from "pixi.js";
import { MagicWordsAssets } from "../objects/MagicWordsAssets";

export class LevelLoader {
  constructor(private levelManager: LevelManager, private app:Application) {}

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
        CardAssets.load().then(() => {
          console.log("loading cards");
          this.levelManager.loadLevel(new AceOfShadows(this.app));
        });

        break;
      case "lvl_2":
        MagicWordsAssets.load().then(()=>{
          
          this.load(new MagicWords(this.app));
        })
        break;
      case "lvl_3":
        this.load(new PhoenixFlame());
        break;
    }
  }
}
