import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase.js";
import { defaultTokenNums, tiles } from "./data.js";
import { shuffle } from "./util/shuffle.js";
import { navigate } from "./util/navigate.js";
import state from "./state.js";
import { initiateMap } from "./scripts.js";
import { uuidv4 } from "./util/uuid.js";

import "./image-preloader.js";

const gameId = window.location.pathname.slice(1);

$(document).ready(() => {
  const clientId = localStorage.getItem("cascadia-client-id");
  if (!clientId) {
    const clientId = uuidv4();
    localStorage.setItem("cascadia-client-id", clientId);
  }
  if (gameId) {
    $("body").addClass("gameView");
    initiateMap();
    state.init(gameId, clientId);
    $("#gameLayer").show();
  } else {
    $("#setupLayer").show();
  }
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
  });
  navigate(`/${gameRef.id}`);
};
