import { doc, getDoc, increment, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { tiles } from "./data";
import { randomRotation } from "./util/randomRotation";
import { setupInitialTokensAndTiles } from "./ui/setupInitialTokensAndTiles";

class State {
  gameId = "";
  clientId = "";
  player = {};
  currentPlayer = "";

  allTiles = [];
  allTokens = [];
  currentTiles = [];
  currentTokens = [];

  natureCubesNum = 0;

  initial = true;

  async init(gameId, clientId) {
    this.gameId = gameId;
    this.clientId = clientId;
    const playerDoc = await getDoc(doc(db, "games", gameId, "players", clientId));
    if (!playerDoc.exists()) {
      this.player = {
        turnsLeft: 20,
      };
      setDoc(doc(db, "games", gameId, "players", clientId), this.player);
    } else {
      this.player = playerDoc.data();
    }
    onSnapshot(doc(db, "games", gameId), async (snap) => {
      // if game doesn't exist, go back to home
      if (!snap.exists()) {
        navigate("/");
        return;
      }
      let data = snap.data();
      // console.log("Game data:", data);
      // set current player if first to join
      this.currentPlayer = data.currentPlayer || this.clientId;
      if (!data.currentPlayer) {
        updateDoc(doc(db, "games", this.gameId), {
          currentPlayer: this.currentPlayer,
        });
      }
      // sync all tiles and tokens
      this.allTiles = data.allTileNums.map((num) => tiles.find((tile) => tile.tileNum === num));
      this.allTokens = data.allTokens;
      this.currentTokens = [];
      for (let i = 0; i < 4; i++) {
        this.currentTokens.push(this.allTokens[i]);
      }
      this.currentTiles = [];
      // rotate them randomly if they have 2 habitats
      for (let i = 0; i < 4; i++) {
        var thisTile = this.allTiles[i];
        if (thisTile.habitats.length == 2) {
          thisTile.rotation = randomRotation(thisTile.tileNum);
        }
        this.currentTiles.push(thisTile);
      }
      console.log("tiles:", this.currentTiles);
      console.log("tokens:", this.currentTokens);

      if (this.initial) {
        this.initial = false;
        setupInitialTokensAndTiles();
      }
    });
  }

  joinGame(name) {
    setDoc(doc(db, "games", this.gameId, "players", this.clientId), {
      name,
    });
  }

  takeTileAndToken(tileIndex, tokenIndex) {
    if (this.currentPlayer !== this.clientId) {
      throw "Not your turn";
    }
    console.log("taking", this.allTiles[tileIndex].tileNum, "-", this.allTokens[tokenIndex]);
    updateDoc(doc(db, "games", this.gameId), {
      allTileNums: this.allTiles.filter((_, index) => index !== tileIndex).map((tile) => tile.tileNum),
      allTokens: this.allTokens.filter((_, index) => index !== tokenIndex),
    });
    updateDoc(doc(db, "games", this.gameId, "players", this.clientId), {
      turnsLeft: increment(-1),
    });
  }
}

export default new State();
