import { Container } from "pixi.js";
import { PlayButton } from "../ui/PlayButton";

export class TitleScreen extends Container {
  private playButton?: PlayButton;

  constructor() {
    super();

    this.initObjects();
    this.addListeners();
  }

  initObjects() {
    this.createStartButton();
  }

  createStartButton = () => {
    this.playButton = new PlayButton();
    this.addChild(this.playButton);
  };

  addListeners() {
    this.on("resize", this.onResize);
  }

  onResize(width: number, height: number): void {
    if (this.playButton) {
      this.playButton.position.set(width / 2, height * 0.9);
    }
  }
}
