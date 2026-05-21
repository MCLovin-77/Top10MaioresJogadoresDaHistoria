const players = [
  {
    name: "Cristiano Ronaldo",
    aliases: ["cristiano ronaldo", "cristiano", "ronaldo", "ronaldo cristiano"]
  },
  {
    name: "D'alessandro",
    aliases: ["dalessandro", "d'alessandro", "alessandro"]
  },
  {
    name: "Alef Manga",
    aliases: ["alef manga", "alef", "manga"]
  },
  {
    name: "Wagner Love",
    aliases: ["wagner love", "wagner", "love"]
  },
  {
    name: "Cruyff",
    aliases: ["cruyff", "johan cruiff", "johan cruyff", "cruiff"]
  },
  {
    name: "Bernabei",
    aliases: ["bernabei"]
  },
  {
    name: "Alan Patrick",
    aliases: ["alan patrick", "alan", "patrick"]
  },
  {
    name: "Mercado",
    aliases: ["mercado"]
  },
  {
    name: "Sergio Ramos",
    aliases: ["sergio ramos", "sergio", "ramos"]
  },
  {
    name: "Thiago Galhardo",
    aliases: ["thiago galhardo", "thiago", "galhardo"]
  },
  {
    name: "Maldini",
    aliases: ["maldini", "paolo maldini"]
  },
  {
    name: "Beckenbauer",
    aliases: ["beckenbauer", "franz beckenbauer"]
  }
];

const statusEl = document.getElementById("status");
const attemptsEl = document.getElementById("attempts");
const playerListEl = document.getElementById("player-list");
const resetButton = document.getElementById("resetButton");
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");

let shuffledPlayers = [];
let revealed = [];
let attempts = 12;
let foundCount = 0;

function startGame() {
  shuffledPlayers = players.slice();
  revealed = Array(shuffledPlayers.length).fill(false);
  attempts = 12;
  foundCount = 0;
  statusEl.textContent = "Digite o nome de um jogador oculto e revele-o na lista.";
  attemptsEl.textContent = `${attempts} chances restantes`;
  guessInput.value = "";
  guessInput.disabled = false;
  guessButton.disabled = false;
  renderPlayerList();
}

function renderPlayerList() {
  playerListEl.innerHTML = "";

  shuffledPlayers.forEach((player, index) => {
    const item = document.createElement("div");
    item.className = "player-card";
    item.textContent = revealed[index] ? player.name : `top${index + 1}`;

    if (revealed[index]) {
      item.classList.add("revealed");
    }

    playerListEl.appendChild(item);
  });
}

function normalizeText(text) {
  return text
    .normalize("NFD")

    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function isMatch(guess, player) {
  const normalizedGuess = normalizeText(guess);
  if (normalizedGuess === normalizeText(player.name)) {
    return true;
  }
  return player.aliases.some((alias) => normalizeText(alias) === normalizedGuess);
}

function handleGuess() {
  const guess = guessInput.value.trim();
  if (!guess) {
    statusEl.textContent = "Digite o nome do jogador antes de chutar.";
    return;
  }

  const targetIndex = shuffledPlayers.findIndex((player, index) => !revealed[index] && isMatch(guess, player));
  attempts -= 1;
  attemptsEl.textContent = `${attempts} chances restantes`;

  if (targetIndex !== -1) {
    revealed[targetIndex] = true;
    foundCount += 1;
    statusEl.textContent = `Acertou! ${shuffledPlayers[targetIndex].name} foi revelado.`;
    guessInput.value = "";

    if (foundCount === shuffledPlayers.length) {
      statusEl.textContent = `Parabéns! Você acertou todos os jogadores com ${attempts} chances restantes.`;
      endGame();
      return;
    }
  } else {
    statusEl.textContent = "lagartiou pra dedéu";
    if (attempts <= 0) {
      statusEl.textContent = "Acabaram as chances! Jogo encerrado.";
      endGame();
      return;
    }
  }

  renderPlayerList();
}

function endGame() {
  guessInput.disabled = true;
  guessButton.disabled = true;
  for (let i = 0; i < revealed.length; i += 1) {
    if (!revealed[i]) revealed[i] = true;
  }
  renderPlayerList();
}

guessButton.addEventListener("click", handleGuess);
guessInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleGuess();
  }
});
resetButton.addEventListener("click", startGame);
startGame();
