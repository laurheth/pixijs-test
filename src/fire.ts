// Fire demo! 🔥
import * as PIXI from 'pixi.js';

// Particle class
class particle {
    startPosition: Array<number>;
    speed: Array<number>;
    sprite: PIXI.Sprite;
    frames: number;
    lifetime: number;
    delay: number;

    constructor(position: Array<number>, sprite: PIXI.Sprite, lifetime: number, delay: number) {
        this.startPosition = [...position];        
        this.sprite = sprite;
        this.speed=[0,0];
        this.frames=0;
        this.lifetime=lifetime;
        this.sprite.tint = 0xff0000;

        // set pivot point
        this.sprite.pivot.set(this.sprite.width/2, this.sprite.height/2);

        this.delay = delay;
        this.start();
    }

    // Reset initial conditions
    start() {
        this.sprite.x = this.startPosition[0];
        this.sprite.y = this.startPosition[1];
        this.speed = [
            2*(Math.random() - Math.random()),
            Math.random() - Math.random()
        ];
        if (this.frames>0) {
            this.frames-=this.lifetime;
        }
        this.sprite.tint = 0xff0000;
    }

    // Update
    update(delta: number) {
        this.frames += delta;
        if (this.frames < this.delay) {
            return;
        }
        else if (this.delay > 0) {
            this.frames=0;
            this.delay = -Infinity;
        }
        // Reset
        if (this.frames > this.lifetime) {
            this.start();
        }
        // Adjust speeds
        this.speed[1]-=delta/4;
        this.speed[0]-=delta * (this.sprite.x - this.startPosition[0])/200;

        // Apply speed
        this.sprite.x += this.speed[0] * delta;
        this.sprite.y += this.speed[1] * delta;

        // Calculate tint
        const fraction = Math.min(this.frames / this.lifetime,1);
        this.sprite.tint = PIXI.utils.rgb2hex([1,fraction,0]);
    }
}

const fire = {
    scene: <PIXI.ParticleContainer> new PIXI.ParticleContainer(10,{tint:true}),

    particles: <Array<particle>> [],

    // Setup function
    setup: function(loader: PIXI.Loader, width: number, height: number) {
        for (let i=0;i<10;i++) {
            // Create the new particle
            const newParticle = new particle(
                [width/2,height/2],
                new PIXI.Sprite(
                    loader.resources["assets/fireParticle.png"].texture
                ),
                30,
                3*i
            );
            // Add to the scene
            this.scene.addChild(newParticle.sprite);
            // Add to the particle list
            this.particles.push(newParticle);
                
        }
        return this.scene;
    },

    play: function(delta: number) {
        this.particles.forEach(particle => particle.update(delta));
    }
}

export default fire;