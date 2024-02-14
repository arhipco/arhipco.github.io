class Star {
    constructor() {
        this.x;
        this.y;
        this.dx;
        this.dy;
        this.size;
        this.speed;
        this.maxSpeed = 2; // Maximum speed of stars
        this.minSize = 1; // Minimum size of stars
        this.maxSize = 4; // Maximum size of stars
        this.isOut = false;
    }
    reset() {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * Math.min(canvas.width, canvas.height) / 2;
        this.x = canvas.width / 2 + radius * Math.cos(angle);
        this.y = canvas.height / 2 + radius * Math.sin(angle);
        this.dx  = this.x - canvas.width / 2;
        this.dy  = this.y - canvas.height / 2;
        this.size = this.minSize + Math.random() * (this.maxSize - this.minSize);
        this.speed = Math.random() * this.maxSpeed;
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