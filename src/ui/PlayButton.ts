import { loadEvents } from "../utils/EventBus";
import { UIButton } from "./UIButton";

/** Play button that emits START event when clicked */
export class PlayButton extends UIButton {
  constructor() {
    super("PLAY");
    this.on("pointerdown", this.handlePlayButtonClick);
  }

  /** Emits START event to load LEVEL SELECT*/
  handlePlayButtonClick() {
    loadEvents.emit("START");
  }
}
