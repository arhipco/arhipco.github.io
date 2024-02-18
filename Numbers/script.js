const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'white');
gradient.addColorStop(0.5, 'gold');
gradient.addColorStop(1, 'orangered');
ctx.fillStyle = gradient;
ctx.strokeStyle = 'blue';
ctx.textAlign = 'center';


let mouse = { x: 0, y: 0, pressed: false };
const starField = new StarField();
const player = new Player(canvas, ctx, 0);
const popUp = new PopUp(player);

let transitionEffect = false;
let transitionColor = 0;
let gameHardness = 'Easy'
let GameState = "menu"; // menu, game, gameover, popup 
let myButtons = [];
let q  = Math.min(canvas.width, canvas.height) / 8;

// menu buttons
myButtons.push(new myButton("menu", canvas.width / 2 - q, canvas.height / 2 - q, q / 2, 'Easy', q / 4));
myButtons.push(new myButton("menu", canvas.width / 2, canvas.height / 2, q / 2, 'Normal', q / 4));
myButtons.push(new myButton("menu", canvas.width / 2 + q, canvas.height / 2 + q, q / 2, 'Hard', q / 4));

// game button
myButtons.push(new myButton("game", canvas.width / 30, canvas.height - canvas.width / 30, canvas.width / 30, 'M', canvas.width / 20));
myButtons.push(new myButton("game", canvas.width / 2 + canvas.width / 8, canvas.height - canvas.width / 30, canvas.width / 30, 'R', canvas.width / 20));

// popUp buttons
myButtons.push(new myButton("popup", q * 6, q*6, q, 'Next', q / 2.5));

// Handle mouse click event on Buttons
window.addEventListener('resize', e => {
    player.resize(e.target.window.innerWidth, e.target.window.innerHeight);
});
window.addEventListener('touchstart', e => { 
    if(!mouse.pressed) {
        mouse.pressed = true;
        mouse.x = e.changedTouches[0].pageX;
        mouse.y = e.changedTouches[0].pageY;
        checkClickTap();
    }
});
window.addEventListener('touchend', e => {
    mouse.pressed = false;
});
window.addEventListener('mouseup', e => {
    mouse.pressed = false;
});
window.addEventListener('keydown', e => {
    if (e.key == 'm') player.toggleMusic();
});
window.addEventListener('mousemove', e => {
    mouse.x = e.x;
    mouse.y = e.y;
    myButtons.forEach(button => {
        if (button.isMouseInsideButton(mouse.x, mouse.y)) {
            button.color = 'gold';
        } else {
            button.color = 'orange';
        }
    });
});
window.addEventListener('mousedown', e => {
    if(!mouse.pressed) {
        mouse.pressed = true;
        mouse.x = e.x;
        mouse.y = e.y; 
        checkClickTap();
    }
});
function checkClickTap() {
    if(mouse.pressed) {
        myButtons.forEach(button => {
            if (button.isMouseInsideButton(mouse.x, mouse.y)) {
                if (GameState == "menu") {
                    if (button.text == 'Easy') {
                        gameHardness = 'Easy';  
                        player.complexity = 2;
                    }
                    if (button.text == 'Normal') {
                        gameHardness = 'Normal';
                        player.complexity = 5;
                    }
                    if (button.text == 'Hard') {
                        gameHardness = 'Hard';
                        player.complexity = 10;
                    }
                    GameState = "game";
                    player.startNewLevel();
                }
                if (GameState == "game") {
                    if (button.text == 'M') {
                        player.toggleMusic(); 
                    }
                    if (button.text == 'R') {
                        transitionEffect = true;
                        transitionColor = 0;
                        GameState = "menu";
                        player.resetGame = true;
                        player.level = 1;
                    }
                }
                if(GameState == "popup" && popUp.isOpened) {
                    if (button.text == 'Next') {
                        mouse.pressed = false;
                        transitionEffect = true;
                        setTimeout(function() {
                            popUp.isOpened = false;
                            GameState = "game";
                            player.level++; // NEXT LEVEL§
                            player.startNewLevel();
                        }, 200);
                        
                    }
                }
            }
        });
    }
}
function animate() {
    if (!transitionEffect) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        starField.update();
        
        if (GameState == "game") {
            player.updateParticles(ctx);
        }
        if (GameState == "menu") {}
        if(GameState == "popup") {    
            mouse.pressed = false;
            popUp.openPopUp(player.level, player.timer.getTimeAsSummSeconds());
        } 
        myButtons.forEach(button => {
            if(GameState == button.group) button.draw();
        });
    }
    if (transitionEffect) {
        transitionColor += 3;
        ctx.fillStyle = 'black';
        ctx.globalAlpha = transitionColor / 100;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (transitionColor >= 60) {
            transitionEffect = false;
            ctx.globalAlpha = 1;
            transitionColor = 0;
        }   
    }
    //mouse.pressed = false;
    requestAnimationFrame(animate);
}
animate();