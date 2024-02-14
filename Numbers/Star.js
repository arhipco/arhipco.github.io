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