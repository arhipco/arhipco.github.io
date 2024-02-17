class Timer {
    constructor() {
        this.seconds = 0;
        this.minutes = 0;
        this.timerInterval = null;
        this.textTime = "";
    }

    start() {
        if (!this.timerInterval) {
            this.timerInterval = setInterval(() => {
                this.seconds++;

                if (this.seconds === 60) {
                    this.seconds = 0;
                    this.minutes++;
                }

                this.updateTimer();
            }, 1000); // Update timer every second
        }
    }

    stop() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    reset() {
        this.seconds = 0;
        this.minutes = 0;
        this.updateTimer();
    }

    updateTimer() {
        const formattedMinutes = this.minutes < 10 ? "0"+this.minutes : this.minutes;
        const formattedSeconds = this.seconds < 10 ? "0"+this.seconds : this.seconds;
        this.textTime = formattedMinutes + ":" + formattedSeconds;
    }
    getTimeAsText() {   
        return this.textTime;
    }
    getTimeAsSummSeconds(){
        return this.minutes * 60 + this.seconds;
    }
}

 

