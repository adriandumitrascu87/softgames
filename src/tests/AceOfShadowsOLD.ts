import { Application, Assets, Container } from "pixi.js";
import { BackButton } from "../ui/BackButton";
import { gsap } from "gsap";
import { Card } from "../objects/Card";

await Assets.load("images/cardBack.jpg");

export class AceOfShadowsOLD extends Container {
  private backButton?: BackButton;

  private bgLayer = new Container();
  private miniGameLayer = new Container();
  private uiLayer = new Container();

  private intialStackContainer = new Container();
  private destinationStackContainer = new Container();

  //new card,bottom card, top card, destinationCard
  private activeCards: Card[] = [];
  private destinationCards: Card[] = [];

  private cardAmount: number = 20;
  private limit: number = 20;
  // cardBackTexture: Texture = Assets.load("images/cardBack.jpg");

  constructor(app:Application) {
    super();

    console.log("AceOfShadows");
    this.addChild(this.bgLayer);
    this.addChild(this.miniGameLayer);
    this.addChild(this.uiLayer);

    this.init();
  }

  init() {
    this.createUI();
    this.initListeners();
    this.createMiniGame();
  }

  createUI = () => {
    this.backButton = new BackButton();
    this.uiLayer.addChild(this.backButton);
  };

  createMiniGame() {
    this.miniGameLayer.addChild(this.destinationStackContainer);
    this.miniGameLayer.addChild(this.intialStackContainer);

    this.createInitialCards();
    this.animateCards();
  }

  animateCards = () => {
    // move top card

    let bottomCard = this.activeCards[1];
    const topCard = this.activeCards.pop();
    if (!topCard) return;

    if (bottomCard)
      gsap.to(bottomCard, {
        x: bottomCard.x + 15,
        y: bottomCard.y + 15,
        duration: 0.3,
      });

    if (topCard) {
      this.intialStackContainer.removeChild(topCard);
      this.miniGameLayer.addChild(topCard);
      topCard.x = this.intialStackContainer.x + 15;
      topCard.y = this.intialStackContainer.y + 15;
      gsap
        .to(topCard, {
          x: this.destinationStackContainer.x,
          y: this.destinationStackContainer.y,
          duration: 0.3,
        })
        .then(() => {
          this.miniGameLayer.removeChild(topCard);
          this.destinationStackContainer.addChild(topCard);
          this.destinationCards.push(topCard);
          this.updateActiveCards();
          this.loopAnim();
        });
    }
  };

  testCount = 0;
  loopAnim = () => {
    console.log(this.destinationCards.length);
    if (this.destinationCards.length != this.limit) {
      this.testCount++;
      // console.log(this.testCount);
      this.animateCards();
    } else {
      // console.log(this.destinationCards.length);
      // console.log("DONE");
    }
  };

  updateActiveCards() {
    this.cardAmount = this.cardAmount - 1;

    if (this.cardAmount > 3) {
      const newCard = new Card(Assets.get("images/cardBack.jpg"));

      this.intialStackContainer.addChildAt(newCard, 0);

      this.activeCards.unshift(newCard);
    } else {
      this.activeCards.unshift(null);
    }

    // add new card at the bottom of initial stack
  }

  createInitialCards() {
    for (let i = 0; i < 3; i++) {
      var card = new Card(Assets.get("images/cardBack.jpg"));
      this.activeCards.push(card);
      this.intialStackContainer.addChild(card);
    }
  }

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

  initListeners() {
    this.on("resize", this.onResize);
  }

  onResize(width: number, height: number): void {
    if (this.backButton) {
      this.backButton.position.set(width / 2, height * 0.9);
    }

    this.handleStackContainerPosition(width, height);
  }
}
