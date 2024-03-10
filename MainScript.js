
var bird;
var walls = [];

var jumps = 0;
var score = 0;

var loss = false;
var deaths = 0;
var deathCounted = false;

let img;
let imgX = 0;
function preload() {
  img = loadImage('cloud.png');
}

function setup() {

    if (windowWidth / 2 > 400) {
        var canW = windowWidth / 2;
    } else {
        var canW = 400;
    }
    var cnv = createCanvas(canW, windowHeight);
    bird = new Bird();
}


var genRateB = 0

function draw() {
    background(140, 240, 240);
    image(img, imgX, 0, 0, windowHeight - 80);
    imgX -= 0.5;

    bird.applyForce(createVector(0, 0.8));

    bird.update();
    bird.render();

    for (var i = 0; i <= walls.length - 1; i++) {
        walls[i].update();

        if (walls[i].pos.x > bird.pos.x) {

            if (bird.pos.y < walls[i].openingTop) {
                walls[i].color1 = "red";

                if (walls[i].pos.x < bird.pos.x) {
                    loss = true;
                }

            } else {
                walls[i].color1 = "gray"
            }

            if (bird.pos.y > walls[i].openingBottom) {
                walls[i].color2 = "red";

            } else {
                walls[i].color2 = "gray"
            }

        } else {
            walls[i].color1 = "gray";
            walls[i].color2 = "gray";
        }

        walls[i].render();

        if (bird.pos.x < walls[i].pos.x + 50) {
            if (bird.pos.x > walls[i].pos.x - 20 && bird.pos.x < walls[i].pos.x + 20) {

                if (bird.pos.y > walls[i].openingBottom) {
                    loss = true;
                }

                if (bird.pos.y < walls[i].openingTop) {
                    loss = true;
                }

            }
        }

        if (bird.pos.x > walls[i].pos.x ) {
            if (walls[i].addPoint == 1) {
                score++;
                walls[i].addPoint = 0;
            }
        }

        if (-500 > walls[i].pos.x) {
            walls.splice(i, 1)
            loss = false;
        }
    }

    if (genRateB == 100) {
        walls.push(new Wall(random(100, windowHeight - 200)));
        genRateB = 0;
    }
    genRateB++;

    // walls[0].update();
    // walls[0].render();
    if (loss) {
        score = 0;
        if (!deathCounted) {
            deaths++;
            deathCounted = true;
        }
    } else {
        deathCounted = false;
    }

    fill(160, 200, 160);
    rect(0, windowHeight - 80, windowWidth, windowHeight);

    push();
    fill(51);
    stroke(51);
    strokeWeight(2);
    textSize(25);
    text("Jumps = " + jumps, 20, 25);
    text("Score = " + score, 20, 50);
    //text("Dead = " + loss, 20, 75);
    text("Deaths = " + deaths, 20, 75);

    
    textSize(20);
    text("fps = " + fps, 50, windowHeight - 20);
    
    
    pop();

}

const times = [];
let fps;

function refreshLoop() {
    window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        fps = times.length;
        //console.log(fps);
        refreshLoop();
    });
}

refreshLoop();

class Wall {
    constructor(openingPos) {
        this.pos = createVector(windowWidth, 0);
        this.width = 20;
        this.color1 = "gray";
        this.color2 = "gray";

        this.addPoint = 1;

        this.gap = 150;

        this.openingPos = openingPos;

        this.openingTop = this.openingPos - (this.gap / 2);
        this.openingBottom = this.openingPos + (this.gap / 2);

        this.bottom = {
            topLeft: createVector(this.openingBottom - this.width / 2, this.openingBottom),
            bottomRight: createVector(this.openingBottom + this.width / 2, this.openingBottom),
        }
    }

    update() {
        this.pos.x -= 4;

        this.openingTop = this.openingPos - (this.gap / 2);
        this.openingBottom = this.openingPos + (this.gap / 2);

        this.bottom = {
            topLeft: createVector(this.pos.x - this.width / 2, this.openingBottom),
            bottomRight: createVector(this.pos.x + this.width / 2, windowHeight),
        }

        this.top = {
            topLeft: createVector(this.pos.x - this.width / 2, 0),
            bottomRight: createVector(this.pos.x + this.width / 2, this.openingTop),
        }
    }

    render() {
        push();
        fill(51);
        stroke(51);
        strokeWeight(3);
        //point(this.pos.x, this.openingPos);

        point(this.pos.x, this.openingTop);
        point(this.pos.x, this.openingBottom);

        rectMode(CORNERS);

        fill(this.color1);
        rect(this.top.topLeft.x, this.top.topLeft.y, this.top.bottomRight.x, this.top.bottomRight.y);

        fill(this.color2);
        rect(this.bottom.topLeft.x, this.bottom.topLeft.y, this.bottom.bottomRight.x, this.bottom.bottomRight.y);

        // rect(this.pos.x,  , this.width, this.height);

        pop();
    }
}

class Bird {
    constructor() {

        this.pos = createVector(200, 0);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxVel = 10;

        this.mass = 2;

        this.height = 10;
        this.width = 20;

        this.jumping = false;
        this.jumpTime = 0;
        this.canJumpAgain = true;

        this.keybindings = {
            up: 87,
            down: 83,
            left: 65,
            right: 68,
            shoot: 71,
            shoot2: 72,
            shoot3: 74
        }

    }

    update() {
        this.movementControls();

        this.vel.add(this.acc);

        if (this.vel.y > this.maxVel) {
            this.vel.y = this.maxVel;
        }

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        if (this.pos.y > windowHeight - 84) {
            this.pos.y = windowHeight - 84 ;
        }

        this.acc.mult(0);



    }

    render() {
        push();
        stroke(0, 0, 0);
        point(this.pos.x, this.pos.y);
        if (loss) {
            fill(255,0,0);
        } else {
            fill(0,255,0);
        }
        //rectMode(CENTER);
        ellipse(this.pos.x, this.pos.y, this.width, this.width);

        fill(0, 255, 0);
        text("x " + this.pos.x + "  y " + this.pos.y, this.pos.x, this.pos.y - 30);


        pop();
    }

    applyForce(force) {
        let f = p5.Vector.div(force, this.mass);
        this.acc.add(f);
    }

    movementControls() {
        var upPressed = false;

        if (mouseIsPressed || keyIsDown(this.keybindings.up) || keyIsDown(32) ) {
            upPressed = true;
        }

        if (upPressed && !this.pastUpArrow) { //this.col.bottom == true
            jumps += 1;
            this.vel = createVector(0, -7);
            this.jumping = true;
            this.jumpTime = 0;
        }

        if (mouseIsPressed || keyIsDown(this.keybindings.up) || keyIsDown(32) ) {
            this.pastUpArrow = true;
        } else {
            this.pastUpArrow = false;
        }


    }
}