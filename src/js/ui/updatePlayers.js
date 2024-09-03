import { natureTokenImage } from "../images";
import { generateMapHTML } from "../scripts";
import state from "../state";

export function updatePlayers() {
  for (let player of state.players) {
    let item = document.querySelector(`.player[data-id="${player.id}"]`);
    if (item) {
      item.querySelector(".natureToken span").innerText = player.natureCubesNum || 0;
      item.querySelector("h3").innerHTML = `${player.id === state.currentPlayer ? "<span>⭐</span>" : ""}${
        player.name
      }`;
      item.querySelector(".turnsLeft span").innerText = player.turnsLeft ?? "?";
      item.querySelector(".modal .mapContainer").innerHTML = generateMapHTML(JSON.parse(player.mapData), false);
    } else {
      let newItem = document.createElement("div");
      newItem.classList.add("player");
      newItem.dataset.id = player.id;
      newItem.innerHTML = `
        <h3>${player.id === state.currentPlayer ? "<span>⭐</span>" : ""}${player.name}</h3>
        <div class="natureToken row">
          <img width="24" src="${natureTokenImage}" alt="turns" />
          <span>${player.natureCubesNum || 0}</span>
        </div>
        <div class="turnsLeft row">
          ↺
          <span>${player.turnsLeft || "?"}</span>
        </div>
        <div class="modal">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">${player.name}</p>
              <button class="delete closeModalTrigger" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
              <div class="mapContainer hideWhenShowingGoalsMobile hideWhenShowingGoalsTablet">
              
              </div>
            </section>
            <footer class="modal-card-foot"></footer>
          </div>
        </div>
      `;
      if (player.id !== state.clientId) {
        newItem.style.cursor = "pointer";
        newItem.addEventListener("click", () => {
          newItem.querySelector(".modal").classList.add("is-active");
          let scrollElement = newItem.querySelector(".modal .modal-card-body");
          scrollElement.scrollLeft = (scrollElement.scrollWidth - scrollElement.clientWidth) / 2;
          scrollElement.scrollTop = (scrollElement.scrollHeight - scrollElement.clientHeight) / 2;
        });
      }
      playersContainer.appendChild(newItem);
    }
  }
}
