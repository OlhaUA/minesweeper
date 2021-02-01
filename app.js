document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const initial = document.querySelector('.scrin');
  const minesLeft = document.querySelector('#mines-left');
  const result = document.querySelector('#result');
  const selectElem = document.getElementById('level-select');
  const gameAgain = document.getElementById('try-again');
  let width = 10;
  let mineAmount = 20;
  let flags = 0;
  let squares = [];
  let isGameOver = false;
  let called = false;
  let timeLeft = 0;

  initial.innerHTML = 'Please select the difficulty level.<br>Good luck! :)';

  const timeLeftDisplay = document.getElementById('time-left');

  let timer;

  function countDown() {
    if (timeLeft <= 0) {
      clearInterval((timeLeft = 0));
      gameOver();
    }
    timeLeftDisplay.innerHTML = timeLeft;
    timeLeft -= 1;
  }

  selectElem.addEventListener('change', (e) => {
    if (e.target.value == 20) {
      mineAmount = 15;
      timeLeft = 130;
    }
    if (e.target.value == 35) {
      mineAmount = 30;
      timeLeft = 160;
    }
    minesLeft.innerHTML = mineAmount;
    grid.classList.remove('scrin');
    initial.innerHTML = '';
    if (!called) {
      createBoard();
    }
    timer = setInterval(countDown, 1000);
  });

  // create board
  function createBoard() {
    called = true;

    minesLeft.innerHTML = mineAmount;

    // get shuffled game array with random mines
    const minesArray = Array(mineAmount).fill('mine');
    const emptyArray = Array(width * width - mineAmount).fill('valid');
    const gameArray = emptyArray.concat(minesArray);
    // const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    // The Fisher-Yates Algorithm
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        // destructuring assignment
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const shuffledArray = shuffleArray(gameArray);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');
      square.setAttribute('id', i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      square.addEventListener('click', function () {
        click(square);
      });

      // right click for flag
      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    }

    // add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('mine'))
          total++;
        if (
          i > 9 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains('mine')
        )
          total++;
        if (i > 10 && squares[i - width].classList.contains('mine')) total++;
        if (
          i >= 11 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains('mine')
        )
          total++;
        if (
          i <= 98 &&
          !isRightEdge &&
          squares[i + 1].classList.contains('mine')
        )
          total++;
        if (
          i < 90 &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains('mine')
        )
          total++;
        if (
          i <= 88 &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains('mine')
        )
          total++;
        if (i <= 89 && squares[i + width].classList.contains('mine')) total++;
        squares[i].setAttribute('data', total);
      }
    }
  }
  // createBoard();

  // add flag with right click
  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains('checked') && flags < mineAmount) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag');
        square.innerHTML = '🚩';
        flags++;
        minesLeft.innerHTML = mineAmount - flags;
        checkForWin();
      } else {
        square.classList.remove('flag');
        square.innerHTML = '';
        flags--;
        minesLeft.innerHTML = mineAmount - flags;
      }
    }
  }

  // click on square actions
  function click(square) {
    let currentId = square.id;
    if (isGameOver) return;
    if (
      square.classList.contains('checked') ||
      square.classList.contains('flag')
    )
      return;
    if (square.classList.contains('mine')) {
      gameOver();
    } else {
      let total = square.getAttribute('data');
      if (total != 0) {
        square.classList.add('checked');
        if (total == 1) square.classList.add('one');
        if (total == 2) square.classList.add('two');
        if (total == 3) square.classList.add('three');
        if (total == 4) square.classList.add('four');
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add('checked');
  }

  // check neighboring squares once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = parseInt(currentId) - 1;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = parseInt(currentId) + 1 - width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 10) {
        const newId = parseInt(currentId) - width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = parseInt(currentId) - 1 - width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = parseInt(currentId) + 1;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = parseInt(currentId) - 1 + width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = parseInt(currentId) + 1 + width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 89) {
        const newId = parseInt(currentId) + width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  // game over
  function gameOver() {
    result.innerHTML = 'Game Over. Try again!';
    isGameOver = true;
    clearInterval(timer);

    // show all the mines
    squares.forEach((square) => {
      if (square.classList.contains('mine')) {
        square.innerHTML = '💥';
        square.classList.remove('mine');
        square.classList.add('checked');
      }
    });
  }

  function checkForWin() {
    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains('flag') &&
        squares[i].classList.contains('mine')
      ) {
        matches++;
      }
      if (matches === mineAmount) {
        result.innerHTML = 'YOU WIN!😊';
        isGameOver = true;
        clearInterval(timer);
      }
    }
  }

  // try game again
  function tryAgain() {
    window.location.reload();
  }

  gameAgain.addEventListener('click', tryAgain);
});
