import { Application, Container } from "pixi.js";
import { FpsCounter } from "./utils/FpsCounter";
import { TitleScreen } from "./scenes/TitleScreen";
import { loadEvents } from "./utils/EventBus";
import { LevelSelect } from "./scenes/LevelSelect";
import { AceOfShadows } from "./scenes/AceOfShadows";
import { MagicWords } from "./scenes/MagicWords";
import { PhoenixFlame } from "./scenes/PhoenixFlame";
import { LevelManager } from "./scenes/LevelManager";

const app = new Application();
const fpsCounter = new FpsCounter(5, 5);

const debugLayer = new Container();

await app.init({
  resizeTo: window,
  backgroundColor: 0x1e1e1e,
});

document.body.appendChild(app.canvas);

//load first level - Title Screen
const levelManager = new LevelManager(app.stage);
levelManager.loadLevel(new TitleScreen());
levelManager.onResize(app.screen.width, app.screen.height);

loadEvents.on("START", () => {
  levelManager.loadLevel(new LevelSelect());
  levelManager.onResize(app.screen.width, app.screen.height);
});

loadEvents.on("BACK", () => {
  levelManager.loadLevel(new LevelSelect());
  levelManager.onResize(app.screen.width, app.screen.height);
});

loadEvents.on("LOAD_LEVEL", (nextLevel) => {
  switch (nextLevel) {
    case "lvl_1":
      levelManager.loadLevel(new AceOfShadows());
      levelManager.onResize(app.screen.width, app.screen.height);
      break;
    case "lvl_2":
      levelManager.loadLevel(new MagicWords());
      levelManager.onResize(app.screen.width, app.screen.height);
      break;
    case "lvl_3":
      levelManager.loadLevel(new PhoenixFlame());
      levelManager.onResize(app.screen.width, app.screen.height);
      break;
  }
});

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
