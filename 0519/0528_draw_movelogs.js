const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const fpgrowth = require('node-fpgrowth');
const funcSet = require('../modules/function');
const split_m = 0
// let video_x = 876;  // 
// let video_y = 540; // japan 거리
// let video_x = 640; // 현대 0414 올림픽대로
// let video_y = 640;
// let video_x = 320; // T 3거리 
// let video_y = 180;
let video_x = 360; // highway
let video_y = 240;
// let static_grid_size = 96 * 54;
let static_video_x = video_x / 10;
let static_video_y = video_y / 10;
let grid_result = {};
const split_cnt = 6;
const file_name = `0425_highway30min`
const u_lines = fs.readFileSync(`../0303_type/${file_name}.txt`).toString().split('\n');

const target_split = { 101: 1, 102: 1, 103: 1, 104: 1, 201: 1, 202: 1, 203: 1, 204: 1, 301: 1, 302: 1, 303: 1, 304: 1, 401: 1, 402: 1, 403: 1, 404: 1 };
let area_median_result = {}; // 영역별 객체의 median 값을 저장하기 위한 변수

let grid_result_small = {};
let grid_result_big = {};
let grid_result_intersect = {};

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
    let obj = { timestamp: parseInt(cols[1]), x: parseInt(cols[5]), y: parseInt(cols[6]), w: width, h: height, size, object_id: cols[2], static_id: cols[4], area_id: a_id }
    log_prev_ary.push(obj);

  } else {
  }
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

    let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;
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

    log_ary.push({ object_id: user_id, x: mean_x, y: mean_y, direction, w: arr[j].w, h: arr[j].h, direction_id, velocity, size: size_mean, area_id: arr[j].area_id, grid_id: arr[j].static_id })

    // if (!grid_dup_removed.includes(arr[j].grid_id)) {
    //   grid_dup_removed.push(arr[j].grid_id);
    // }
  }

  // if (grid_dup_removed.length > 3) {
  //   for (let i = 0; i < log_ts.length; i++) {
  //     log_ary.push(log_ts[i]);
  //   } 
  // }
}


let user_area_logs = _.groupBy(log_ary, 'area_id');
let user_area_result = {};

for (let area_id in user_area_logs) {
  let area_arr = user_area_logs[area_id];
  let sizes = [];
  for (let a = 0; a < area_arr.length; a++) {
    sizes.push(area_arr[a].size);
  }


  let area_is = target_split[area_id];

  if (area_is === 1) {
    user_area_result[area_id] = -1;
  } else if (area_is === 2) {

    let user_mean = mathjs.mean(sizes);
    if (user_mean > area_median_result[area_id]) {
      // 크면 
      user_area_result[area_id] = 1;
    } else {
      user_area_result[area_id] = 0;
    }
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

    let sizes = [];
    for (let i = 0; i < user_arr_ary.length; i++) {
      sizes.push(user_arr_ary[i].size);
    }
    if (sizes.length === 0) {
      continue;
    }
    area_sizes.push(mathjs.min(sizes)); // 객체의 최소 사이즈 축적

  }

  area_size_logs[area_id] = area_sizes


}

for (let area_id in area_size_logs) {
  let arr = area_size_logs[area_id];
  // if (arr.length <= 10) {
  //   continue;
  // }
  if (arr.length === 0) {
    area_median_result[area_id] = 0;
  } else {
    area_median_result[area_id] = mathjs.median(arr);
  }
  // console.log(`area[${area_id}] - ${mathjs.median(arr)}, ${arr.length}`);
}

for (let area_id in area_median_result) {

  let area_arr = area_group_result[area_id];
  let split_result = target_split[area_id];
  let arr0 = []  // 공통
  let arr1 = []; // 큰거 
  let arr2 = []; // 작은거

  // console.log(`area[${area_id}] split_result:${split_result}`);
  let { x, y } = funcSet.getXY(video_x, video_y, area_id, split_cnt);

  if (split_result === 1) {
    arr0 = JSON.parse(JSON.stringify(area_arr));
    funcSet.func(x, y, video_x / split_cnt, video_y / split_cnt, area_id, arr0, grid_result_intersect);
  } else if (split_result === 2) {

    let median = area_median_result[area_id];

    for (let i = 0; i < area_arr.length; i++) {
      if (area_arr[i].size > median) {
        arr1.push(area_arr[i]);
      } else {
        arr2.push(area_arr[i])
      }
    }
    funcSet.func(x, y, video_x / split_cnt, video_y / split_cnt, area_id, arr1, grid_result_big);
    funcSet.func(x, y, video_x / split_cnt, video_y / split_cnt, area_id, arr2, grid_result_small);

  }

}
for (let a_g_id in grid_result_intersect) {
  let grid_result = grid_result_intersect[a_g_id];
  // console.log(`intersect ${JSON.stringify(grid_result)}`);
  // fs.appendFileSync(`./${file_name}_grid_result_intersect.txt`, `${JSON.stringify(grid_result)},\n`);

}
for (let a_g_id in grid_result_small) {
  let grid_result = grid_result_small[a_g_id];
  // fs.appendFileSync(`./${file_name}_grid_result_small.txt`, `${JSON.stringify(grid_result)},\n`);

}
for (let a_g_id in grid_result_big) {
  let grid_result = grid_result_big[a_g_id];
  // fs.appendFileSync(`./${file_name}_grid_result_big.txt`, `${JSON.stringify(grid_result)},\n`);

}

