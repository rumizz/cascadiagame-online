import { natureTokenImage } from "../images";
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
    } else {
      let newItem = document.createElement("div");
      newItem.classList.add("player");
      newItem.dataset.id = player.id;
      newItem.innerHTML = `
        <h3>${player.id === state.currentPlayer ? "<span>⭐</span>" : ""}${player.name}</h3>
        <div class="natureToken">
          <img width="24" src="${natureTokenImage}" alt="turns" />
          <span>${player.natureCubesNum || 0}</span>
        </div>
        <div class="turnsLeft">
          ↺
          <span>${player.turnsLeft || "?"}</span>
        </div>
      `;
      playersContainer.appendChild(newItem);
    }
  }
}
