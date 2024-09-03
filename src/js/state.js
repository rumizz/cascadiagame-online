import { collection, doc, getDoc, increment, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { tiles } from "./data";
import { updateTokensAndTiles } from "./ui/updateTokens";
import { updatePlayers } from "./ui/updatePlayers";
import { updateTurnsLeft } from "./ui/updateTurnsLeft";

class State {
  gameId = "";
  clientId = "";
  mapData = [];
  currentPlayer = "";
  turnsLeft;

  players = [];

  allTiles = [];
  allTokens = [];
  currentTiles = [];
  currentTokens = [];

  natureCubesNum = 0;

  async init(gameId, clientId) {
    this.gameId = gameId;
    this.clientId = clientId;
    const playerDoc = await getDoc(doc(db, "games", gameId, "players", clientId));
    if (!playerDoc.exists()) {
      throw "Player not found";
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
          thisTile.rotation = (+thisTile.tileNum % 6) * 60;
        }
        this.currentTiles.push(thisTile);
      }
      // console.log("tiles:", this.currentTiles);
      // console.log("tokens:", this.currentTokens);
      updateTokensAndTiles();
      updatePlayers();
    });
    onSnapshot(collection(db, "games", gameId, "players"), async (querySnapshot) => {
      const players = [];
      querySnapshot.forEach((doc) => {
        players.push({ ...doc.data(), id: doc.id });
      });
      this.players = players;
      this.turnsLeft = this.players.find((player) => player.id === this.clientId).turnsLeft;
      updatePlayers();
      updateTurnsLeft();
    });
  }

  async joinGame(name) {
    await setDoc(doc(db, "games", this.gameId, "players", this.clientId), {
      name,
      turnsLeft: 5,
    }).then(() => {
      console.log("Player joined game");
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
      currentPlayer:
        this.players[(this.players.findIndex((player) => player.id === this.clientId) + 1) % this.players.length].id,
      isStarted: true,
    });
    updateDoc(doc(db, "games", this.gameId, "players", this.clientId), {
      turnsLeft: increment(-1),
    });
  }

  async saveMap() {
    this.logMap();
    await updateDoc(doc(db, "games", this.gameId, "players", this.clientId), {
      mapData: JSON.stringify(this.mapData),
    });
  }

  async saveNatureCubesNum() {
    await updateDoc(doc(db, "games", this.gameId, "players", this.clientId), {
      natureCubesNum: this.natureCubesNum,
    });
  }

  logMap() {
    console.log(
      "Map data:",
      this.mapData
        .filter((row) => row.some((cell) => cell.habitats.length))
        .map((row) => row.filter((cell) => cell.habitats.length).map((cell) => `${cell.habitats.join("+")}`))
    );
  }
}

export default new State();
