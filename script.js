let players = JSON.parse(localStorage.getItem("players")) || [];
let selectedIndex = null;

const defaultTruths = ["What is your secret?", "Biggest fear?"];
const defaultDares = ["Dance for 10 sec", "Sing a song"];

// SAVE PLAYERS
function savePlayers() {
  localStorage.setItem("players", JSON.stringify(players));
}

// ADD PLAYER
function addPlayer() {
  const input = document.getElementById("playerInput");
  if (!input.value) return;

  players.push(input.value);
  input.value = "";
  savePlayers();
  renderPlayers();
}

// DISPLAY PLAYERS
function renderPlayers() {
  const circle = document.getElementById("playerCircle");
  if (!circle) return;

  circle.innerHTML = "";

  const angleStep = (2 * Math.PI) / players.length;

  players.forEach((p, i) => {
    const angle = i * angleStep;
    const x = 150 + 120 * Math.cos(angle);
    const y = 150 + 120 * Math.sin(angle);

    const div = document.createElement("div");
    div.className = "player";
    div.style.left = x + "px";
    div.style.top = y + "px";
    div.innerText = p;

    if (i === selectedIndex) div.classList.add("highlight");

    circle.appendChild(div);
  });
}

// LOAD PLAYERS ON START
window.onload = () => {
  renderPlayers();
};

// SPIN
function spinBottle() {
  if (players.length === 0) return;

  const bottle = document.getElementById("bottle");
  const spinBtn = document.getElementById("spinBtn");

  spinBtn.disabled = true;

  const deg = 360 * 5 + Math.random() * 360;
  bottle.style.transform = `rotate(${deg}deg)`;

  setTimeout(() => {
    selectedIndex = Math.floor(Math.random() * players.length);
    renderPlayers();

    document.getElementById("truthBtn").disabled = false;
    document.getElementById("dareBtn").disabled = false;

    spinBtn.disabled = false;
  }, 3000);
}

// NAVIGATION
function goToPage(page) {
  window.location.href = page;
}

function goBack() {
  window.location.href = "index.html";
}

// RESET
function resetGame() {
  if (confirm("Clear all data?")) {
    localStorage.clear();
    players = [];
    selectedIndex = null;
    renderPlayers();
    location.reload();
  }
}

// ---------- CARDS SYSTEM ----------

// LOAD CARDS
function loadCards(type) {
  const container = document.getElementById("cardsContainer");

  let userData = JSON.parse(localStorage.getItem(type)) || [];
  let defaults = type === "truth" ? defaultTruths : defaultDares;

  container.innerHTML = "";

  defaults.forEach(text => {
    container.appendChild(createCard(text, false, type));
  });

  userData.forEach((text, index) => {
    container.appendChild(createCard(text, true, type, index));
  });
}

// CREATE CARD
function createCard(text, isUser, type, index) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">Click</div>
      <div class="card-back">${text}</div>
    </div>
  `;

  card.onclick = () => card.classList.toggle("flip");

  if (isUser) {
    const controls = document.createElement("div");

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.onclick = (e) => {
      e.stopPropagation();
      editCard(type, index);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteCard(type, index);
    };

    controls.appendChild(editBtn);
    controls.appendChild(deleteBtn);
    card.appendChild(controls);
  }

  return card;
}

// ADD TRUTH
function addTruth() {
  const input = document.getElementById("truthInput");
  if (!input.value) return;

  let data = JSON.parse(localStorage.getItem("truth")) || [];
  data.push(input.value);
  localStorage.setItem("truth", JSON.stringify(data));

  input.value = "";
  loadCards("truth");
}

// ADD DARE
function addDare() {
  const input = document.getElementById("dareInput");
  if (!input.value) return;

  let data = JSON.parse(localStorage.getItem("dare")) || [];
  data.push(input.value);
  localStorage.setItem("dare", JSON.stringify(data));

  input.value = "";
  loadCards("dare");
}

// EDIT
function editCard(type, index) {
  let data = JSON.parse(localStorage.getItem(type)) || [];

  let newText = prompt("Edit:", data[index]);
  if (newText) {
    data[index] = newText;
    localStorage.setItem(type, JSON.stringify(data));
    loadCards(type);
  }
}

// DELETE
function deleteCard(type, index) {
  let data = JSON.parse(localStorage.getItem(type)) || [];

  data.splice(index, 1);
  localStorage.setItem(type, JSON.stringify(data));
  loadCards(type);
}

// SHUFFLE
function shuffleCards(type) {
  let data = JSON.parse(localStorage.getItem(type)) || [];
  data.sort(() => Math.random() - 0.5);
  localStorage.setItem(type, JSON.stringify(data));
  loadCards(type);
}