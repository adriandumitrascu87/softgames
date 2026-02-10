import { Application, Container } from "pixi.js";
import { BackButton } from "../ui/BackButton";
import { TextHolder } from "../objects/TextHolder";
import { Palette } from "../utils/Palette";
import { Utils } from "../utils/Utils";
import { MagicWordsAssets } from "../objects/MagicWordsAssets";
import { UIButton } from "../ui/UIButton";
import { gsap } from "gsap";

/** Main Magic Words mini-game container */
export class MagicWords extends Container {
  private app: Application;

  //  placeholder character for emoji replacement
  private readonly EMOJI_MARKER = "";

  // next / start button
  private nextButton?: UIButton;
  private backButton?: BackButton;

  private miniGameLayer = new Container();
  private uiLayer = new Container();
  private nextButtonConainer = new Container();

  // horizontal safe area padding
  private stageHorizontalPadding: number = 20; //percent
  // vertical safe area padding
  private stageVerticalPadding: number = 25; //percent

  //gap between text holders
  private holderGap = 25;

  //[char_1, char_2, char_3, char_4] - avatarDataOrder
  private textHolderArray: TextHolder[] = [];

  //currently active dialogue panel
  private activePanel?: TextHolder;

  private numberOfCaracters: number;
  private safeWidth: number;
  private safeHeight: number;
  private currentDialogLine: number = 0;

  private magicWordsData: any;
  // private emojiData: any;

  constructor(app: Application) {
    super();

    this.app = app;

    this.safeWidth =
      this.app.renderer.width * (1 - this.stageHorizontalPadding / 100);
    this.safeHeight =
      this.app.renderer.height * (1 - this.stageVerticalPadding / 100);
    this.addChild(this.miniGameLayer);
    this.addChild(this.uiLayer);

    this.magicWordsData = MagicWordsAssets.data;
    // this.emojiData = this.magicWordsData.emojis;

    this.numberOfCaracters = this.magicWordsData.avatars.length;

    console.log("MagicWords");

    this.on("added", this.init);
  }

  /** Initializes UI, layout, and listeners */

  init() {
    this.initUI();
    this.animUI();
    this.addTextHolders();
    this.initListeners();
    this.onResize(this.app.renderer.width, this.app.renderer.height);
  }
  /** Adds idle animation to the next button */
  animUI() {
    if (this.nextButton)
      gsap.to(this.nextButton, {
        y: this.nextButton.y - 3,
        duration: 0.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });
  }
  /** Selects active panel based on character name */
  swichActivePanel(name: string) {
    switch (name) {
      case "Sheldon":
        this.activePanel = this.textHolderArray[0];
        break;
      case "Penny":
        this.activePanel = this.textHolderArray[1];
        break;
      case "Leonard":
        this.activePanel = this.textHolderArray[2];
        break;
      case "Neighbour":
        this.activePanel = this.textHolderArray[3];
        break;

      default:
        this.activePanel = undefined;
        break;
    }
  }
  /** Registers resize and button events */
  initListeners() {
    this.on("resize", this.onResize);
    this.nextButton?.on("pointerdown", this.handleNextButtonClick);
  }
  /** Advances dialogue when next button is pressed */
  handleNextButtonClick = () => {
    if (this.nextButton) Utils.toggleButtonVisibility(this.nextButton, false);

    if (this.nextButton?.getLabelText() === "START") {
      this.nextButton.updateLabel("NEXT");
    }
    this.showDialog();
  };
  /** Displays the next dialogue line */
  showDialog() {
    const currentDialogData =
      this.magicWordsData.dialogue[this.currentDialogLine];
    this.swichActivePanel(currentDialogData.name);

    if (this.activePanel) {
      this.showActivePanel();
      const emojiText = this.addEmojisToText(currentDialogData.text);

      if (emojiText) {
        this.activePanel.updateEmoji(emojiText.key);
        this.activePanel.updateText(emojiText.text);

        // console.log(emojiText);
      }
    }

    this.currentDialogLine++;

    if (this.magicWordsData.dialogue[this.currentDialogLine])
      if (this.nextButton)
        Utils.toggleButtonVisibility(this.nextButton, true, 1);
  }

