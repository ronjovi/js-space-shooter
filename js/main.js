
// CONSTANTS
const PLAYER_VELOCITY = 250;

// game
let game;

/**
 * Player health bar
 */
class HealthBar {

    constructor(scene, x, y) {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.value = 195;
        this.p = 76 / 100;

        this.draw();

        scene.add.existing(this.bar);
    }

    decrease(amount) {
        this.value -= amount;

        if (this.value < 0) {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }

    draw() {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0xF9F0D9);
        this.bar.fillRect(this.x, this.y, 200, 20);

        //  Health
        this.bar.fillStyle(0xffffff);
        //this.bar.fillRect(this.x + 2, this.y + 2, 200, 12);

        if (this.value < 30) {
            this.bar.fillStyle(0xff0000);
        }
        else {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 2, this.y + 2, this.value, 16);
    }

}

/**
 * Class for the bullet is sent by the player ship
 */
class Bullet extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, 0, 0, 'player-bullet');
        this.initPhysics(); // start physics for playter -allows for movement and collision detection
        this.speed = Phaser.Math.GetSpeed(400, 1);
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
    }

    update(time, delta) {
        this.y -= this.speed * delta;

        if (this.y < -50) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

/**
 * Class for the bullet is sent by the player ship
 */
class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, 0, 0, 'asteroid');
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
                this.destroy();
            }
        } else {
            this.visible = false;
        }
    }
}

/**
 * Class for the explosions
 */
class Explosion extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, 0, 0, 'explosion');
    }

    show(x, y) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
    }

    update(time, delta) {
        // if (!this.scene.isPaused) {
        //     this.visible = true;
        //     this.y += this.speed * delta;
        //     if (this.y > window.innerHeight + 100) {
        //         this.destroy();
        //     }
        // } else {
        //     this.visible = false;
        // }
    }
}



/**
 * Scene that has the content and logic for the game scene
 * This is where the user gets to control their ship and shoot enemies
 */
class StartScene extends Phaser.Scene {

    constructor() {
        super({
            key: "StartScene"
        });

        this.bg;
        this.gameSceneGraphics;
        this.logo;
        this.start;
        this.instructions
    }

    /**
     * Hides loader
     * changes opacity to 0 for fade effect
     * changes display to none after 300ms - we wait for fade out to finish
     */
    hideLoader() {
        document.querySelector("#game-loader").style.opacity = 0; // fade out loader

        // give the loader element enough time to transition to 0 opacity (300ms)
        // then hide element
        setTimeout(() => {
            document.querySelector("#game-loader").style.display = "none";
        }, 300)

    }

