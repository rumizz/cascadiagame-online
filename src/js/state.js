import { arrayRemove, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { tiles } from "./data";
import { randomRotation } from "./util/randomRotation";
import { updateTokensAndTiles } from "./scripts";

class State {
  gameId = "";

  allTiles = [];
  allTokens = [];
  currentTiles = [];
  currentTokens = [];

  natureCubesNum = 0;

  init(gameId) {
    this.gameId = gameId;
    onSnapshot(doc(db, "games", gameId), (doc) => {
      if (!doc.exists()) {
        navigate("/");
        return;
      }
      let data = doc.data();
      console.log("Game data:", data);
      this.allTiles = data.allTileNums.map((num) =>
        tiles.find((tile) => tile.tileNum === num)
      );
      this.allTokens = data.allTokens;
      this.currentTokens = [];
      for (let i = 0; i < 4; i++) {
        this.currentTokens.push(this.allTokens[i]);
      }
      this.currentTiles = [];
      // draw 4 tiles and rotate them randomly if they have 2 habitats
      for (let i = 0; i < 4; i++) {
        var thisTile = this.allTiles[i];
        if (thisTile.habitats.length == 2) {
          thisTile.rotation = randomRotation(thisTile.tileNum);
        }
        this.currentTiles.push(thisTile);
      }
      console.log("tiles:", this.currentTiles);
      console.log("tokens:", this.currentTokens);

      updateTokensAndTiles();
    });
  }

  takeTileAndToken(tileIndex, tokenIndex) {
    console.log(
      "Taking",
      this.allTiles[tileIndex].tileNum,
      "at",
      tileIndex,
      "and token",
      this.allTokens[tokenIndex],
      "at",
      tokenIndex
    );
    updateDoc(doc(db, "games", this.gameId), {
      allTileNums: this.allTiles
        .filter((_, index) => index !== tileIndex)
        .map((tile) => tile.tileNum),
      allTokens: this.allTokens.filter((_, index) => index !== tokenIndex),
    });
  }
}

export default new State();
