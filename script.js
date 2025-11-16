async function loadGames() {
  try {
    const res = await fetch("games.json");
    const games = await res.json();

    const gameGrid = document.getElementById("gameGrid");
    const gameCount = document.getElementById("gameCount");
    const searchInput = document.getElementById("searchInput");

    gameGrid.innerHTML = "";

    let availableGames = games.filter(g => g.entry);
    gameCount.textContent = `${availableGames.length} Game${availableGames.length !== 1 ? "s" : ""}`;

    availableGames.forEach(game => {
      const card = document.createElement("div");
      card.className = "game-card";

      card.innerHTML = `
        <div class="game-card-header">
          <div class="game-icon">🎮</div>
          <div class="game-info">
            <div class="game-title">${game.title}</div>
            <div class="game-status">
              <span class="status-dot"></span><span>Ready to play</span>
            </div>
          </div>
        </div>
      `;

      card.onclick = () => openGameMenu(game, card);
      gameGrid.appendChild(card);
    });

    searchInput.addEventListener("input", e => {
      const term = e.target.value.toLowerCase();
      for (const card of gameGrid.children) {
        const title = card.querySelector(".game-title").textContent.toLowerCase();
        card.style.display = title.includes(term) ? "block" : "none";
      }
    });

  } catch (err) {
    alert("Could not load games.json — make sure it’s next to index.html");
  }
}

loadGames();

let activeCard = null;

function openGameMenu(game, card) {
  const overlay = document.getElementById("gameOverlay");
  const welcomeScreen = document.getElementById("welcomeScreen");

  if (activeCard) activeCard.classList.remove("active");
  card.classList.add("active");
  activeCard = card;

  welcomeScreen.classList.add("hidden");

  document.getElementById("overlayTitle").textContent = game.title;
  document.getElementById("overlayArt").src = game.art || "default-art.png";
  document.getElementById("overlayDesc").textContent = game.description || "Ready to play";

  overlay.classList.add("open");

  document.getElementById("overlayPlay").onclick = () => startGame(game);
  document.getElementById("overlayBack").onclick = () => {
    overlay.classList.remove("open");
    activeCard.classList.remove("active");
    activeCard = null;
    welcomeScreen.classList.remove("hidden");
  };
}

function startGame(game) {
  const overlay = document.getElementById("gameOverlay");
  const gameFrame = document.getElementById("gameFrame");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const backBtn = document.getElementById("backBtn");

  gameFrame.src = game.entry;
  gameFrame.classList.add("visible");

  overlay.classList.remove("open");

  fullscreenBtn.classList.remove("hidden");
  backBtn.classList.remove("hidden");
}

document.getElementById("fullscreenBtn").onclick = () => {
  const frame = document.getElementById("gameFrame");
  if (frame.requestFullscreen) frame.requestFullscreen();
};

document.getElementById("backBtn").onclick = () => {
  const frame = document.getElementById("gameFrame");
  const welcomeScreen = document.getElementById("welcomeScreen");

  frame.classList.remove("visible");
  frame.src = "";

  welcomeScreen.classList.remove("hidden");

  document.getElementById("fullscreenBtn").classList.add("hidden");
  document.getElementById("backBtn").classList.add("hidden");

  if (activeCard) activeCard.classList.remove("active");
  activeCard = null;
};
