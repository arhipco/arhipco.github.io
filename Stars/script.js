const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 
const ctx = canvas.getContext('2d');
 
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'yellow';
ctx.font = "bold 30px Courier";  

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

function animate(timestamp)  
{
    const deltaTime = timestamp - lastFrameTime;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    stars.forEach(star => {
        star.update();
        star.draw();
        if(star.isOut){
            stars.splice(stars.indexOf(star), 1);
            addNewStar();
        } 
    });
       
    lastFrameTime = timestamp;
    requestAnimationFrame(animate);
}
 
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