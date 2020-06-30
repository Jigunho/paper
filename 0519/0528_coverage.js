/// 0528 실험 4.2 객체 이동경로 커버리지 비교를 위한 실험
// 고정그리드와 가변그리드 비교
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
let split_len = 10
let static_video_x = video_x / split_len;
let static_video_y = video_y / split_len;

let grid_result = {};
const split_cnt = 4; // 부분 영역 갯수
const file_name = `person`
const u_lines = fs.readFileSync(`../0303_type/${file_name}.txt`).toString().split('\n');

const target_split = { 101: 1, 102: 1, 103: 1, 104: 1, 201: 1, 202: 1, 203: 1, 204: 1, 301: 1, 302: 1, 303: 1, 304: 1, 401: 1, 402: 1, 403: 1, 404: 1 };
let area_median_result = {}; // 영역별 객체의 median 값을 저장하기 위한 변수

let grid_result_small = {};
let grid_result_big = {};
let grid_result_intersect = {};

let log_ary = [];
let log_prev_ary = [];



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

    let mean_w = parseInt((parseInt(arr[j].width) + parseInt(arr[j - 1].width)) / 2);
    let mean_h = parseInt((parseInt(arr[j].height) + parseInt(arr[j - 1].height)) / 2);

    log_ary.push({
      object_id: user_id, x: mean_x, y: mean_y,
      direction, direction_id, velocity, size: size_mean, area_id: arr[j].area_id,
      g_id: arr[j].g_id, grid_id: arr[j].static_id, w: mean_w, h: mean_h
    })

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

console.log(log_ary.length);

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





// let target_ids = ['8', '21', '25', '29', '35', '40', '45', '56', '75', '134', '168', '186', '231', '232', '241', '269', '347']; // 사람
// let target_ids = ['456'];
let target_ids = [];
let targets_logs = {};


let sizes = [];

let user_all_grids = [];

let user_obj_ary = _.groupBy(log_ary, 'object_id');
for (let user_id in user_obj_ary) {

  let user_arr = user_obj_ary[user_id];
  // sizes.push(user_arr.length);
  let user_grids = {};
  let user_grid = user_arr.filter(v => {
    if (user_grids[v.grid_id]) {
    } else {
      user_grids[v.grid_id] = 1;
      return v;
    }
  })
  if (Object.keys(user_grids).length > 5) {
    // console.log(Object.keys(user_grids))
    target_ids.push(user_id);
  }

}

// console.log(target_ids);
// console.log(Object.keys(target_ids).length)

for (let user_id in user_obj_ary) {

  if (!target_ids.includes(user_id)) {
    continue;
  }
  let arr = user_obj_ary[user_id];

  targets_logs[user_id] = JSON.parse(JSON.stringify(arr));
  // console.log(arr);

}

let adaptive_diff_ary = []; // 가변 그리드 사이즈 커버리지 차이
let static_diff_ary = []; // 고정그리드 사이즈 커버리지 차이

