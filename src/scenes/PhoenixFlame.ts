import {
  Application,
  Container,
  Graphics,
  Particle,
  ParticleContainer,
  Sprite,
  Texture,
} from "pixi.js";

import { gsap } from "gsap";
import { BackButton } from "../ui/BackButton";
import { FireParticle } from "../objects/FireParticle";
import { Utils } from "../utils/Utils";
/** Phoenix flame particle effect */
export class PhoenixFlame extends Container {
  private readonly PARTICLES_NUMBER: number = 10;
  private readonly PARTICLES_RADIUS: number = 10;

  private readonly PARTICLE_X_OFFSET: number = 30;
  private readonly PARTICLE_MAX_LIFE: number = 1;
  private readonly PARTICLE_MIN_LIFE: number = 0.1;
  private readonly PARTICLE_MAX_SPEED_X: number = 50;
  private readonly PARTICLE_MAX_SPEED_Y: number = 70;
  private readonly PARTICLE_MIN_SPEED_Y: number = 20;

  private readonly PARTICLE_LIFT: number = 60;
  private readonly PARTICLE_DRAG: number = 0.98;

  private readonly BASE_SIZE: number = 30;
  app: Application;

  particleColors = [0xff0000, 0xff8d00, 0xffce00, 0xffe700];

  backButton?: BackButton;
  uiLayer = new Container();
  miniGameLayer = new Container();

  particleContainer = new Container();
  baseHolder = new Container();

  // Particle pool

  private particlesArray: FireParticle[] = [];
  private particleTextures: Texture[] = [];
  private maxNrOfTextures: number = 10;
  tickFn?: () => void;

  constructor(app: Application) {
    super();
    console.log("PhoenixFlame");

    this.app = app;
    this.on("added", this.init);
  }

  init() {
    this.addChild(this.miniGameLayer);
    this.addChild(this.uiLayer);
    this.addUI();
    this.initListeners();
    this.addBase();
    this.createParticleEmmiter();
    this.addParticles();
    this.addUpdate();

    this.onResize(this.app.renderer.width, this.app.renderer.height);
  }

  addUpdate() {
    this.tickFn = () => {
      const deltaSeconds = this.app.ticker.deltaMS / 1000;
      this.update(deltaSeconds);
    };

    this.app.ticker.add(this.tickFn);
  }

  // add fire base;
  addBase() {
    const baseGraphics = new Graphics()
      .arc(0, 0, this.BASE_SIZE, Math.PI, 0)
      .fill(0xff0000);
    this.baseHolder.addChild(baseGraphics);
    baseGraphics.x = 10;
    baseGraphics.y = 20;

    this.baseHolder.alpha = 0.5;

    gsap.to(this.baseHolder.scale, {
      x: 1.2,
      y: 1.2,
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    gsap.to(this.baseHolder, {
      alpha: 0.9,
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });
  }

  createParticleEmmiter() {
    this.miniGameLayer.addChild(this.baseHolder);
    this.miniGameLayer.addChild(this.particleContainer);
  }

  update(delta: number): void {
    this.emitParticle();

    for (let i = 0; i < this.particlesArray.length; i++) {
      const fireParticle = this.particlesArray[i];

      if (!fireParticle.visible) return;

      // x/y movement
      fireParticle.x += fireParticle.speedX * delta;
      fireParticle.y -= fireParticle.speedY * delta;

      // physics
      fireParticle.speedY -= this.PARTICLE_LIFT * delta;
      fireParticle.speedX *= this.PARTICLE_DRAG;

      //lifetime
      fireParticle.lifeTime -= delta;
      fireParticle.alpha = Math.max(0, fireParticle.lifeTime);

      const scaleValue = fireParticle.lifeTime;
      fireParticle.scale.set(scaleValue);

      //kill particle
      if (fireParticle.lifeTime <= 0) {
        fireParticle.visible = false;
      }
    }
  }

  //emit all available particles per frame
  emitParticle() {
    for (let i = 0; i < this.particlesArray.length; i++) {
      const particleToEmit = this.findInactiveParticle();
      if (!particleToEmit) return;
      this.resetParticle(particleToEmit);
    }
  }

  resetParticle(particleToEmit: FireParticle) {
    if (!this.particleContainer) return;
    particleToEmit.x = (Math.random() - 0.5) * this.PARTICLE_X_OFFSET;
    particleToEmit.y = 0;

    particleToEmit.scale.set(1, 1);
    particleToEmit.visible = true;
    particleToEmit.alpha = 1;

    particleToEmit.lifeTime =
      Math.random() * (this.PARTICLE_MAX_LIFE - this.PARTICLE_MIN_LIFE) +
      this.PARTICLE_MIN_LIFE;
    particleToEmit.speedX = (Math.random() - 0.5) * this.PARTICLE_MAX_SPEED_X;
    particleToEmit.speedY =
      Math.random() * this.PARTICLE_MIN_SPEED_Y +
      (this.PARTICLE_MAX_SPEED_Y - this.PARTICLE_MIN_SPEED_Y);
  }

  findInactiveParticle() {
    for (let i = 0; i < this.particlesArray.length; i++) {
      const part = this.particlesArray[i];

      if (!part.visible) {
        return part;
      }
    }
  }

  addParticles() {
    this.generateTextures();

    for (let i = 0; i < this.PARTICLES_NUMBER; i++) {
      const fire = new FireParticle();
      fire.texture =
        this.particleTextures[
          Math.floor(Math.random() * this.particleTextures.length)
        ];
      this.resetParticle(fire);
      this.particlesArray.push(fire);
      this.particleContainer?.addChild(fire);
    }
  }

  generateTextures() {
    for (let i = 0; i < this.maxNrOfTextures; i++) {
      const fillColor =
        this.particleColors[
          Math.floor(Math.random() * this.particleColors.length)
        ];

      const particleGrafic = new Graphics()
        .circle(0, 0, this.PARTICLES_RADIUS)
        .fill(fillColor);
      const texture = this.app.renderer.generateTexture(particleGrafic);
      this.particleTextures.push(texture);
      particleGrafic.destroy();
    }
  }

  initListeners() {
    this.on("resize", this.onResize);
  }

  addUI() {
    this.backButton = new BackButton();

    this.uiLayer.addChild(this.backButton);
  }

  // Update elements position on resize
  onResize(width: number, height: number): void {
    if (this.backButton) {
      this.backButton.position.set(
        this.backButton.width / 2 + 5,
        height - this.backButton.height / 2 - 5,
      );
    }

    if (this.particleContainer) {
      this.particleContainer.position.set(width / 2, height * 0.75);
      this.baseHolder.position.copyFrom(this.particleContainer);
    }
  }

  destroyUnit() {
    if (this.tickFn) {
      this.app.ticker.remove(this.tickFn);
    }

    this.removeAllListeners();
    Utils.recursiveKillTweens(this);
    Utils.destroyAllChildren(this);
  }
}
