import { Sprite } from "pixi.js";

/** Fire particle with physics properties */
export class FireParticle extends Sprite {
  public isSkewing:boolean = false;

  public lifeTime: number = 100;
  public speedX: number = 5;
  public speedY: number = 3;


  constructor() {
    super();
  }
}
