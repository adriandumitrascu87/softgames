import { Container } from "pixi.js";
import { LevelButton } from "../ui/LevelButton";
import { Utils } from "../utils/Utils";

/** Level Select */
export class LevelSelect extends Container {
  private lvlTag: string = "lvl";
  private levelButtons: LevelButton[] = [];
  private uiLayer = new Container();
  private lvlButtonLabel: string[] = [
    "Ace of Shadows",
    "Magic Words",
    "Phoenix Flame",
  ];
  constructor() {
    super();

    console.log("LEVEL SELECT");
    this.on("added", this.initObjects);
  
  }

  initObjects() {
    this.addChild(this.uiLayer);
    this.createButtons();
    this.addListeners();
  }

  addListeners = () => {
    this.on("resize", this.onResize);
  };

  createButtons = () => {
    for (let i = 0; i < this.lvlButtonLabel.length; i++) {
      const labelText = this.lvlButtonLabel[i];
      const levelToLoad = this.lvlTag + "_" + (i + 1);

      const button = new LevelButton(labelText, levelToLoad);
      this.levelButtons.push(button);

      this.uiLayer.addChild(button);
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

  destroyUnit() {
    this.removeAllListeners();
    Utils.recursiveKillTweens(this);

    Utils.destroyAllChildren(this);

    this.levelButtons.length = 0;
    this.lvlButtonLabel.length = 0;
  }
}
