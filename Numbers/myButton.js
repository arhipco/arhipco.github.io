class myButton {
    constructor(x, y, r, text, fontSize) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.fontSize = fontSize;
        this.text = text;
        this.color = 'orange';
        this.textColor = 'green';
        this.clicked = false;
        this.isHovered = false;
        this.hoverColor = 'gold';
    }
    isMouseInsideButton(x, y) {
        const distance = Math.hypot((x - this.x),(y - this.y));
        return distance <= this.r;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = this.textColor; // print button text 
        ctx.font = "bold " + this.fontSize + "px Courier";
        let textWidth = ctx.measureText(this.text).width;
        ctx.fillText(this.text, this.x - textWidth / 2, this.y + this.fontSize / 3.5);
    }
}