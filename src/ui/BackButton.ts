import { loadEvents } from "../utils/EventBus";
import { UIButton } from "./UIButton";

/** Back button that emits BACK event when clicked */
export class BackButton extends UIButton {
  constructor() {
    super("BACK", 100, 50, 10);
    this.on("pointerdown", this.handleBackButtonClick);
  }

  /** Emits BACK event to navigate to LEVEL SELECT */
  handleBackButtonClick() {
    loadEvents.emit("BACK");
  }
}
