// 이산화 검증/// 0528 실험 4.2 객체 이동경로 커버리지 비교를 위한 실험
const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const fpgrowth = require('node-fpgrowth');
const funcSet = require('../modules/function');
const split_m = 0
let video_x = 876;  // 
let video_y = 540; // japan 거리, person
// let video_x = 640; // 현대 0414 올림픽대로
// let video_y = 640;
// let video_x = 320; // T 3거리 
// let video_y = 180;
// let video_x = 360; // highway
// let video_y = 240;
// let static_grid_size = 96 * 54;

let size_coverage_ary = {};
let split_len = 4
let static_video_x = video_x / split_len; // 부분 영역 사이즈
let static_video_y = video_y / split_len;

let grid_result = {};
const split_cnt = 4; // 부분 영역 갯수
const file_name = `0327_japan`
const u_lines = fs.readFileSync(`../0303_type/${file_name}.txt`).toString().split('\n');



let log_ary = [];
let log_prev_ary = [];
let user_result = {};


let static_grid_infos = [];
for (let i = 0; i < split_len; i++) {
  for (let j = 0; j < split_len; j++) {
    let id = `${i}-${j}`;
    let start_y = video_y / split_len * i;
    let start_x = video_x / split_len * j;
    let obj = { id, x: start_x, y: start_y, w: video_x / split_len, h: video_y / split_len };
    static_grid_infos.push(obj);
  }

}


function getGrid(x, y) {
  let x_size = parseInt(x / static_video_x);
  let y_size = parseInt(y / static_video_y);
  return `${y_size}-${x_size}`;
}
function getGridStart(grid_id) {
  // 고정그리드 왼쪽 상단 좌표를 보여줌
  let arr = grid_id.split('-');
  return { x: parseInt(arr[1]) * static_video_x, y: parseInt(arr[0]) * static_video_y };

}
for (let i = 0; i < u_lines.length; i++) {
  let cols = u_lines[i].split('\t');

  let size = parseInt(cols[7]) * parseInt(cols[8]);
  let height = parseInt(cols[7]);
  let width = parseInt(cols[8]);
  if (!isNaN(size)) {


    // funcSet.getAreaId
    let a_id = funcSet.getAreaId(parseInt(cols[9]), parseInt(cols[10]), parseInt(cols[5]), parseInt(cols[6]));
    let obj = { timestamp: parseInt(cols[1]), x: parseInt(cols[5]), y: parseInt(cols[6]), width, height, size, object_id: cols[2], static_id: cols[4], area_id: a_id, g_id: getGrid(parseInt(cols[5]), parseInt(cols[6])) }
    log_prev_ary.push(obj);

  } else {
  }
}
console.log(log_prev_ary.length)
let tmp_object = _.groupBy(log_prev_ary, 'object_id');
for (let user_id in tmp_object) {
  let arr = tmp_object[user_id];
  let grids = [];
  let directions = [];
  let vels = [];
  let sizes = [];

  arr.sort(function (a, b) {
    return a.timestamp - b.timestamp
  })





  for (let j = 1; j < arr.length; j++) {

    if (arr[j].x === arr[j - 1].x || arr[j].y === arr[j - 1].y) {
      continue;
    }
    grids.push(arr[j].static_id)
    let velocity = Math.sqrt(Math.pow(arr[j].y - arr[j - 1].y, 2) + Math.pow(arr[j].x - arr[j - 1].x, 2)) / (arr[j].timestamp - arr[j - 1].timestamp) * 100;
    vels.push(velocity);
    let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;
    directions.push(direction);
    let direction_id = -1;
    if (direction <= 90) {
      direction_id = 0;
    } else if (direction > 90 && direction <= 180) {
      direction_id = 1;
    } else if (direction > 180 && direction <= 270) {
      direction_id = 2;
    } else {
      direction_id = 3;
    }

    // console.log(direction_id)
    let mean_x = (arr[j].x + arr[j - 1].x) / 2;
    let mean_y = (arr[j].y + arr[j - 1].y) / 2;

    let size_mean = (arr[j].size + arr[j - 1].size) / 2;
    sizes.push(size_mean)
    let mean_w = parseInt((parseInt(arr[j].width) + parseInt(arr[j - 1].width)) / 2);
    let mean_h = parseInt((parseInt(arr[j].height) + parseInt(arr[j - 1].height)) / 2);

    log_ary.push({
      object_id: user_id, x: mean_x, y: mean_y,
      direction, direction_id, velocity, size: size_mean, area_id: arr[j].area_id,
      g_id: arr[j].g_id, grid_id: arr[j].static_id, w: mean_w, h: mean_h
    })

  }
  if (grids.length > 0) {
    user_result[user_id] = {
      grids: [...new Set(grids)], cnt: grids.length , vel_mean: mathjs.mean(vels), vel_std: mathjs.std(vels),
      size_mean: mathjs.mean(sizes), size_std: mathjs.std(sizes), dir_mean: mathjs.mean(directions), dir_std: mathjs.std(directions)
    }
  }

}


