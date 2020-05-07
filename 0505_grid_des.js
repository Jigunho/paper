const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const fpgrowth = require('node-fpgrowth');
const funcSet = require('./modules/function');
var pidusage = require('pidusage');

// Compute statistics every second:

// let video_x = 960;  // 
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
const split_cnt = 4;
const file_name = `0425_highway30min` //`0327_japan` //`0425_T_car` 0425_highway30min
const u_lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');

// const target_split = { 101: 1, 102: 1, 103: 1, 104: 1, 201: 1, 202: 1, 203: 2, 204: 2, 301: 1, 302: 2, 303: 2, 304: 2, 401: 1, 402: 2, 403: 2, 404: 1 };
// japan
// const target_split = { 101: 1, 102: 2, 103: 2, 104: 1, 201: 1, 202: 2, 203: 2, 204: 1, 301: 1, 302: 2, 303: 2, 304: 1, 401: 1, 402: 2, 403: 2, 404: 1 };
// T 
const target_split = { 101: 1, 102: 1, 103: 1, 104: 1, 201: 1, 202: 1, 203: 1, 204: 1, 301: 1, 302: 1, 303: 1, 304: 1, 401: 1, 402: 1, 403: 1, 404: 1 };
// high
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
    let obj = { timestamp: parseInt(cols[1]), x: parseInt(cols[5]), y: parseInt(cols[6]), width, height, size, object_id: cols[2], static_id: cols[4], area_id: a_id }
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

    // if (j % 2=== 0) {
    //   continue
    // }
    if (arr[j].x === arr[j - 1].x || arr[j].y === arr[j - 1].y) {
      continue;
    }
    let velocity = Math.sqrt(Math.pow(arr[j].y - arr[j - 1].y, 2) + Math.pow(arr[j].x - arr[j - 1].x, 2)) / (arr[j].timestamp - arr[j - 1].timestamp) * 100;

    let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;

    let mean_x = (arr[j].x + arr[j - 1].x) / 2;
    let mean_y = (arr[j].y + arr[j - 1].y) / 2;

    let size_mean = (arr[j].size + arr[j - 1].size) / 2;

    log_ary.push({ object_id: user_id, x: mean_x, y: mean_y, direction, velocity, size: size_mean, area_id: arr[j].area_id, grid_id: arr[j].static_id })

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

  // console.log(`${area_id}(${area_arr.length}), mean:${mathjs.mean(sizes)}, var:${mathjs.variance(sizes)}`)

  let area_is = target_split[area_id];

  if (area_is === 1) {
    user_area_result[area_id] = -1;
  } else if (area_is === 2) {

    let user_mean = mathjs.mean(sizes);
    if (user_mean > area_median_result[area_id]) {
      // 크면 
      user_area_result[area_id] = 1; // big
    } else {
      user_area_result[area_id] = 0; // small
    }
  }

}
// console.log(user_area_result)


let area_size_logs = {};

let area_2_result = {};

let area_group_result = _.groupBy(log_ary, 'area_id');
for (let area_id in area_group_result) {

  area_2_result[area_id] = [];

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
    area_2_result[area_id].push(mathjs.min(sizes));
  }

  if (target_split[area_id] === 2) {
    area_size_logs[area_id] = area_sizes
  } else {
    area_size_logs[area_id] = -1;
  }



}
for (let area_id in area_2_result) {
  let arr = area_2_result[area_id]
  console.log(`${area_id}(${arr.length}), mean:${mathjs.mean(arr)}, var:${mathjs.std(arr)}`)
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
// console.log(area_median_result)

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
  // fs.appendFileSync(`./0505_${file_name}_grid_result_intersect.txt`, `${JSON.stringify(grid_result)},\n`);

}
for (let a_g_id in grid_result_small) {
  let grid_result = grid_result_small[a_g_id];
  // fs.appendFileSync(`./0505_${file_name}_grid_result_small.txt`, `${JSON.stringify(grid_result)},\n`);

}
for (let a_g_id in grid_result_big) {
  let grid_result = grid_result_big[a_g_id];
  // fs.appendFileSync(`./0505_${file_name}_grid_result_big.txt`, `${JSON.stringify(grid_result)},\n`);

}

console.log(`${Object.keys(grid_result_intersect).length} , ${Object.keys(grid_result_big).length}, ${Object.keys(grid_result_small).length}`)




let static_avg_lens = []; // 고정길이 평균
let adaptive_avg_lens = []; // 가변길이 평균
// 이 평균이랑 내가 타겟하는 80개의 객체들의 평균도 한번 비교해봐라 0503
// let target_ids = [8,21,29,45,56,134,168,186,232,344,347,369,383,406,476,490,559,603,621,628,664,723,770,796,813,856,899,907,925,948,978,999,1001,1014,1044,1047,1078,1097,1136,1157,1171,1312,1323,1394,1431,1433,1497,1532,1583,1624]
// let target_ids = [4, 7, 57, 90, 97, 109, 173, 247, 255, 337, 360, 363, 461, 497, 544, 549, 557, 571, 606, 622, 700, 728, 735, 746, 754, 765, 773, 799, 824, 905, 911, 917, 981, 986, 990, 1024, 1049, 1082, 1164, 1178, 1182, 1195, 1284, 1403, 1434, 1436, 1537, 1547, 1559, 1562]
// japan car

// let target_ids = [8,11,17,23,26,28,32,38,41,43,49,50,51,52,53,55,60,62,68,69,72,74,81,83,101,106,130,132,137,139,144,146,148,149,150,154,181,187,222,223,230,264,278,283,284,286,289,292,321,330]
// T Car
let target_ids = [4,22,31,39,46,59,63,64,66,71,73,79,88,94,97,104,117,118,119,122,124,129,134,138,141,147,176,190,196,197,199,203,207,214,215,233,238,240,250,256,263,269,270,274,275,315,317,318,325,331]

