/**
 * Class for the player
 */
 class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player'); // load player ship asset

       
        this.initPlayer(scene); // start physics for playter -allows for movement and collision detection
    }

    initPlayer(scene) {
        scene.add.existing(this); // add player to scene
        this.scene.physics.world.enable(this);
        this.setCollideWorldBounds(true);
        this.visible = true;// show user
    }

    /**
     * Handles player vertical movement
     */
    verticalMovementHandler(cursors) {

        if (cursors.up.isDown) {

            this.body.setVelocityY(-1 * PLAYER_VELOCITY); // move player down
        }
        else if (cursors.down.isDown) {
            this.body.setVelocityY(PLAYER_VELOCITY); // move player up
        }
        else {
            this.body.setVelocityY(0); // stop vertical movement
        }
    }

    /**
     * Handles player horizontal movement
     */
    horizontalMovementHandler(cursors) {
        if (cursors.left.isDown) {
            this.body.setVelocityX(-1 * PLAYER_VELOCITY); // move player left
        }
        else if (cursors.right.isDown) {
            this.body.setVelocityX(PLAYER_VELOCITY); // move player right
        }
        else {
            this.body.setVelocityX(0); // stop horizontal movement
        }
    }


}