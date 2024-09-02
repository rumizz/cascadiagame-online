import { checkDuplicateTokens, generateDisplayTile } from "../scripts";
import state from "../state";

export function setupInitialTokensAndTiles() {
  let initialTiles = [];
  let initialTokens = [];
  for (let i = 0; i < 4; i++) {
    var thisTile = state.allTiles[i];
    initialTiles.push(thisTile);
  }
  for (let j = 0; j < 4; j++) {
    var thisToken = state.allTokens[j];
    initialTokens.push(thisToken);
  }

  var initialTokenTileHTML = "";

  // again, since there are 4 combinations of tiles+tokens container, the below loop is actioned 4 times
  for (let k = 0; k < 4; k++) {
    // the below code generates the HTML to store information for each tile and token combination and then inserts it into the DOM
    initialTokenTileHTML += '<div class="tokenTileContainer" tokenTileNum="' + k + '">';
    initialTokenTileHTML += generateDisplayTile(initialTiles[k]);
    initialTokenTileHTML += '<div class="tokenContainer" wildlifetoken="' + initialTokens[k] + '">';
    initialTokenTileHTML += '<img class="token" src="img/tokens/' + initialTokens[k] + '.png" />';
    initialTokenTileHTML += "</div>";
    initialTokenTileHTML += "</div>";
  }

  $("#tileTokenContainer").append(initialTokenTileHTML);

  checkDuplicateTokens();
}
