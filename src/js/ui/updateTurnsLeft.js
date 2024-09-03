import state from "../state";

export function updateTurnsLeft() {
  $(".turnsLeftFigure").html(state.turnsLeft);
}
