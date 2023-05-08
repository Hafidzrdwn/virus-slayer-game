const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

canvas.width = 500
canvas.height = 550

const preloadGame = document.querySelector('.pregame')
const gameContainer = document.querySelector('.game-container')
const inputUsername = document.querySelector('.input-username')
const btnPlay = document.querySelector('.btn-play')
const countdownOverlay = document.querySelector('.game-count-overlay')

class Virus {
  constructor(position, src) {
    this.x = position.x
    this.y = position.y
    this.width = 50
    this.height = 50
    this.image = new Image()
    this.src = src
    this.speed = 4
  }

  draw() {
    // ctx.fillStyle = 'white'
    // ctx.fillRect(this.x, this.y, this.width, this.height)
    this.image.src = this.src
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  }

  update() {
    this.y += this.speed
  }
}

class Key {
  constructor(position, text) {
    this.x = position.x
    this.y = position.y
    this.width = canvas.width / 4
    this.height = 90
    this.text = text
  }

  draw() {
    ctx.fillStyle = '#43faa5'
    ctx.fillRect(this.x, this.y, this.width, this.height)
    ctx.fillStyle = '#1d1d1d'
    ctx.textAlign="center"; 
    ctx.textBaseline = "middle";
    ctx.font = 'bold 20px Arial'
    ctx.fillText(this.text, this.x + (this.width / 2), this.y + (this.height / 2))
  }

  update() {

  }
}

class Bar {
  constructor(position) {
    this.x = position.x
    this.y = position.y
    this.width = canvas.width / 4
    this.height = 10
    this.color = 'rgba(255, 255, 255, .6)'
  }

  draw() {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  update() {

  }
}

class Line {
  constructor(position) {
    this.x = position.x
    this.y = position.y
    this.width = 1
    this.height = canvas.height
    this.color = 'white'
  }

  draw() {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  update() {

  }
}

function drawVirus() {
  let images = ['virus', 'covid', 'dbvirus']
  let position = { 
    x: Math.floor(Math.random() * 4) * 125,
    y: -10
  }
  let src = `images/${images[Math.floor(Math.random() * 3)]}.png`

  return new Virus(position, src)
}

function drawKeys() {
  let keys = [
    new Key({
      x: 0,
      y: canvas.height - 90
    }, 'D'),
    new Key({
      x: 125,
      y: canvas.height - 90
    }, 'F'),
    new Key({
      x: 250,
      y: canvas.height - 90
    }, 'J'),
    new Key({
      x: 375,
      y: canvas.height - 90
    }, 'K')
  ]

  return keys
}

function drawBars() {
  let bars = [
    new Bar({
      x: 0,
      y: canvas.height - 90 - 10
    }, 'D'),
    new Bar({
      x: 125,
      y: canvas.height - 90 - 10
    }, 'F'),
    new Bar({
      x: 250,
      y: canvas.height - 90 - 10
    }, 'J'),
    new Bar({
      x: 375,
      y: canvas.height - 90 - 10
    }, 'K')
  ]

  return bars
}

function drawLines() {
  let lines = [
    new Line({
      x: 125,
      y: 0
    }),
    new Line({
      x: 250,
      y: 0
    }),
    new Line({
      x: 375,
      y: 0
    })
  ]

  return lines
}

class drawDangerZone {

  constructor() {
    this.setup()
  }

  setup() {
    this.width = canvas.width
    this.height = 175
    this.x = 0
    this.y = canvas.height - 90 - 10 - 175
    this.color = 'rgba(255,0,0,.2)'
  }

  draw() {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

let danger = new drawDangerZone()

function virusGetHit(virus, zone) {
  return virus.y + virus.height > zone.y
}

class handleEventListener {
  constructor(game) {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'd':
          game.bars[0].color = 'rgba(255, 255, 255, 1)'
          break;
        case 'f':
          game.bars[1].color = 'rgba(255, 255, 255, 1)'
          break;
        case 'j':
          game.bars[2].color = 'rgba(255, 255, 255, 1)'
          break;
        case 'k':
          game.bars[3].color = 'rgba(255, 255, 255, 1)'
          break;
      }
    })

    document.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'd':
          game.bars[0].color = 'rgba(255, 255, 255, .6)'
          break;
        case 'f':
          game.bars[1].color = 'rgba(255, 255, 255, .6)'
          break;
        case 'j':
          game.bars[2].color = 'rgba(255, 255, 255, .6)'
          break;
        case 'k':
          game.bars[3].color = 'rgba(255, 255, 255, .6)'
          break;
      }
    })
  }
}


class Game {

  constructor() {
    this.setup()
  }

  setup() {
    this.keys = drawKeys()
    this.lines = drawLines()
    this.bars = drawBars()
    this.dangerZone = new drawDangerZone()
    this.virus = []
    new handleEventListener(this)
  }

  draw() {
    this.dangerZone.draw();
    [...this.keys, ...this.lines, ...this.bars, ...this.virus].forEach(e => e.draw())
  }

  update() {
    [...this.keys, ...this.lines, ...this.bars, ...this.virus].forEach(e => e.update())

    this.virus.forEach((virus, index) => {

      if (virus.y + virus.height - 10 > canvas.height) {
        this.virus.splice(index, 1)
        fail += 1
        failWrapper.innerHTML = fail
      }
    })
    
    if (virusSpawnInterval > 1000) {
      if (fail >= 10) return
      this.virus.push(drawVirus())
    } else {
      virusSpawnInterval++
    }

    console.log(virusSpawnInterval)

  }
}

let game = new Game()
const timerWrapper = document.querySelector('.timer > span')
const playerName = document.querySelector('.player-name > span')
const scoreWrapper = document.querySelector('.score > span')
const failWrapper = document.querySelector('.fail > span')
let time = 0
let score = 0
let fail = 0
let virusSpawnInterval = 0

let pause = true, gameover = false

setInterval(() => {
  
  if (pause || gameover) {
    return
  }

  time++;
  timerWrapper.textContent = time;

}, 1000);

function animate() {
  if (pause || gameover) {
    return
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  game.update()
  game.draw()
  window.requestAnimationFrame(animate)
}

function play() {
  preloadGame.style.display = 'none'
  gameContainer.style.display = 'flex'
  game.draw()
  countdown()
  setTimeout(() => {
    pause = false
    animate()
    if (inputUsername.value.length > 6) {
      playerName.innerHTML = inputUsername.value.substring(0,6) + '..'
    } else {
      playerName.innerHTML = inputUsername.value
    }
  }, 4000);
}

inputUsername.addEventListener('input', function (e) {
  if (e.target.value.trim()) {
    btnPlay.classList.remove('disabled')
  } else {
    btnPlay.classList.add('disabled')
  }
})

btnPlay.addEventListener('click', play)

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
