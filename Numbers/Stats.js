class Stats {
    constructor() {
        this.levelKey = 1;
        this.timesEasy = []; // двумерный массив Уровень:Времена
        this.timesNormal = []; // двумерный массив Уровень:Времена
        this.timesHard = []; // двумерный массив Уровень:Времена
        this.currTime;
        let rows = 50;
        let columns = 6;

        // creating two-dimensional array
        for (let i = 0; i < rows; i++) {
            this.timesEasy[i] = [];
            for (let j = 0; j < columns; j++) {
                this.timesEasy[i][j] = 1000 + j;
            }
        }
        for (let i = 0; i < rows; i++) {
            this.timesNormal[i] = [];
            for (let j = 0; j < columns; j++) {
                this.timesNormal[i][j] = 2000 + j;
            }
        }
        for (let i = 0; i < rows; i++) {
            this.timesHard[i] = [];
            for (let j = 0; j < columns; j++) {
                this.timesHard[i][j] = 3000 + j;
            }
        }



        this.saveGameTimes();
    }
    loadGameTimes() {
        this.timesHard = JSON.parse(localStorage.getItem('timesHard'));
        this.timesNormal = JSON.parse(localStorage.getItem('timesNormal'));
        this.timesEasy = JSON.parse(localStorage.getItem('timesEasy'));
        
    }

    saveGameTimes() {
        localStorage.setItem('timesEasy', JSON.stringify(this.timesEasy));
        localStorage.setItem('timesNormal', JSON.stringify(this.timesNormal));
        localStorage.setItem('timesHard', JSON.stringify(this.timesHard));
    }

    printTimes(currTime, levelKey, context, x,y, fontSize){
        this.currTime = currTime;
        this.ctx = context;
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.levelKey = levelKey;
        if(gameHardness == "Easy") {
            this.timesEasy[this.levelKey].forEach((time, index) => {
                if(time == this.currTime){
                    this.ctx.fillStyle = "red";
                }else{
                    this.ctx.fillStyle = "blue";
                }
                this.ctx.fillText(index + 1 + " - " + this.secondsToTime(time), x,y + index*fontSize); 
            }); 
        }
        if(gameHardness == "Normal") {
            this.timesNormal[this.levelKey].forEach((time, index) => {
                if(time == this.currTime){
                    this.ctx.fillStyle = "red";
                }else{
                    this.ctx.fillStyle = "blue";
                }
                this.ctx.fillText(index + 1 + " - " + this.secondsToTime(time), x,y + index*fontSize); 
            }); 
        }
        if(gameHardness == "Hard") {
            this.timesHard[this.levelKey].forEach((time, index) => {
                if(time == this.currTime){
                    this.ctx.fillStyle = "red";
                }else{
                    this.ctx.fillStyle = "blue";
                }
                this.ctx.fillText(index + 1 + " - " + this.secondsToTime(time), x,y + index*fontSize); 
            }); 
        }
           
    }
    // adding new time in seconds
    addGameTime(levelKey,newTime) {

        this.levelKey = levelKey;
        this.currTime = newTime;

        if(gameHardness == "Easy") {    
            this.timesEasy[this.levelKey].push(this.currTime);
            this.timesEasy[this.levelKey].sort((a, b) => a - b);  
            this.timesEasy[this.levelKey] = this.timesEasy[this.levelKey].filter((element, index) => this.timesEasy[this.levelKey].indexOf(element) === index);
            if(this.timesEasy[this.levelKey].length > 5){
                console.log(this.timesEasy[this.levelKey].length);
                this.timesEasy[this.levelKey].pop();
            }
        }
        if(gameHardness == "Normal") {    
            this.timesNormal[this.levelKey].push(this.currTime);
            this.timesNormal[this.levelKey].sort((a, b) => a - b);  
            this.timesNormal[this.levelKey] = this.timesNormal[this.levelKey].filter((element, index) => this.timesNormal[this.levelKey].indexOf(element) === index);
            if(this.timesNormal[this.levelKey].length > 5){
                console.log(this.timesNormal[this.levelKey].length);
                this.timesNormal[this.levelKey].pop();
            }
        }
        if(gameHardness == "Hard") {    
            this.timesHard[this.levelKey].push(this.currTime);
            this.timesHard[this.levelKey].sort((a, b) => a - b);  
            this.timesHard[this.levelKey] = this.timesHard[this.levelKey].filter((element, index) => this.timesHard[this.levelKey].indexOf(element) === index);
            if(this.timesHard[this.levelKey].length > 5){
                console.log(this.timesHard[this.levelKey].length);
                this.timesHard[this.levelKey].pop();
            }
        }


        this.saveGameTimes();
    }
    timeToSeconds(time) {
        const [minutes, seconds] = time.split(":");
        return parseInt(minutes) * 60 + parseInt(seconds);
    }
    secondsToTime(seconds) {    
        let min = Math.floor(seconds / 60);
        let sec = seconds % 60;
        if(min < 10) {min = "0"+min;}
        if(sec < 10) {sec = "0"+sec;}
        return min + ":" + sec;
    }
}

