const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 
const ctx = canvas.getContext('2d');

const numStars = 400; // Number of stars
const maxDepth = 1000; // Maximum depth of stars
const minSize = 0.2; // Minimum size of stars
const maxSize = 4; // Maximum size of stars

class Star {
    constructor(x, y, z, size){
        this.x = x;
        this.newX;
        this.y = y; 
        this.newY; 
        this.z = z;
        this.size = size;
        this.newSize = size;
        this.scaleFactor = 1;
    }
    
    update(){
        this.scaleFactor = 2 * maxDepth / (maxDepth + this.z); 
        this.newX = canvas.width / 2 + (this.x - canvas.width / 2) * this.scaleFactor;
        this.newY = canvas.height / 2 + (this.y - canvas.height / 2) * this.scaleFactor; 
        this.newSize = this.size * this.scaleFactor;
        this.z -= 10;
        if (this.newX < 0 || this.newX > canvas.width) {
            this.z = maxDepth;
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
        }    
    }
    draw(){
        ctx.fillRect(this.newX, this.newY, this.newSize, this.newSize);
        ctx.strokeStyle = 'yellow';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }
}

function animate(timestamp)  
{
    const deltaTime = timestamp - lastFrameTime;
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    stars.forEach(star => {
        star.update();
        star.draw();
    });
       
    lastFrameTime = timestamp;
    requestAnimationFrame(animate);
}
 
let stars = [];    
for (let i = 0; i < numStars; i++) { 
      addNewStar();
}    
function addNewStar(){
    stars.push(new Star(Math.random() * canvas.width,
                        Math.random() * canvas.height,
                        Math.random() * maxDepth,
                        Math.random() + minSize));
}
let lastFrameTime = 0;   
requestAnimationFrame(animate);  
