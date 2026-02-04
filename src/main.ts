import { Application } from "pixi.js";
import { FpsCounter } from "./objects/FpsCounter";
import { UnitManager } from "./scenes/UnitManager";
import { TitleScreen } from "./scenes/TitleScreen";
import { loadEvents } from "./utils/EventBus";

const app = new Application();
const fpsCounter = new FpsCounter(5, 5);

await app.init({
  resizeTo: window,
  backgroundColor: 0x1e1e1e,
});

document.body.appendChild(app.canvas);

const unitManager = new UnitManager(app.stage);
unitManager.loadUnit(new TitleScreen());
loadEvents.on("START", () => {
  // unitManager.loadUnit(new LevelSelect());
});

loadEvents.on("BACK", () => {
  // unitManager.loadUnit(new LevelSelect());
});

loadEvents.on("LOAD_UNIT", (data) => {
  // unitManager.loadUnit(new Unit(unit));
});

app.stage.addChild(fpsCounter);

app.ticker.add((ticker) => {
  fpsCounter.update(ticker.deltaMS);
});

window.addEventListener("resize", () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  fpsCounter.resize();
});
