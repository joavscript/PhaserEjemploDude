import Phaser from "phaser";

class Escena extends Phaser.Scene{

    platforms = null;
    player = null;
    cursors = null;
    stars = null;
    score = 0;
    scoreText;
    bomb = null;
    gameOver = false;

    preload() {
        this.load.image('sky', 'img/sky.png');
        this.load.image('ground', 'img/platform.png');
        this.load.image('star', 'img/star.png');
        this.load.image('bomb', 'img/bomb.png');
        this.load.spritesheet('dude', 'img/dude.png',
        {frameWidth: 32, frameHeight: 48});
        this.load.spritesheet('bird', 'img/crow.png',
        {frameWidth: 200, frameHeight: 205});
      }
    
    create() {
        //creando el fondo del canvas
        this.add.image(400, 300, 'sky');

        //para que las plataformas no se muevan
        this.platforms = this.physics.add.staticGroup();

        //creando la plataforma del piso
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        //creando plataformas chicas
        this.platforms.create(100, 300, 'ground');
        this.platforms.create(450, 450, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player = this.physics.add.sprite(100, 250, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        //Se crean los movimientos para utilizar en update
        this.anims.create({
            key: 'izquierda',
            frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate:10,
            repeat: -1
        });
        this.anims.create({
            key: 'derecha',
            frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRate:10,
            repeat: -1
        });
        this.anims.create({
            key: 'frente',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        //creando estrellas a lo largo del eje x
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 5, //cantidad de estrellas, cuenta desde cero
            setXY: { x:12, y:0, stepX: 60 }
        });
        //genera rebote random de las estrellas
        this.stars.children.iterate( function (child){
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        //colision de player y estrellas con las plataformas
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        //colision para colectar estrellas
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        //Creando el Score o puntaje
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);


      }
    update(){

        if (this.cursors.left.isDown){
            this.player.setVelocityX(-160);

            this.player.anims.play('izquierda', true);
        }
        else if (this.cursors.right.isDown){
            this.player.setVelocityX(160);

            this.player.anims.play('derecha', true);
        }
        else {
            this.player.setVelocityX(0);

            this.player.anims.play('frente');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-280);
        }
        

    }
    //funcion para collectar estrellas
    collectStar(player, star){
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('score: ' + this.score);
        if (this.stars.countActive(true) === 0)
        {
            this.stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            
        }
    }
    hitBomb (player, bomb)
{
    this.physics.pause();

    this.player.setTint(0xff0000);

    this.player.anims.play('turn');

    //this.gameOver = true;
}
}

export default Escena;