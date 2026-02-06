import { Container, type Application } from "pixi.js";
import { LevelManager } from "./LevelManager";
import { FpsCounter } from "../utils/FpsCounter";
import { LevelLoader } from "./LevelLoader";
import { TitleScreen } from "../scenes/TitleScreen";

export class GameInit {
  private app: Application;

  private gameLayer = new Container();
  private uiLayer = new Container();

  private levelManager: LevelManager;
  private fpsCounter: FpsCounter;

  constructor(app: Application) {
    this.app = app;

    this.app.stage.addChild(this.gameLayer);
    this.app.stage.addChild(this.uiLayer);

    this.levelManager = new LevelManager(this.gameLayer);
    this.fpsCounter = new FpsCounter();

    this.uiLayer.addChild(this.fpsCounter);

    this.initLevels();
    this.iniLoop();
  }

  initLevels = () => {
    const loader = new LevelLoader(this.levelManager);
    loader.init();

    this.levelManager.loadLevel(new TitleScreen());
  };

  iniLoop = () => {
    this.app.ticker.add((ticker) => {
      this.fpsCounter.update(ticker.deltaMS);

      this.levelManager.onResize(window.innerWidth, window.innerHeight);
      this.fpsCounter.resize();
    });
  };
}
