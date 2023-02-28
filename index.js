const formPlay = document.getElementById('formPlay'); 
const inpUsername = document.getElementById('username'); 

formPlay.addEventListener('submit', function(e){
    e.preventDefault();

    if(inpUsername.value.trim()) {
        localStorage.setItem('username', inpUsername.value)
        formPlay.reset()
        inpUsername.nextElementSibling.disabled = true

        start();
    } else {
        alert('Please fill your username!')
        return false;
    }

})

inpUsername.addEventListener('keyup', function(){
    if(inpUsername.value.trim()) {
        inpUsername.nextElementSibling.disabled = false
    } else {
        inpUsername.nextElementSibling.disabled = true
    }
})

const countdownOverlay = document.querySelector('.game-count-overlay');

function countdown() {
    let count = 3;    
    countdownOverlay.style.display = 'flex'
    
    let counting_down = setInterval(()=> {
        count--;
        if(count < 1) {
            countdownOverlay.children[0].innerText = 'GO!'
            clearInterval(counting_down);
            setTimeout(()=> {
                countdownOverlay.style.display = 'none'
                countdownOverlay.children[0].innerText = '3'
            }, 1000)
        } else {
            countdownOverlay.children[0].innerText = count
        }
        
    }, 1000)
}

let canvas = document.getElementById('game')
let ctx = canvas.getContext('2d')
canvas.width = 600
canvas.height = 820

let btnPosition = 0;
let vX = 25, vPosX = {};
let btnImages = ['d','f','j','k']

for (let i = 0; i < 4; i++) {

    vPosX[btnImages[i]] = vX

    let image = new Image()

    image.src = `/images/${btnImages[i]}.png`
    if(i == 0 || i == 2) {
        ctx.fillStyle = 'rgb(248, 101, 85)'
    } else {
        ctx.fillStyle = 'salmon'
    }
    ctx.fillRect(btnPosition , canvas.height - 120, canvas.width / 4 ,120)

    let temp = {
        el: image,
        posX: btnPosition
    }

    image.onload = function(){
        ctx.drawImage(temp.el, temp.posX + 55 ,canvas.height - 100, (canvas.width / 4) / 4, 85)
    }


    btnPosition += canvas.width / 4;
    vX += canvas.width / 4;
}

ctx.fillStyle = 'rgba(255,0,0,.5)'
ctx.fillRect(0, canvas.height - (120+200), canvas.width, 200)

let canvasCoor = {
    cw: canvas.width,
    ch: canvas.height
}

const preloadGame = document.getElementById('pregame');
const gameContainer = document.querySelector('.game-container');

function start() {
    preloadGame.style.display = 'none'
    gameContainer.style.display = 'flex'

    // countdown();
    // setTimeout(() => playGame(), 4000)
    playGame()
}

const playerName = document.querySelector('.player-name > span')
let gameTimer = document.querySelector('.timer > span')
let timer = 1;
let injects = [], viruses = []

const handleKeys = () => {
    const keys = ['d','f','j','k']
    window.addEventListener('keydown', (e) => {
        if(keys.includes(e.key)) {
            injects.push({x: vPosX[e.key] , y: 430})
        }
    })
}

const addVirus = () => {
    const pattern = Object.values(vPosX)
    let random = Math.floor(Math.random() * 4)
    viruses.push({x: pattern[random], y: 0, w: 50, h: 50})
}

const intervalTimer = () => setInterval(() => {
    timer++;
    gameTimer.innerText = timer
}, 1000);

function playGame() {
    let score = 0, escaped = 0;

    playerName.innerText = localStorage.getItem('username')

    intervalTimer();
    handleKeys();
}

function gameOver() {

}


if(localStorage.getItem('username')) {
    start();
}
function restartGame() {
    window.location.reload()
}

function quit() {
    window.location.reload()

    localStorage.removeItem('username')
}
