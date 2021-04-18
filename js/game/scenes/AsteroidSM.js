/**
 * Class for the bullet is sent by the player ship
 */
class AsteroidSM extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, 0, 0, 'asteroid_sm_0');
        this.initPhysics(); // start physics for playter -allows for movement and collision detection
        this.speed = Phaser.Math.GetSpeed(200, 1); //speed
        this.health = 3;
    }

    initPhysics() {
        this.scene.physics.world.enable(this);
    }

    show(x) {
        this.setPosition(x, -350);

        this.setActive(true);
        this.setVisible(true);
    }

    update(time, delta) {
        if (!this.scene.isPaused) {
            this.visible = true;
            this.y += this.speed * delta;
            if (this.y > window.innerHeight + 100) {
                this.kill();
            }
        } else {
            this.visible = false;
        }
    }

    /**
     * Updates the asteroid frame state based on health
     * 
     * @param {*} bullet 
     */
    collisionHandler(bullet, explosions) {
        var explosion = explosions.get();

        if (explosion) {
            explosion.show(bullet.x, bullet.y);

            explosion.play("explosion_anim");

            setTimeout(() => {
                explosion.destroy();
            }, 350)
        }

        bullet.destroy(); // get rid of bullet

        // detect health of asteroid
        if (this.health === 3) {
            this.health -= 1;
            this.setFrame(1);
        } else if (this.health === 2) {
            this.health -= 1;
            this.setFrame(2);
        } else {
            this.destroy(); // no more health destroy
        }
    }
}