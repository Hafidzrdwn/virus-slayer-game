const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

canvas.width = 480
canvas.height = 600

const SPEED = [4, 6, 8, 10]
const INTERVAL = [16.7, 32.7, 64.7, 124.7]

const preloadGame = document.querySelector('.pregame')
const instructionBox = document.querySelector('.instruction-box')
const gameContainer = document.querySelector('.game-container')
const gameOverWrapper = document.querySelector('.gameover-wrapper')
const pauseWrapper = document.querySelector('.pause-wrapper')
const leaderboardWrapper = document.querySelector('.leaderboard-wrapper')

const formPlay = document.getElementById('form-play')
const inputUsername = document.querySelector('.input-username')
const btnPlay = document.querySelector('.btn-play')
const btnInstruction = document.querySelector('.btn-instruction')
const btnQuit = document.querySelectorAll('.btn-quit')
const btnPause = document.querySelector('.btn-pause')
const btnRestart = document.querySelectorAll('.btn-restart')
const btnContinue = document.querySelector('.btn-continue')
const btnLeaderboard = document.querySelectorAll('.btn-leaderboard')
const btnCloseLeaderboard = document.querySelector('.btn-close')
const countdownOverlay = document.querySelector('.game-count-overlay')

class Virus {
  constructor(position, src) {
    this.x = position.x
    this.y = position.y
    this.width = 75
    this.height = 75
    this.image = new Image()
    this.src = src
    this.speed = setIntervalAndSpeed().speed
  }

