import {  Texture } from "pixi.js";

/** Loads and stores all Magic Words assets (data, avatars, emojis) */
export class MagicWordsAssets {
  // API endpoint for game data
  private static readonly url =
    "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords";

  // API generating avatar images
  private static apiUrlAvatars =
    "https://api.dicebear.com/9.x/personas/png?seed=";
  // API generating emoji images
  private static apiUrlEmoji =
    "https://api.dicebear.com/9.x/fun-emoji/png?seed=";

  /** Parsed API data */
  public static data: any;

  /** Cached emoji textures by name */
  public static emojiTextures: Map<string, Texture> = new Map<
    string,
    Texture
  >();
  /** Cached avatar textures by name */
  public static avatarTextures: Map<string, Texture> = new Map<
    string,
    Texture
  >();

  // total images to be loaded
  private static totalToLoad = 0;

  // loaded images counter
  private static loadedCount = 0;

  //resolver for loading promises
  private static resolveLoad?: () => void;

  /** Loads JSON + all avatar & emoji textures */
  static async load(): Promise<any> {
    if (this.data) return this.data;

    const response = await fetch(this.url);
    if (!response.ok) throw new Error("failed to load magicwords JSON");

    const rawData = await response.json();

    this.data = {
      dialogue: rawData.dialogue,
      emojis: rawData.emojies,
      avatars: rawData.avatars,
    };

    // ensure all required emoji & avatar data exists
    this.completeData();

    this.totalToLoad = this.data.emojis.length + this.data.avatars.length;
    this.loadedCount = 0;

    // console.log("magicwords data:", this.data);

    this.createSprites();

    // wait until all images are loaded
    await new Promise<void>((resolve) => {
      // console.log("RESOLVE");
      this.resolveLoad = resolve;
    });

    // await Assets.load("images/avatars/avatar.jpg");
    return this.data;
  }

  static completeData() {
    this.checkAvatarData();
    this.checkEmojiData();
  }

  //adds missing avatar entries based on dialogue characters
  static checkAvatarData() {
    for (let i = 0; i < this.data.dialogue.length; i++) {
      const name = this.data.dialogue[i].name;

      const isMissing = this.checkIfAvatarDataIsMissing(name);

      if (isMissing) {
        const avatarData = {
          name: name,
          url: this.apiUrlAvatars + name,
        };
        this.data.avatars.push(avatarData);
      }
    }
  }

  //adds missing emojis referenced in dialogue text
  static checkEmojiData() {
    for (let i = 0; i < this.data.dialogue.length; i++) {
      const text = this.data.dialogue[i].text;

      const loadNewEmojiName = this.checkIfEmojiExistsInData(text);

      if (loadNewEmojiName) {
        const avatarData = {
          name: loadNewEmojiName,
          url: this.apiUrlEmoji + loadNewEmojiName,
        };
        this.data.emojis.push(avatarData);
      }
    }
  }

  //extracts emoji name from `{emoji}`
  static checkIfEmojiExistsInData(dialog: string) {
    const emojiMatch = dialog.match(/\{([^}]+)\}/);

    if (!emojiMatch) {
      return null;
    }
    const emojiName = emojiMatch[1];

    let hasEmoji = false;

    for (let i = 0; i < this.data.emojis.length; i++) {
      const name = this.data.emojis[i].name;

      if (name === emojiName) {
        hasEmoji = true;
        break;
      }
    }

    if (!hasEmoji) {
      return emojiName;
    }
    return null;
  }
  static checkIfAvatarDataIsMissing(nameToSearch: string) {
    for (let i = 0; i < this.data.avatars.length; i++) {
      const avatarName = this.data.avatars[i].name;

      if (avatarName === nameToSearch) {
        return false;
      }
    }

    return true;
  }

  static createSprites() {
    if (MagicWordsAssets.avatarTextures.size == 0) this.createAvatars();
    if (MagicWordsAssets.emojiTextures.size == 0) this.createEmoji();
  }

  private static onAssetLoaded() {
    this.loadedCount++;

    if (this.loadedCount >= this.totalToLoad) {
      this.resolveLoad?.();
      this.resolveLoad = undefined;
    }
  }
  static createEmoji() {
    for (let i = 0; i < MagicWordsAssets.data.emojis.length; i++) {
      const avatar = MagicWordsAssets.data.emojis[i];
      const name = avatar.name;
      const url = avatar.url;

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const texture = Texture.from(img);
        MagicWordsAssets.emojiTextures.set(name, texture);
        this.onAssetLoaded();
      };
      img.src = url;
    }
  }
  static createAvatars() {
    for (let i = 0; i < MagicWordsAssets.data.avatars.length; i++) {
      const avatar = MagicWordsAssets.data.avatars[i];
      const name = avatar.name;
      const url = avatar.url;

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const texture = Texture.from(img);
        MagicWordsAssets.avatarTextures.set(name, texture);
        this.onAssetLoaded();
      };
      img.src = url;
    }
  }
}
