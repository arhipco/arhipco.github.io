const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
 
const gradient = ctx.createLinearGradient(0,0,canvas.width, canvas.height);
gradient.addColorStop(0, 'white');
gradient.addColorStop(0.5, 'gold');
gradient.addColorStop(1, 'orangered');
ctx.fillStyle = gradient;
ctx.strokeStyle = 'white';
ctx.font = "bold 20px Courier";
let currentNumber = 1;
let resetGame = false;

let printTXT = "Order numbers";

class Particle {
    constructor(player, number){
        this.player = player;
        this.number = number;
        this.ratioIndex = 50;
        this.radius = 0;
        this.x = 0;
        this.y = 0;
        this.isSelected = false;
        this.reset();
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        if (this.vx == 0) this.vx = 1;
        if (this.vy == 0) this.vy = 1;
    }
    draw(context){
        if(this.isSelected){
            context.fillStyle = "green";
        }else{
            context.fillStyle = gradient;
        } 
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.fillStyle = 'black'; // print Number
        context.fillText(this.number, this.x - (5 * this.number.toString().length), this.y + 5); 
        //context.stroke();
    }
    update(){
        if(player.mouse.pressed){ 
            const distance = Math.hypot((player.mouse.x - this.x),(player.mouse.y - this.y));

            if (distance <= this.radius){
                if(this.number == currentNumber + 1) {
                    currentNumber++;
                    this.isSelected = true;
                }else if(!resetGame && !this.isSelected){ 
                    resetGame = true; 
                } 
            }
        }
        if(this.isSelected){
            this.radius = this.player.width / this.ratioIndex + 20;
        }
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < this.radius) this.vx = Math.random();
            
        if ( this.x > this.player.width - this.radius) this.vx = -Math.random(); 
        
        if (this.y < this.radius) this.vy = Math.random();
            
        if ( this.y > this.player.height - this.radius) this.vy = -Math.random();
    }
    reset(){
        if(this.number == currentNumber){
            this.isSelected = true;
        }else{
            this.isSelected = false;
        }
        
        this.radius = Math.floor(Math.random() * 10 + this.player.width / this.ratioIndex);
        this.x = this.radius + Math.random() * (this.player.width - this.radius * 3);
        this.y = this.radius + Math.random() * (this.player.height - this.radius * 3); // baseRadius?
    }
}

class Player {
    constructor(canvas, context){
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 10;
        this.createParticles();
        this.level = 1;

        this.mouse = {
            x: 0,
            y: 0,
            pressed: false
        }

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
    }
    createParticles(){
        for (let i = 0; i < this.numberOfParticles; i++){
            this.particles.push(new Particle(this, i+1));
        }
    }
    updateParticles(context){
        context.fillStyle = 'yellow';
        context.fillText((printTXT), 30, this.canvas.height - 20);
        if(resetGame){
            this.resize(this.canvas.width, this.canvas.height);
        }
        this.connectParticles(context);
        this.connectSelected(context);
         
        ctx.font = "bold 20px Courier";
        let countSelected = 0;
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
            if(particle.isSelected) countSelected++;
        });
        
        if(countSelected == this.numberOfParticles){
            this.level++; // NEXT LEVEL
            this.particles = [];
            this.numberOfParticles *= this.level;
            this.createParticles();
            this.resize(this.canvas.width, this.canvas.height);
        }
    }
    connectSelected(context){
        context.save();
        context.strokeStyle = 'green';
        
        for (let a = 0; a < this.particles.length -1; a++){
            if(this.particles[a].isSelected && this.particles[a + 1].isSelected){
               context.strokeWidth = 15;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[a + 1].x, this.particles[a + 1].y);
                    context.lineTo(this.particles[a].x + 2, this.particles[a].y + 2);
                    context.stroke();
            }
        }
        context.restore(); 
    }
    connectParticles(context){
        const maxDistance = 300;
        for (let a = 0; a < this.particles.length; a++){
            for (let b = a; b < this.particles.length; b++){
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                if (distance < maxDistance){
                    context.save();
                    const opacity = 1 - (distance/maxDistance);
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
    resize(width, height){
        resetGame = false;
        currentNumber = 1;
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        const gradient = this.context.createLinearGradient(0,0, width, height);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(0.5, 'gold');
        gradient.addColorStop(1, 'orangered');
        this.context.fillStyle = gradient;
        this.context.strokeStyle = 'white';
        this.particles.forEach(particle => {
            particle.reset();
        });
    }
}
const player = new Player(canvas, ctx);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.updateParticles(ctx);
    requestAnimationFrame(animate);
}
animate();