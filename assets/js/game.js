import '../css/style.css'
import {Trie} from "./trie.js"

// Declaración de variables y constantes
const COLUMNS = localStorage.getItem('columns') ?? 5 // Longitud de la palabra
const ROWS = 6
let LEMARIO
let LEMARIO2
let COUNT_WORDS

const state = {
  secretWord: '',
  grid: Array(ROWS).fill().map(() => Array(COLUMNS).fill('')),
  currentRow: 0,
  currentCol: 0,
  letters: {},
  gameFinished: false
}

// Función para obtener la información del archivo data.json donde estan guardadas las palabras
async function getInformation(){
  if (localStorage.getItem('lemario') == null || localStorage.getItem('len') != COLUMNS) {
    const response = await fetch('./data.json')
    const data = await response.json()
    LEMARIO = Array.from(data[COLUMNS]).map(word => word.toLowerCase())
    COUNT_WORDS = LEMARIO.length
    localStorage.setItem('lemario', JSON.stringify(LEMARIO))
    localStorage.setItem('len', COLUMNS)
    localStorage.setItem('cw', COUNT_WORDS)
  }else{
    LEMARIO=JSON.parse(localStorage.getItem('lemario'))
    COUNT_WORDS = localStorage.getItem('cw')
  }
  LEMARIO2= new Trie()
  for (let word of LEMARIO){
    LEMARIO2.insert(word)
  }
  selectWord()
  countLetters()
  startup() 
}

// Función para seleccionar la palabra secreta
function selectWord(){
  const index = Math.floor(Math.random() * COUNT_WORDS) // Indice aleatorio
  state.secretWord = LEMARIO[index]
}

function countLetters() {
  let word = state.secretWord
  state.letters={}
  for (let i = 0; i < word.length; i++) {
      var letter = word[i]
      if (state.letters[letter]) {
        state.letters[letter]++
      } else {
        state.letters[letter] = 1
      }
  }
}

// Función para actualizar el tablero
function updateGrid(){ 
  if (state.currentRow >= ROWS) return
  for(let y = 0; y < state.grid[0].length; y++){
    const box = document.getElementById(`box${state.currentRow}${y}`)
    box.textContent = state.grid[state.currentRow][y]
  }
}

// Función para resetear el tablero
function resetGrid(){
  state.grid = Array(ROWS).fill().map(() => Array(COLUMNS).fill(''))
  state.currentRow = 0
  state.currentCol = 0
  state.gameFinished = false
  const boxes = document.getElementsByClassName('box')
  for(let i = 0; i < boxes.length; i++){
    const box = boxes[i]
    box.textContent = ''
    box.classList.remove('right')
    box.classList.remove('wrong')
    box.classList.remove('empty')
    box.classList.remove('animated')
    box.style.animationDelay = '0ms'
  }
  selectWord()
  countLetters()
  updateGrid()
  registerKeyEvents()
  console.log(state.secretWord)
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
    if (state.currentRow >= ROWS || state.gameFinished) return
    const key = e.key
    if (key == 'Enter'){
      if (state.currentCol == COLUMNS){
        const word = getCurrentWord()
        if (isWordValid(word)){
          revealWord(word)
          state.currentCol = 0
          state.currentRow++
        }else{
          alert('Palabra inválida')
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
  return state.grid[state.currentRow].join('') 
}

// Función para verificar si la palabra existe y esta en el diccionario
function isWordValid(word){
  return LEMARIO2.search(word) 
}

// Función para revelar la palabra
function revealWord(word){
  const row = state.currentRow
  let tmp = {...state.letters}
  const animation_time = 100
  for(let i = 0; i < COLUMNS; i++){
    const box = document.getElementById(`box${row}${i}`)
    const letter = box.textContent

    setTimeout(() => {
      if (letter == state.secretWord[i]){
        box.classList.add('right')
        tmp[letter]--;
      }else if(state.secretWord.includes(letter) && tmp[letter]>0){
        box.classList.add('wrong')
        tmp[letter]--;
      }else{
        box.classList.add('empty')
      }
    }, ((i+1) * animation_time))

    box.classList.add('animated')
    box.style.animationDelay = `${(animation_time * i)}ms`
  }

  const isWinner = state.secretWord === word
  const isGameOver = state.currentRow + 1 >= ROWS
  state.gameFinished = isWinner || isGameOver 

  setTimeout(() => {
    if (isWinner){
      alert('Ganaste bro')
      localStorage.setItem('wins', parseInt(localStorage.getItem('wins')) + 1)
    }else if(isGameOver){
      alert(`Tan facil que era adivinar... ${state.secretWord}?`)
      localStorage.setItem('fails', parseInt(localStorage.getItem('fails')) + 1)
    }
    score()
  }, (COLUMNS) * animation_time+100)
}

// Función para iniciar el juego
function startup(){
  console.log(state.secretWord)
  const game = document.getElementById('game')
  drawGrid(game)
  registerKeyEvents()
}

// Función para anotar puntos
function score(){
  if (localStorage.getItem('wins') == null || localStorage.getItem('fails') == null) {
    localStorage.setItem('wins', 0)
    localStorage.setItem('fails', 0)
  }
  document.getElementById('wins').innerHTML = localStorage.getItem('wins')
  document.getElementById('fails').innerHTML = localStorage.getItem('fails')
}

const reload = document.getElementById('reload')
const home = document.getElementById('home')

reload.addEventListener('click', resetGrid)
home.addEventListener('click', () =>  window.location.href = 'index.html')

// Acá comienza todo
score()
getInformation()