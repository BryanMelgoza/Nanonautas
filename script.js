const Phaser = require("phaser");

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics:{
        default: 'arcade',
        arcade:{
            gravity: {y:300},
            debug: false
        }
    },
    scene:{
        perload: preload,
        create: create,
        update: update
    }
};

var score = 0;
var scoreText;
var gameOver=false;

var game = new Phaser. Game(config);

function preload(){
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', {framewidth: 32, frameHeight: 48});
   
}


function create(){
    this.add.image (400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    
    platforms.create(400, 568, 'ground').setscale(2).refreshBody();
    
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    
    player = this.physics.add.sprite(100, 450, 'dude');
    
    player.setCollideworldBounds(true);
    player.setBounce(0.2);

    this.anims.create({
        key: 'left',
        frame: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frame: [{key: 'dude', frame: 4 } ],
        frameRete: 20
    });
   
        this.anims.create({
            key: 'right',
            frame: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRete: 10,
            repeat: -1
        });
    //    player.body.setGravityY(300);
       this.physics.add.collider(player, platforms);
    cursors = this.input.keyboard.createCursorKeys();
       
    stars = this.physics.add.group({
        key:'star',
        repeat: 11,
        setXY: {x: 12,y:0, stepX: 70}
    });

    stars.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars,platforms);

    this.physics.add.overlap(player,starts,collectStar,null,true);
    
    scoreText = this.add.text(16,16,'score: 0',{fontsize: '32px', fill: '#000'})

    bombs = this.physics.add.group();
    
    this.physics.add.colider(bombs,platforms);

    this.physics.add.colider(player,bombs,hitBomb, null, this);
};



function update() {

    // Las siguientes tres líneas son para reiniciar al juego, pueden ser marcadas como comentario para detener el juego
if(gameOver){
    return
}

        if(cursors.left.isDown){
            player.setvelocityx(-160);
            player.anims.play('left', true);
         } else if(cursors.right.isDown) {
            player.setvelocityX(160);
            player.anims.play('right', true);
         } else{
            player.setvelocityX(0);
            player.anims.play('turn');
        if(cursors.up.isDown && player.body.touching.down)
            player.setvelocityY(-330);
        }
}


function collectStar(player,star){
    star.disableBody(true,true);
    
    score+=10;
    scoreText.setText('Score: '+score);

    if(starts.countActive(true)=== 0){
        stars.children.iterate(function(child){
            child.enableBody(true, child.x, 0, true, true);
        });       
        
        var x = (player.x < 400) ? Phaser.Math.Between(400,800): Phaser.Math.Between(0, 400);
        
        var bomb = bombs.create(x,16,'bomb');
        bomb.setBounce(1);
        bomb.setCollideworldBounds(true);
        bomb.setvelocity(Phaser.Math.Between(-200,200),20);
    }
}

function hitBombs(player,bomb){
    this.physics.pause();
    player.settint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
    
}