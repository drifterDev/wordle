import './style.css'

// Declaración de variables y constantes
const COUNT_WORDS = 8
const COLUMNS = localStorage.getItem('columns') ?? 5 // Longitud de la palabra
const ROWS = 6
let DICTIONARY
let gameFinished = false

const state = {
  secretWord: '',
  grid: Array(ROWS).fill().map(() => Array(COLUMNS).fill('')),
  currentRow: 0,
  currentCol: 0,
}

// Función para obtener la información del archivo data.json donde estan guardadas las palabras
async function getInformation(){
  const response = await fetch('./data.json')
  const data = await response.json()
  DICTIONARY = Object.values(data[COLUMNS]).map(word => word.toLowerCase()) // Se puede mejorar
  const index = Math.floor(Math.random() * COUNT_WORDS) // Indice aleatorio
  state.secretWord = DICTIONARY[index]
  startup() 
}

// Función para actualizar el tablero
function updateGrid(){ 
  for(let x = 0; x < state.grid.length; x++){
    for(let y = 0; y < state.grid[0].length; y++){
      const box = document.getElementById(`box${x}${y}`)
      box.textContent = state.grid[x][y]
    }
  }
}

// Función para dibujar cada caja del tablero
function drawBox(container, x, y){
  const box = document.createElement('div')
  box.className = 'box'
  box.id = `box${x}${y}`
  box.textContent = ''
  container.appendChild(box)
  return box
}

// Funcion para dibujar el tablero por primera vez
function drawGrid(container){
  const grid = document.createElement('div')
  grid.classList.add(`grid-${COLUMNS}`)
  grid.classList.add('grid')
  for(let x = 0; x < ROWS; x++){
    for(let y = 0; y < COLUMNS; y++){
      drawBox(grid, x, y)
    }
  }
  container.appendChild(grid)
}

// Función para obtener las teclas presionadas
function registerKeyEvents(){
  document.body.onkeydown = (e) => {
    if (state.currentRow >= ROWS || gameFinished) return
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

// Función para verificar si la tecla presionada es una letra
function isletter(key){
  return key.length == 1 && key.match(/[a-z]/i)
}

// Función para agregar una letra a la fila actual
function addLetter(letter){
  if (state.currentCol == COLUMNS) return
  state.grid[state.currentRow][state.currentCol] = letter
  state.currentCol++
}

// Función para eliminar una letra de la fila actual
function removeLetter(){
  if (state.currentCol == 0) return
  state.grid[state.currentRow][state.currentCol - 1] = ''
  state.currentCol--
}

// Función para obtener la palabra actual
function getCurrentWord(){
  return state.grid[state.currentRow].join('') // Se puede mejorar (?)
}

// Función para verificar si la palabra existe y esta en el diccionario
function isWordValid(word){
  return DICTIONARY.includes(word) // Se puede mejorar 
}

// Función para revelar la palabra
function revealWord(word){
  const row = state.currentRow
  const animation_time = 100

  for(let i = 0; i < COLUMNS; i++){
    const box = document.getElementById(`box${row}${i}`)
    const letter = box.textContent

    setTimeout(() => {
      if (letter == state.secretWord[i]){
        box.classList.add('right')
      }else if(state.secretWord.includes(letter)){
        box.classList.add('wrong')
      }else{
        box.classList.add('empty')
      }
    }, ((i+1) * animation_time));

    box.classList.add('animated')
    box.style.animationDelay = `${(animation_time * i)}ms`
  }

  const isWinner = state.secretWord === word
  const isGameOver = state.currentRow === ROWS

  setTimeout(() => {
    if (isWinner){
      alert('You win!')
      gameFinished = true
    }else if(isGameOver){
      gameFinished = true
      alert(`Game over!, the word was ${state.secretWord}`)
    }
  }, (COLUMNS) * animation_time+100);
}

// Función para iniciar el juego
function startup(){
  const game = document.getElementById('game')
  drawGrid(game)
  console.log(state.secretWord)
  registerKeyEvents()
}

// Acá comienza todo
getInformation()