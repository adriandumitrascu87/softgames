import { Container } from "pixi.js";
import { LevelButton } from "../ui/LevelButton";

export class LevelSelect extends Container {
  private lvlTag: string = "lvl";
  private levelButtons: LevelButton[] = [];
  private lvlButtonLabel: string[] = [
    "Ace of Shadows",
    "Magic Words",
    "Phoenix Flame",
  ];
  constructor() {
    super();

    console.log("LEVEL SELECT");
    this.initObjects();
  }


  initObjects() {
    this.createButtons();
    this.addListeners();
  }

  addListeners = () => {

    this.on("resize", this.onResize);
  }

  createButtons = () => {
    for (let i = 0; i < this.lvlButtonLabel.length; i++) {
      const labelText = this.lvlButtonLabel[i];
      const levelToLoad = this.lvlTag + "_" + (i + 1) ;

      const button = new LevelButton(labelText, levelToLoad );
      this.levelButtons.push(button);

      this.addChild(button);
    }
  };

  onResize(width: number, height: number): void {
    for (let i = 0; i < this.levelButtons.length; i++) {
      const lvlButton = this.levelButtons[i];

      lvlButton.position.set(
        width / 2,
        (height / (this.levelButtons.length + 1)) * (i + 1),
      );
    }
  }
}
