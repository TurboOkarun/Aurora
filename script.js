async function loadGames() {
  try {
    const res = await fetch("games.json");
    const games = await res.json();
    const gameGrid = document.getElementById("gameGrid");
    const gameFrame = document.getElementById("gameFrame");
    const welcomeScreen = document.getElementById("welcomeScreen");
    const gameCount = document.getElementById("gameCount");
    const searchInput = document.getElementById("searchInput");
    gameGrid.innerHTML = "";
    let availableGames = games.filter(g => g.entry);
    gameCount.textContent = `${availableGames.length} Game${availableGames.length !== 1 ? "s" : ""}`;
    let activeCard = null;
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
      card.onclick = () => {
        if (activeCard) activeCard.classList.remove("active");
        card.classList.add("active");
        activeCard = card;
        welcomeScreen.classList.add("hidden");
        gameFrame.src = game.entry;
        gameFrame.classList.add("visible");
        document.getElementById("fullscreenBtn").classList.remove("hidden");
        document.getElementById("backBtn").classList.remove("hidden");
      };
      gameGrid.appendChild(card);
    });
    searchInput.addEventListener("input", e => {
      const term = e.target.value.toLowerCase();
      for (const card of gameGrid.children) {
        const title = card.querySelector(".game-title").textContent.toLowerCase();
        card.style.display = title.includes(term) ? "block" : "none";
      }
    });
  } catch {
    alert("Could not load games.json — make sure it’s next to index.html");
  }
}

loadGames();

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
