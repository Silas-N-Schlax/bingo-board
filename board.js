document.getElementById('generate').addEventListener('click', generateBoard);
document.getElementById('print').addEventListener('click', printBoard);
document.getElementById('reset').addEventListener('click', resetBoard);

function generateBoard() {
  console.log('Generating board...');
  const board = document.getElementById('board');
  board.innerHTML = '';

  const letters = ['B', 'I', 'N', 'G', 'O'];
  const headerRow = document.createElement('tr');
  letters.forEach(letter => {
    const th = document.createElement('th');
    th.innerText = letter;
    headerRow.appendChild(th);
  });
  board.appendChild(headerRow);

  const numbers = [];
  for (let i = 0; i < 5; i++) {
    numbers[i] = shuffleArray(generateNumbers(i * 15 + 1, i * 15 + 15));
    console.log(`Column ${letters[i]} numbers:`, numbers[i]);
  }

  for (let row = 0; row < 5; row++) {
    const tr = document.createElement('tr');
    for (let col = 0; col < 5; col++) {
      const td = document.createElement('td');
      if (row === 2 && col === 2) {
        td.innerText = 'FREE';
        td.classList.add('free', 'marked');
      } else {
        td.innerText = numbers[col][row];
        td.addEventListener('click', () => handleCellClick(td));
      }
      tr.appendChild(td);
    }
    board.appendChild(tr);
  }
  saveBoardState();
}

function generateNumbers(start, end) {
  const numbers = [];
  for (let i = start; i <= end; i++) {
    numbers.push(i);
  }
  return numbers;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function handleCellClick(cell) {
  if (!cell.classList.contains('free')) {
    cell.classList.toggle('marked');
    checkForBingo();
    saveBoardState();
  }
}

function checkForBingo() {
  const board = document.getElementById('board');
  const rows = board.getElementsByTagName('tr');
  const cells = [];
  for (let i = 1; i < rows.length; i++) {
    cells.push(rows[i].getElementsByTagName('td'));
  }

  const directions = [
    // Horizontal
    [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
    [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]],
    [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]],
    [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4]],
    [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4]],
    // Vertical
    [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
    [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]],
    [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]],
    [[0, 3], [1, 3], [2, 3], [3, 3], [4, 3]],
    [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4]],
    // Diagonal
    [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]],
    [[0, 4], [1, 3], [2, 2], [3, 1], [4, 0]]
  ];

  let bingo = false;
  for (const direction of directions) {
    if (direction.every(([row, col]) => cells[row][col].classList.contains('marked') || cells[row][col].classList.contains('free'))) {
      bingo = true;
      break;
    }
  }

  const allMarked = Array.from(cells).every(row => Array.from(row).every(cell => cell.classList.contains('marked') || cell.classList.contains('free')));

  if (bingo || allMarked) {
    displayBingo(allMarked);
  }
}

function displayBingo(isBlackout) {
  const bingoMessage = document.createElement('div');
  bingoMessage.innerText = isBlackout ? 'BLACKOUT BINGO 😎' : 'BINGO!!';
  bingoMessage.classList.add('bingo-message');
  document.body.appendChild(bingoMessage);

  if (isBlackout) {
    document.body.style.backgroundColor = 'black';
    startConfetti();
    startFireworks();
    localStorage.setItem('blackout', 'true');
  }

  setTimeout(() => {
    document.body.removeChild(bingoMessage);
  }, 2000);
}

function startConfetti() {
  const confettiScript = document.createElement('script');
  confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js';
  confettiScript.onload = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end || localStorage.getItem('blackout') === 'true') {
        requestAnimationFrame(frame);
      }
    }());
  };
  document.body.appendChild(confettiScript);
}

function startFireworks() {
  const fireworkInterval = setInterval(() => {
    if (localStorage.getItem('blackout') !== 'true') {
      clearInterval(fireworkInterval);
      return;
    }

    const firework = document.createElement('div');
    firework.classList.add('firework');
    document.body.appendChild(firework);

    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight * 0.75;

    firework.style.left = `${x}px`;
    firework.style.top = `${window.innerHeight}px`;

    setTimeout(() => {
      firework.style.top = `${y}px`;
      setTimeout(() => {
        firework.classList.add('explode');
        setTimeout(() => {
          document.body.removeChild(firework);
        }, 500);
      }, 1000);
    }, 100);
  }, 2000);
}

function stopConfetti() {
  const confettiScript = document.querySelector('script[src*="confetti"]');
  if (confettiScript) {
    document.body.removeChild(confettiScript);
  }
}

function printBoard() {
  const buttons = document.getElementById('buttons');
  buttons.style.display = 'none';

  const board = document.getElementById('board');
  const cells = board.getElementsByTagName('td');
  const originalStyles = [];

  for (let i = 0; i < cells.length; i++) {
    originalStyles.push({
      backgroundColor: cells[i].style.backgroundColor,
      color: cells[i].style.color
    });
    cells[i].style.backgroundColor = 'white';
    cells[i].style.color = 'black';
  }

  window.print();

  for (let i = 0; i < cells.length; i++) {
    cells[i].style.backgroundColor = originalStyles[i].backgroundColor;
    cells[i].style.color = originalStyles[i].color;
  }

  buttons.style.display = 'flex';
}

function saveBoardState() {
  const board = document.getElementById('board');
  const rows = board.getElementsByTagName('tr');
  const boardState = [];
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName('td');
    const rowState = [];
    for (let j = 0; j < cells.length; j++) {
      rowState.push({
        text: cells[j].innerText,
        marked: cells[j].classList.contains('marked')
      });
    }
    boardState.push(rowState);
  }
  localStorage.setItem('bingoBoardState', JSON.stringify(boardState));
}

function loadBoardState() {
  const boardState = JSON.parse(localStorage.getItem('bingoBoardState'));
  if (!boardState) return;

  const board = document.getElementById('board');
  board.innerHTML = '';

  const letters = ['B', 'I', 'N', 'G', 'O'];
  const headerRow = document.createElement('tr');
  letters.forEach(letter => {
    const th = document.createElement('th');
    th.innerText = letter;
    headerRow.appendChild(th);
  });
  board.appendChild(headerRow);

  boardState.forEach(rowState => {
    const tr = document.createElement('tr');
    rowState.forEach(cellState => {
      const td = document.createElement('td');
      td.innerText = cellState.text;
      if (cellState.text === 'FREE') {
        td.classList.add('free', 'marked');
      } else if (cellState.marked) {
        td.classList.add('marked');
      }
      td.addEventListener('click', () => handleCellClick(td));
      tr.appendChild(td);
    });
    board.appendChild(tr);
  });

  if (localStorage.getItem('blackout') === 'true') {
    document.body.style.backgroundColor = 'black';
    startConfetti();
    startFireworks();
  }
}

function resetBoard() {
  const board = document.getElementById('board');
  const rows = board.getElementsByTagName('tr');
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName('td');
    for (let j = 0; j < cells.length; j++) {
      cells[j].classList.remove('marked');
    }
  }
  localStorage.removeItem('blackout');
  document.body.style.backgroundColor = '';
  stopConfetti();
  saveBoardState();
}

document.addEventListener('DOMContentLoaded', loadBoardState);