    /**
      * Display menu
      * adds hover event listener to change color of link
      * adds click event listener to:
      *    1. Show loader and navigate to game scene
      *    2. Show instructions image
      */
    addMenu() {
        const white = '#F9F0D9';
        const red = '#F94A41';
        const width = window.innerWidth;
        const height = window.innerHeight;

        /**
         * Adds logo
         * shows hand cursor on hover
         * centers logo
         */
        const logoStyles = { fontFamily: 'Rationale', fontSize: 43, color: red };
        this.logo = this.add.text(0, 0, 'Space Odyssey', logoStyles).setInteractive({ useHandCursor: true });
        this.logo.setPosition(width / 2 - this.logo.width / 2, height * .3);

        /**
         * Adds start link
         * shows hand cursor on hover
         * centers logo
         */
        const startStyles = { fontFamily: 'Rationale', fontSize: 26, color: white };
        this.start = this.add.text(0, 0, 'NEW GAME', startStyles).setInteractive({ useHandCursor: true });
        this.start.setPosition(width / 2 - this.start.width / 2, height * .4);

        /**
         * Adds instructions link
         * shows hand cursor on hover
         * centers logo
         */
        const instructionsStyles = { fontFamily: 'Rationale', fontSize: 26, color: white };
        this.instructions = this.add.text(0, 0, 'INSTRUCTIONS', instructionsStyles).setInteractive({ useHandCursor: true });
        this.instructions.setPosition(width / 2 - this.instructions.width / 2, height * .45);

        /**
         * shows loader and navigates to game scene
         */
        this.start.on('pointerdown', (pointer) => {
            document.querySelector("#game-loader").style.opacity = 1;
            document.querySelector("#game-loader").style.display = "flex";
            this.scene.start('GameScene');
        });


        /**
         * changes start color to red on hover
         */
        this.start.on('pointerover', (pointer) => {
            const styles = { fontFamily: 'Rationale', fontSize: 26, color: red }; // start styles
            this.start.setStyle(styles);
        });

        /**
         * changes start color to white on no hover
         */
        this.start.on('pointerout', (pointer) => {
            const styles = { fontFamily: 'Rationale', fontSize: 26, color: white }; // start styles
            this.start.setStyle(styles);
        });

        /**
         * changes instructions color to red on hover
         */
        this.instructions.on('pointerover', (pointer) => {
            const styles = { fontFamily: 'Rationale', fontSize: 26, color: red }; // start styles
            this.instructions.setStyle(styles);
        });

        /**
         * changes instructions color to white on no hover
         */
        this.instructions.on('pointerout', (pointer) => {
            const styles = { fontFamily: 'Rationale', fontSize: 26, color: white }; // start styles
            this.instructions.setStyle(styles);
        });

    }

    preload() {
        this.load.image("space", "https://temp-assets-t.s3-us-west-1.amazonaws.com/bg.png");
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        // add space background to game
        this.bg = this.add.tileSprite(0, 0, 10000, 10000, 'space').setOrigin(0);

        // creates keys listener for playeer action/movement
        this.cursors = this.input.keyboard.createCursorKeys();

        // set the resize listener and callback
        this.scale.on('resize', this.resize, this);

        // get graphics for create method
        this.gameSceneGraphics = this.add.graphics();

        // Loaing in google font
        // once loaded, add the text for the Integrity
        WebFont.load({
            google: {
                families: ['Rationale']
            }
        });

        /**
         * Display menu
         * Start Link - starts the game
         * Instructions Link - shows instructions
         */
        this.addMenu();

        this.hideLoader();
    }

    /**
     * Handles resizing the game when the viewport size changes
     */
    resize() {
        var width = window.innerWidth; // get viewport width
        var height = window.innerHeight;// get viewport height

        // resizes game and background
        this.cameras.resize(width, height);
        this.bg.setSize(width, height);

        this.logo.setPosition(width / 2 - this.logo.width / 2, height * .3); // centers logo
        this.start.setPosition(width / 2 - this.start.width / 2, height * .4); // centers start
        this.instructions.setPosition(width / 2 - this.instructions.width / 2, height * .45); // centers instructions
    }
}


/**
 * Scene that has the content and logic for the game scene
 * This is where the user gets to control their ship and shoot enemies
 */
class GameScene extends Phaser.Scene {

    constructor() {
        super({
            key: "GameScene"
        });

        this.bg;
        this.player;
        this.cursors;
        this.gameSceneGraphics;
        this.bullets;
        this.lastFired = 0;
        this.levelText;
        this.level = 1;
        this.score = 0;
        this.integrity = 1;
        this.player;
        this.instructionsSm;
        this.isPaused = false;
        this.hp;
        this.logo;
        this.start;
        this.instructions;
        this.quit;
        this.explosions;

        this.MAX_ASTEROIDS = 5;
        this.ASTEROID_DELAY = 0;
    }

    /**
     * Hides loader
     * changes opacity to 0 for fade effect
     * changes display to none after 300ms - we wait for fade out to finish
     */
    hideLoader() {
        document.querySelector("#game-loader").style.opacity = 0; // fade out loader

        // give the loader element enough time to transition to 0 opacity (300ms)
        // then hide element
        setTimeout(() => {
            document.querySelector("#game-loader").style.display = "none";
        }, 300)
    }

