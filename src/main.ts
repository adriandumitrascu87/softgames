import * as PIXI from "pixi.js";
import { FpsCounter } from "./utils/FpsCounter";

const app = new PIXI.Application();
const fpsCounter =  new FpsCounter(5,5);

await app.init({
  resizeTo:window,
  backgroundColor: 0x1e1e1e,
});


document.body.appendChild(app.canvas);

app.stage.addChild(fpsCounter);
// Example sprite
const box = new PIXI.Graphics()
  .rect(0, 0, 100, 100)
  .fill(0xff595e);

box.x = 350;
box.y = 250;

app.stage.addChild(box);

// Simple animation
app.ticker.add((ticker) => {
  box.rotation += 0.01;
   fpsCounter.update(ticker.deltaMS);
});

window.addEventListener("resize", ()=>{
  app.renderer.resize(window.innerWidth, window.innerHeight);
  fpsCounter.resize();
})
