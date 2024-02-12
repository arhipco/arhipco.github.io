const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'white');
gradient.addColorStop(0.5, 'gold');
gradient.addColorStop(1, 'orangered');
ctx.fillStyle = gradient;
ctx.strokeStyle = 'blue';

class myButton {
    constructor(x, y, r, text) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.text = text;
        this.color = 'orange';
        this.textColor = 'green';
        this.clicked = false;
        this.isHovered = false;
        this.hoverColor = 'gold';
        this.draw();
    }
    // Check if mouse click is within the button bounds
    isMouseInsideButton(x, y) {
        const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
        return distance <= this.r;
    }

    isMouseEntered() {
        this.x += Math.random() * 10 - 5;
        this.y += Math.random() * 10 - 5;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = this.textColor; // print button text 
        ctx.font = "bold 20px Courier";
        let textWidth = ctx.measureText(this.text).width;
        ctx.fillText(this.text, this.x - textWidth / 2, this.y + 5);
    }
}

class StarField {
    constructor() {
        this.numStars = 133; // Number of stars
        this.maxSpeed = 2; // Maximum speed of stars
        this.minSize = 1; // Minimum size of stars
        this.maxSize = 4; // Maximum size of stars
        this.stars = [];
        for (let i = 0; i < this.numStars; i++) {
            this.addNewStar();
        }
    }
    addNewStar() {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * Math.min(canvas.width, canvas.height) / 2;
        let x = canvas.width / 2 + radius * Math.cos(angle);
        let y = canvas.height / 2 + radius * Math.sin(angle);
        let dx = x - canvas.width / 2;
        let dy = y - canvas.height / 2;
        let size = this.minSize + Math.random() * (this.maxSize - this.minSize);
        let speed = Math.random() * this.maxSpeed;

        this.stars.push(new Star(x, y, dx, dy, size, speed));
    }
    update() {
        ctx.fillStyle = "white";
        this.stars.forEach(star => {
            star.update();
            star.draw();
            if (star.isOut) {
                this.stars.splice(this.stars.indexOf(star), 1);
                this.addNewStar();
            }
        });
    }
}
class Star {
    constructor(x, y, dx, dy, size, speed) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.speed = speed;
        this.isOut = false;
    }

    update() {
        const distanceToCenter = Math.hypot(this.dx, this.dy);
        this.x += this.dx / distanceToCenter * this.speed;
        this.y += this.dy / distanceToCenter * this.speed;
        if (this.x > canvas.width || this.x < 0 ||
            this.y > canvas.height || this.y < 0) {
            this.isOut = true;
        }
    }
    draw() {
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

class Particle {
    constructor(canvas, player, number) {
        this.canvas = canvas;
        this.player = player;
        this.number = number;
        this.onTop = false;
        this.ratioIndex = 30;
        if (this.canvas.width > this.canvas.height) {
            this.ratioIndex = this.canvas.width / 20;
        } else {
            this.ratioIndex = this.canvas.height / 20;
        }
        this.radius;
        this.x = 0;
        this.y = 0;
        this.isSelected = false;
        if(number == 1) this.isSelected = true;
        this.reset();
        this.vx = Math.random() * player.speed - player.speed * 0.5;
        this.vy = Math.random() * player.speed - player.speed * 0.5;
    }
    draw(context) {
        if (this.isSelected) {
            context.fillStyle = "green";
        } else {
            context.fillStyle = gradient;
        }
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.font = "bold " + this.ratioIndex + "px Courier";
        context.fillStyle = 'black'; // print Number
        context.fillText(this.number,
            this.x - (this.ratioIndex / 4 * this.number.toString().length),
            this.y + this.ratioIndex / 4);
    }
    update() {
        if (this.player.mouse.pressed) {
            const distance = Math.hypot((this.player.mouse.x - this.x), (this.player.mouse.y - this.y));

            if (distance <= this.radius) {
                this.player.mouse.pressed = false;
                if (this.number == this.player.currentNumber + 1) {
                    player.currentNumber++;
                    this.isSelected = true;
                } else if (!player.resetGame && !this.isSelected) {
                    player.resetGame = true;
                }
            }
        }
        if (this.isSelected) {
            this.radius = this.ratioIndex * 1.5;
        }
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < this.radius) this.vx = Math.random();
        if (this.x > this.player.width - this.radius) this.vx = -Math.random() * (player.speed - player.speed * 0.5);
        if (this.y < this.radius) this.vy = Math.random();
        if (this.y > this.player.height - this.radius) this.vy = -Math.random() * (player.speed - player.speed * 0.5);
    }
    reset() {
        if (this.number == this.player.currentNumber) {
            this.isSelected = true;
        } else {
            this.isSelected = false;
        }

        this.radius = Math.floor(Math.random() * this.ratioIndex / 5 + this.ratioIndex);
        this.x = this.radius + Math.random() * (this.player.width - this.radius * 3);
        this.y = this.radius + Math.random() * (this.player.height - this.radius * 3); // baseRadius?
    }
}

