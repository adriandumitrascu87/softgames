import {
  Application,
  Container,
  ObservablePoint,
  type DestroyOptions,
} from "pixi.js";
import { CardPool } from "../objects/CardPool";
import { Card } from "../objects/Card";

import { gsap } from "gsap";
import { BackButton } from "../ui/BackButton";
import { UIButton } from "../ui/UIButton";
import { Palette } from "../utils/Palette";

export class AceOfShadows extends Container {
  private miniGameLayer = new Container();
  private uiLayer = new Container();

  private intialStackContainer = new Container();
  private destinationStackContainer = new Container();

  private allCards: Card[] = [];
  private destinationCards: Card[] = [];

  private cardAmount = 144;
  private animationDuration: number = 2; //seconds
  private intervalDuration: number = 1000; //miliseconds

  private cardPool: CardPool;

  private backButton?: BackButton;
  private playButton?: UIButton;
  private animationInterval?: number;
  private resetButton?: UIButton;
  private app: Application;

  constructor(app: Application) {
    super();

    this.app = app;
    this.cardPool = new CardPool(this.cardAmount);

    this.addChild(this.miniGameLayer);
    this.addChild(this.uiLayer);

    // initialize level after being added to the stage
    this.on("added", this.init);
  }

  private init() {
    this.addUI();
    this.addCardContainers();
    this.createCards();
    this.initListeners();
    this.onResize(this.app.renderer.width, this.app.renderer.height);
  }

  //Add the card stack containers
  addCardContainers() {
    this.miniGameLayer.addChild(this.destinationStackContainer);
    this.miniGameLayer.addChild(this.intialStackContainer);
  }

  // Create UI buttons and add them to the UI layer
  addUI() {
    this.backButton = new BackButton();
    this.playButton = new UIButton("START", 100, 50, 10, Palette.primary);
    this.resetButton = new UIButton("RESET", 100, 50, 10, Palette.primary);

    this.uiLayer.addChild(this.backButton);
    this.uiLayer.addChild(this.playButton);
    this.uiLayer.addChild(this.resetButton);

    this.resetButton.visible = false;
  }

  // Create cards and place them in a randomized pile
  createCards = () => {
   

    let direction = 1;
    for (let i = 0; i < this.cardAmount; i++) {
      const card = this.cardPool.getCardFromPool();
      this.allCards.push(card);
      this.intialStackContainer.addChild(card);

      const offset = this.randomPointInCircle();
      card.x = offset.x;
      card.y = offset.y;

      direction = direction * -1;
      card.angle = Math.random() * 360 * direction;
    }
  };

  // Generate a random point inside a circle
  private randomPointInCircle() {

    const radius:number =75;
    const t = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * radius;

    return {
      x: Math.cos(t) * r,
      y: Math.sin(t) * r,
    };
  }

  // Animate the next card from the initial stack to the destination stack
  animateNextCard() {
    this.animationInterval = setInterval(() => {
      if (this.allCards.length === 0) {
        clearInterval(this.animationInterval);
      }

      const curentCard = this.allCards.pop();
      if (!curentCard) return;

      const globalPosition = curentCard.getGlobalPosition();

      this.intialStackContainer.removeChild(curentCard);
      this.miniGameLayer.addChild(curentCard);

      const localPosition = this.miniGameLayer.toLocal(globalPosition);
      curentCard.position.copyFrom(localPosition);

      this.tweenCardTo(curentCard, this.destinationStackContainer.position);
    }, this.intervalDuration);
  }

  // tween a card to the a destination position
  tweenCardTo = (card: Card, endPosition: ObservablePoint) => {
    gsap.to(card, {
      x: endPosition.x,
      y: endPosition.y,
      duration: this.animationDuration, // animation lasts 2 seconds
      angle: 0,
      onComplete: () => {
        this.handleCompleteAnimtion(card);
        this.checkIfAllCardsAreMoved();
      },
    });
  };

  // Check if all cards have been moved to the destination stack
  checkIfAllCardsAreMoved = () => {
    if (this.destinationCards.length === this.cardAmount) {
      console.log("Animation Done", this.destinationCards.length);
      if (this.resetButton) this.toggleButtonVisibility(this.resetButton, true);
    }
  };

