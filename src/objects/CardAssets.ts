import { Assets, type Texture } from "pixi.js";

export class CardAssets {
  static textures: Texture[] = [];

  static async load() {
    const texturePaths = [
      "images/ace_1.png",
      "images/ace_2.png",
      "images/ace_3.png",
      "images/ace_4.png",
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
