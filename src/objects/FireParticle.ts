import { Sprite } from "pixi.js";

/** Fire particle with physics properties */
export class FireParticle extends Sprite {
  public originalLifeTime:number = 0;

  public lifeTime: number = 0;
  public speedX: number = 0;
  public speedY: number = 0;


  constructor() {
    super();

    this.anchor.set(0.5, 0.5);
  }
}
