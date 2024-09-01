import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase.js";

const gameId = "test";

const unsub = onSnapshot(doc(db, "games", gameId), (doc) => {
    console.log("Game data: ", doc.data());
});