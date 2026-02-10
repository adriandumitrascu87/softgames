import { Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import { Palette } from "../utils/Palette";
import { gsap } from "gsap";
import { Utils } from "../utils/Utils";

/** Avatar with sprite, optional name tag, and idle animation */
export class Avatar extends Container {
  private avatar: Container = new Container();
  private sprite: Sprite;
  originalWidth: number;
  originalHeight: number;
  bg?: Graphics;
  nameTag?: Text;

  constructor(texture: Texture, name?: string) {
    super();

    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5, 0.5);

    this.avatar.addChild(this.sprite);

    this.originalWidth = this.avatar.width;
    this.originalHeight = this.avatar.height;
    if (name) {
      this.createNameTag(name);
    }

    this.addChild(this.avatar);
    this.animAvatar();
  }

  animAvatar() {
    gsap.to(this.avatar, {
      y: this.avatar.y - 3,
      duration: 1,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      delay: Math.random() * 2,
    });
  }

  /** Scales avatar to fit bounds */
  resize(maxWidth: number, maxHeight: number) {
    const scaleX = maxWidth / this.originalWidth;
    const scaleY = maxHeight / this.originalHeight;

    const scale = Math.min(scaleX, scaleY);

    this.avatar.scale.set(scale);
  }

  /** Creates background and label for name */
  createNameTag(name: string) {
    this.createBackground();
    this.createNameLabel(name);
  }

  createNameLabel(name: string) {
    if (!this.bg) return;
    this.nameTag = new Text({
      text: name,
      style: {
        fontFamily: "Arial",
        fontSize: 20,
        fill: 0xffffff,
      },
    });

    this.nameTag.anchor.set(0.5, 0.5);

    this.checkLabelSize();

    this.avatar.addChild(this.nameTag);
    this.nameTag.position.set(
      this.sprite.x,
      this.sprite.height / 2 + this.bg.height / 2,
    );
  }

  checkLabelSize = () => {
    const minFontSize: number = 5;
    if (!this.bg) return;
    if (!this.nameTag) return;
    if (this.nameTag.width <= this.bg.width * 0.9) return;
    while (
      this.nameTag.width > this.bg.width * 0.9 &&
      this.nameTag.style.fontSize > minFontSize
    ) {
      this.nameTag.style.fontSize = this.nameTag.style.fontSize - 1;
    }
  };

  createBackground() {
    this.bg = new Graphics()
      .roundRect(0, 0, 90, 20, 2)
      .fill(Palette.primary);

    this.avatar.addChild(this.bg);
    this.bg.x = -this.bg.width / 2;
    this.bg.y = this.avatar.height / 2;
  }

  destroy(options?: boolean | { children?: boolean }) {
    this.removeAllListeners();

    Utils.recursiveKillTweens(this);
    Utils.destroyAllChildren(this);

    this.eventMode = "none";
    this.cursor = "default";

    super.destroy(options);
  }
}
