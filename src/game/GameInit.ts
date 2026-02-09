import { Container, Application } from "pixi.js";
import { LevelManager } from "./LevelManager";
import { FpsCounter } from "../utils/FpsCounter";
import { LevelLoader } from "./LevelLoader";
import { TitleScreen } from "../scenes/TitleScreen";

import { isMobile } from "pixi.js";

/** Bootstraps the game and core systems */

export class GameInit {
  private app: Application;

  /** Main gameplay layer */
  private gameLayer = new Container();
  /** UI overlay layer */
  private uiLayer = new Container();

  /** Handles scene loading and switching */
  private levelManager: LevelManager;
  /** FPS debug display */
  private fpsCounter: FpsCounter;

  constructor(app: Application) {
    this.app = app;

    // Lock FPS on mobile to avoid dynamic throttling
    if (isMobile.any) {
      this.app.ticker.maxFPS = 60;
      this.app.ticker.minFPS = 60;
    }

    // Add root layers
    this.app.stage.addChild(this.gameLayer);
    this.app.stage.addChild(this.uiLayer);

    // Init managers
    this.levelManager = new LevelManager(this.gameLayer);
    this.fpsCounter = new FpsCounter();

    // Add UI elements
    this.uiLayer.addChild(this.fpsCounter);

    this.initLevels();
    this.iniLoop();
    this.initResize();
  }

  /** Handles window resize */
  initResize = () => {
    const resizeHandler = () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.levelManager.onResize(this.app.screen.width, this.app.screen.height);
      this.fpsCounter.resize();
    };
    window.addEventListener("resize", resizeHandler);

    resizeHandler();
  };

  /** Loads initial game levels */
  initLevels() {
    const loader = new LevelLoader(this.levelManager, this.app);
    loader.init();

    // Start at title screen
    this.levelManager.loadLevel(new TitleScreen());
  }

   /** Main update loop */
  iniLoop = () => {
    this.app.ticker.add((ticker) => {
      this.fpsCounter.update(ticker.deltaMS);
    });
  };
}
