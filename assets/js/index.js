import '../css/style.css'

const divs = document.querySelectorAll('.div')
const reset = document.getElementById('reset')

reset.addEventListener('click', deleteScore)

// divs.length = cantidad de dificultades diferentes, en este caso son [4,8]
for (let i = 0; i < divs.length; i++) {
  divs[i].addEventListener('click', function() {
    begin(divs[i].innerText)
  })
}

function begin(value){
  localStorage.setItem('columns', value)
  window.location.href = 'game.html'
}

function score(){
  if (localStorage.getItem('wins') == null || localStorage.getItem('fails') == null) {
    localStorage.setItem('wins', 0)
    localStorage.setItem('fails', 0)
  }
  document.getElementById('wins').innerHTML = localStorage.getItem('wins')
  document.getElementById('fails').innerHTML = localStorage.getItem('fails')
}

function deleteScore(){
  localStorage.setItem('wins', 0)
  localStorage.setItem('fails', 0)
  score()
}

score()