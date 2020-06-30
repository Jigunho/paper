let split_len = 15
let video_x = 876;  // 
let video_y = 540; // japan 거리
let static_video_x = video_x / split_len;
let static_video_y = video_y / split_len;
console.log(`width: ${static_video_x}, height: ${static_video_y}`);

function getGrid(x, y) {
  let x_size = parseInt(x / static_video_x);
  let y_size = parseInt(y / static_video_y);
  return `${y_size}-${x_size}`;
}
function getSize(grid_id) {
  // 고정그리드 왼쪽 상단 좌표를 보여줌
  let arr = grid_id.split('-');
  return { x: parseInt(arr[1])*static_video_x, y: parseInt(arr[0])*static_video_y };
  
}
const main = () => {

  let id = getGrid(20, 530 );
  console.log(id);
  console.log(getSize(id));
}
main();