  draw() {
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
    ctx.fillStyle = '#00f397'
    ctx.fillRect(this.x, this.y, this.width, this.height)
    ctx.fillStyle = '#181818'
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

class DangerZone {

  constructor(posX) {
    this.width = canvas.width / 4
    this.height = 175
    this.x = posX
    this.y = canvas.height - 90 - 10 - 175
    this.color = 'rgba(255,0,0,.3)'
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
    x: Math.floor(Math.random() * 4) * 120 + (120 / 2 - 75 / 2),
    y: -50
  }
  let src = `images/${images[Math.floor(Math.random() * 3)]}.png`

  return new Virus(position, src)
}

function drawKeys() {
  let keys = []
  let i = 0
  let words = ['D','F','J','K']
  for (let j = 0; j < 4; j++) {
    keys.push(
      new Key(
        {
          x: i,
          y: canvas.height - 90
        }, words[j]
      )
    )
    i += 120
  }

  return keys
}

function drawBars() {
  let bars = []
  let i = 0
  for (let j = 0; j < 4; j++) {
    bars.push(
      new Bar({
        x: i,
        y: canvas.height - 90 - 10
      })
    )
    i += 120
  }
  return bars
}

function drawLines() {
  let lines = []
  for (let i = 1; i <= 3; i++) {
    lines.push(new Line({
      x: 120 * i,
      y: 0
    }))
  }

  return lines
}

function drawDangerZone() {
  let dangers = []
  let j = 0;
  for (let i = 0; i < 4; i++) {
    dangers.push(new DangerZone(j))
    j+=120
  }

  return dangers
}

let keywordObj = {
  d: 0,
  f: 1,
  j: 2,
  k: 3
}

function virusGetHit(virus, zone) {
  return virus.x == zone.x + (120 / 2 - 75 / 2) &&
        virus.y + virus.height > zone.y
}

function barLight(game, key, state) {
  switch (state) {
    case "lighton":
      switch (key) {
        case 'd': case 'f': case 'j': case 'k':
          game.bars[keywordObj[key]].color = 'rgba(255, 255, 255, 1)'
          game.virus.forEach((virus, index) => {
            if (virusGetHit(virus, drawDangerZone()[keywordObj[key]])) {
              game.virus.splice(index, 1)
              score++
              scoreWrapper.innerHTML = score
            }
          })
          break;
        case 'Escape':
          game.pause()
          break;
      }
      break;
    case "lightoff":
      switch (key) {
        case 'd': case 'f': case 'j': case 'k':
          game.bars[keywordObj[key]].color = 'rgba(255, 255, 255, .6)'
          break;
      }
      break;
  }
}

class handleEventListener {
  constructor(game) {

    document.addEventListener('keydown', (e) => {
      barLight(game, e.key, "lighton")
    })

    document.addEventListener('keyup', (e) => {
      barLight(game, e.key, "lightoff")
    })
  }
}

function setIntervalAndSpeed() {
  if (score >= 0 && score <= 15) {
    return { speed: SPEED[0], inv: INTERVAL[0] }
  } else if (score > 15 && score <= 30) {
    return { speed: SPEED[1], inv: INTERVAL[1] }
  } else if(score > 30 && score <= 60){
    return { speed: SPEED[2], inv: INTERVAL[2] }
  } else {
    return { speed: SPEED[3], inv: INTERVAL[3] }
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
    this.dangerZone = drawDangerZone()
    this.virus = []
    new handleEventListener(this)
  }

  draw() {
    [...this.virus, ...this.dangerZone, ...this.keys, ...this.lines, ...this.bars].forEach(e => e.draw())
  }

  update() {

    if (fail >= 5) {
      gameover = true
      this.gameover()
    } 

    [...this.virus, ...this.dangerZone, ...this.keys, ...this.lines, ...this.bars].forEach(e => e.update())

    this.virus.forEach((virus, index) => {
      if (virus.y + virus.height > canvas.height - 90 + 75) {
        this.virus.splice(index, 1)
        fail += 1
        failWrapper.innerHTML = fail
      }
    })
    
    if (virusSpawnInterval > 1000 / setIntervalAndSpeed().inv) {
      this.virus.push(drawVirus())
      virusSpawnInterval = 0
    } else {
      virusSpawnInterval++
    }
  }

  setLeaderboard(player_name, final_score, game_duration) {

    let idx_obj = rank.findIndex((val) => {
      return val.name.trim().toLowerCase() === player_name.trim().toLowerCase()
    })

    if (idx_obj >= 0) {
      if (final_score >= rank[idx_obj].score) {
        rank[idx_obj].score = final_score
        rank[idx_obj].duration = game_duration
      }
    } else {
      let person = {
        name: player_name,
        score: final_score,
        duration: game_duration
      }
  
      rank.push(person)
    }
    localStorage.setItem('rank', JSON.stringify(rank))

    let sortedRank = []
    if (rank.length > 1) {
      for (let i = 0; i < rank.length; i++) {
        sortedRank.push(rank[i])
      }  
      sortedRank.sort((a, b) => { return b.score - a.score })

      if (sortedRank.length > 5) {
        sortedRank.splice(5, (sortedRank.length - 5))
      }

      localStorage.setItem('rank', JSON.stringify(sortedRank))
    }
  }

  drawLeaderboard() {
    rank = JSON.parse(localStorage.getItem('rank'))
    let template = ""
    rank.forEach((dt, idx) => {
      template += `
        <tr>
          <td>${idx + 1}</td>
          <td>${dt.name}</td>
          <td>${dt.score}</td>
          <td>${dt.duration}</td>
        </tr>   
      `
    })

    document.querySelector('.leaderboard-table > tbody').innerHTML = template
  }

  leaderboard() {
    if (!gameover) pause = true
    this.drawLeaderboard()
    leaderboardWrapper.style.display = 'flex'
  }

  closeLeaderboard() {
    if (!gameover) {
      pause = false
      animate()
    } 
    leaderboardWrapper.style.display = 'none'
  }

  pause() {
    pause = !pause
    animate()
    if (pause) {
      pauseWrapper.style.display = 'flex'
    } else {
      pauseWrapper.style.display = 'none'
    }
  }

  restart() {
    location.reload()
  }

  gameover() {

    let name = localStorage.getItem('username'),
      duration = `${time_minute}:${time_second}`

    gameOverWrapper.style.display = 'flex'
    this.setLeaderboard(name, score, duration)
    document.querySelector('.player-name-final > span').innerHTML = name
    document.querySelector('.timer-final > span').innerHTML = duration
    document.querySelector('.score-final > span').innerHTML = score

  }

  quit() {
    pause = true, gameover = false
    time = 0
    time_second = 0
    time_minute = 0
    score = 0
    fail = 0
    virusSpawnInterval = 0
    this.virus = []
    
    scoreWrapper.innerHTML = score
    timerWrapper.innerHTML = '00:00'
    failWrapper.innerHTML = '0'
    playerName.innerHTML = '-'

    gameContainer.style.display = 'none'
    preloadGame.style.display = 'flex'
    inputUsername.value = null
    btnPlay.disabled = true
    localStorage.removeItem('username')
  }
}

let game = new Game()

let shadows = document.querySelectorAll('.shadow-buttons > button')
shadows.forEach(btn => {
  btn.addEventListener('click', (e) => {
    barLight(game, e.target.dataset.key, "lighton")
    
    setTimeout(() => {
      barLight(game, e.target.dataset.key, "lightoff")
    }, 50);
  })
})

const timerWrapper = document.querySelector('.timer > span')
const playerName = document.querySelector('.player-name > span')
const scoreWrapper = document.querySelector('.score > span')
const failWrapper = document.querySelector('.fail > span')
let time = 0
let time_second = 0
let time_minute = 0
let score = 0
let fail = 0
let rank = (localStorage.getItem('rank')) ? JSON.parse(localStorage.getItem('rank')) : []

let virusSpawnInterval = 0
let pause = true, gameover = false

setInterval(() => {
  
  if (pause || gameover) return

  time++
  
  let second = Math.floor(time % 60)
  let minute = Math.floor(time / 60)

  time_second = (second < 10) ? '0'+second : second
  time_minute = (minute < 10) ? '0'+minute : minute

  timerWrapper.innerHTML = `${time_minute}:${time_second}`
}, 1000);

function animate() {
  if (pause || gameover) {
    return
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.beginPath()
  game.update()
  game.draw()
  window.requestAnimationFrame(animate)
}

function play() {
  preloadGame.style.display = 'none'
  gameOverWrapper.style.display = 'none'
  gameContainer.style.display = 'flex'

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.beginPath()
  game.draw()

  countdown()
  setTimeout(() => {
    pause = false
    animate()

    let storage_username = localStorage.getItem('username') 
    if (storage_username) {
      inputUsername.value = storage_username
    } else {
      localStorage.setItem('username', inputUsername.value)
    }

    if (inputUsername.value.length > 6) {
      playerName.innerHTML = inputUsername.value.substring(0,6) + '..'
    } else {
      playerName.innerHTML = inputUsername.value
    }

    if (!localStorage.getItem('rank')) {
      localStorage.setItem('rank', [])
    }
  }, 4000);
}

inputUsername.addEventListener('input', function (e) {
  if (e.target.value.trim()) {
    btnPlay.disabled = false
  } else {
    btnPlay.disabled = true
  } 
})

formPlay.addEventListener('submit', e => e.preventDefault())
btnPlay.addEventListener('click', play)

btnInstruction.addEventListener('click', function () {
  if (instructionBox.classList.contains('d-none')) {
    preloadGame.style.width = '920px'
    setTimeout(() => {
      btnInstruction.querySelector('i').classList.replace('fa-info-circle', 'fa-times')
      instructionBox.classList.remove('d-none')
    }, 300);
  } else {
    btnInstruction.querySelector('i').classList.replace('fa-times', 'fa-info-circle')
    instructionBox.classList.add('d-none')
    preloadGame.style.width = '550px'
  }
})

btnQuit.forEach(btn => {
  btn.addEventListener('click', function () {
    game.quit()
  }, false)
})
btnRestart.forEach(btn => {
  btn.addEventListener('click', function () {
    game.restart()
  }, false)
})
btnPause.addEventListener('click', function () {
  game.pause()
}, false)
btnContinue.addEventListener('click', function () {
  game.pause()
}, false)
btnLeaderboard.forEach(btn => {
  btn.addEventListener('click', function () {
    game.leaderboard()
  }, false)
})
btnCloseLeaderboard.addEventListener('click', function () {
  game.closeLeaderboard()
}, false)

if(localStorage.getItem('username')) {
  preloadGame.style.display = 'none'
  play()
}

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
