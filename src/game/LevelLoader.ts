import { loadEvents } from "../utils/EventBus";

import type { LevelManager } from "./LevelManager";
import { LevelSelect } from "../scenes/LevelSelect";
import { MagicWords } from "../scenes/MagicWords";
import { PhoenixFlame } from "../scenes/PhoenixFlame";
import { AceOfShadows } from "../scenes/AceOfShadows";
import { CardAssets } from "../objects/CardAssets";
import type { Application } from "pixi.js";
import { MagicWordsAssets } from "../objects/MagicWordsAssets";
/** Handles level loading and scene transitions */
export class LevelLoader {
  constructor(private levelManager: LevelManager, private app:Application) {}

    /** Initializes event listeners */
  init() {
    this.registerLoadLevelEvents();
  }

   /** Registers global load/navigation events */
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


    /** Loads a scene and applies resize */
  private load(unit: any) {
    this.levelManager.loadLevel(unit);
    this.levelManager.onResize(window.innerWidth, window.innerHeight);
  }

  /** Loads a game level by ID (with assets if needed) */
  private loadGameLevel(levelId: string) {
    switch (levelId) {
      case "lvl_1":
        CardAssets.load().then(() => {
          // console.log("loading cards");
          this.levelManager.loadLevel(new AceOfShadows(this.app));
        });

        break;
      case "lvl_2":
        MagicWordsAssets.load().then(()=>{
          
          this.load(new MagicWords(this.app));
        })
        break;
      case "lvl_3":
        this.load(new PhoenixFlame(this.app));
        break;
    }
  }
}
