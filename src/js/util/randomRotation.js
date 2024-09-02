export function randomRotation(tileNum) {
  var rotations = [0, 60, 120, 180, 240, 300];
  var rotationIndex = +tileNum % 6 || Math.floor(Math.random() * 6);
  return rotations[rotationIndex];
}
