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



const player = new Player(canvas, ctx, 0);
let GameIsStarted = false;
let myButtons = [];
let q = canvas.width / 8;
if (canvas.width < canvas.height) {
    q = canvas.height / 8;
}

myButtons.push(new myButton(canvas.width / 2 - q, canvas.height / 2 - q, q / 2, 'Easy', q / 4));
myButtons.push(new myButton(canvas.width / 2, canvas.height / 2, q / 2, 'Normal', q / 4));
myButtons.push(new myButton(canvas.width / 2 + q, canvas.height / 2 + q, q / 2, 'Hard', q / 4));


// Handle mouse click event on Buttons
window.addEventListener('resize', e => {
    player.resize(e.target.window.innerWidth, e.target.window.innerHeight);
});
window.addEventListener('touchstart', e => {
    player.mouse.pressed = true;
    player.mouse.x = e.changedTouches[0].pageX;
    player.mouse.y = e.changedTouches[0].pageY;
});

window.addEventListener('mouseup', e => {
    player.mouse.pressed = false;
});
window.addEventListener('keydown', e => {
    if (e.key == 'm') this.toggleMusic();
});

document.addEventListener('mousemove', function (event) {
   // if (!GameIsStarted) {
        const mouseX = event.clientX; // X-coordinate relative to the viewport
        const mouseY = event.clientY; // Y-coordinate relative to the viewport
        myButtons.forEach(button => {
            if (button.isMouseInsideButton(mouseX, mouseY)) {
                button.color = 'gold';
            } else {
                button.color = 'orange';
            }
        });
    //}
});
window.addEventListener('mousedown', e => {
    player.mouse.pressed = true;
    player.mouse.x = e.x;
    player.mouse.y = e.y;
});
document.addEventListener('click', function (event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    myButtons.forEach(button => {
        if (button.isMouseInsideButton(mouseX, mouseY)) {
            if (!GameIsStarted) {
                if (button.text == 'Easy') {
                    player.complexity = 2;
                }
                if (button.text == 'Normal') {
                    player.complexity = 5;
                }
                if (button.text == 'Hard') {
                    player.complexity = 10;
                }
                GameIsStarted = true;
                player.startNewLevel();
            } else {
                if (button.text == 'M') {
                    player.toggleMusic();
                }
            }
        }
    });
});

const starField = new StarField();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    starField.update();
    if (GameIsStarted == true) {
        player.updateParticles(ctx);
    //} else {
       
    }
    myButtons.forEach(button => {
        button.draw();
    });

    requestAnimationFrame(animate);
}
animate();