import { Application } from "pixi.js";
import { GameInit } from "./game/GameInit";


const app = new Application();


await app.init({
  preference: 'webgl', // Use WebGL for better performance
  antialias: true,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0x8ecae6,
});

document.body.appendChild(app.canvas);

new GameInit(app);

