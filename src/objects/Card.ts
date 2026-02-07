import { Container, Sprite, Texture } from "pixi.js";


export class Card extends Container {
    card: Sprite;
 

    constructor (texture:Texture){

        super();

        this.card = new Sprite(texture);
        this.card.anchor.set(0.5, 0.5);


        this.addChild(this.card);

    }
}