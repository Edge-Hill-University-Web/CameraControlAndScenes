class PhaserTutorialSessionFour extends Phaser.Scene {

    constructor() {
        super('GameScene');
        this.player;
        this.cursors;
        this.text;
        this.platforms;
        this.stars;
        this.score = 0;
        this.scoreText;
        this.cam;
        this.checkpoint;
    }

    preload() {
        // preloading of assets
        this.load.image('sky', 'assets/sky.png');
        this.load.image('environment', 'assets/environment.jpg');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('checkpoint', 'assets/checkpoint.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {

        const canvas = game.canvas;
        // set the origin to the top-left corner of the image
        const sky = this.add.image(0, 0, 'environment');
        sky.setOrigin(0, 0);

        // Adds Text
        this.text = this.add.text(300, 50, 'Introduction to Phaser', { fill: '#ffffff' });
        this.text.setZ(5);

        this.scoreText = this.add.text(600, 10, 'Stars Collected: 0', { fill: '#000000' });
        this.scoreText.setZ(5);

        // Creates a Group of Static Objects and adds Objects to them.
        /*
        since the platforms are belong to a StaticGroup they will remain 
        in place in the world and are not impacted at all be gravity
        */
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(500, 400, 'platform');
        this.platforms.create(10, 200, 'platform');
        this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();


        //Player physics
        this.player = this.physics.add.sprite(100, 300, 'dude').setScale(2).setCollideWorldBounds(true);
        this.player.setBounceY(0.4);


        //Camera 
        this.cam = this.cameras.main.setSize(800, 600);
        this.cam.setZoom(1);
        this.cameras.main.setBounds(0, 0, 1920, 600);

        this.cam.startFollow(this.player, true, 100, 100);


        // //draws a circle which we will use to MASK the viewport of the camera.
        const mask = this.add.graphics().fillCircle(650, 450, 80);
        const cam2 = this.cameras.add(450, 350, 400, 200).setMask(mask.createGeometryMask()).setZoom(0.4);


        // Optionally, you can also set the camera's limits to keep the camera from going out of bounds.
        // For example, to keep the camera within the map's dimensions:
        //this.cameras.main.setLerp(0.1, 0.1); // Optional: Add smooth camera movement
        //this.cameras.main.setDeadzone(50, 50); // Optional: Add a deadzone for smoother camera follow


        // Checkpoint
        this.checkpoint = this.physics.add.sprite(100, 100, 'checkpoint');
        this.checkpoint.setScale(0.1).refreshBody();

        // Collision Detection Implementation for player and platforms and Checkpoint
        this.physics.add.collider(this.player, this.platforms);


        this.physics.add.collider(this.checkpoint, this.platforms);
        this.physics.world.setBounds(0, 0, 2000, 1000);

        cam2.startFollow(this.player);

        //Keyboard Control (Arrow Keys)
        this.cursors = this.input.keyboard.createCursorKeys();

        //stars collectables group
        this.stars = this.physics.add.group({
            collideWorldBounds: true,
            gravityY: 500,
            key: 'star',
            repeat: 9,
            setXY: { x: 20, y: 0, stepX: 75 },
        });

        // Simulates a bouncing animation were each star has different bounce values.
        this.stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        // Collision Between Stars and Platforms
        this.physics.add.collider(this.stars, this.platforms);
        // Collision Between stars and Stars
        this.physics.add.collider(this.stars, this.stars);

        // Collision Between Player and Stars
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        // Collision Between Player and Checkpoint
        this.physics.add.overlap(this.player, this.checkpoint, this.reachedCheckpoint, null, this);


        //animation
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,

        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4, end: 4 }],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update() {

        this.scoreText.x = this.player.body.position.x + 200;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }

        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
            this.player.anims.play('turn');
        }

        else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
            this.player.anims.play('turn');
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
    }
    /*
    This is a custom function to handle the resolution between 
    the collision of a player and star object.
    */
    collectStar(player, star) {
        this.score += 1;
        this.scoreText.setText('Stars Collected: ' + this.score);
        star.disableBody(true, true);
        star.destroy();
    }

    reachedCheckpoint() {
        this.scene.start('scene2');
    }

}

// SCENE B
class NextLevel extends Phaser.Scene {
    constructor() {
        super({ key: 'scene2' });
    }

    preload() {
        this.load.image('scene2', 'assets/scene2.png')
    }

    create() {
        this.active = true;
        this.add.image(400, 300, 'scene2');
        this.add.text(200, 100, 'This is Scene B', { fontSize: '32px', fill: '#000' });


    }
}


const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    transparent: false,
    width: 800,
    height: 600,
    disableContextMenu: false,
    scene: [PhaserTutorialSessionFour, NextLevel],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 300 },
        },

    }
};

const game = new Phaser.Game(config);
