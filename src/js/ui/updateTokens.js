import { tokenImage } from "../images";
import { checkDuplicateTokens, generateDisplayTile } from "../scripts";
import state from "../state";

let isAnimating = false;

function generateTokenContainer(i, tile, token) {
  let newElem = document.createElement("div");
  newElem.classList.add("tokenTileContainer");
  newElem.setAttribute("tokenTileNum", i);
  newElem.innerHTML = `
      ${generateDisplayTile(tile)}
      <div class="tokenContainer" wildlifetoken="${token}">
        <img class="token" src="${tokenImage[token]}" />
      </div>
    `;
  return newElem;
}
function generatePool() {
  tileTokenContainer.childNodes.forEach((elem) => {
    elem.classList.add("old");
  });
  for (let k = 0; k < 4; k++) {
    let newElem = generateTokenContainer(k, state.currentTiles[k], state.currentTokens[k]);
    newElem.style.display = "none";
    tileTokenContainer.appendChild(newElem);
  }
  setTimeout(() => {
    tileTokenContainer.querySelectorAll(".tokenTileContainer.old").forEach((elem) => {
      elem.remove();
    });
    tileTokenContainer.querySelectorAll(".tokenTileContainer").forEach((elem) => {
      elem.style.display = "block";
    });
  }, 100);
}

export function updateTokensAndTiles() {
  if (isAnimating) {
    return;
  }
  isAnimating = true;

  let needsAnimation =
    tileTokenContainer.querySelectorAll(".tokenTileContainer .tileContainer").length > 0 &&
    tileTokenContainer.querySelectorAll(".tokenTileContainer .tileContainer").length < 4;

  if (needsAnimation) {
    let newElem = generateTokenContainer(4, state.currentTiles[3], state.currentTokens[3]);
    tileTokenContainer.appendChild(newElem);

    setTimeout(() => {
      let reachedGap = false;
      for (let i = 0; i < 4; i++) {
        if (!document.querySelector(`.tokenTileContainer[tokentilenum="${i}"] .tokenContainer .token`)) {
          reachedGap = true;
        }
        let next = `.tokenTileContainer[tokentilenum="${i + 1}"] .tokenContainer .token`;
        let current = `.tokenTileContainer[tokentilenum="${i}"] .tokenContainer`;
        if (reachedGap && document.querySelector(next)) {
          $(next).addClass("movingElementOpacity");
          $(next).parentToAnimate($(current), 1000);
        }
      }
      reachedGap = false;
      for (let i = 0; i < 4; i++) {
        if (!document.querySelector(`.tokenTileContainer[tokentilenum="${i}"] .tileContainer`)) {
          reachedGap = true;
        }
        let next = `.tokenTileContainer[tokentilenum="${i + 1}"] .tileContainer`;
        let current = `.tokenTileContainer[tokentilenum="${i}"]`;
        if (reachedGap && document.querySelector(next)) {
          //$(next).addClass("movingElementOpacity");
          $(next).parentToAnimate($(current), 1000);
        }
      }
      $(".tokenTileContainer.inactive").removeClass("inactive");
      $(`.tokenTileContainer[tokentilenum="4"]`).remove();
      setTimeout(() => {
        isAnimating = false;
        generatePool();
      }, 1000);
    }, 10);
  } else {
    isAnimating = false;
    generatePool();
    checkDuplicateTokens();
  }
}
