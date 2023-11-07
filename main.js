import './style.css'

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

  for(let x = 0; x < 6; x++){
    for(let y = 0; y < 5; y++){
      drawBox(grid, x, y)
    }
  }

  container.appendChild(grid)
}

function startup(){
  const game = document.getElementById('game')
  drawGrid(game)
}

startup();