import { Container, Sprite, Texture } from "pixi.js";


export class Card extends Container {
    card: Sprite;
    cardWidth:number =150;
    cardHeight:number =200;

    constructor (texture:Texture){

        super();

        this.card = new Sprite(texture);
        this.card.anchor.set(0.5, 0.5);
        this.card.width = this.cardWidth;
        this.card.height = this.cardHeight;

        this.addChild(this.card);

    }
}