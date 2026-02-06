import { Application } from "pixi.js";
import { GameInit } from "./game/GameInit";


const app = new Application();


await app.init({
  resizeTo: window,
  backgroundColor: 0x1e1e1e,
});


document.body.appendChild(app.canvas);

new GameInit(app);

