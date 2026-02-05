import { Application, Container } from "pixi.js";
import { FpsCounter } from "./utils/FpsCounter";
import { TitleScreen } from "./scenes/TitleScreen";
import { LevelManager } from "./scenes/LevelManager";
import { LevelLoader } from "./scenes/LevelLoader";

const app = new Application();
const fpsCounter = new FpsCounter(5, 5);

const debugLayer = new Container();

await app.init({
  resizeTo: window,
  backgroundColor: 0x1e1e1e,
});

document.body.appendChild(app.canvas);

const levelManager = new LevelManager(app.stage);
const levelLoader = new LevelLoader(levelManager);
levelLoader.init();

//load first level - Title Screen
levelManager.loadLevel(new TitleScreen());

app.stage.addChild(debugLayer);
debugLayer.addChild(fpsCounter);

app.ticker.add((ticker) => {
  fpsCounter.update(ticker.deltaMS);
});

window.addEventListener("resize", () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  levelManager.onResize(app.screen.width, app.screen.height);
  fpsCounter.resize();
});
