class PopUp {
    constructor(player) {
        // таймер и таблицу времён засунуть в ПопАп окошко
        // 
        this.player = player;
        this.width = this.player.canvas.width;
        this.height = this.player.canvas.height;
        this.minDimension = Math.min(this.width, this.height); 
        this.x = this.minDimension/4;
        this.y = this.minDimension / 4; 
        this.radius = this.minDimension / 24;
        this.ctx = this.player.context;

        this.currentTime;
        this.isOpened = false;
        this.timeStats = null;
        this.timeStats = new Stats(); 

        this.timeStats.loadGameTimes();
    }
    openPopUp(level,time) {
        if(!this.isOpened) {
            this.isOpened = true;
            this.level = level;
            this.currentTime = time; // SHOW PopUp with Current Time in SECONDS
            this.timeStats.addGameTime(this.player.level, this.currentTime);
        }
        this.draw();
    }

    draw(){
        this.ctx.fillStyle = this.gradient;

        this.ctx.globalAlpha = 0.5;
        this.drawRoundedRect(this.x, this.y,
            this.minDimension / 3 + this.x,
            this.minDimension / 3 + this.y,
            this.radius);
        this.ctx.globalAlpha = 1;   
    }
    drawRoundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.arcTo(x + width, y, x + width, y + height, radius);
        this.ctx.arcTo(x + width, y + height, x, y + height, radius);
        this.ctx.arcTo(x, y + height, x, y, radius);
        this.ctx.arcTo(x, y, x + width, y, radius);
        this.ctx.closePath(); 
        this.ctx.fill();
        this.ctx.fillStyle = 'black'; 
        this.ctx.font = "bold " + this.radius + "px Courier";
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = "center";
        this.ctx.fillText(" Times of " + gameHardness + " : " + this.player.level, this.x * 2, this.y * 1.3);

        this.timeStats.printTimes(this.currentTime, this.player.level, ctx, this.x * 2 ,this.y * 1.5 + this.radius, this.radius );
 
    }

}