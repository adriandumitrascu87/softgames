import { Container } from "pixi.js";
import type { IUnit } from "../utils/IUnit";
import { PlayButton } from "../objects/PlayButton";

export class TitleScreen extends Container implements IUnit {
  private playButton?: PlayButton;

  constructor() {
    super();
  }

  initObjects() {
    this.createStartButton();
  }

  createStartButton = () => {
    this.playButton = new PlayButton();
    this.addChild(this.playButton);
  };
  onEnterUnit(): void {
    this.initObjects();
    this.addListeners();
  }

  addListeners() {
    if (this.playButton)
      this.playButton.on("pointerdown", this.handlePlayButtonClick);
  }

  handlePlayButtonClick() {

    console.log("PLAY")
  }

  onExitUnit(): void {}

  onResize(width: number, height: number): void {
    if (this.playButton) {
      this.playButton.position.set(width / 2, height * 0.9);
    }
  }
}
