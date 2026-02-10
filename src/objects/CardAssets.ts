import { Assets, type Texture } from "pixi.js";

/** Loads and stores card textures */
export class CardAssets {
  static textures: Texture[] = [];

  static async load() {
    const texturePaths = [
      `${import.meta.env.BASE_URL}images/cards/ace_1.png`,
      `${import.meta.env.BASE_URL}images/cards/ace_2.png`,
      `${import.meta.env.BASE_URL}images/cards/ace_3.png`,
      `${import.meta.env.BASE_URL}images/cards/ace_4.png`,
    ];
    await Assets.load(texturePaths);

    for (const path of texturePaths) {
      const texture = Assets.get(path) as Texture;
      this.textures.push(texture);
    }
  }

  static getRandomTexture(): Texture {
    return this.textures[Math.floor(Math.random() * this.textures.length)];
  }
}
