import { Container, Graphics, Text } from "pixi.js";

export class TextHolder extends Container {
  private readonly INITIAL_FONT_SIZE = 50;
  private readonly MINIMUM_FONT_SIZE = 5;
  private readonly TEXT_PADDING = 10; //percent
  private bg?: Graphics;
  private textHolder?: Text;
  padding: number;

  constructor(
    private sizeData: {
      width: number;
      height: number;
      radius: number;
      color: number;
    },
    private textData: { text: string; color: number },
  ) {
    super();

    this.padding = 1 - this.TEXT_PADDING / 100;
    this.init();
  }

  init() {
    this.pivot.set(0.5, 0.5);

    this.ceateHolderBackground();
    this.createTextHolder();
    this.resizeText();
  }

  resizeText = () => {
    if (!this.textHolder || !this.bg) return;
    if (this.textHolder?.height <= this.bg.height * this.padding) return;

    while (
      this.textHolder.height > this.bg.height * this.padding &&
      this.textHolder.style.fontSize > this.MINIMUM_FONT_SIZE
    ) {
      this.textHolder.style.fontSize = this.textHolder.style.fontSize - 1;
    }
  };

  createTextHolder() {
    this.textHolder = new Text({
      text: this.textData.text,
      style: {
        fontFamily: "Arial",
        fontSize: this.INITIAL_FONT_SIZE,
        fill: this.textData.color,
        align: "center",
        wordWrap: true,
        wordWrapWidth: this.sizeData.width * this.padding,
        breakWords: true,
      },
    });

    this.textHolder.anchor.set(0.5, 0.5);
    this.addChild(this.textHolder);
  }

  ceateHolderBackground() {
    this.bg = new Graphics()
      .roundRect(
        -this.sizeData.width / 2,
        -this.sizeData.height / 2,
        this.sizeData.width,
        this.sizeData.height,
        this.sizeData.radius,
      )
      .fill(this.sizeData.color);

    this.addChild(this.bg);
  }

  resizeBackGround(newSize: any) {
    if (!this.bg) return;
    this.bg.clear();
    this.bg.roundRect(
      -newSize.width / 2,
      -newSize.height / 2,
      newSize.width,
      newSize.height,
      newSize.radius,
    );
    this.bg.fill(this.sizeData.color);

    if (this.textHolder && this.textHolder.style.wordWrap) {
      
      this.textHolder.style.fontSize = this.INITIAL_FONT_SIZE;
      this.textHolder.style.wordWrapWidth = newSize.width * this.padding;
    }
    this.resizeText();
  }
}
