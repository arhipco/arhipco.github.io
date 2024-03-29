class Player {
    constructor(canvas, context, complexity) {
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.resetGame = false;
        this.printTXT = " ";
        this.particles = [];
        this.amountParticles;
        this.currentNumber = 0;
        this.level = 1;
        this.speed;
        this.complexity = complexity;
        this.timer = null;
        this.timer = new Timer();
        this.timer.start();
    }
    toggleMusic() {
        this.bgMusic = document.getElementById('bg-music');
        if (this.bgMusic.paused) {
            this.bgMusic.play();
        } else {
            this.bgMusic.pause();
        }
    }
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.amountParticles; i++) {
            this.particles.push(new Particle(this.canvas, this, i + 1));
        }
    }
    startNewLevel() {
        //this.level = 25;
        
        this.timer.reset();
        this.timer.start();
        
        this.speed = Math.floor(this.level / 2);
        this.amountParticles = Math.floor((this.level - this.speed) * this.complexity);
        // где complexity = 2 для лёгкого и 10 для сложного

        this.currentNumber = 0;
        this.resetGame = false;
        this.createParticles();
        this.resize(this.canvas.width, this.canvas.height);
    }

    updateParticles(context) {
        if (this.resetGame) {
            this.resize(this.canvas.width, this.canvas.height);
        }
        this.connectParticles(context);
        let countSelected = 0;

        // move next particle to top
        this.particles.forEach(particle => {
            particle.onTop = false;
            if (this.currentNumber + 1 == particle.number) {
                particle.onTop = true;
                const index = this.particles.indexOf(particle);
                this.particles.splice(index, 1);
                this.particles.push(particle);
            }
        });
        context.strokeStyle = 'blue';
        context.globalAlpha = 0.9;
        this.particles.forEach(particle => {
            particle.draw(context);
        });
        context.globalAlpha = 1;
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].isSelected) countSelected++;
        }
        if (countSelected == this.amountParticles && transitionEffect == false) {
            // открываем ПопАп и передаём туда уровень и текущее время
            transitionEffect = true;
            this.timer.stop();
            this.particles = [];
            setTimeout(function() {
                GameState = "popup"; 
            }, 200);
            
        }
        this.showInfoText();
    }
    showInfoText() {
        let q = this.canvas.width / 20;

        this.context.fillStyle = 'green';
        this.context.textAlign = "left";
        this.context.font = "bold " + q / 1.2 + "px Courier";
        this.context.fillText("Next number: " + (this.currentNumber + 1), 10, this.canvas.width / 30);
        this.context.fillText("Level: " + this.level, this.canvas.width / 2, this.canvas.width / 30);
        this.context.fillText("play/pause music.", q * 1.5, this.canvas.height - q + q / 4);
        this.context.textAlign = "right";
        this.context.fillText(this.timer.getTimeAsText() + " ",  this.canvas.width, this.canvas.width / 30);
        this.context.fillText("restart game ", this.canvas.width, this.canvas.height - q + q / 4);
    }

    connectParticles(context) {
        const maxDistance = Math.max(this.canvas.width, this.canvas.height) / 4;
        context.lineWidth = 3;
        context.strokeStyle = 'white';
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                if (this.particles[a].isSelected && this.particles[b].isSelected) {
                    if (this.particles[a].number == this.particles[b].number - 1) {
                        context.save();
                        context.strokeStyle = 'green';
                        context.beginPath();
                        context.moveTo(this.particles[a].x, this.particles[a].y);
                        context.lineTo(this.particles[b].x, this.particles[b].y);
                        context.stroke();
                        context.restore();
                    }
                }
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                if (distance < maxDistance) {
                    context.save();
                    const opacity = 1 - (distance / maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    }
    resize(width, height) {
        this.resetGame = false;
        this.currentNumber = 0;
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        const gradient = this.context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(0.5, 'gold');
        gradient.addColorStop(1, 'orangered');
        this.context.fillStyle = gradient;
        this.context.strokeStyle = 'blue';
        this.particles.forEach(particle => {
            particle.reset();
        });
    }
}