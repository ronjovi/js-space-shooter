/**
 * Class for the bullet is sent by the player ship
 */
 class Bullet extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, 0, 0, 'player-bullet');
        this.initPhysics(); // start physics for playter -allows for movement and collision detection
        this.speed = BULLET_SPEED_DEFAULT;
        console.log(this.speed)
    }

    initPhysics() {
        this.scene.physics.world.enable(this);
    }

    fire(x, y) {
        this.setPosition(x, y - 50);

        this.setActive(true);
        this.setVisible(true);
    }

    hide() {
        this.setActive(false);
        this.setVisible(false);
        this.setPosition(-100,-100);
    }

    update(time, delta) {
        this.y -= this.speed * delta;

        if (this.y < -50) {
            this.setVisible(false);
            this.setActive(false);
        }
    }
}