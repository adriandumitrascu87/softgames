import { Container, Graphics, Text } from "pixi.js";
import { Palette } from "../utils/Palette";
import { Utils } from "../utils/Utils";
/** Base UI button component with customizable appearance and auto-scaling text */
export class UIButton extends Container {
  private bg!: Graphics;
  private buttonLabelText!: Text;

  private buttonWidth: number;
  private buttonHeight: number;
  private buttonRadius: number;
  private bgColor: number;

  private buttonLabel: string;

  constructor(
    buttonLabel?: string,
    buttonWidth?: number,
    buttonHeight?: number,
    buttonRadius?: number,
    bgColor?: number,
  ) {
    super();

    this.buttonLabel = buttonLabel ?? "DefaultLabel";
    this.buttonWidth = buttonWidth ?? 160;
    this.buttonHeight = buttonHeight ?? 80;
    this.buttonRadius = buttonRadius ?? 10;
    this.bgColor = bgColor ?? Palette.primary;

    this.createBackground();
    this.createLabel();
    this.centerContainer();
    this.setupMouseEvents();
  }

   /** Centers button pivot point */
  centerContainer() {
    this.pivot.set(this.buttonWidth / 2, this.buttonHeight / 2);
  }

   /** Creates rounded rectangle background */
  private createBackground() {
    this.bg = new Graphics()
      .roundRect(0, 0, this.buttonWidth, this.buttonHeight, this.buttonRadius)
      .fill(this.bgColor);

    this.addChild(this.bg);
  }

    /** Creates centered text label with auto-sizing */
  private createLabel() {
    this.buttonLabelText = new Text({
      text: this.buttonLabel,
      style: {
        fontFamily: "Arial",
        fontSize: Math.floor(this.buttonHeight / 2),
        fill: Palette.secondary,
      },
    });

    this.checkLabelSize();

    this.buttonLabelText.anchor.set(0.5);
    this.buttonLabelText.position.set(
      this.buttonWidth / 2,
      this.buttonHeight / 2,
    );

    this.addChild(this.buttonLabelText);
  }

  /** Updates button text */
  updateLabel(newLabel: string) {
    this.buttonLabelText.text = newLabel;
    this.checkLabelSize();
  }

  /** Returns current  text */
  getLabelText() {
    return this.buttonLabelText.text;
  }

    /** Shrinks font size if text exceeds button width */
  checkLabelSize = () => {
    const minFontSize: number = 20;

    // console.log("BEFORE", this.buttonLabelText.style.fontSize);
    if (this.buttonLabelText.width <= this.bg.width * 0.9) return;

    while (
      this.buttonLabelText.width > this.bg.width * 0.9 &&
      this.buttonLabelText.style.fontSize > minFontSize
    ) {
      this.buttonLabelText.style.fontSize =
        this.buttonLabelText.style.fontSize - 1;
    }

    // console.log("AFTER", this.buttonLabelText.style.fontSize);
  };

   /** Disables button*/
  disableInput() {
    // console.log(this.buttonLabel + " disabled");
    this.eventMode = "none";
  }

    /** Enables button*/
  enableInput() {
    // console.log(this.buttonLabel + " enabled");
    this.eventMode = "static";
  }

    /** Sets up  events for visual feedback */
  private setupMouseEvents() {
    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerdown", () => {
      this.scale.set(0.98);
    });

    this.on("pointerup", () => {
      this.scale.set(1);
    });
  }

   /** Cleanup: removes listeners, kills tweens, destroys children */
  destroy(options?: boolean | { children?: boolean }) {
    this.removeAllListeners();


    Utils.recursiveKillTweens(this);
    Utils.destroyAllChildren(this);


    this.eventMode = "none";
    this.cursor = "default";

    super.destroy(options);
  }
}
