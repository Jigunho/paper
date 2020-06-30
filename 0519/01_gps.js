// GPS 데이터를 1차원 속성으로 이산화한 결과
const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const lines = fs.readFileSync('../0303_type/hyundae_0416_gangnam.txt').toString().split('\n');
const funcSet = require('../modules/function');

console.log(lines.length);
let ary = [];
for (let i = 0; i < lines.length; i++) {
  let cols = lines[i].split('\t');
  ary.push({ id: cols[3], timestamp: parseInt(cols[2], 10) / 1000, x: parseInt(cols[5]), y: parseInt(cols[6]) })
}
let log_prev_ary = [];
let log_ary = []
for (let i = 0; i < lines.length; i++) {
  let cols = lines[i].split('\t');

  // let size = parseInt(cols[7]) * parseInt(cols[8]);
  // let height = parseInt(cols[7]);
  // let width = parseInt(cols[8]);

  // funcSet.getAreaId
  let a_id = funcSet.getAreaId(parseInt(cols[9]), parseInt(cols[10]), parseInt(cols[5]), parseInt(cols[6]));
  let obj = { timestamp: parseInt(cols[1]), x: parseInt(cols[5]), y: parseInt(cols[6]), object_id: cols[2], static_id: cols[4], area_id: a_id }
  log_prev_ary.push(obj);


}
let tmp_object = _.groupBy(log_prev_ary, 'object_id');
for (let user_id in tmp_object) {
  let arr = tmp_object[user_id];
  let grids = [];

  arr.sort(function (a, b) {
    return a.timestamp - b.timestamp
  })


  for (let j = 1; j < arr.length; j++) {

    if (arr[j].x === arr[j - 1].x || arr[j].y === arr[j - 1].y) {
      continue;
    }
    let velocity = Math.sqrt(Math.pow(arr[j].y - arr[j - 1].y, 2) + Math.pow(arr[j].x - arr[j - 1].x, 2)) / (arr[j].timestamp - arr[j - 1].timestamp) * 100;
    let moveLen = Math.sqrt(Math.pow(arr[j].y - arr[j - 1].y, 2) + Math.pow(arr[j].x - arr[j - 1].x, 2));
    let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;

    let mean_x = (arr[j].x + arr[j - 1].x) / 2;
    let mean_y = (arr[j].y + arr[j - 1].y) / 2;

    let size_mean = (arr[j].size + arr[j - 1].size) / 2;

    log_ary.push({ object_id: user_id, x: mean_x, y: mean_y, direction, velocity, size: size_mean, area_id: arr[j].area_id, grid_id: arr[j].static_id, move: moveLen })

  }

}


let user_area_logs = _.groupBy(log_ary, 'area_id');
let user_area_result = {}; // 속도
let user_area_result2 = {}; // 방향
let user_area_result3 = {}; // 이동 거리
for (let area_id in user_area_logs) {
  let area_arr = user_area_logs[area_id];
  let vels = [];
  let dirs = [];
  let moves = [];
  for (let a = 0; a < area_arr.length; a++) {
    vels.push(area_arr[a].velocity);
    dirs.push(area_arr[a].direction);
    moves.push(area_arr[a].move);
  }
  user_area_result2[area_id] = dirs;
  user_area_result[area_id] = vels;
  user_area_result3[area_id] = moves;
}

for (let area_id in user_area_result) {
  let vels = user_area_result[area_id];
  let dirs = user_area_result2[area_id];
  let moves = user_area_result3[area_id]
  for (let i = 0; i < vels.length; i++) {
    fs.appendFileSync(`./${area_id}_${vels.length}.txt`,`${vels[i]}\t${dirs[i]}\t${moves[i]}\n`);
  }
}