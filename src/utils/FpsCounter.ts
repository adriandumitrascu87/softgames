import { Container, Text, TextStyle } from "pixi.js";
import { Palette } from "./Palette";

/** Simple FPS counter using ticker delta */
export class FpsCounter extends Container {
  private FPS_TAG: string = "FPS";

  private elapsed: number = 0;
  private frames: number = 0;

  private fpsText!: Text;

  private readonly fpsStyle = new TextStyle({
    fontFamily: "Arial",
    fontSize: 20,
    fill: Palette.textSeconday,
  });

   // Auto-reposition flag
  repositionNeeded: boolean = false;
  // Used to detect text width changes
  lastTextWidth: number = 0;

  constructor(x?: number, y?: number) {
    super();
    this.createTextObject();
    this.addObject(x, y);
  }

    /** Positions the FPS label */
  addObject(x?: number, y?: number) {
    if (x && y) {
      this.fpsText.position.set(x, y);
    } else {
      this.repositionNeeded = true;
      this.fpsText.position.set(
        this.fpsText.width / 2,
        this.fpsText.height / 2,
      );
    }

    this.visible = false;
  }

   /** Creates FPS text object */
  private createTextObject() {
    this.fpsText = new Text({
      text: `${this.FPS_TAG} :0 `,
      style: this.fpsStyle,
    });
    this.addChild(this.fpsText);
    this.fpsText.anchor.set(0.5, 0.5);
  }

  
  /** Updates FPS value once per second */
  update(delta: number) {
    this.elapsed += delta;
    this.frames++;

    if (this.elapsed >= 1000) {
      const fps = ((this.frames * 1000) / this.elapsed).toFixed(2);
      this.fpsText.text = `${this.FPS_TAG} : ${fps} `;
      this.elapsed = 0;
      this.frames = 0;

      // Reposition only if text size changed
      if (this.fpsText.width != this.lastTextWidth) {
        this.visible = true;
        this.resize();
      }
      this.lastTextWidth = this.fpsText.width;
    }
  }

    /** Keeps FPS label inside screen bounds */
  resize() {
    if (
      this.fpsText.position.x - this.fpsText.anchor.x * this.fpsText.width <
      0
    ) {
      this.fpsText.position.x = this.fpsText.anchor.x * this.fpsText.width;
    }

    if (
      this.fpsText.position.y - this.fpsText.anchor.y * this.fpsText.height <
      0
    ) {
      this.fpsText.position.y = this.fpsText.anchor.y * this.fpsText.height;
    }
  }
}
