import { Container } from "pixi.js";
import { UIButton } from "../objects/UIButton";
import { loadEvents } from "../utils/EventBus";

export class LevelSelect extends Container {
  private lvlTag: string = "lvl";
  private levelButtons: UIButton[] = [];
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
    for (let i = 0; i < this.levelButtons.length; i++) {
      const lvlButton = this.levelButtons[i];

      lvlButton.on("pointerdown", () => {
        this.handleLvlButtonClick(lvlButton);
      });
    }

    this.on("resize", this.onResize);
  }

  handleLvlButtonClick(button: UIButton) {
    loadEvents.emit("LOAD_UNIT", button.label);
  }

  createButtons = () => {
    for (let i = 0; i < this.lvlButtonLabel.length; i++) {
      const labelText = this.lvlButtonLabel[i];

      const button = new UIButton(labelText);

      button.label = this.lvlTag + "_" + (i + 1);

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
