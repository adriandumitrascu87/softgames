import { Application, Container, warn } from "pixi.js";
import { CardPool } from "../objects/CardPool";
import { Card } from "../objects/Card";
import { BackButton } from "../ui/BackButton";
import { UIButton } from "../ui/UIButton";
import { Palette } from "../utils/Palette";
import { Utils } from "../utils/Utils";

export class AceOfShadows extends Container {

  private readonly CARD_AMOUNT = 144;
  private readonly CARD_SPAWN_INTERVAL_MS = 1000;
  private readonly CARD_ANIMATION_DURATION_S = 2;

  private readonly RANDOM_STACK_RADIUS = 75;


  private miniGameLayer = new Container();
  private uiLayer = new Container();

  private intialStackContainer = new Container();
  private destinationStackContainer = new Container();

  private allCards: Card[] = [];
  private destinationCards: Card[] = [];

  private cardPool: CardPool;

  private backButton?: BackButton;
  private playButton?: UIButton;
  private animationInterval?: number;
  private resetButton?: UIButton;
  private app: Application;
  

  constructor(app: Application) {
    super();

    this.app = app;
    this.cardPool = new CardPool(this.CARD_AMOUNT);

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
    this.miniGameLayer.addChild(this.intialStackContainer);
    this.miniGameLayer.addChild(this.destinationStackContainer);
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
    for (let i = 0; i < this.CARD_AMOUNT; i++) {
      const card = this.cardPool.getCardFromPool();
      this.allCards.push(card);

      const offset = Utils.getSpiralPosition(i);
      card.x = offset.x;
      card.y = offset.y;
      this.intialStackContainer.addChild(card);
    }
  };

  // Animate the next card from the initial stack to the destination stack
  animateNextCard() {
    this.animationInterval = setInterval(() => {
      if (this.allCards.length === 0) {
        this.handleAnimationComplete();
        clearInterval(this.animationInterval);
      }

      const curentCard = this.allCards.pop();
      if (!curentCard) return;

      const globalPosition = curentCard.getGlobalPosition();

      this.intialStackContainer.removeChild(curentCard);

      const localPosition =
        this.destinationStackContainer.toLocal(globalPosition);

      this.destinationStackContainer.addChild(curentCard);

      curentCard.position.copyFrom(localPosition);

      Utils.tweenContainerTo(curentCard, 0, 0, this.CARD_ANIMATION_DURATION_S);
      this.destinationCards.push(curentCard);
    }, this.CARD_SPAWN_INTERVAL_MS);
  }


  handleAnimationComplete() {
    if (this.destinationCards.length === this.CARD_AMOUNT) {
      console.log("Animation Done", this.destinationCards.length);
      if (this.resetButton)
        Utils.toggleButtonVisibility(
          this.resetButton,
          true,
          this.CARD_SPAWN_INTERVAL_MS / 1000,
        );
    }
  }

  // Start the timed card animation loop
  startLoopAnim() {
    this.animateNextCard();
  }

  // Handle Play button click
  handleOnPlayClick = () => {
    if (!this.playButton) return;
    Utils.toggleButtonVisibility(this.playButton, false);
    this.startLoopAnim();
  };

  // Handle Reset button click
  handleOnResetClick = () => {
    if (!this.resetButton) return;
    Utils.toggleButtonVisibility(this.resetButton, false);
    this.resetCards();
  };
  // Reset cards back to the initial stack
  resetCards = () => {
    console.log("RESET CARDS");
    this.destinationStackContainer.removeChildren();
    this.allCards = this.destinationCards.slice();
    this.destinationCards = [];

    const randomCardPositions = Math.random() > 0.5;

    if (randomCardPositions) warn("RANDOM IS NOT A BUG - IS A FEATURE");

    let direction = 1;

    for (let i = 0; i < this.allCards.length; i++) {
      const card = this.allCards[i];

      this.intialStackContainer.addChild(card);

      card.visible = true;
      card.angle = 0;

      const offset = randomCardPositions
        ? Utils.randomPointInCircle(75)
        : Utils.getSpiralPosition(i);

      card.x = offset.x;
      card.y = offset.y;

      if (randomCardPositions) {
        direction = direction * -1;
        card.angle = Math.random() * 360 * direction;
      }
    }

    if (this.playButton) Utils.toggleButtonVisibility(this.playButton, true);
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

  destroyUnit() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = undefined;
    }

    Utils.recursiveKillTweens(this);

    this.playButton?.off("pointerdown", this.handleOnPlayClick);
    this.resetButton?.off("pointerdown", this.handleOnResetClick);
    this.off("resize", this.onResize);

    this.destroy({ children: true });

    this.allCards.length = 0;
    this.destinationCards.length = 0;

    console.log("DESTROY Ace Of Shadows");
  }
}