  /** Replaces `{emoji}` with markers and returns emoji key */
  addEmojisToText(dialog: string): { text: string; key?: string } {
    const match = dialog.match(/\{([^}]+)\}/);
    if (!match) return { text: dialog };

    const emojiName = match[1];
    const replacedText = dialog.replace(match[0], this.EMOJI_MARKER);

    return { key: emojiName, text: replacedText };
  }
  fixDialog(text: string, toRemove: string, replacement: string): string {
    const finalText = text.replace(toRemove, replacement);

    return finalText;
  }

  /** Highlights active panel */
  showActivePanel() {
    for (let i = 0; i < this.textHolderArray.length; i++) {
      const textHolder = this.textHolderArray[i];
      if (textHolder == this.activePanel) {
        textHolder.scale.set(1, 1);
        textHolder.alpha = 1;
      } else {
        textHolder.scale.set(0.9, 0.9);
        textHolder.alpha = 0.5;
      }
    }
  }

  /** Creates one text holder per character */
  addTextHolders = () => {
    const layout = this.getLayout();
    const defaultText = "...";

    const textData = {
      text: defaultText,
      color: Palette.textSeconday,
    };

    for (let i = 0; i < this.numberOfCaracters; i++) {
      const avatarData = this.magicWordsData.avatars[i];

      const textHolder = new TextHolder(
        {
          width: layout.itemWidth,
          height: layout.itemHeight,
          radius: 10,
          color: Palette.secondary,
        },

        textData,
        avatarData,
      );

      this.miniGameLayer.addChild(textHolder);
      this.textHolderArray.push(textHolder);

      textHolder.alpha = 0.5;
      textHolder.scale.set(0.9,0.9);
    }
  };

  /** Calculates layout sizes based on screen */
  getLayout() {
    const width = this.app.renderer.width;
    const height = this.app.renderer.height;
    const isLandscape = Utils.isLandscape(width, height);
    const count = this.numberOfCaracters;

    const totalGap = this.holderGap * (count - 1);
    const textHolderHeight = (this.safeHeight - totalGap) / count;

    return {
      isLandscape,
      itemWidth: this.safeWidth,
      itemHeight: textHolderHeight,
    };
  }

  /** Creates back and next buttons */
  initUI() {
    this.backButton = new BackButton();

    this.nextButton = new UIButton("START", 100, 50, 10, Palette.primary);
    this.nextButtonConainer.addChild(this.nextButton);

    this.uiLayer.addChild(this.backButton);
    this.uiLayer.addChild(this.nextButtonConainer);
  }

  /** Handles resize events */
  onResize(width: number, height: number): void {
    this.updateSafeArea(width, height);
    if (this.backButton) {
      this.backButton.position.set(
        this.backButton.width / 2 + 5,
        height - this.backButton.height / 2 - 5,
      );
    }

    if (this.nextButtonConainer) {
      this.nextButtonConainer.position.set(
        width / 2,
        height - this.nextButtonConainer.height / 2 - 5,
      );
    }

    this.resizeTextHolder();
    this.handlePositionOnResize(width, height);
  }

  /** Updates safe area bounds */
  private updateSafeArea(width: number, height: number) {
    this.safeWidth = width * (1 - this.stageHorizontalPadding / 100);
    this.safeHeight = height * (1 - this.stageVerticalPadding / 100);
  }

  /** Resizes text holder backgrounds */
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

  /** Positions text holders vertically */
  handlePositionOnResize(width: number, height: number) {
    const layout = this.getLayout();
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
  }

  destroyUnit() {
    this.removeAllListeners();
    Utils.recursiveKillTweens(this);

    Utils.destroyAllChildren(this);

    this.activePanel = undefined;
    this.magicWordsData = undefined;
    // this.emojiData = undefined;
  }
}
