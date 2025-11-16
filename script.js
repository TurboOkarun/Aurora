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

    // Build game cards
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

      // When clicked → open Xbox-style game menu
      card.onclick = () => openGameMenu(game);

      gameGrid.appendChild(card);
    });

    // Search filter
    searchInput.addEventListener("input", e => {
      const term = e.target.value.toLowerCase();
      for (const card of gameGrid.children) {
        const title = card.querySelector(".game-title").textContent.toLowerCase();
        card.style.display = title.includes(term) ? "block" : "none";
      }
    });

  } catch (err) {
    console.error(err);
    alert("Could not load games.json — make sure it’s next to index.html");
  }
}

loadGames();

/* -------------------------------
   XBOX-STYLE GAME MENU OVERLAY
--------------------------------*/
function openGameMenu(game) {
  // fill overlay info
  document.getElementById("overlayTitle").textContent = game.title;
  document.getElementById("overlayDescription").textContent = game.description || "";
  document.getElementById("overlayArt").src = game.art || "default_art.jpg";

  // play button
  document.getElementById("overlayPlay").onclick = () => {
    const gameFrame = document.getElementById("gameFrame");
    const welcomeScreen = document.getElementById("welcomeScreen");

    gameFrame.src = game.entry;
    gameFrame.classList.add("visible");
    welcomeScreen.classList.add("hidden");

    // hide overlay
    closeGameMenu();

    document.getElementById("fullscreenBtn").classList.remove("hidden");
    document.getElementById("backBtn").classList.remove("hidden");
  };

  // show overlay
  document.getElementById("gameOverlay").style.display = "flex";
}

function closeGameMenu() {
  document.getElementById("gameOverlay").style.display = "none";
}

/* -------------------------------
   FRAME CONTROLS (Fullscreen/Back)
--------------------------------*/
document.getElementById("fullscreenBtn").onclick = () => {
  const frame = document.getElementById("gameFrame");
  if (frame.requestFullscreen) frame.requestFullscreen();
};

document.getElementById("backBtn").onclick = () => {
  document.getElementById("gameFrame").classList.remove("visible");
  document.getElementById("gameFrame").src = "";
  document.getElementById("welcomeScreen").classList.remove("hidden");
  document.getElementById("fullscreenBtn").classList.add("hidden");
  document.getElementById("backBtn").classList.add("hidden");
};
