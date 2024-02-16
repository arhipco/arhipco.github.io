class Particle {
    constructor(canvas, player, number) {
        this.canvas = canvas;
        this.player = player;
        this.number = number;
        this.onTop = false;
        this.radius;
        this.minimalRadius = 20;
        this.minRadius = Math.min(this.canvas.width, this.canvas.height) / 20;
        this.maxRadius = Math.min(this.canvas.width, this.canvas.height) / 10;
        this.x = 0;
        this.y = 0;
        this.isSelected;
        this.reset();

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
        context.font = "normal " + this.radius + "px Courier";
        context.textBaseline = 'middle';
        context.textAlign = "center";
        context.fillStyle = 'black'; // print Number
        context.fillText(this.number, this.x, this.y);
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
            if (this.x != this.player.width / 2) {
                this.vx = (this.player.width / 2 - this.x) / 200;
            }
            if (this.y != this.player.height / 2) {
                this.vy = (this.player.height / 2 - this.y) / 200;
            }
            this.radius = this.minRadius;
        }
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < this.radius) this.vx = Math.abs(this.vx);
        if (this.x > this.player.width - this.radius) this.vx = -Math.abs(this.vx);
        if (this.y < this.radius) this.vy = Math.abs(this.vy);
        if (this.y > this.player.height - this.radius) this.vy = -Math.abs(this.vy);
    }
    reset() {
        if (this.number == this.player.currentNumber) {
            this.isSelected = true;
        } else {
            this.isSelected = false;
        }

        this.radius = this.maxRadius - (this.maxRadius - this.minRadius) / this.player.particles.length * (this.number - 1);
        if (this.radius < this.minRadius) this.radius = this.minRadius;
        this.x = this.radius + Math.random() * (this.player.width - this.radius * 3);
        this.y = this.radius + Math.random() * (this.player.height - this.radius * 3); // baseRadius?
        this.vx = Math.random() * this.player.speed - this.player.speed * 0.5;
        this.vy = Math.random() * this.player.speed - this.player.speed * 0.5;
    }
}