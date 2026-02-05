import { loadEvents } from "../utils/EventBus";
import { UIButton } from "./UIButton";

export class LevelButton extends UIButton {
  constructor(lvlButtonLabel:string, levelToload:string) {
    super(lvlButtonLabel);
    this.on("pointerdown", ()=>{
        this.handleLevelClick(levelToload);
    });
  }

  handleLevelClick(levelToload:string) {
     loadEvents.emit("LOAD_UNIT", levelToload);
  }
}