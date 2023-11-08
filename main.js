import './style.css'

const DIFFICULTY = 5
const COUNTWORDS = 8
const COLUMNS = 5
const ROWS = 6
let DICTIONARY

const state = {
  secretWord: '',
  grid: Array(ROWS).fill().map(() => Array(COLUMNS).fill('')),
  currentRow: 0,
  currentCol: 0,
}

async function getInformation(){
  const response = await fetch('./data.json')
  const data = await response.json()
  DICTIONARY = Object.values(data[DIFFICULTY]).map(word => word.toLowerCase())
  const index = Math.floor(Math.random() * COUNTWORDS)
  state.secretWord = DICTIONARY[index]
  startup()
}

function updateGrid(){
  for(let x = 0; x < state.grid.length; x++){
    for(let y = 0; y < state.grid[0].length; y++){
      const box = document.getElementById(`box${x}${y}`)
      box.textContent = state.grid[x][y]
    }
  }
}

function drawBox(container, x, y, letter = ''){
  const box = document.createElement('div')
  box.className = 'box'
  box.id = `box${x}${y}`
  box.textContent = letter

  container.appendChild(box)
  return box
}

function drawGrid(container){
  const grid = document.createElement('div')
  grid.className = 'grid'

  for(let x = 0; x < state.grid.length; x++){
    for(let y = 0; y < state.grid[0].length; y++){
      drawBox(grid, x, y)
    }
  }

  container.appendChild(grid)
}

function registerKeyEvents(){
  document.body.onkeydown = (e) => {
    if (state.currentRow >= ROWS) return
    const key = e.key
    if (key == 'Enter'){
      if (state.currentCol == COLUMNS){
        const word = getCurrentWord()
        if (isWordValid(word)){
          revealWord(word)
          state.currentCol = 0
          state.currentRow++
        }else{
          alert('Invalid word')
        }
      }
    }else if(key == 'Backspace'){
      removeLetter()
    }else if(isletter(key)){
      addLetter(key)
    }
    
    updateGrid()
  }
}

function isletter(key){
  return key.length == 1 && key.match(/[a-z]/i)
}

function addLetter(letter){
  if (state.currentCol == COLUMNS) return
  state.grid[state.currentRow][state.currentCol] = letter
  state.currentCol++
}

function removeLetter(){
  if (state.currentCol == 0) return
  state.grid[state.currentRow][state.currentCol - 1] = ''
  state.currentCol--
}

function getCurrentWord(){
  return state.grid[state.currentRow].join('')
}

function isWordValid(word){
  return DICTIONARY.includes(word)
}

function revealWord(word){
  const row = state.currentRow

  for(let i = 0; i < state.grid[0].length; i++){
    const box = document.getElementById(`box${row}${i}`)
    const letter = box.textContent

    if (letter == state.secretWord[i]){
      box.classList.add('right')
    }else if(state.secretWord.includes(letter)){
      box.classList.add('wrong')
    }else{
      box.classList.add('empty')
    }
  }

  const isWinner = state.secretWord === word
  const isGameOver = state.currentRow === ROWS

  if (isWinner){
    alert('You win!')
  }else if(isGameOver){
    alert(`Game over!, the word was ${state.secretWord}`)
  }
}

function startup(){
  const game = document.getElementById('game')
  drawGrid(game)
  console.log(state.secretWord)
  registerKeyEvents()
}

getInformation()