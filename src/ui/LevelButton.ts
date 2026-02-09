import { loadEvents } from "../utils/EventBus";
import { UIButton } from "./UIButton";

/** Level selection button that loads the level indicated by the label */
export class LevelButton extends UIButton {
  constructor(lvlButtonLabel:string, levelToload:string) {
    super(lvlButtonLabel);
    this.on("pointerdown", ()=>{
        this.handleLevelClick(levelToload);
    });
  }

    /** Emits LOAD_LEVEL event with level id */
  handleLevelClick(levelToload:string) {
     loadEvents.emit("LOAD_LEVEL", levelToload);
  }
}