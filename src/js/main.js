import { addDoc, collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase.js";
import { defaultTokenNums, tiles } from "./data.js";
import { shuffle } from "./util/shuffle.js";
import { navigate } from "./util/navigate.js";
import state from "./state.js";
import { initiateMap, updateNatureCubesNum } from "./scripts.js";
import { uuidv4 } from "./util/uuid.js";

import "./image-preloader.js";

const gameId = window.location.pathname.slice(1);

$(document).ready(() => {
  let clientId = localStorage.getItem("cascadia-client-id");
  if (!clientId) {
    clientId = uuidv4();
    localStorage.setItem("cascadia-client-id", clientId);
  }
  if (gameId) {
    state.init(gameId, clientId);
    getDoc(doc(db, "games", gameId, "players", clientId)).then((player) => {
      if (player.exists()) {
        const data = player.data();
        if (!data.mapData) {
          initiateMap(true);
        } else {
          state.mapData = JSON.parse(data.mapData);
          state.logMap();
          state.natureCubesNum = data.natureCubesNum;
          updateNatureCubesNum(true);
          initiateMap();
        }
        $("body").addClass("gameView");
        $("#gameLayer").show();
      } else {
        $("#joinLayer").show();
      }
    });
  } else {
    $("#setupLayer").show();
  }
});

join.addEventListener("click", () => {
  $("#joinLayer").hide();
  $("body").addClass("gameView");
  initiateMap(true);
  state.joinGame(nameField.value);
  $("#gameLayer").show();
});

export const createAndJoinGame = async () => {
  // setup tiles
  let allTileNums = shuffle(tiles).map((tile) => tile.tileNum);
  // setup tokens
  let allTokens = [];
  for (var tokenNum in defaultTokenNums) {
    if (defaultTokenNums.hasOwnProperty(tokenNum)) {
      for (let i = 0; i < defaultTokenNums[tokenNum]; i++) {
        allTokens.push(tokenNum);
      }
    }
  }
  allTokens = shuffle(allTokens);
  // create game document
  const gameRef = await addDoc(collection(db, "games"), {
    allTileNums,
    allTokens,
    isStarted: false,
  });
  navigate(`/${gameRef.id}`);
};
