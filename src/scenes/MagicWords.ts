import { Application, Container } from "pixi.js";
import { BackButton } from "../ui/BackButton";
import { TextHolder } from "../objects/TextHolder";
import { Palette } from "../utils/Palette";
import { Utils } from "../utils/Utils";

export class MagicWords extends Container {
  private backButton?: BackButton;

  private miniGameLayer = new Container();
  private uiLayer = new Container();

  private app: Application;

  private numberOfCaracters: number = 3;

  private stageHorizontalPadding: number = 20; //percent
  private stageVerticalPadding: number = 20; //percent

  private holderGap = 20;

  //[char_1, char_2, char_3]
  private textHolderArray: TextHolder[] = [];
  safeWidth: number;
  safeHeight: number;

  constructor(app: Application) {
    super();

    this.app = app;

    this.safeWidth =
      this.app.renderer.width * (1 - this.stageHorizontalPadding / 100);
    this.safeHeight =
      this.app.renderer.height * (1 - this.stageVerticalPadding / 100);
    this.addChild(this.miniGameLayer);
    this.addChild(this.uiLayer);

    console.log("MagicWords");

    this.on("added", this.init);
  }

  init() {
    this.initUI();
    this.addTextHolders();

    this.initListeners();
    this.onResize(this.app.renderer.width, this.app.renderer.height);
  }

  initListeners = () => {
    this.on("resize", this.onResize);
  };

  addTextHolders = () => {
    const layout = this.getLayout();
    const test =
      "AAAAAAAA AAAAAAAAAAA AAAAAAAAA AAAAAAAAAAAAAAAAAA AAAAAAA AAAAAAAAAAAAA AAAAAAAAA AAAAAAAA AAAAAAAAAAAA AAAAAAAA";

    const textData = {
      text: test,
      color: Palette.textSeconday,
    };

    for (let i = 0; i < this.numberOfCaracters; i++) {
      const textHolder = new TextHolder(
        {
          width: layout.itemWidth,
          height: layout.itemHeight,
          radius: 10,
          color: Palette.secondary,
        },

        textData,
      );

      this.miniGameLayer.addChild(textHolder);
      this.textHolderArray.push(textHolder);
    }
  };

  getLayout() {
    const width = this.app.renderer.width;
    const height = this.app.renderer.height;
    const isLandscape = Utils.isLandscape(width, height);
    const count = this.numberOfCaracters;

    // console.log(isLandscape, " lanscape");
    // if (isLandscape) {
    //   const totalGap = this.holderGap * (count - 1);
    //   const textHolderWidth = (this.safeWidth - totalGap) / count;

    //   return {
    //     isLandscape,
    //     itemWidth: textHolderWidth,
    //     itemHeight: this.safeHeight,
    //   };
    // }

    const totalGap = this.holderGap * (count - 1);
    const textHolderHeight = (this.safeHeight - totalGap) / count;

    return {
      isLandscape,
      itemWidth: this.safeWidth,
      itemHeight: textHolderHeight,
    };
  }

  initUI() {
    this.backButton = new BackButton();
    console.log(this.backButton);
    this.uiLayer.addChild(this.backButton);
  }

  // Update elements position on resize
  onResize(width: number, height: number): void {
    this.updateSafeArea(width, height);
    if (this.backButton) {
      this.backButton.position.set(
        this.backButton.width / 2 + 5,
        height - this.backButton.height / 2 - 5,
      );
    }

    this.resizeTextHolder();
    this.handlePositionOnResize(width, height);
  }

  private updateSafeArea(width: number, height: number) {
    this.safeWidth = width * (1 - this.stageHorizontalPadding / 100);
    this.safeHeight = height * (1 - this.stageVerticalPadding / 100);
  }
  resizeTextHolder() {
    const layout = this.getLayout();

    var newSizeData = {
      width: layout.itemWidth,
      height: layout.itemHeight,
      radius: 10,
    };

    for (let i = 0; i < this.textHolderArray.length; i++) {
      const textHolder = this.textHolderArray[i];

      textHolder.resizeBackGround(newSizeData);
    }
  }

  handlePositionOnResize(width: number, height: number) {
    const layout = this.getLayout();
    // const startX = (width - this.safeWidth) / 2;
    const startY = (height - this.safeHeight) / 2;

    for (let i = 0; i < this.textHolderArray.length; i++) {
      const holder = this.textHolderArray[i];
      holder.position.set(
        width / 2,
        startY +
          i * (layout.itemHeight + this.holderGap) +
          layout.itemHeight / 2,
      );
    }

    // for (let i = 0; i < this.textHolderArray.length; i++) {
    //   const holder = this.textHolderArray[i];
    //   if (layout.isLandscape) {
    //     holder.position.set(
    //       startX +
    //         i * (layout.itemWidth + this.holderGap) +
    //         layout.itemWidth / 2,
    //       height / 2,
    //     );
    //   } else {
    //     holder.position.set(
    //       width / 2,
    //       startY +
    //         i * (layout.itemHeight + this.holderGap) +
    //         layout.itemHeight / 2,
    //     );
    //   }
  }
}