  // Toggle a button' s visibility and input state with animation
  toggleButtonVisibility(button: UIButton, enable: boolean) {
    if (enable) {
      button.scale.set(0, 0);
      button.visible = true;
    } else {
      button.disableInput();
    }

    const newScale = enable ? 1 : 0;
    const ease = enable ? "power1.out" : "power1.in";

    gsap.to(button.scale, {
      x: newScale,
      y: newScale,
      duration: 0.1,
      ease: ease,
      onComplete: () => {
        button.visible = enable;
        if (enable) button.enableInput();
      },
    });
  }

  // Handle logic after a card finishes moving
  handleCompleteAnimtion = (card: Card) => {
    this.miniGameLayer.removeChild(card);
    this.destinationStackContainer.addChild(card);
    card.position.set(0, 0);
    this.destinationCards.push(card);

    card.visible =
      this.destinationStackContainer.children.indexOf(card) !=
      this.destinationStackContainer.children.length - 2;
  };

  // Start the timed card animation loop
  startLoopAnim() {
    this.animateNextCard();
  }

  // Handle Play button click
  handleOnPlayClick = () => {
    if (!this.playButton) return;
    this.toggleButtonVisibility(this.playButton, false);
    this.startLoopAnim();
  };

  // Handle Reset button click
  handleOnResetClick = () => {
    if (!this.resetButton) return;
    this.toggleButtonVisibility(this.resetButton, false);
    this.resetCards();
  };
  // Reset cards back to the initial stack
  resetCards = () => {
    console.log("RESET CARDS");
    this.destinationStackContainer.removeChildren();
    this.allCards = this.destinationCards.slice();
    this.destinationCards = [];

    
    console.log(this.allCards.length);
    for (let i = 0; i < this.allCards.length; i++) {
      const card = this.allCards[i];

      this.intialStackContainer.addChild(card);

      card.visible = true;
      const offset = this.randomPointInCircle();
      card.x = offset.x;
      card.y = offset.y;
      card.angle = Math.random() * 360;
    }

    if (this.playButton) this.toggleButtonVisibility(this.playButton, true);
  };

  // add input and resize listeners
  initListeners() {
    this.on("resize", this.onResize);
    this.playButton?.on("pointerdown", this.handleOnPlayClick);
    this.resetButton?.on("pointerdown", this.handleOnResetClick);
  }
  // Position stack containers based on screen orientation
  handleStackContainerPosition(w: number, h: number) {
    if (w > h) {
      this.intialStackContainer.x = w / 4;
      this.destinationStackContainer.x = (w * 3) / 4;
      this.intialStackContainer.y = this.destinationStackContainer.y = h / 2;
    } else {
      this.intialStackContainer.y = h / 4;
      this.destinationStackContainer.y = (h * 3) / 4;
      this.intialStackContainer.x = this.destinationStackContainer.x = w / 2;
    }
  }

  // Update elements position on resize
  onResize(width: number, height: number): void {
    if (this.backButton) {
      this.backButton.position.set(
        this.backButton.width / 2 + 5,
        height - this.backButton.height / 2 - 5,
      );
    }

    if (this.playButton) {
      this.playButton.position.set(width / 2, height / 2);
    }

    if (this.resetButton) {
      this.resetButton.position.set(width / 2, height / 2);
    }
    this.handleStackContainerPosition(width, height);
  }

  destroy(options?: DestroyOptions): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = undefined;
    }

    gsap.killTweensOf(this.allCards);
    gsap.killTweensOf(this.destinationCards);

    if (this.playButton) gsap.killTweensOf(this.playButton);
    if (this.resetButton) gsap.killTweensOf(this.resetButton);

    this.playButton?.off("pointerdown", this.handleOnPlayClick);
    this.resetButton?.off("pointerdown", this.handleOnResetClick);

    this.off("resize", this.onResize);

    this.playButton?.disableInput();
    this.resetButton?.disableInput();

    this.intialStackContainer.removeChildren();
    this.destinationStackContainer.removeChildren();
    this.uiLayer.removeChildren();
    this.miniGameLayer.removeChildren();

    this.allCards.length = 0;
    this.destinationCards.length = 0;

    super.destroy(options);

    console.log("DESTROY Ace Of Shadows");
  }
}
