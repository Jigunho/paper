const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')

const funcSet = require('./modules/function');
const split_m = 0
let video_x = 360;  // 
let video_y = 240; // 사거리(4801)
// let video_x = 960;  // 
// let video_y = 540; // japan 거리
// let video_x = 640; // 현대 0414 올림픽대로
// let video_y = 640;
// let video_x = 320; // T 3거리 
// let video_y = 180;
// let video_x = 360; // highway
// let video_y = 240;
// let static_grid_size = 96 * 54;
let static_video_x = video_x / 10;
let static_video_y = video_y / 10;
let grid_result = {};
const split_cnt = 4;
let area_size = video_x / split_cnt * video_y / split_cnt;
const file_name = `4801` // 0425_highway30min ,, 0425_T_car ,, 4801
const u_lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');
let log_ary = [];
let log_prev_ary = [];
for (let i = 0; i < u_lines.length; i++) {
  let cols = u_lines[i].split('\t');

  let size = parseInt(cols[7]) * parseInt(cols[8]);
  let height = parseInt(cols[7]);
  let width = parseInt(cols[8]);
  if (!isNaN(size)) {


    // funcSet.getAreaId
    let a_id = funcSet.getAreaId(parseInt(cols[9]), parseInt(cols[10]), parseInt(cols[5]), parseInt(cols[6]));
    let obj = { timestamp: parseInt(cols[1]), x: parseInt(cols[5]), y: parseInt(cols[6]), width, height, size, object_id: cols[2], grid_id: cols[4], area_id: a_id }
    log_prev_ary.push(obj);

  } else {
  }
}
let obj_cnt = 0;
let tmp_object = _.groupBy(log_prev_ary, 'object_id');
for (let user_id in tmp_object) {
  let arr = tmp_object[user_id];
  let grids = [];

  arr.sort(function (a, b) {
    return a.timestamp - b.timestamp
  })

  let log_ts = [];
  let grid_dup_removed = [];
  for (let j = 1; j < arr.length; j++) {

    if (arr[j].x === arr[j - 1].x || arr[j].y === arr[j - 1].y) {
      continue;
    }
    let velocity = Math.sqrt( Math.pow(arr[j].y - arr[j-1].y, 2) + Math.pow(arr[j].x - arr[j-1].x, 2)) / ( arr[j] .timestamp - arr[j-1].timestamp ) * 100;

    let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;

    let mean_x = (arr[j].x + arr[j - 1].x) / 2;
    let mean_y = (arr[j].y + arr[j - 1].y) / 2;

    let size_mean = (arr[j].size + arr[j - 1].size) / 2;

    log_ts.push({ object_id: user_id, x: mean_x, y: mean_y, direction, velocity, size: size_mean, area_id: arr[j].area_id, grid_id: arr[j].grid_id })
  
    if (!grid_dup_removed.includes(arr[j].grid_id)) {
      grid_dup_removed.push(arr[j].grid_id);
    }
  }

  if (grid_dup_removed.length > 3) {
    for (let i = 0; i < log_ts.length; i++) {
      log_ary.push(log_ts[i]);
    } 
    obj_cnt += 1;
  }
}

console.log(`filter before : ${Object.keys(tmp_object).length}, after: ${obj_cnt}`);
let area_group = _.groupBy(log_ary, 'area_id');
for (let a_id in area_group) {
  let logs = area_group[a_id];
  let obj_mins = {};
  let strs = '';

  for (let i = 0 ; i < logs.length ; i ++) {
    if (!obj_mins[logs[i].object_id]) {
      obj_mins[logs[i].object_id] = logs[i];
    } else {
      obj_mins[logs[i].object_id] = obj_mins[logs[i].object_id].size > logs[i].size ? logs[i] : obj_mins[logs[i].object_id];
    }

  }


  
  let area_max = 0;

  for (let obj_id in obj_mins) {
    // strs += `${a_id}\t${obj_mins[obj_id].size/area_size}\t${obj_mins[obj_id].direction}\n`
    if (obj_mins[obj_id].size < area_size && area_max < obj_mins[obj_id].size/area_size) {
      area_max = obj_mins[obj_id].size/area_size;
    }
  }

  let area_size_ = area_size;
  if (area_max < 0.5) {
    area_size_ = area_size / 2 
  }

  let up = 0;
  let down = 0;
  let not_all = 0;
  for (let obj_id in obj_mins) {
    // strs += `${a_id}\t${obj_mins[obj_id].size/area_size}\t${obj_mins[obj_id].direction}\n`
    if (obj_mins[obj_id].size < area_size && obj_mins[obj_id].size >= area_size_ / 2) {
      up ++;
    } else if (obj_mins[obj_id].size < area_size_ / 2) {
      down ++;
    } else {
      not_all ++;
    }
  }
  console.log(`${a_id}(${area_size_}) up: ${up}, down: ${down}, not : ${not_all}`)
  console.log(`${a_id} max: ${area_max} -> ${area_size_}`)
  // fs.appendFileSync(`./0502_${a_id}.txt`, `영역\t사이즈\t방향\n`);
  // fs.appendFileSync(`./0502_${a_id}.txt`, `${strs}\n`);
  console.log(`${a_id} : ${Object.keys(obj_mins).length}`);
  
}