console.log(`${Object.keys(grid_result_intersect).length} , ${Object.keys(grid_result_big).length}, ${Object.keys(grid_result_small).length}`)




let target_ids = ['84','47', '377','456'];
// let target_ids = [  '2238', '2242', '2244', '2245', '2248', '2249', '2253',
// '2254', '2257', '2264', '2278', '2288', '2293', '2294',
// '2295', '2296', '2297', '2298', '2300', '2303', '2304',
// '2306', '2314', '2322', '2324', '2329', '2332', '2335',
// '2343', '2344', '2347', '2349', '2353', '2365', '2369'];
let targets_logs = {};



let user_obj_ary = _.groupBy(log_ary, 'object_id');

console.log(`user all len : ${Object.keys(user_obj_ary).length}`)
for (let user_id in user_obj_ary) {

  if (!target_ids.includes(user_id)) {
    continue;
  }
  let arr = user_obj_ary[user_id];

  targets_logs[user_id] = JSON.parse(JSON.stringify(arr));
  // console.log(arr);

}

for (let target_id in targets_logs) {

  let target_logs = targets_logs[target_id];
  let user_static_ids = [];
  let user_adaptive_grids = [];


  let user_grid_direction_support = {}; 

  let draw_move_logs = []; // 화면에 그릴 이동로그

  console.log(`${target_id}  -${target_logs.length}`)
  for (let i = 0; i < target_logs.length; i++) {

    ///////////////////////////// 실제 좌표 ////////////////////////////


    ///////////////////////////// 고정 그리드 /////////////////////////

    let s_id = target_logs[i].grid_id
    if (!user_static_ids.includes(s_id)) {
      user_static_ids.push(s_id);
    }
    // console.log(`${JSON.stringify(target_logs[i])}`);
    // fs.appendFileSync(`./${file_name}_target_user_real_log.txt`, `${JSON.stringify(target_logs[i])},\n`);

    let u_area_result = user_area_result[target_logs[i].area_id]
    if (!u_area_result) {
      continue;
    }
    // console.log(`${arr[j].area_id} - ${u_area_result}`)
    let r = -1;
    let g_info = null;
    let g_size = -1;
    // console.log(`${arr[j].area_id} - ${u_area_result}`)
    if (u_area_result === 1) {
      // big
      r = funcSet.getGridId(target_logs[i].x, target_logs[i].y, grid_result_big)
      g_info = funcSet.getTargetGridInfo(target_logs[i].area_id, grid_result_big);
      g_size = funcSet.getGridSizeKey(r, grid_result_big);

    } else if (u_area_result === 0) {
      // small
      r = funcSet.getGridId(target_logs[i].x, target_logs[i].y, grid_result_small);
      g_info = funcSet.getTargetGridInfo(target_logs[i].area_id, grid_result_small);
      g_size = funcSet.getGridSizeKey(r, grid_result_small);

    } else if (u_area_result === -1) {
      // 중립
      r = funcSet.getGridId(target_logs[i].x, target_logs[i].y, grid_result_intersect);
      g_info = funcSet.getTargetGridInfo(target_logs[i].area_id, grid_result_intersect);
      g_size = funcSet.getGridSizeKey(r, grid_result_intersect);

    }

    if (r == -1 || g_size === -1 || g_size === undefined || g_info === null) {
      continue
    } else {

      // let id =`${g_size.id}^${target_logs[i].direction_id}`;
      user_adaptive_grids.push(g_size.id);
      // user_adaptive_grids.push(id);

      // console.log(JSON.stringify(g_size));
      // if (user_grid_direction_support[g_size.id]) {
      //   user_grid_direction_support[g_size.id][target_logs[i].direction_id] += 1;
      // } else {
      //   user_grid_direction_support[g_size.id] = { 0: 0, 1: 0, 2: 0, 3: 0 };
      //   user_grid_direction_support[g_size.id][target_logs[i].direction_id] += 1;

      // }


      // fs.appendFileSync('./target_user_adaptive.txt', `${JSON.stringify(g_size)}\n`);

    }




  }
  console.log(`${target_id}  ---${user_adaptive_grids.length}`)

  fs.appendFileSync(`./${file_name}_target_user_adaptive.txt`, `${target_id} - ${JSON.stringify([...new Set(user_adaptive_grids)])}\n`);

  // for (let grid_id in user_grid_direction_support) {
  //   let support = user_grid_direction_support[grid_id];
  //   let key = -1;
  //   let max = -1;
  //   for (let id in support) {
  //     if (max < support[id]) {
  //       key = id;
  //       max = support[id];
  //     }
  //   }
  //   // console.log(`${grid_id} - ${key} ${max}`);
  //   // user_adaptive_grids.push(`${grid_id}^${key}`);
  // }

}