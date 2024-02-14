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