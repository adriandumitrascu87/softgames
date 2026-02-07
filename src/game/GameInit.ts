import { Container, Application } from "pixi.js";
import { LevelManager } from "./LevelManager";
import { FpsCounter } from "../utils/FpsCounter";
import { LevelLoader } from "./LevelLoader";
import { TitleScreen } from "../scenes/TitleScreen";

import { isMobile } from "pixi.js";

export class GameInit {
  private app: Application;

  private gameLayer = new Container();
  private uiLayer = new Container();

  private levelManager: LevelManager;
  private fpsCounter: FpsCounter;

  constructor(app: Application) {
    this.app = app;

    if (isMobile.any) {
      this.app.ticker.maxFPS = 60;
      this.app.ticker.minFPS = 60;
    }

    this.app.stage.addChild(this.gameLayer);
    this.app.stage.addChild(this.uiLayer);

    this.levelManager = new LevelManager(this.gameLayer);
    this.fpsCounter = new FpsCounter();

    this.uiLayer.addChild(this.fpsCounter);

    this.initLevels();
    this.iniLoop();
    this.initResize();
  }

  initResize = () => {
    const resizeHandler = () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.levelManager.onResize(this.app.screen.width, this.app.screen.height);
      this.fpsCounter.resize();
    };
    window.addEventListener("resize", resizeHandler);

    resizeHandler();
  };

  initLevels() {
    const loader = new LevelLoader(this.levelManager, this.app);
    loader.init();
    this.levelManager.loadLevel(new TitleScreen());
  }

  iniLoop = () => {
    this.app.ticker.add((ticker) => {
      this.fpsCounter.update(ticker.deltaMS);
    });
  };
}
