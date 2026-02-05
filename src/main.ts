import { Application, Container } from "pixi.js";
import { FpsCounter } from "./utils/FpsCounter";
import { UnitManager } from "./scenes/UnitManager";
import { TitleScreen } from "./scenes/TitleScreen";
import { loadEvents } from "./utils/EventBus";
import { LevelSelect } from "./scenes/LevelSelect";
import { AceOfShadows } from "./scenes/AceOfShadows";
import { MagicWords } from "./scenes/MagicWords";
import { PhoenixFlame } from "./scenes/PhoenixFlame";

const app = new Application();
const fpsCounter = new FpsCounter(5, 5);

const debugLayer = new Container();

await app.init({
  resizeTo: window,
  backgroundColor: 0x1e1e1e,
});

document.body.appendChild(app.canvas);

//load first unit - Title Screen
const unitManager = new UnitManager(app.stage);
unitManager.loadUnit(new TitleScreen());
unitManager.onResize(app.screen.width, app.screen.height);

loadEvents.on("START", () => {
  unitManager.loadUnit(new LevelSelect());
  unitManager.onResize(app.screen.width, app.screen.height);
});

loadEvents.on("BACK", () => {
  unitManager.loadUnit(new LevelSelect());
  unitManager.onResize(app.screen.width, app.screen.height);
});

loadEvents.on("LOAD_UNIT", (nextUnit) => {
  switch (nextUnit) {
    case "lvl_1":
      unitManager.loadUnit(new AceOfShadows());
      unitManager.onResize(app.screen.width, app.screen.height);
      break;
    case "lvl_2":
      unitManager.loadUnit(new MagicWords());
      unitManager.onResize(app.screen.width, app.screen.height);
      break;
    case "lvl_3":
      unitManager.loadUnit(new PhoenixFlame());
      unitManager.onResize(app.screen.width, app.screen.height);
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
  unitManager.onResize(app.screen.width, app.screen.height);
  fpsCounter.resize();
});
