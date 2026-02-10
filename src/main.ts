import { Application } from "pixi.js";
import { GameInit } from "./game/GameInit";
import "./global.css";

(async () => {
  const app = new Application();
  await app.init({
    resizeTo: window,
    preference: "webgl",
    antialias: true,
    backgroundColor: 0x8ecae6,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
  document.body.appendChild(app.canvas);
  new GameInit(app);
})();
