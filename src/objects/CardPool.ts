
import { Card } from "./Card";
import { CardAssets } from "./CardAssets";

export class CardPool {
  private pool: Card[] = [];


  constructor(initialSize: number) {
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createCard());
    }
  }

  private createCard(): Card {
    return new Card(CardAssets.getRandomTexture());
  }

  getCardFromPool(): Card {
    let card = this.pool.pop();
    if (!card) card = this.createCard();
    return card;
  }

}
