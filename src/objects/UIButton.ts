import { Container, Graphics, Text } from "pixi.js";

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
    this.bgColor = bgColor ?? 0x000000;

    this.createBackground();
    this.createLabel();
    this.centerContainer();
    this.setupMouseEvents();
  }

  centerContainer() {
    this.pivot.set(this.buttonWidth / 2, this.buttonHeight / 2);
  }

  private createBackground() {
    this.bg = new Graphics()
      .roundRect(0, 0, this.buttonWidth, this.buttonHeight, this.buttonRadius)
      .fill(this.bgColor);

    this.addChild(this.bg);
  }

  private createLabel() {
    this.buttonLabelText = new Text({
      text: this.buttonLabel,
      style: {
        fontFamily: "Arial",
        fontSize: Math.floor(this.buttonHeight / 2),
        fill: 0xffffff,
      },
    });

    this.buttonLabelText.anchor.set(0.5);
    this.buttonLabelText.position.set(
      this.buttonWidth / 2,
      this.buttonHeight / 2,
    );

    this.addChild(this.buttonLabelText);
  }

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
}
