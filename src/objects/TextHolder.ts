import {
  CanvasTextMetrics,
  Container,
  Graphics,
  Point,
  Sprite,
  Text,
  Texture,
} from "pixi.js";
import { Avatar } from "./Avatar";
import { MagicWordsAssets } from "./MagicWordsAssets";
import { Utils } from "../utils/Utils";
import { gsap } from "gsap";

/** Text holder with text, avatar, and optional emoji */
export class TextHolder extends Container {
  private readonly INITIAL_FONT_SIZE = 50;
  private readonly MINIMUM_FONT_SIZE = 5;
  private readonly TEXT_PADDING = 10; //percent
  private bg?: Graphics;
  private textHolder?: Text;
  padding: number;
  avatar?: Avatar;

  emojiContainer = new Container();
  emojiOriginalWidth?: number;

  constructor(
    /** Size and color data for the textHolder */
    private sizeData: {
      width: number;
      height: number;
      radius: number;
      color: number;
    },
    /** Initial text and color */
    private textData: { text?: string; color: number },
    /** Optional avatar data */
    private avatarData?: any,
  ) {
    super();
    this.padding = 1 - this.TEXT_PADDING / 100;
    this.init();
  }

  /** Builds background, text, avatar, and emoji container */
  init() {
    this.pivot.set(0.5, 0.5);
    this.ceateHolderBackground();
    this.createTextHolder();
    this.addEmojiContainer();
    this.createAvatars();
    this.resizeText();
  }

  /** Adds emoji container with idle animation */
  addEmojiContainer() {
    this.addChild(this.emojiContainer);

    this.emojiContainer.angle = -5;
    gsap.to(this.emojiContainer, {
      duration: 1,
      angle: 5,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });
  }

  /** Creates avatar sprite if data exists */
  createAvatars() {
    if (!this.avatarData) return;
    const texture = MagicWordsAssets.avatarTextures.get(this.avatarData.name);
    if (!texture) return;
    this.avatar = new Avatar(texture, this.avatarData.name);

    this.addChild(this.avatar);

    this.resizeAvatar();
    this.repositionAvatar(this.avatarData.position);
  }

  /** Positions avatar left or right */
  repositionAvatar(position: string) {
    if (!this.avatar || !this.bg) return;
    if (position === "left") {
      this.avatar.x = -this.bg.width / 2;
    } else {
      this.avatar.x = this.bg.width / 2;
    }
  }

  /** Resizes avatar to fit textHolder */
  resizeAvatar() {
    if (!this.avatar || !this.bg) return;

    const maxWidth = this.bg.width * (1 - this.padding) * 2;
    const maxHeight = this.bg.height * 0.9;

    this.avatar.resize(maxWidth, maxHeight);

    this.resizeAndRepositionEmoji();
  }

  /** Shrinks text until it fits inside text holder */
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

  /** Scales and positions emoji relative to avatar */
  resizeAndRepositionEmoji() {
    if (!this.emojiContainer) return;
    if (!this.avatar) return;
    if (!this.emojiOriginalWidth) return;
    this.emojiContainer.x = this.avatar.x;

    var s = (this.avatar.width * 0.3) / this.emojiOriginalWidth;

    this.emojiContainer.scale.set(s, s);

    this.emojiContainer.y = this.avatar.y - this.avatar.height / 2;
    // if (!this.textHolder || !this.emojiContainer) return;
    // const charIndex = this.textHolder.text.indexOf("⚫");
    // if (charIndex === -1) return;
    // const localPos = this.getCharLocalPositionWrapped(
    //   this.textHolder,
    //   charIndex,
    // );
    // if (!localPos) return;
    // this.emojiContainer.position.set(
    //   localPos.x - this.textHolder.width / 2 +this.emojiContainer.width / 2,
    //   localPos.y - this.emojiContainer.height / 2,
    // );
    // if (this.emojiOriginalHeight) {
    //   const scale = this.textHolder.style.fontSize! / this.emojiOriginalHeight;
    //   this.emojiContainer.scale.set(scale, scale);
    // }
  }

  // measureCharX(text: Text, index: number):  {
  //   // const before = text.text.substring(0, index);

  //   // const metrics = CanvasTextMetrics.measureText(before, text.style);

  //   // return metrics.width;
  // }

  // getCharLocalPositionWrapped(textObj: Text, charIndex: number): {

  // }

  /** Creates and style text object */
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

  /** Draws rounded background */
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
  /** Resizes text holder and  content */
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

    if (!this.avatar) return;
    this.resizeAvatar();
    this.repositionAvatar(this.avatarData.position);
  }

  /** Updates displayed text */
  updateText(newText: string) {
    if (!this.textHolder) return;
    this.textHolder.style.fontSize = this.INITIAL_FONT_SIZE;
    this.textHolder.text = newText;
    this.resizeText();
  }

  /** Replaces emoji sprite */
  updateEmoji(textureKey?: string) {
    this.emojiContainer.removeChildren();

    if (!textureKey) return;
    if (!this.avatar) return;

    const texture = MagicWordsAssets.emojiTextures.get(textureKey);
    if (!texture) return;

    const newEmoji = new Sprite(texture);
    this.emojiContainer.addChild(newEmoji);

    this.emojiOriginalWidth = newEmoji.width;

    newEmoji.position.set(-newEmoji.width / 2, -newEmoji.height / 2);

    this.resizeAndRepositionEmoji();
  }
}
