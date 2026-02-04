import { Container, Graphics } from "pixi.js";
import type { IUnit } from "../utils/IUnit";
import { PlayButton } from "../objects/PlayButton";

export class TitleScreen extends Container implements IUnit {
  constructor() {
    super();
    
    this.initObjects();
  }

  initObjects (){
    this.createStartButton();
  }

  createStartButton  = ()=>{

  const playButton = new PlayButton();

  playButton.position.set(300,400);

   playButton.on("pointerdown", () => {
      console.log("Play clicked");
      //   manager
    });

    this.addChild(playButton);
    
  }
  onEnterUnit(): void {

  }
  onExitUnit(): void {}
}
