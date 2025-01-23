let numbers = Array.from({ length: 75}, (_, i) => i + 1)
let currentNumbers = loadCurrentNumbers() || [...numbers] // load from cache or initialize

//on click of button do run function start()
document.getElementById('start').addEventListener('click', start)
document.getElementById('nextNumber').addEventListener('click', nextNumber)
document.getElementById('restart').addEventListener('click', reset)
document.getElementById('showAll').addEventListener('click', showAll)

function start() {
  const boxes = document.querySelectorAll('.box')
  boxes.forEach(box => box.style.backgroundColor = 'lightblue')
  boxes.forEach(box => box.style.color = 'lightblue')
  currentNumbers = shuffle([...numbers]) // reset currentNumbers to shuffled numbers
  saveCurrentNumbers()
  saveBoardState()
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array; 
}

function nextNumber() {
  if (currentNumbers.length === 0) {
    alert('All numbers have been called')
    return
  }
  const currentNumber = document.getElementById('currentNumber')
  const lastNumber1 = document.getElementById('l1')
  const lastNumber2 = document.getElementById('l2')
  const lastNumber3 = document.getElementById('l3')
  const nextNumber = nextNumberWithLetter()
  lastNumber3.innerText = lastNumber2.innerText
  lastNumber2.innerText = lastNumber1.innerText
  lastNumber1.innerText = currentNumber.innerText
  currentNumber.innerText = nextNumber[1]

  //reveal number in bingo card
  const boxes = document.querySelectorAll('.box')
  boxes.forEach(box => {
    if (box.innerText === nextNumber[0].toString()) {
      box.style.backgroundColor = '#dbdbdb'
      box.style.color = 'black'
    }
  })
  saveCurrentNumbers()
  saveBoardState()
}

function nextNumberWithLetter() {
  console.log(currentNumbers)
  const nextNumber = currentNumbers.pop()
  let formatted = ''
  if (nextNumber <= 15) {
    formatted = `B${nextNumber}`
  } else if (nextNumber <= 30) {
    formatted = `I${nextNumber}`
  } else if (nextNumber <= 45) {
    formatted = `N${nextNumber}`
  } else if (nextNumber <= 60) {
    formatted = `G${nextNumber}`
  } else {
    formatted = `O${nextNumber}`
  }
  return [nextNumber, formatted]
}

function reset() {
  const boxes = document.querySelectorAll('.box')
  boxes.forEach(box => box.style.backgroundColor = 'lightblue')
  boxes.forEach(box => box.style.color = 'lightblue')
  document.getElementById('currentNumber').innerText = 'K00'
  document.getElementById('l1').innerText = 'K00'
  document.getElementById('l2').innerText = 'K00'
  document.getElementById('l3').innerText = 'K00'
  currentNumbers = [...numbers]
  saveCurrentNumbers()
  saveBoardState()
}

function showAll() {
  const boxes = document.querySelectorAll('.box')
  boxes.forEach(box => box.style.backgroundColor = '#dbdbdb')
  boxes.forEach(box => box.style.color = 'black')
  document.getElementById('currentNumber').innerText = 'K00'
  document.getElementById('l1').innerText = 'K00'
  document.getElementById('l2').innerText = 'K00'
  document.getElementById('l3').innerText = 'K00'
  saveCurrentNumbers()
  saveBoardState()
}

function saveCurrentNumbers() {
  localStorage.setItem('currentNumbers', JSON.stringify(currentNumbers))
}

function loadCurrentNumbers() {
  const savedNumbers = localStorage.getItem('currentNumbers')
  return savedNumbers ? JSON.parse(savedNumbers) : null
}

function saveBoardState() {
  const currentNumber = document.getElementById('currentNumber').innerText
  const lastNumbers = [
    document.getElementById('l1').innerText,
    document.getElementById('l2').innerText,
    document.getElementById('l3').innerText
  ]
  const boxes = Array.from(document.querySelectorAll('.box')).map(box => ({
    id: box.id,
    backgroundColor: box.style.backgroundColor,
    color: box.style.color
  }))
  localStorage.setItem('boardState', JSON.stringify({ currentNumber, lastNumbers, boxes }))
}

function loadBoardState() {
  const savedState = localStorage.getItem('boardState')
  if (savedState) {
    const { currentNumber, lastNumbers, boxes } = JSON.parse(savedState)
    document.getElementById('currentNumber').innerText = currentNumber
    document.getElementById('l1').innerText = lastNumbers[0]
    document.getElementById('l2').innerText = lastNumbers[1]
    document.getElementById('l3').innerText = lastNumbers[2]
    boxes.forEach(boxState => {
      const box = document.getElementById(boxState.id)
      box.style.backgroundColor = boxState.backgroundColor
      box.style.color = boxState.color
    })
  }
}

// Load the board state when the page loads
window.addEventListener('load', () => {
  loadCurrentNumbers()
  loadBoardState()
})