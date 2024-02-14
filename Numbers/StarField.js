class StarField {
    constructor() {
        this.numStars = 133; // Number of stars
        this.stars = [];
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push(new Star());
        }
        this.stars.forEach(star => {
            star.reset();
        });
    }
    update() {
        ctx.fillStyle = "white";
        this.stars.forEach(star => {
            star.update();
            star.draw();
            if (star.isOut) {
                star.reset();
            }
        });
    }
}