const board = document.getElementById("board");
const messageDialog = document.getElementById("messageDialog");
const messageInput = document.getElementById("message");
const soundIcon = document.querySelector("#sound");
const audio = new Audio("sound.mp3");
let audioEnabled = false;

function toggleSound() {
  audioEnabled = !audioEnabled;
  if (audioEnabled) {
    soundIcon.src = "sound-on.svg";
    return;
  }
  soundIcon.src = "sound-off.svg";
}

const columns = 22,
  rows = 6;
const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
const randomColors = [
  "#dbdbdc",
  "#ed0e0e",
  "#e9730b",
  "#22c264",
  "#1b85c4",
  "#a052a8",
];

function createBoard() {
  for (let i = 0; i < columns * rows; i++) {
    const tile = document.createElement("div");

    tile.className = "tile";
    tile.textContent = " ";
    const hinge = document.createElement("div");
    hinge.className = "hinge";
    tile.appendChild(hinge);
    board.appendChild(tile);
  }
}

function updateBoard(text) {
  return new Promise((resolve) => {
    const tiles = document.querySelectorAll(".tile");
    let completed = 0; // Track how many tiles have finished updating

    tiles.forEach((tile, i) => {
      const newChar = text[i] || " ";
      if (tile.textContent !== newChar) {
        let cycleCount = Math.floor(Math.random() * 5) + 5;
        let cycleInterval = setInterval(() => {
          tile.textContent =
            randomChars[Math.floor(Math.random() * randomChars.length)];
          tile.style.background =
            randomColors[Math.floor(Math.random() * randomColors.length)];
          cycleCount--;
          if (cycleCount <= 0) {
            clearInterval(cycleInterval);
            const hinge = document.createElement("div");
            hinge.className = "hinge";
            tile.textContent = newChar;
            tile.appendChild(hinge);
            tile.style.background = "rgb(33, 33, 33)";

            completed++; // Mark this tile as completed

            // If all tiles are updated, resolve the promise
            if (completed === tiles.length) {
              resolve();
            }
          }
        }, 100);
      } else {
        completed++; // If no change is needed, count it as completed
        if (completed === tiles.length) {
          resolve();
        }
      }
    });
  });
}
function displayMessage() {
  if (audioEnabled) {
    audio.play();
  }
  let text = messageInput.value
    .toUpperCase()
    .split("\n")
    .map((line) => line.padEnd(columns, " "))
    .slice(0, rows)
    .join("");
  text = text.padEnd(columns * rows, " ").slice(0, columns * rows);
  updateBoard(text).then(() => {
    audio.pause();
  });
}

function toggleDialog() {
  messageDialog.style.display =
    messageDialog.style.display === "none" ? "block" : "none";
}

createBoard();
