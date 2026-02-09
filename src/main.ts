import { Application } from "pixi.js";
import { GameInit } from "./game/GameInit";


const app = new Application();


await app.init({
  preference: 'webgl', 
  antialias: true,
  backgroundColor: 0x8ecae6,
});

document.body.appendChild(app.canvas);

new GameInit(app);

