import { loadEvents } from "../utils/EventBus";
import { UIButton } from "./UIButton";

export class PlayButton extends UIButton {
  constructor() {
    super("PLAY");
    this.on("pointerdown", this.handlePlayButtonClick);
  }

  handlePlayButtonClick() {
    loadEvents.emit("START");
  }
}
