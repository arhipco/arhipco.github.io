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
    isMouseInsideButton(x, y){
        const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
        return distance <= this.r;
    }

    isMouseEntered(){
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
    constructor(){
        this.numStars = 133; // Number of stars
        this.maxSpeed = 2; // Maximum speed of stars
        this.minSize = 1; // Minimum size of stars
        this.maxSize = 4; // Maximum size of stars
        this.stars = []; 
        for (let i = 0; i < this.numStars; i++) { 
            this.addNewStar();
        } 
    }
    addNewStar(){
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
    update(){
        ctx.fillStyle = "white";
        this.stars.forEach(star => {
            star.update();
            star.draw();
            if(star.isOut){
                this.stars.splice(this.stars.indexOf(star), 1);
                this.addNewStar();
            } 
        });
    }
}
class Star {
    constructor(x, y, dx, dy, size, speed){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.speed = speed;
        this.isOut = false;
    }
    
    update(){
        const distanceToCenter = Math.hypot(this.dx, this.dy);
        this.x += this.dx / distanceToCenter * this.speed;
        this.y += this.dy / distanceToCenter * this.speed;
        if(this.x > canvas.width || this.x < 0 ||
            this.y > canvas.height || this.y < 0) {
                this.isOut = true;}
    }
    draw(){
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

class Particle {
    constructor(player, number) {
        this.player = player;
        this.number = number;
        this.ratioIndex = 50;
        this.radius = 0;
        this.x = 0;
        this.y = 0;
        this.isSelected = false;
        this.reset();
        this.vx = Math.random() * player.speed - player.speed * 0.5;
        this.vy = Math.random() * player.speed - player.speed * 0.5;
        //if (this.vx == 0) this.vx = 1;
        //if (this.vy == 0) this.vy = 1;
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
        context.fillStyle = 'black'; // print Number
        context.fillText(this.number, this.x - (5 * this.number.toString().length), this.y + 5);
    }
    update() {
        if (this.player.mouse.pressed) {
            const distance = Math.hypot((this.player.mouse.x - this.x), (this.player.mouse.y - this.y));

            if (distance <= this.radius) {
                if (this.number == this.player.currentNumber + 1) {
                    player.currentNumber++;
                    this.isSelected = true;
                } else if (!player.resetGame && !this.isSelected) {
                    player.resetGame = true;
                }
            }
        }
        if (this.isSelected) {
            this.radius = this.player.width / this.ratioIndex + 20;
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

        this.radius = Math.floor(Math.random() * 10 + this.player.width / this.ratioIndex);
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
        this.amountParticles = 10;
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
            if(e.key == 'm') this.toggleMusic();
        });
    }
    toggleMusic() {
        this.bgMusic = document.getElementById('bg-music'); 
        if(this.bgMusic.paused) {
          this.bgMusic.play();  
        } else {
          this.bgMusic.pause();
        }
      }
    createParticles() {
        for (let i = 0; i < this.amountParticles; i++) {
            this.particles.push(new Particle(this, i + 1));
        }
    }
    startNewLevel(){
        this.speed = Math.floor(this.level/2);
        this.amountParticles = (this.level-this.speed)*this.complexity // где complexity = 2 для лёгкого и 10 для сложного
    
        this.context.font = "bold 20px Courier";
        this.currentNumber = 1;
        this.resetGame = false;

        this.printTXT = "Press 'm' to play/pause music. Looking number: ";
        this.createParticles();
        this.resize(this.canvas.width, this.canvas.height);
    }
    updateParticles(context) {
        this.context.fillStyle = 'yellow';
        this.context.fillText(this.printTXT + (this.currentNumber + 1) + "   Level: " + this.level, 30, this.canvas.height - 20);
        if (this.resetGame) {
            this.resize(this.canvas.width, this.canvas.height);
        }
        this.connectParticles(context);
        this.connectSelected(context);

        this.context.font = "bold 20px Courier";
        let countSelected = 0;
        this.particles.forEach(particle => {

            context.strokeStyle = 'blue';
            particle.draw(context);
            particle.update();
            if (particle.isSelected) countSelected++;
        });

        if (countSelected == this.amountParticles) {
            this.level++; // NEXT LEVEL
            this.particles = [];
            this.startNewLevel();
        }
    }
    connectSelected(context) {
        context.save();
        context.strokeStyle = 'green';

        for (let a = 0; a < this.particles.length - 1; a++) {
            if (this.particles[a].isSelected && this.particles[a + 1].isSelected) {
                context.strokeWidth = 15;
                context.beginPath();
                context.moveTo(this.particles[a].x, this.particles[a].y);
                context.lineTo(this.particles[a + 1].x, this.particles[a + 1].y);
                //context.lineTo(this.particles[a].x + 2, this.particles[a].y + 2);
                context.stroke();
            }
        }
        context.restore();
    }
    connectParticles(context) {
        const maxDistance = 300;

        context.strokeStyle = 'white';
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
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
myButtons.push(new myButton(canvas.width / 2, canvas.height / 2 , 50, 'Normal'));
myButtons.push(new myButton(canvas.width / 2 + 100, canvas.height / 2 + 100 , 50, 'Hard'));

// Handle mouse click event on Buttons
document.addEventListener('mousemove', function(event) {
    const mouseX = event.clientX; // X-coordinate relative to the viewport
    const mouseY = event.clientY; // Y-coordinate relative to the viewport
    myButtons.forEach(button => {
        if (button.isMouseInsideButton(mouseX, mouseY)) {
            button.color = 'gold';
        } else {
            button.color ='orange';
        }
    });
});
document.addEventListener('click', function(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    let complexity = 2;
    myButtons.forEach(button => {
        if (button.isMouseInsideButton(mouseX, mouseY)) {
            if(button.text == 'Easy') {
                console.log('Easy Clicked!');
                complexity = 2;
            }
            if(button.text == 'Normal') {
                console.log('Normal Clicked!');
                complexity = 5;
            }
            if(button.text == 'Hard') {
                console.log('Hard Clicked!');
                complexity = 10;
            }
            GameIsStarted = true;
            player = new Player(canvas, ctx, complexity);
        }
    });
    
});

const starField = new StarField();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    starField.update();
    if(GameIsStarted == true) {
        player.updateParticles(ctx);
    }else{
        myButtons.forEach(button => {
            button.draw();
        });
    }
    
    requestAnimationFrame(animate);
}
animate();