class Player {
    constructor(canvas, context, complexity) {
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.resetGame = false;
        this.printTXT = " ";
        this.particles = [];
        this.amountParticles;
        this.currentNumber = 1;
        this.level = 1;
        this.speed;
        this.complexity = complexity;
        this.mouse = { x: 0, y: 0, pressed: false }
        this.startNewLevel();
        window.addEventListener('resize', e => {
            this.resize(e.target.window.innerWidth, e.target.window.innerHeight);
        });
        window.addEventListener('touchstart', e => {
            this.mouse.pressed = true;
            this.mouse.x = e.changedTouches[0].pageX;
            this.mouse.y = e.changedTouches[0].pageY;
        });
        window.addEventListener('mousedown', e => {
            this.mouse.pressed = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mouseup', e => {
            this.mouse.pressed = false;
        });
        window.addEventListener('keydown', e => {
            if (e.key == 'm') this.toggleMusic();
        });
    }
    toggleMusic() {
        this.bgMusic = document.getElementById('bg-music');
        if (this.bgMusic.paused) {
            this.bgMusic.play();
        } else {
            this.bgMusic.pause();
        }
    }
    createParticles() {
        for (let i = 0; i < this.amountParticles; i++) {
            this.particles.push(new Particle(this.canvas, this, i + 1));
        }
    }
    startNewLevel() {
        this.speed = Math.floor(this.level / 2);
        this.amountParticles = (this.level - this.speed) * this.complexity // где complexity = 2 для лёгкого и 10 для сложного

        this.currentNumber = 1;
        this.resetGame = false;
        this.createParticles();
        this.resize(this.canvas.width, this.canvas.height);
    }
    updateParticles(context) {
        this.context.fillStyle = 'green';
        this.context.font = "bold " + this.canvas.width / 30 + "px Courier";
        this.context.fillText("Looking number: " + (this.currentNumber + 1), 10, this.canvas.width / 30);
        this.context.fillText("Level: " + this.level, this.canvas.width / 2, this.canvas.width / 30);
        this.context.fillText("Press 'm' to play/pause music.", 10, this.canvas.height - 10);
        if (this.resetGame) {
            this.resize(this.canvas.width, this.canvas.height);
        }
        this.connectParticles(context);
        this.connectSelected(context);

        let countSelected = 0;

        // move next particle to top
        this.particles.forEach(particle => {
            particle.onTop = false;
            if (this.currentNumber + 1 == particle.number) {
                particle.onTop = true;
                const index = this.particles.indexOf(particle);
                this.particles.splice(index, 1);
                this.particles.push(particle);
            }
        });

        this.particles.forEach(particle => {
            context.strokeStyle = 'blue';
            particle.draw(context);
        });

        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].isSelected) countSelected++;
        }
        if (countSelected == this.amountParticles) {
            this.level++; // NEXT LEVEL
            this.particles = [];
            this.startNewLevel();
        }
    }
    connectSelected(context) {
        /* context.save();
        context.strokeStyle = 'green';
        context.lineWidth = 3;

        for (let a = 0; a < this.particles.length - 1; a++) {
            if (this.particles[a].isSelected && this.particles[a + 1].isSelected) {
                context.beginPath();
                context.moveTo(this.particles[a].x, this.particles[a].y);
                context.lineTo(this.particles[a + 1].x, this.particles[a + 1].y);
                context.stroke();
            }
        }
        context.restore(); */
    }
    connectParticles(context) {
        const maxDistance = 300;
        context.lineWidth = 3;
        context.strokeStyle = 'white';
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                
                if (this.particles[a].isSelected && this.particles[b].isSelected) {
                    if(this.particles[a].number == this.particles[b].number-1) {
                        context.save();
                        context.strokeStyle = 'green';
                        context.beginPath();
                        context.moveTo(this.particles[a].x, this.particles[a].y);
                        context.lineTo(this.particles[b].x, this.particles[b].y);
                        context.stroke();
                        context.restore();
                    }
                }



                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                if (distance < maxDistance) {
                    context.save();
                    const opacity = 1 - (distance / maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    }
    resize(width, height) {
        this.resetGame = false;
        this.currentNumber = 1;
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        const gradient = this.context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(0.5, 'gold');
        gradient.addColorStop(1, 'orangered');
        this.context.fillStyle = gradient;
        this.context.strokeStyle = 'blue';
        this.particles.forEach(particle => {
            particle.reset();
        });
    }
}

let GameIsStarted = false;
let player = null;
let myButtons = [];
myButtons.push(new myButton(canvas.width / 2 - 100, canvas.height / 2 - 100, 50, 'Easy'));
myButtons.push(new myButton(canvas.width / 2, canvas.height / 2, 50, 'Normal'));
myButtons.push(new myButton(canvas.width / 2 + 100, canvas.height / 2 + 100, 50, 'Hard'));


// Handle mouse click event on Buttons
document.addEventListener('mousemove', function (event) {
    if (!GameIsStarted) {
        const mouseX = event.clientX; // X-coordinate relative to the viewport
        const mouseY = event.clientY; // Y-coordinate relative to the viewport
        myButtons.forEach(button => {
            if (button.isMouseInsideButton(mouseX, mouseY)) {
                button.color = 'gold';
            } else {
                button.color = 'orange';
            }
        });
    }
});
document.addEventListener('click', function (event) {
    if (!GameIsStarted) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
        let complexity = 2;
        myButtons.forEach(button => {
            if (button.isMouseInsideButton(mouseX, mouseY)) {
                if (button.text == 'Easy') {
                    complexity = 2;
                }
                if (button.text == 'Normal') {
                    complexity = 5;
                }
                if (button.text == 'Hard') {
                    complexity = 10;
                }
                GameIsStarted = true;
                player = new Player(canvas, ctx, complexity);
            }
        });
    }
});

const starField = new StarField();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    starField.update();
    if (GameIsStarted == true) {
        player.updateParticles(ctx);
    } else {
        myButtons.forEach(button => {
            button.draw();
        });
    }

    requestAnimationFrame(animate);
}
animate();