// let target_ids = [15,24,33,49,58,63,71,84,85,94,104,105,109,112,114,121,126,128,129,134,141,147,152,158,162,166,168,189,192,196,197,199,203,204,207,214,222,233,234,240,243,244,245,255,266,270,271,276,280,290,292,311,315,318,326,334];
// highway
let big_grid_count = Object.keys(grid_result_intersect).length + Object.keys(grid_result_big).length;
let small_grid_count = Object.keys(grid_result_intersect).length + Object.keys(grid_result_small).length;
let avg_count = (big_grid_count + small_grid_count) / 2
let compare_count = small_grid_count
let support = 0.03; // 갯수

let target_id_len = {};

let alll = [];

let user_cnt = 0; // 50이 맞는지 체크

let targets_logs = {};

let user_obj_ary = _.groupBy(log_ary, 'object_id');
for (let user_id in user_obj_ary) {

  let arr = user_obj_ary[user_id];

  if (target_ids.includes(parseInt(user_id, 10))) {
    targets_logs[user_id] = JSON.parse(JSON.stringify(arr));
  }
}
console.log(`init - ${Object.keys(targets_logs).length}`);



for (let target_id in targets_logs) {

  if (!target_ids.includes(parseInt(target_id, 10))) {
    continue;
  }
  user_cnt++;

  let target_logs = targets_logs[target_id];
  let user_static_ids = [];
  let user_adaptive_grids = []

  let user_area_match_id = {};
  let user_area_directions = {};
  let area_group = _.groupBy(target_logs, 'area_id');
  for (let area_id in area_group) {
    let area_arr = area_group[area_id];
    let sizes = [];
    let directions = [];
    for (let i = 0; i < area_arr.length; i++) {
      sizes.push(area_arr[i].size);
      directions.push(area_arr[i].direction);
    }

    let area_result = target_split[area_id];
    if (area_result === 2) {

      if (mathjs.mean(sizes) > area_median_result[area_id]) {
        // big
        user_area_match_id[area_id] = 1; // big 
      } else {
        user_area_match_id[area_id] = 0; // small

      }

    } else {
      user_area_match_id[area_id] = -1; // intersect
    }

    user_area_directions[area_id] = funcSet.getDirectionId(mathjs.mean(directions));

  }
  // console.log(`${target_id} - ${JSON.stringify(user_area_match_id)}`);
  // continue;

  for (let i = 0; i < target_logs.length; i++) {

    ///////////////////////////// 실제 좌표 ////////////////////////////


    ///////////////////////////// 고정 그리드 /////////////////////////

    let s_id = target_logs[i].grid_id
    if (!user_static_ids.includes(s_id)) {
      user_static_ids.push(s_id);
    }


    let u_area_result = user_area_match_id[target_logs[i].area_id]
    if (!u_area_result) {
      continue;
    }
    let target_x = target_logs[i].x;
    let target_y = target_logs[i].y;
    if (target_x > video_x) {
      target_x = video_x - 1;
    }
    if (target_y > video_y) {
      target_y = video_y - 1;
    }
    // let { target_x, target_y} = funcSet.reviseXY(target_logs[i].x, target_logs[i].y, video_x, video_y, target_logs[i].area_id);
    let r = -1;
    let g_info = null;
    let g_size = -1;
    // console.log(`${arr[j].area_id} - ${u_area_result}`)
    if (u_area_result === 1) {
      // big
      r = funcSet.getGridId(target_x, target_y, grid_result_big)
      g_info = funcSet.getTargetGridInfo(target_logs[i].area_id, grid_result_big);
      g_size = funcSet.getGridSizeKey(r, grid_result_big);

    } else if (u_area_result === 0) {
      // small
      r = funcSet.getGridId(target_x, target_y, grid_result_small);
      g_info = funcSet.getTargetGridInfo(target_logs[i].area_id, grid_result_small);
      g_size = funcSet.getGridSizeKey(r, grid_result_small);

    } else if (u_area_result === -1) {
      // 중립
      r = funcSet.getGridId(target_x, target_y, grid_result_intersect);
      g_info = funcSet.getTargetGridInfo(target_logs[i].area_id, grid_result_intersect);
      g_size = funcSet.getGridSizeKey(r, grid_result_intersect);

    }

    if (r == -1) {

      // console.log(`not found ${target_id} area_id: ${target_logs[i].area_id}, a_result:${u_area_result}, : x:${target_logs[i].x}, y:${target_logs[i].y}`)

      continue





    } else {

      if (!user_adaptive_grids.includes(`${g_size.id}*${u_area_result}^${user_area_directions[target_logs[i].area_id]}`)) {
        user_adaptive_grids.push(`${g_size.id}*${u_area_result}^${user_area_directions[target_logs[i].area_id]}`);

      }
      alll.push(`${g_size.id}*${u_area_result}^${user_area_directions[target_logs[i].area_id]}`);


    }


  }

  // console.log(`${target_id} - ${user_adaptive_grids.length}`)
  if (user_adaptive_grids.length > compare_count * support) {
    adaptive_avg_lens.push(user_adaptive_grids.length);
    static_avg_lens.push(user_static_ids.length);
  }
  // console.log(user_adaptive_grids);
  let dup_removed_ad = [...new Set(user_adaptive_grids)];
  target_id_len[target_id] = dup_removed_ad;


  // adaptive_avg_lens.push(user_adaptive_grids.length);
  // console.log(`${target_id} static: ${user_static_ids}`);

  // console.log(`${target_id} adaptive: ${JSON.stringify(user_adaptive_grids)}`);

}
