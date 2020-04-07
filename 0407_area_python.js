const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')

const funcSet = require('./modules/function');
const split_m = 0
// let video_x = 360;  // 
// let video_y = 240; // 사거리(4801)
let video_x = 960;  // 
let video_y = 540; // japan 거리
let static_grid_size = 96 * 54;
let static_video_x = video_x / 10;
let static_video_y = video_y / 10;
let grid_result = {};
const split_cnt = 4;
const file_name = `0327_japan`
const u_lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');


let log_ary = [];

let area_mean_size_logs = {};
let area_max_size_logs = {};
let area_min_size_logs = {};
let area_mean_dir_logs = {}
for (let i = 0; i < u_lines.length; i++) {
  let cols = u_lines[i].split('\t');

  let size = parseInt(cols[7]) * parseInt(cols[8]);
  let height = parseInt(cols[7]);
  let width = parseInt(cols[8]);
  if (!isNaN(size)) {


    // funcSet.getAreaId
    let a_id = funcSet.getAreaId(parseInt(cols[9]), parseInt(cols[10]), parseInt(cols[5]), parseInt(cols[6]));
    if (!area_mean_size_logs[a_id]) {
      area_mean_size_logs[a_id] = [];
      area_max_size_logs[a_id] = [];
      area_min_size_logs[a_id] = [];
      area_mean_dir_logs[a_id] = [];

    }
    let obj = { timestamp: parseInt(cols[1]), x: parseInt(cols[5]), y: parseInt(cols[6]), width, height, size, object_id: cols[2], static_id: cols[4], area_id: a_id }
    log_ary.push(obj);

  } else {
  }
}

let area_size_logs = {};

let area_group_result = _.groupBy(log_ary, 'area_id');
for (let area_id in area_group_result) {

  let area_arr = area_group_result[area_id];

  let area_user_obj = _.groupBy(area_arr, 'object_id');




  let area_sizes = []; // 영역별 객체 대표값 사이즈 속성
  for (let user_id in area_user_obj) {
    let user_arr_ary = area_user_obj[user_id];
    
    user_arr_ary.sort(function (a, b) {
      return a.timestamp - b.timestamp
    })

    let sizes = [];
    let directions = [];
    for (let i = 1; i < user_arr_ary.length; i++) {
      sizes.push(user_arr_ary[i].size);
      let direction = Math.atan2(user_arr_ary[i - 1].y - user_arr_ary[i].y, user_arr_ary[i].x - user_arr_ary[i - 1].x) * 180 / Math.PI;
      direction = (direction + 360) % 360;
      directions.push(direction)
    }
    if (sizes.length === 0) {
      continue;
    }
    area_mean_size_logs[area_id].push(mathjs.mean(sizes));
    area_max_size_logs[area_id].push(mathjs.max(sizes));
    area_min_size_logs[area_id].push(mathjs.min(sizes));
    area_mean_dir_logs[area_id].push(mathjs.mean(directions));
  }
  console.log(`${area_id} - ${area_mean_dir_logs[area_id].length}`);

  area_size_logs[area_id] = area_sizes


}
let strs = []

for (let area_id in area_mean_size_logs) {
  let arr0 = area_mean_size_logs[area_id];
  let arr1 = area_max_size_logs[area_id];
  let arr2 = area_min_size_logs[area_id];
  let arr3 = area_mean_dir_logs[area_id];

  for (let i =0  ; i < arr0.length; i ++) {
    let str = `${area_id},${arr0.length},${arr0[i]},${arr1[i]},${arr2[i]},${arr3[i]}`;
    strs.push(str);


  }

}
// fs.appendFileSync(`./0407_${file_name}_area_result.txt`,strs.join('\n'));

