
function calculateAngle(x, y) {
	var angle = Math.atan2(y, x);

    return ((180 / Math.PI) * angle + 360 ) % 360; // rad to deg conversion
}
// console.log((180 / Math.PI) * 0.34)
var angle = Math.atan2(1,0);
console.log(angle)

let direction = Math.atan2(-1, 0) * 180 / Math.PI;
direction = (direction + 360) % 360;
console.log(direction)
