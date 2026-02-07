import { loadEvents } from "../utils/EventBus";
import { UIButton } from "./UIButton";

export class BackButton extends UIButton {
  constructor() {
    super("BACK", 100, 50, 10);
    this.on("pointerdown", this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    loadEvents.emit("BACK");
  }
}