    preload() {
        // this.load.setBaseURL('https://viterbi-web.usc.edu/~sanc735/itp301/assignment_09/images/');
        this.load.image("space", "https://temp-assets-t.s3-us-west-1.amazonaws.com/bg.png");
        this.load.spritesheet("player", "https://temp-assets-t.s3-us-west-1.amazonaws.com/player-sprite.png", { frameWidth: 100, frameHeight: 119 });
        this.load.spritesheet("asteroid", "https://temp-assets-t.s3-us-west-1.amazonaws.com/asteroid_1.png", { frameWidth: 100, frameHeight: 88 });
        this.load.spritesheet("explosion", "https://temp-assets-t.s3-us-west-1.amazonaws.com/explosion.png", { frameWidth: 80, frameHeight: 80 });
        this.load.image("player-bullet", "https://temp-assets-t.s3-us-west-1.amazonaws.com/player-bullet.png");
        this.load.image("instructions-sm", "https://temp-assets-t.s3-us-west-1.amazonaws.com/instructions-sm.png");
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.bullets = this.add.group({
            classType: Bullet,
            maxSize: 25,
            runChildUpdate: true
        });

        this.asteroids = this.add.group({
            classType: Asteroid,
            maxSize: 20,
            runChildUpdate: true
        });

        this.explosions = this.add.group({
            classType: Explosion,
            maxSize: 25,
            runChildUpdate: true
        });

        // add space background to game
        this.bg = this.add.tileSprite(0, 0, 10000, 10000, 'space').setOrigin(0);
        // adds instructions to bottom of screen
        this.instructionsSm = this.add.image(width - 185, height - 60, 'instructions-sm');

        // create player instance
        // we pass the scence instance and coordinate for starting position x,y
        // start at middle of view port and ~ 200 px from bottom
        this.player = new Player(this, width / 2, height / 2 + height * .3);
        this.anims.create({
            key: "player_anim",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 20,
            repeat: -1
        });
        this.player.play("player_anim");

        // set  custom boundary in retctangle ship
        // this prevents the player from accessing the the top 125px and bottom 200px of screen
        // both of these sections contain the HUD score, level and ship integrity
        this.player.body.setBoundsRectangle(new Phaser.Geom.Rectangle(0, 145, width, height - 260));

        // creates keys listener for playeer action/movement
        this.cursors = this.input.keyboard.createCursorKeys();

        // set the resize listener and callback
        this.scale.on('resize', this.resize, this);

        // get graphics for create method
        this.gameSceneGraphics = this.add.graphics();

        // Loaing in google font
        // once loaded, add the text for the Integrity
        WebFont.load({
            google: {
                families: ['Rationale']
            },
            active: () => {
                this.add.text(30, window.innerHeight - 50, 'Integrity: ', { fontFamily: 'Rationale', fontSize: 23, color: '#fff', });
            }
        });

        // styles for the score and level values
        const styles = { fontFamily: 'Rationale', fontSize: 23, color: '#fff' };

        // add score label
        this.add.text(30, 75, 'Score: ', styles);
        // add level label
        this.add.text(30, 105, 'Level: ', styles);

        // add the text for score, level value
        this.scoreText = this.add.text(90, 75, '0', styles);
        this.levelText = this.add.text(90, 105, '1', styles);

        this.hp = new HealthBar(this, 120, height - 47);

        // create explosion animation
        this.anims.create({
            key: "explosion_anim",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        this.physics.add.collider(this.bullets, this.asteroids, (bullet, asteroid) => {
            var explosion = this.explosions.get();

            if (explosion) {
                explosion.show(bullet.x, bullet.y);

                explosion.play("explosion_anim");

                setTimeout(() => {
                    explosion.destroy();
                }, 350)
            }

            bullet.destroy(); // get rid of bullet

            // detect health of asteroid
            if (asteroid.health === 3) {
                asteroid.health -= 1;
                asteroid.setFrame(1);
                this.score += 50;
            } else if (asteroid.health === 2) {
                asteroid.health -= 1;
                asteroid.setFrame(2);
                this.score += 50;
            } else {
                this.score += 50;
                asteroid.destroy(); // no more health destroy
            }


        });

    //     this.game.input.onDown.addOnce(() => {
    //         this.game.sound.context.resume();
    //    });

        this.hideLoader();
    }

    asteroidSpawnHandler(time, delta) {
        const width = window.innerWidth;
        var lowerBorder = width * .15;
        var highBorder = width - lowerBorder;
        var x = Math.floor((Math.random() * highBorder) + lowerBorder)

        const num = this.asteroids.children.entries.length;
        if (num < this.MAX_ASTEROIDS & time > this.ASTEROID_DELAY) {
            var check = this.asteroids.getFirstDead();
            if (check) {
                check.show(x);
            } else {
                var asteroid = this.asteroids.get();
                asteroid.show(x);
            }
            this.ASTEROID_DELAY = time + 500;
        }
    }

    update(time, delta) {
        // update values of text
        this.levelText.setText(`${this.level}`);
        this.scoreText.setText(`${this.score}`);

        if (!this.isPaused) {
            // scroll the background down 
            this.bg.tilePositionY -= 2.5;

            // Listen for up,down keys - moves player up or down
            this.player.verticalMovementHandler(this.cursors);
            // Listen left,right keys - moves player right or left
            this.player.horizontalMovementHandler(this.cursors);

            // Listen for 'space' down
            // shoots bullets 
            this.bulletFireHandler(time, delta);

            // handles spawns of asteroids
            this.asteroidSpawnHandler(time, delta);

            // listen for any pauses
            this.pauseHandler();
        }

    }

    pauseHandler() {
        this.input.keyboard.on('keydown-P', (event) => {
            if (!this.isPaused) {
                this.addPauseMenu();
                this.isPaused = true;
            }
        });
    }

    bulletFireHandler(time, delta) {
        if (this.cursors.space.isDown && time > this.lastFired) {

            var bullet = this.bullets.get();

            if (bullet) {
                bullet.fire(this.player.x, this.player.y);

                this.lastFired = time + 200;
            }
        }
    }

    /**
 * Handles resizing the game when the viewport size changes
 */
    resize() {
        var width = window.innerWidth;
        var height = window.innerHeight;


        this.cameras.resize(width, height);
        this.bg.setSize(width, height);
        this.player.body.setBoundsRectangle(new Phaser.Geom.Rectangle(0, 145, width, height - 260));
        // adds instructions to bottom of screen
        this.instructionsSm.setPosition(width - 185, height - 60);
    }

    /**
     * Display menu
     * adds hover event listener to change color of link
     * adds click event listener to:
     *    1. Show loader and navigate to game scene
     *    2. Show instructions image
     */
    addPauseMenu() {
        const white = '#F9F0D9';
        const red = '#F94A41';
        const width = window.innerWidth;
        const height = window.innerHeight;

        // adds a black transparent layer
        this.gameSceneGraphics.fillStyle(0x000000, 0.5);
        this.overlay = this.gameSceneGraphics.fillRect(0, 0, width, height);

        /**
         * Adds logo
         * shows hand cursor on hover
         * centers logo
         */
        const logoStyles = { fontFamily: 'Rationale', fontSize: 43, color: red };
        this.logo = this.add.text(0, 0, 'Space Odyssey', logoStyles).setInteractive({ useHandCursor: true });
        this.logo.setPosition(width / 2 - this.logo.width / 2, height * .3);

        /**
         * Adds start link
         * shows hand cursor on hover
         * centers logo
         */
        const startStyles = { fontFamily: 'Rationale', fontSize: 26, color: white };
        this.start = this.add.text(0, 0, 'RESUME GAME', startStyles).setInteractive({ useHandCursor: true });
        this.start.setPosition(width / 2 - this.start.width / 2, height * .4);

        /**
         * Adds instructions link
         * shows hand cursor on hover
         * centers logo
         */
        const instructionsStyles = { fontFamily: 'Rationale', fontSize: 26, color: white };
        this.instructions = this.add.text(0, 0, 'INSTRUCTIONS', instructionsStyles).setInteractive({ useHandCursor: true });
        this.instructions.setPosition(width / 2 - this.instructions.width / 2, height * .45);

        /**
         * Adds quit link
         * shows hand cursor on hover
         * centers logo
         */
        const quitStyles = { fontFamily: 'Rationale', fontSize: 26, color: white };
        this.quit = this.add.text(0, 0, 'QUIT', quitStyles).setInteractive({ useHandCursor: true });
        this.quit.setPosition(width / 2 - this.quit.width / 2, height * .5);

        /**
         * shows loader and navigates to game scene
         */
        this.start.on('pointerdown', (pointer) => {
            this.start.visible = false;
            this.logo.visible = false;
            this.instructions.visible = false;
            this.quit.visible = false;
            this.gameSceneGraphics.clear();
            this.isPaused = false;
        });

        /**
         * shows loader and navigates to game scene
         */
        this.quit.on('pointerdown', (pointer) => {
            document.querySelector("#game-loader").style.opacity = 1;
            document.querySelector("#game-loader").style.display = "flex";
            this.isPaused = false;
            this.score = 0;
            this.level = 1;
            this.integrity = 1;
            this.scene.start('StartScene');
        });


        /**
         * changes start color to red on hover
         */
        this.start.on('pointerover', (pointer) => {
            const styles = { fontFamily: 'Rationale', fontSize: 26, color: red }; // start styles
            this.start.setStyle(styles);
        });

        /**
         * changes start color to white on no hover
         */
        this.start.on('pointerout', (pointer) => {
            const styles = { fontFamily: 'Rationale', fontSize: 26, color: white }; // start styles
            this.start.setStyle(styles);
        });

        /**
         * changes instructions color to red on hover
         */
        this.instructions.on('pointerover', (pointer) => {
            const styles = { fontFamily: 'Rationale', fontSize: 26, color: red }; // start styles
            this.instructions.setStyle(styles);
        });

        /**
         * changes instructions color to white on no hover
         */
        this.instructions.on('pointerout', (pointer) => {
            const styles = { fontFamily: 'Rationale', fontSize: 26, color: white }; // start styles
            this.instructions.setStyle(styles);
        });

        /**
 * changes instructions color to red on hover
 */
        this.quit.on('pointerover', (pointer) => {
            const styles = { fontFamily: 'Rationale', fontSize: 26, color: red }; // start styles
            this.quit.setStyle(styles);
        });

        /**
         * changes instructions color to white on no hover
         */
        this.quit.on('pointerout', (pointer) => {
            const styles = { fontFamily: 'Rationale', fontSize: 26, color: white }; // start styles
            this.quit.setStyle(styles);
        });

    }
}

// game config
var config = {
    type: Phaser.WEBGL, // instructs pahser to use webGL  - defaults to canvas if it cant
    backgroundColor: "#2dab2d",
    scale: {
        mode: Phaser.Scale.RESIZE, // sets resize size which scales game based on viewport width
        parent: "game-container", // id of the element containg the game
        height: '100%', // scale to 100% height
        width: '100%'// scale to 100% width
    },
    physics: {
        debug: true,
        default: 'arcade',
        arcade: {
            fps: 60,
            debug: true,
            debugShowBody: true,
            debugShowStaticBody: true,
            debugShowVelocity: true,
            debugVelocityColor: 0xffff00,
            debugBodyColor: 0x0000ff,
            debugStaticBodyColor: 0xffffff
        }
    },
    scene: [GameScene, StartScene, ,]
};

// create game instance
game = new Phaser.Game(config);

