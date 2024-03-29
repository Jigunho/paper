exports.getAreaId = (video_x, video_y, x, y) => {
  if (x > video_x) {
    x = video_x -1;
  } 
  if (y > video_y) {
    y = video_y -1;
  }
  if(isNaN(video_x)) {
    return false;
  }
  let AREA_X_SIZE = video_x / 4;
  let AREA_Y_SIZE = video_y / 4;
  let area_x = Math.ceil(x / AREA_X_SIZE);
  let area_y = Math.ceil(y / AREA_Y_SIZE);
  let area_id = `${area_x}0${area_y}`;
  // console.log(`${video_x}, ${video_y}, ${x}, ${y} - ${area_id}`)

  return area_id

}
exports.getGridId = (video_x, video_y, x, y) => {

  let GRID_X_SIZE = video_x / 12;
  let GRID_Y_SIZE = video_y / 12;

  let grid_x = Math.ceil(x / GRID_X_SIZE) - 1;
  let grid_y = Math.ceil(y / GRID_Y_SIZE) - 1;

  if (grid_x < 10)
    grid_x = `0${grid_x}`;
  if (grid_y < 10)
    grid_y = `0${grid_y}`
  let grid_id = `${grid_x}${grid_y}`.trim();
  return grid_id

}
