import { Application, Container, Graphics, Texture } from "pixi.js";

import { gsap } from "gsap";
import { BackButton } from "../ui/BackButton";
import { FireParticle } from "../objects/FireParticle";
import { Utils } from "../utils/Utils";
import { TextHolder } from "../objects/TextHolder";
import { Palette } from "../utils/Palette";
/** Phoenix flame particle effect */
export class PhoenixFlame extends Container {
  private readonly PARTICLES_NUMBER: number = 10;
  private readonly PARTICLES_RADIUS: number = 35;

  private readonly PARTICLE_X_OFFSET: number = 100;
  private readonly PARTICLE_MAX_LIFE: number = 2.3;
  private readonly PARTICLE_MIN_LIFE: number = 0.5;
  private readonly PARTICLE_MAX_SPEED_X: number = 70;
  private readonly PARTICLE_MAX_SPEED_Y: number = 150;
  private readonly PARTICLE_MIN_SPEED_Y: number = 20;

  private readonly PARTICLE_LIFT: number = 10;
  private readonly PARTICLE_DRAG: number = 0.95;

  private readonly BASE_SIZE: number = 50;
  app: Application;

  uiLayer = new Container();
  miniGameLayer = new Container();
  backgroundLayer = new Container();

  particleContainer = new Container();
  baseHolder = new Container();

  /** Flame color palette */
  particleColors = [0xff0000, 0xff8d00, 0xffce00, 0xffe700];

  
   /** Particle pool */
  private particlesArray: FireParticle[] = [];
  private particleTextures: Texture[] = [];
  private maxNrOfTextures: number = 10;

  backButton?: BackButton;
  textHolder?: TextHolder;

   /** Cached ticker callback */
  tickFn?: () => void;

  constructor(app: Application) {
    super();
    console.log("PhoenixFlame");

    this.app = app;
    this.on("added", this.init);
  }


  /** level setup */
  init() {
    this.addChild(this.backgroundLayer);
    this.addChild(this.miniGameLayer);
    this.addChild(this.uiLayer);


    this.addBackground();
    this.addUI();
    this.initListeners();
    this.addBase();
    this.createParticleEmmiter();
    this.addParticles();
    this.addUpdate();

    this.onResize(this.app.renderer.width, this.app.renderer.height);
  }

 
  /** Background text panel */
  addBackground() {
    const textData = {
      text: "great fire",
      color: Palette.textSeconday,
    };

    this.textHolder = new TextHolder(
      {
        width: this.app.renderer.width * 0.9,
        height: this.app.renderer.height * 0.3,
        radius: 10,
        color: Palette.secondary,
      },

      textData,
    );

    this.backgroundLayer.addChild(this.textHolder);
  }

  /** Registers ticker update */
  addUpdate() {
    this.tickFn = () => {
      const deltaSeconds = this.app.ticker.deltaMS / 1000;
      this.update(deltaSeconds);
    };

    this.app.ticker.add(this.tickFn);
  }

  /** fire base graphic */
  addBase() {
    const baseGraphics = new Graphics()
      .arc(0, 0, this.BASE_SIZE, Math.PI, 0)
      .fill(0xff0000);
    this.baseHolder.addChild(baseGraphics);
    baseGraphics.x = 0;
    baseGraphics.y = this.PARTICLES_RADIUS;

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

  /** Adds emitter containers */
  createParticleEmmiter() {
    this.miniGameLayer.addChild(this.baseHolder);
    this.miniGameLayer.addChild(this.particleContainer);
  }

   /** frame particle update */
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

      const normalizedLife =
        fireParticle.lifeTime / fireParticle.originalLifeTime;
      fireParticle.lifeTime -= delta;
      fireParticle.alpha = Math.max(0, normalizedLife);

      const scaleValue = Math.max(0, normalizedLife);
      fireParticle.scale.set(scaleValue, scaleValue);

      //kill particle
      if (fireParticle.lifeTime <= 0) {
        fireParticle.visible = false;
      }
    }
  }

   /** Emits all available particles */
  emitParticle() {
    for (let i = 0; i < this.particlesArray.length; i++) {
      const particleToEmit = this.findInactiveParticle();
      if (!particleToEmit) return;
      this.resetParticle(particleToEmit);
    }
  }

  /** Resets particle state */
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
    particleToEmit.originalLifeTime = particleToEmit.lifeTime;

    particleToEmit.speedX = (Math.random() - 0.5) * this.PARTICLE_MAX_SPEED_X;

    particleToEmit.speedY =
      Math.random() * this.PARTICLE_MIN_SPEED_Y +
      (this.PARTICLE_MAX_SPEED_Y - this.PARTICLE_MIN_SPEED_Y);
  }

  /** Finds a free particle from pool */
  findInactiveParticle() {
    for (let i = 0; i < this.particlesArray.length; i++) {
      const part = this.particlesArray[i];

      if (!part.visible) {
        return part;
      }
    }
  }

  
  /** Creates particle pool */
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

  /** Generates particle textures */
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

  //** Layout update */
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

    if (this.textHolder) {
      this.textHolder.position.set(width / 2, this.height / 3);

      var newSizeData = {
        width: this.app.renderer.width * 0.9,
        height: this.app.renderer.height * 0.3,
        radius: 10,
      };

      this.textHolder.resizeBackGround(newSizeData);
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
