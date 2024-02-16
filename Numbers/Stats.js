class Stats {
    constructor() {
        this.gameTime = 0;
        this.levelKey = 1;
        this.gameTimeListElement = document.getElementById("stats");
        this.statLevel = [];
        this.loadGameTimes();
        this.updateTimesBoard();
    }

    loadGameTimes(levelKey) {
        this.levelKey = levelKey;
        const savedTimes = localStorage.getItem(this.levelKey);
        if (savedTimes) {
            this.times = JSON.parse(savedTimes);
        } else {
            this.times = [];
        }
    }

    saveGameTimes(levelKey) {
        this.levelKey = levelKey;
        localStorage.setItem(this.levelKey, JSON.stringify(this.times));
    }

    updateTimesBoard() {
        this.gameTimeListElement.innerHTML = "";
        this.times.forEach((time, index) => {
            const timeElement = document.createElement("div");
            timeElement.textContent = "Time ${index + 1}: ${time}";
            this.gameTimeListElement.appendChild(timeElement);
        });
        console.log(this.times);
    }

    addGameTime(levelKey,newTime) {
        this.times.push(newTime);
        this.times.sort((a, b) => b - a); 
        this.saveGameTimes(levelKey);
        this.updateTimesBoard();
    }
}