let tmp_arr2 = {};
for (let i = 0; i <= video_y + 1; i++) {
  for (let j = 0; j <= video_x + 1; j++) {
    tmp_arr2[`${i}-${j}`] = [];

  }
}
// fs.appendFileSync('./tmp.txt',JSON.stringify(tmp_arr2));
// console.log(Object.keys(tmp_arr2));
for (let target_id in targets_logs) {

  let target_logs = targets_logs[target_id];

  let t_arr_a = _.cloneDeep(tmp_arr2);
  let t_arr_s = _.cloneDeep(tmp_arr2);
  // console.log(`${t_arr.length} , ${t_arr[0].length}`)

  let user_static_ids = [];
  let user_adaptive_grids = [];


  let user_grid_direction_support = {};

  // console.log(`target [${target_id}] - ${target_logs.length}`)

  let is_null = 0; // null이 한번이라도 있는애들은 제외


  for (let i = 0; i < target_logs.length; i++) {

    ///////////////////////////// 실제 좌표 ////////////////////////////
    let center_x = target_logs[i].x;
    let center_y = target_logs[i].y;
    let log_w = target_logs[i].w;
    let log_h = target_logs[i].h;
    // console.log(`${target_id}(${i}), x:${center_x}, y:${center_y}, w:${log_w}, h:${log_h}`);
    // console.log(`${target_id}(${i}), start x : ${parseInt(center_x - log_w/2)}, end x: ${mathjs.min([parseInt(center_x + log_w), video_x])}`);
    // console.log(`${target_id}(${i}), start y : ${parseInt(center_y - log_h/2)}, end y: ${mathjs.min([parseInt(center_y + log_h/2), video_y])}`);



    for (let s0 = mathjs.max([parseInt(center_y - log_h / 2), 0]); s0 < mathjs.min([parseInt(center_y + log_h / 2), video_y]); s0++) {
      for (let s1 = mathjs.max([parseInt(center_x - log_w / 2), 0]); s1 < mathjs.min([parseInt(center_x + log_w / 2), video_x]); s1++) {
        if (t_arr_a[`${s0}-${s1}`]) {
          t_arr_a[`${s0}-${s1}`].push(1);
          t_arr_s[`${s0}-${s1}`].push(1);
        } else {
          console.log(`${target_id}, y:${s0}, x:${s1}`);
        }
      }
    }
    // 실제 이동 영역



    ///////////////////////////// 고정 그리드 /////////////////////////

    let s_id = target_logs[i].g_id
    //////////////////////////////
    // grid id print

    let start = getGridStart(s_id);
    for (let s0 = parseInt(start.y); s0 < mathjs.min([parseInt(start.y + static_video_y), video_y]); s0++) {
      for (let s1 = parseInt(start.x); s1 < mathjs.min([parseInt(start.x + static_video_x), video_x]); s1++) {
        // console.log(`${s0}!!${s1}`);

        if (t_arr_s[`${s0}-${s1}`]) {

          t_arr_s[`${s0}-${s1}`].push(2);
        } else {
          is_null += 1;
          // console.log(`static error ${`${s0}-${s1}`}`);
        }
      }
    }





    ////////////////////////////
    if (!user_static_ids.includes(s_id)) {
      user_static_ids.push(s_id);
    }

    static_diff_ary.push(Math.abs(static_video_x * static_video_y) - target_logs[i].size);

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
      // console.log(`null`);
      // console.log(r);
      // console.log(`${u_area_result}, x : ${target_logs[i].x}, y: ${target_logs[i].y}`);
      is_null += 1;
      continue;
    } else {

      user_adaptive_grids.push(g_size.id);




      let center_x = parseInt(g_size.x);
      let center_y = parseInt(g_size.y);
      let log_w = g_size.w;
      let log_h = g_size.h;
      // console.log(`target ${target_id} start x: ${parseInt(center_x - log_w/2)}, end_x : ${center_x + log_w/2}`)
      // console.log(`target ${target_id} start y: ${parseInt(center_y - log_h/2)}, end_y : ${center_y + log_h/2}`)

      for (let s0 = parseInt(center_y - log_h / 2); s0 < center_y + log_h / 2; s0++) {
        for (let s1 = parseInt(center_x - log_w / 2); s1 < center_x + log_w / 2; s1++) {
          // console.log(`${s0}!!${s1}`)
          if (t_arr_a[`${s0}-${s1}`]) {

            t_arr_a[`${s0}-${s1}`].push(2);
          } else {
            // console.log(`target ${target_id} start x: ${parseInt(center_x - log_w/2)}, end_x : ${center_x + log_w/2}`)
            // console.log(`${center_x}, ${center_y} ${log_w}, ${log_h}`)
            // console.log(`target ${target_id} start y: ${parseInt(center_y - log_h/2)}, end_y : ${center_y + log_h/2}`)

            // console.log(`adaptive error ${s0}-${s1}`)
            is_null += 1;

          }
        }
      }

      // 실제 이동 영역



      if (user_grid_direction_support[g_size.id]) {
        user_grid_direction_support[g_size.id][target_logs[i].direction_id] += 1;
      } else {
        user_grid_direction_support[g_size.id] = { 0: 0, 1: 0, 2: 0, 3: 0 };
        user_grid_direction_support[g_size.id][target_logs[i].direction_id] += 1;

      }

      adaptive_diff_ary.push(Math.abs(g_size.grid_size - target_logs[i].size));
    }

  }
  if (is_null > 0) {
    console.log(`${target_id} ${is_null}`);
    continue;
  } else {
    console.log(`${target_id} ${is_null}`);

  }

  let move_s = 0;
  let move_a = 0;
  let inter_s = 0; // 교집합
  let s1_s = 0; // 이동 로그만
  let s2_s = 0; // 그리드만
  let inter_a = 0;
  let s1_a = 0;
  let s2_a = 0;
  for (let i = 0; i < video_y; i++) {
    for (let j = 0; j < video_x; j++) {
      let arr = [...new Set(t_arr_a[`${i}-${j}`])];
      t_arr_a[`${i}-${j}`] = arr
      let ar = [...new Set(t_arr_s[`${i}-${j}`])];
      t_arr_s[`${i}-${j}`] = ar;
    }
  }
  for (let i = 0; i < video_y; i++) {
    for (let j = 0; j < video_x; j++) {
      if (t_arr_a[`${i}-${j}`].length === 2) {
        move_a += 1;
        inter_a += 1;
      } else if (t_arr_a[`${i}-${j}`].length === 1) {
        // console.log(t_arr[`${i}-${j}`][0]);
        if (t_arr_a[`${i}-${j}`][0] === 1) {
          move_a += 1;
          s1_a += 1;
        } else {
          s2_a += 1;
        }
      }
    }
  }
  for (let i = 0; i < video_y; i++) {
    for (let j = 0; j < video_x; j++) {
      // if (!t_arr_s[`${i}-${j}`]) {
      // console.log(`a ${i}-${j}`);
      // }
      if (t_arr_s[`${i}-${j}`].length === 2) {
        inter_s += 1;
        move_s += 1;
      } else if (t_arr_s[`${i}-${j}`].length === 1) {
        // console.log(t_arr[`${i}-${j}`][0]);
        if (t_arr_s[`${i}-${j}`][0] === 1) {
          s1_s += 1;
          move_s += 1;
        } else {
          s2_s += 1;
        }
      }
    }
  }
  // fs.appendFileSync(`./${file_name}_adaptive.txt`, `${target_id}\t${move_a}\t${inter_a}\t${s1_a}\t${s2_a}\t${inter_a/(s2_a + s1_a + move_a)}\n`);
  fs.appendFileSync(`./${file_name}_static_${split_len}.txt`, `${target_id}\t${move_s}\t${inter_s}\t${s1_s}\t${s2_s}\t${inter_s/(s2_s + s1_s + move_s)}\n`);


  // console.log(`${target_id} 고정 교:${inter_s}, 이동로그만:${s1_s}, 그리드만: ${s2_s} / ${s1_s/(s2_s + s1_s + inter_s)}`);
  // console.log(`${target_id} 가변 교:${inter_a}, 이동로그만:${s1_a}, 그리드만: ${s2_a} / ${s1_a/(s2_a + s1_a + inter_a)}`);


  // console.log(`${target_id} - ${user_adaptive_grids}`);
  // fs.appendFileSync(`./${file_name}_target_move_log.txt`, `${target_id} - ${JSON.stringify([...new Set(user_adaptive_grids)])}\n`);

  // fs.appendFileSync(`./${file_name}_${split_len}_grid_move_log.txt`, `${target_id} - ${JSON.stringify([...new Set(user_static_ids)])}\n`);

  // size_coverage_ary[target_id] = t_arr;
  // 가변그리드 + 0.5, 고정그리드 + 0.1, 이동로그 + 1


}