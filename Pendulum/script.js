const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 
const ctx = canvas.getContext('2d');
 
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'yellow';
ctx.font = "bold 30px Courier";
ctx.fillText("CLICK ME", canvas.width / 2 - 60, canvas.height / 2);

let audio1 = new Audio(); audio1.src = 'a1.mp3';
let audio2 = new Audio(); audio2.src = 'a2.mp3';
let audio3 = new Audio(); audio3.src = 'a3.mp3';
let audio4 = new Audio(); audio4.src = 'a4.mp3';

let isStarted = false;

const numStars = 133; // Number of stars
const maxSpeed = 2; // Maximum speed of stars
const minSize = 1; // Minimum size of stars
const maxSize = 4; // Maximum size of stars

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
class Pendulum{
        constructor(length, startAngle, size, color){
            // Pendulum parameters
            this.angleV = 0;
            this.angleA = 0;
            this.gravity = 0.02;
            this.origin = { x: canvas.width / 2, y: 100 };  
            this.angle = Math.PI / 2;
            this.bob = { x: 0, y: 0, s: size };
            this.len = length; 
            this.color = color;
        }

        update(){
            let force = this.gravity * Math.sin(this.angle);
            this.angleA = (-1 * force) / this.len;
            this.angleV += this.angleA;
            this.angle += this.angleV;
            this.bob.x = this.len * Math.sin(this.angle) + this.origin.x;
            this.bob.y = this.len * Math.cos(this.angle) + this.origin.y;

            if(this.bob.x < canvas.width / 2 + 5 &&
               this.bob.x > canvas.width / 2 - 5 ) {
                if(this.len == 400 ) audio1.play();
                if(this.len == 300 ) audio2.play();
                if(this.len == 200 ) audio3.play();
                if(this.len == 100 ) audio4.play();  
            }
        }

        draw(){
            ctx.strokeWidth = 5;
            ctx.beginPath();
            ctx.moveTo(this.origin.x, this.origin.y);
            ctx.lineTo(this.bob.x, this.bob.y);
            ctx.arc(this.bob.x, this.bob.y, this.bob.s, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            }
    }
addEventListener('click', function(){
    if(!isStarted) {
        isStarted = true;

    function animate(timestamp)  
    {
        const deltaTime = timestamp - lastFrameTime;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        pendulums.forEach(pend => {
            pend.update();
            pend.draw();
        });
        
        ctx.fillStyle = "white";
        stars.forEach(star => {
            star.update();
            star.draw();
            if(star.isOut){
                stars.splice(stars.indexOf(star), 1);
                addNewStar();
            } 
        });
                
        ctx.fillRect(canvas.width / 2, 0, 4, canvas.height); // middle line
        ctx.fillStyle = 'yellow';
        ctx.font = "bold 18px Courier";
        ctx.fillText("Pendulum Bells v.1.0. Code by Arhipco", canvas.width / 2 + 10, 20);
        lastFrameTime = timestamp;
        requestAnimationFrame(animate);
    }

    let pendulums = [];
    pendulums.push(new Pendulum(100, 90, 20, "red"));
    pendulums.push(new Pendulum(200, 45, 30, "green"));
    pendulums.push(new Pendulum(300, 90, 40, "blue"));
    pendulums.push(new Pendulum(400, -45, 50, "yellow"));
        
    //////////////  
    let stars = [];    
    for (let i = 0; i < numStars; i++) { 
        addNewStar();
    }    
    function addNewStar(){
        const angle = Math.random() * Math.PI * 2; 
        const radius = Math.random() * Math.min(canvas.width, canvas.height) / 2;
        let x = canvas.width / 2 + radius * Math.cos(angle);
        let y = canvas.height / 2 + radius * Math.sin(angle);
        let dx = x - canvas.width / 2;
        let dy = y - canvas.height / 2;
        let size = minSize + Math.random() * (maxSize - minSize);
        let speed = Math.random() * maxSpeed;
        
        stars.push(new Star(x, y, dx, dy, size, speed));
    }
    let lastFrameTime = 0;   
    requestAnimationFrame(animate);  
    }
}); 