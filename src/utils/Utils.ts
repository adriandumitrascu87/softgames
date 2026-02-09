import { Container } from "pixi.js";
import { gsap } from "gsap";
import type { UIButton } from "../ui/UIButton";

export class Utils {
  static recursiveKillTweens(container: Container) {
    // Kill tweens on the container itself
    gsap.killTweensOf(container);

    // Kill tweens recursively for children
    container.children.forEach((child) => {
      if (child instanceof Container) {
        Utils.recursiveKillTweens(child);
      } else {
        gsap.killTweensOf(child);
      }
    });
  }

  // creates spiral positons for an array of objects
  static getSpiralPosition(
    index: number,
    angleStep: number = 0.1,
    radiusStep: number = 0.5,
  ) {
    const angle = index * angleStep;
    const radius = index * radiusStep;

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  }

  // Generate a random point inside a circle
  static randomPointInCircle(radius: number) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * radius;

    return {
      x: Math.cos(t) * r,
      y: Math.sin(t) * r,
    };
  }

  static isLandscape(w: number, h: number) {
    return w > h;
  }

  // tween a object to the a destination position
  static tweenContainerTo(
    cont: Container,
    destX: number,
    destY: number,
    duration: number,
  ) {
    const angle = cont.angle == 0 ? 360 : 0;
    gsap.to(cont, {
      x: destX,
      y: destY,
      duration: duration, // animation lasts 2 seconds
      angle: angle,
      ease: "power2.inOut",
    });
  }

  

  // Toggle a button' s visibility and input state with animation
  static toggleButtonVisibility(
    button: UIButton,
    enable: boolean,
    delay: number = 0,
  ) {
    if (enable) {
      button.scale.set(0, 0);
      button.visible = true;
    } else {
      button.disableInput();
    }

    const newScale = enable ? 1 : 0;
    const ease = enable ? "power1.out" : "power1.in";

    gsap.to(button.scale, {
      x: newScale,
      y: newScale,
      duration: 0.1,
      ease: ease,
      delay: delay,
      onComplete: () => {
        button.visible = enable;
        if (enable) button.enableInput();
      },
    });
  }
}
