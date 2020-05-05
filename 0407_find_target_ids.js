const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')

const funcSet = require('./modules/function');
const split_m = 0
// let video_x = 360;  // 
// let video_y = 240; // 사거리(4801)
// let video_x = 960;  // 
// let video_y = 540; // japan 거리
let video_x = 320; // T 3거리 
let video_y = 180;
// let video_x = 360; // highway
// let video_y = 240;

let static_grid_size = 96 * 54;
let static_video_x = video_x / 10;
let static_video_y = video_y / 10;
let grid_result = {};
const split_cnt = 4;
const file_name = `0425_T_car`  // 0425_highway30min ,, 0425_T_car ,, 0327_japan
let log_ary = [];
let log_prev_ary = [];
const u_lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');

for (let i = 0; i < u_lines.length; i++) {
  let cols = u_lines[i].split('\t');

  let size = parseInt(cols[7]) * parseInt(cols[8]);
  let height = parseInt(cols[7]);
  let width = parseInt(cols[8]);
  if (!isNaN(size)) {

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

let obj_group_result = _.groupBy(log_ary, 'object_id');
/////// 여기까지 공통//////////////////////


// let p_include_area_ids = ['102','103','202','302']; // japan 사람
// let c_include_area_ids = ['104','204','203','303','402'] // japan car
// let user_ids = [];
// let car_ids = [];
// let user_size_means = [];
// for (let user_id in obj_group_result) {
//   let arr = obj_group_result[user_id];

//   let cnt = 0;
//   let user_includes = [];
//   let sizes = [];
//   let user_areas = [];
//   for (let i = 0 ; i < arr.length ; i ++) {
//     user_areas.push(arr[i].area_id);
//     sizes.push(arr[i].size)
//   }
//   let dup_removed_areas = [...new Set(user_areas)];
//   let is = dup_removed_areas.filter(x => p_include_area_ids.includes(x));
//   if (is.length >= 3 && mathjs.mean(sizes) < 1000) {
//     user_ids.push(user_id);
//   }

//   let is2 = dup_removed_areas.filter(x => c_include_area_ids.includes(x));
//   if (is2.length >= 5) {
//     car_ids.push(user_id);
//   }


// }
// let dup = user_ids.filter(v => car_ids.includes(v));
// console.log(`${car_ids.length} ${user_ids.length} ${Object.keys(obj_group_result).length} dup count: ${dup}`);
// fs.appendFileSync('./0505_user/0327_japan_car.txt', `${car_ids.join(',')}\n`)
// fs.appendFileSync('./0505_user/0327_japan_user.txt', user_ids.join(','))



// let p_include_area_ids = ['203','303','403']; // T car
// // let c_include_area_ids = ['] // japan car
// let user_ids = [];
// let car_ids = [];
// for (let user_id in obj_group_result) {
//   let arr = obj_group_result[user_id];

//   let cnt = 0;
//   let user_includes = [];
//   let sizes = [];
//   let user_areas = [];
//   for (let i = 0 ; i < arr.length ; i ++) {
//     user_areas.push(arr[i].area_id);
//     sizes.push(arr[i].size);
//   }
//   let dup_removed_areas = [...new Set(user_areas)];
//   let is = dup_removed_areas.filter(x => p_include_area_ids.includes(x));
//   if (is.length >= 2 && mathjs.mean(sizes) > 1500 && sizes.length > 22) {
//     car_ids.push(user_id);
//     // console.log(`${sizes.length} ${mathjs.mean(sizes)}(${mathjs.std(sizes)})`)
//   }

//   if (dup_removed_areas.length >= 3 && is.length <= 1 && mathjs.mean(sizes) < 1000 && sizes.length > 37 && mathjs.mean(sizes) > 100) {
//     user_ids.push(user_id);
//     // console.log(dup_removed_areas)
//         console.log(`${sizes.length} ${mathjs.mean(sizes)}(${mathjs.std(sizes)})`)

//   }


// }
// console.log(`${car_ids.length} ${user_ids.length} ${Object.keys(obj_group_result).length}`);
// let dup = user_ids.filter(v => car_ids.includes(v));

// fs.appendFileSync('./0505_user/T_road_car.txt', `${car_ids.join(',')}\n`)
// fs.appendFileSync('./0505_user/T_road_user.txt', user_ids.join(','))




let p_include_area_ids = ['203','202']; // 왼쪽 
// let c_include_area_ids = ['] // japan car
let user_ids = [];
let car_ids = [];
for (let user_id in obj_group_result) {
  let arr = obj_group_result[user_id];

  let cnt = 0;
  let user_includes = [];
  let sizes = [];
  let user_areas = [];
  for (let i = 0 ; i < arr.length ; i ++) {
    user_areas.push(arr[i].area_id);
  }
  let dup_removed_areas = [...new Set(user_areas)];
  let is = dup_removed_areas.filter(x => p_include_area_ids.includes(x));

  if (dup_removed_areas.length >= 3 && dup_removed_areas.length <= 4 ) {
    user_ids.push(user_id);
    console.log(dup_removed_areas)
  }


}
console.log(user_ids.length) // 56
fs.appendFileSync('./0505_user/highway_car.txt', `${user_ids.join(',')}\n`)