console.log(log_ary.length);

let user_area_logs = _.groupBy(log_ary, 'area_id');
let user_area_result = {};

for (let area_id in user_area_logs) {
  let area_arr = user_area_logs[area_id];
  let sizes = [];
  for (let a = 0; a < area_arr.length; a++) {
    sizes.push(area_arr[a].size);
  }



}


let area_size_logs = {};
let us = [];
let area_size = static_video_x * static_video_y;
console.log(`static size: ${static_video_x * static_video_y}`);
let str0 = '';
let area_group_result = _.groupBy(log_ary, 'area_id');
for (let area_id in area_group_result) {

  let area_arr = area_group_result[area_id];
  let area_user_obj = _.groupBy(area_arr, 'object_id');

  let area_sizes = []; // 영역별 객체 대표값 사이즈 속성
  let area_size_ratios = [];
  let area_vels = [];
  let area_objs = []; // objectid 까지같이 저장할 배열
  for (let user_id in area_user_obj) {
    let user_arr_ary = area_user_obj[user_id];

    let sizes = [];
    let vels = [];
    for (let i = 0; i < user_arr_ary.length; i++) {
      sizes.push(user_arr_ary[i].size);
      vels.push(user_arr_ary[i].velocity);
    }
    if (sizes.length === 0) {
      continue;
    }
    area_sizes.push(mathjs.median(sizes)); // 객체의 최소 사이즈 축적
    let r = mathjs.median(sizes) / area_size;
    let group = Math.round(r * 10);
    let v_mean = mathjs.mean(vels);
    if (!isNaN(v_mean)) {
      continue;
    }
    if (r > 1) {
      area_size_ratios.push(0.99);
      area_objs.push({ user_id, ratio: 0.99, group: 10 });
    } else {

      area_size_ratios.push(r);

      area_objs.push({ user_id, ratio: r, group, vel: v_mean });

    }
    if (area_id === '203' && ( group === 8 || group === 9)) {
      // us.push(user_id);
    }
  }
  let groups = _.groupBy(area_objs, 'group');
  for (let g in groups) {
    let arr = groups[g];
    let user_vel_means = [];
    let user_size_means = [];

    arr.forEach(v => {
      user_vel_means.push(v.vel);
      user_size_means.push(v.ratio);
    })
    // console.log(user_size_means);

    if (arr.length> 1) {
      console.log(`${area_id} group:${g}, arr len:${arr.length}, vel:${user_vel_means.length}, size: ${user_size_means.length}`)
      let t =  `${area_id}\t${g}\t${arr.length}\t${mathjs.mean(user_vel_means)}\t${mathjs.mean(user_size_means)}\n`
      str0 += t;
      console.log(t);
  
    }
  }
  str0 += '\n'
  // console.log(`${area_id}(${area_size_ratios.length}) - ${mathjs.mean(area_size_ratios)}`)

  area_size_logs[area_id] = area_objs;
}
fs.appendFileSync(`./${file_name}_area_result.txt`, str0);

for (let area_id in area_size_logs) {
  let arr = area_size_logs[area_id];
  let str = '';
  arr.sort(function (a, b) {
    return a.ratio - b.ratio;
  })
  for (let i = 0; i < arr.length; i++) {
    str += `${arr[i].user_id}\t${arr[i].ratio}\t${arr[i].group}\n`
  }
  // fs.appendFileSync(`./split/${file_name}_${area_id}_${arr.length}.txt`, str);
}
// for (let user_id in user_result) {
//   if (us.includes(user_id))
//   fs.appendFileSync(`./split/${file_name}_user_result.txt`, `uid-${user_id}\t${user_result[user_id].cnt}\t${user_result[user_id].size_mean}\t${user_result[user_id].size_std}\t${user_result[user_id].vel_mean}\t${user_result[user_id].vel_std}\t${user_result[user_id].grids.length}\n`)
// }