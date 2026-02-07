import { Container, Text, TextStyle } from "pixi.js";
import { PlayButton } from "../ui/PlayButton";
import { Palette } from "../utils/Palette";
import { gsap } from "gsap";
import { Utils } from "../utils/Utils";

export class TitleScreen extends Container {
  private playButton?: PlayButton;
  title?: Text;
  uiLayer = new Container();
  titleContainer = new Container();
  playButtonContainer = new Container();

  constructor() {
    super();

    this.initObjects();
    this.addListeners();
  }

  initObjects() {
    this.createStartButton();
    this.createTitle();

    this.on("added", this.init);
  }

  init() {
    this.addElements();
    this.initAnimations();
  }

  addElements = () => {
    this.uiLayer.addChild(this.titleContainer);
    this.uiLayer.addChild(this.playButtonContainer);
    this.addChild(this.uiLayer);
  };

  initAnimations() {
    if (!this.title) return;
    gsap.to(this.title, {
      y: this.title.y - 3,
      duration: 1,
      angle: 5,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });

    if (this.playButton)
      gsap.to(this.playButton, {
        y: this.playButton.y - 3,
        duration: 0.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });
  }

  private createTitle() {
    this.title = new Text({
      text: "3 in 1",
      style: {
        fontFamily: "Arial",
        fontSize: 100,
        fill: Palette.textSeconday,
      },
    });

    this.title.anchor.set(0.5, 0.5);
    this.titleContainer.addChild(this.title);

    this.title.angle = -5;
  }

  createStartButton = () => {
    this.playButton = new PlayButton();

    this.playButtonContainer.addChild(this.playButton);
  };

  addListeners() {
    this.on("resize", this.onResize);
  }

  destroyUnit() {
    this.off("resize", this.onResize);

    Utils.recursiveKillTweens(this);

    this.destroy({ children: true });

    this.playButton = undefined;
    this.title = undefined;
  }

  onResize(width: number, height: number): void {
    if (this.playButtonContainer) {
      this.playButtonContainer.position.set(width / 2, height * 0.9);
    }

    if (this.titleContainer) {
      this.titleContainer.position.set(width / 2, height / 3);
    }
  }
}
