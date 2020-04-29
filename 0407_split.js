const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')

const funcSet = require('./modules/function');
const split_m = 0
// let video_x = 360;  // 
// let video_y = 240; // 사거리(4801)
let video_x = 960;  // 
let video_y = 540; // japan 거리
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
const file_name = `0327_japan`
const u_lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');

const target_split = { 101: 1, 102: 1, 103: 1, 104: 2, 201: 1, 202: 1, 203: 2, 204: 2, 301: 1, 302: 2, 303: 2, 304: 1, 401: 1, 402: 2, 403: 1, 404: 1 };
// japan
// const target_split = { 101: 1, 102: 2, 103: 2, 104: 1, 201: 1, 202: 2, 203: 2, 204: 1, 301: 1, 302: 2, 303: 2, 304: 1, 401: 1, 402: 2, 403: 2, 404: 1 };
// T 
// const target_split = { 101: 1, 102: 1, 103: 1, 104: 1, 201: 1, 202: 1, 203: 1, 204: 1, 301: 1, 302: 1, 303: 1, 304: 1, 401: 1, 402: 1, 403: 1, 404: 1 };
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
  for (let i = 0; i < arr.length; i++) {
    if (i % 2 === 0) {
      log_ary.push(arr[i]);
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

let user_movement_logs = {}; // 0414에 결과를 확인하기 위하여 user별

const print_target_id = `199`;
// let target_ids = ['141', '199', '396', '448','497', '763', '765', '892', '1049', '1074', '1164', '1199', '1210', '1278', '1403', '1439', '1453']; // 차량
let target_ids = ['8', '21', '25', '29', '35', '40', '45', '56', '75', '134', '168', '186', '231', '232', '241', '269', '347']; // 사람

let targets_logs = {};

let print_reals = [];
let print_static_grids = [];
let print_adaptive_grids = [];

let excel_logs1 = [];
let excel_logs2 = [];


let user_obj_ary = _.groupBy(log_ary, 'object_id');
for (let user_id in user_obj_ary) {

  // if (!target_ids.includes(user_id)) {
  //   continue;
  // }
  let arr = user_obj_ary[user_id];

  targets_logs[user_id] = JSON.parse(JSON.stringify(arr));

}

for (let target_id in targets_logs) {

  let target_logs = targets_logs[target_id];
  let user_static_ids = [];
  let camera_screen_ary = [];
  for (let i = 0; i < video_y; i++) {
    let ys = [];
    for (let j = 0; j < video_x; j++) {
      ys.push({ real: 0, static: 0, adaptive: 0 });
    }
    camera_screen_ary.push(ys);
  }


  let up_cnt = 0; // 사이즈가 grid 크기 보다 큰 경우
  let down_cnt = 0;
  let up_grids = [];
  let down_grids = [];
  // console.log(`camera_screen_ary y : ${camera_screen_ary.length}, x: ${camera_screen_ary[0].length}`)
  for (let i = 0; i < target_logs.length; i++) {

    ///////////////////////////// 실제 좌표 ////////////////////////////

    let dup_static_ids = [];
    // console.log(`${target_logs[i].y} ${target_logs[i].x}`);
    let obj_y = target_logs[i].y;
    let obj_x = target_logs[i].x;
    let width = target_logs[i].width;
    let height = target_logs[i].height;
    let start_x = Math.floor(obj_x - (width / 2));
    let end_x = Math.floor(obj_x + (width / 2));
    let start_y = Math.floor(obj_y - (height / 2));
    let end_y = Math.floor(obj_y + (height / 2));

    if (start_x < 0) {
      // console.log(`x: ${start_x} -> 0`)
      start_x = 1;
    }
    if (end_x >= video_x) {
      // console.log(`x: ${end_x} -> 539`)
      end_x = video_x - 1;

    }
    if (start_y < 0) {
      // console.log(`y: ${start_y} -> 0`)
      start_y = 1;

    }
    if (end_y >= video_y) {
      // console.log(`y: ${end_y} -> 539`)
      end_y = video_y - 1;
    }


    ///////////////////////////// 고정 그리드 /////////////////////////

    let s_id = target_logs[i].static_id
    if (!user_static_ids.includes(s_id)) {
      user_static_ids.push(s_id);
    }


    for (let y = start_y; y < end_y; y++) {
      for (let x = start_x; x < end_x; x++) {
        camera_screen_ary[y][x].real = 1;
      }
    }
  }
  // console.log(`up cnt: ${up_cnt}[${up_grids}], down cnt: ${down_cnt}[${down_grids}]`);

  for (let i = 0; i < user_static_ids.length; i++) {

    let y_id = -1;
    let x_id = -1;
    if (user_static_ids[i].length === 3) {
      let splits = user_static_ids[i].split('0');
      x_id = parseInt(splits[0], 10);
      y_id = parseInt(splits[1], 10);
    } else {
      let splits = user_static_ids[i].split('0');

      x_id = 10;
      y_id = parseInt(splits[2], 10);
    }




    let start_x = (x_id - 1) * static_video_x;
    let start_y = (y_id) * static_video_y;
    for (let y = start_y; y < start_y + static_video_y; y++) {
      for (let x = start_x; x < start_x + static_video_x; x++) {
        camera_screen_ary[y][x].static = 1;
      }
    }
    // if (target_id === print_target_id) {
    //   let obj = { x: start_x, y: start_y, w: static_video_x, h: static_video_y }
    //   print_static_grids.push(obj)
    // }

    // console.log(`${user_static_ids[i]} start_x : ${start_x}, end_x : ${start_x + static_video_x} start_y : ${start_y}, end_y : ${start_y + static_video_y}`);

  }
  // console.log(`${target_id} static logs : ${print_static_grids}`)



  ///////////////////////////// 고정 영역 id 발급 /////////////////////////////

  let arr = targets_logs[target_id];

  arr.sort(function (a, b) {
    return a.timestamp - b.timestamp
  })


  let user_area_logs = _.groupBy(arr, 'area_id');
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





  // 유저별 통계 및 리스트에 집중

  let user_adaptive_grids = [];

  for (let j = 1; j < arr.length; j++) {

    if (arr[j].x === arr[j - 1].x || arr[j].y === arr[j - 1].y) {
      continue;
    }

    let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;

    let mean_x = (arr[j].x + arr[j - 1].x) / 2;
    let mean_y = (arr[j].y + arr[j - 1].y) / 2;

    let mean_width = (arr[j].width + arr[j - 1].width) / 2;
    let mean_height = (arr[j].height + arr[j - 1].height) / 2;

    // if (target_id === print_target_id) {

    //   let obj = { x: mean_x - mean_width / 2, y: mean_y - mean_height / 2, w: mean_width, h: mean_height };
    //   print_reals.push(obj)
    // }



    // const target_split = { 101: 1, 102: 1, 103: 1, 104: 2, 201: 1, 202: 1, 203: 2, 204: 2, 301: 0, 302: 2, 303: 2, 304: 1, 401: 1, 402: 2, 403: 1, 404: 1 };

    let u_area_result = user_area_result[arr[j].area_id]
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
      r = funcSet.getGridId(mean_x, mean_y, grid_result_big)
      g_info = funcSet.getTargetGridInfo(arr[j].area_id, grid_result_big);
      g_size = funcSet.getGridSizeKey(r, grid_result_big);

    } else if (u_area_result === 0) {
      // small
      r = funcSet.getGridId(mean_x, mean_y, grid_result_small);
      g_info = funcSet.getTargetGridInfo(arr[j].area_id, grid_result_small);
      g_size = funcSet.getGridSizeKey(r, grid_result_small);

    } else if (u_area_result === -1) {
      // 중립
      r = funcSet.getGridId(mean_x, mean_y, grid_result_intersect);
      g_info = funcSet.getTargetGridInfo(arr[j].area_id, grid_result_intersect);
      g_size = funcSet.getGridSizeKey(r, grid_result_intersect);

    }

    if (r == -1 || g_size === -1 || g_size === undefined || g_info === null) {
      // if (target_id === print_target_id)
      // console.log(`grid_id:${r}, x,y(${mean_x},${mean_y}) grid_size:${g_size})`);
      continue
    } else {
      // g_size = g_size.grid_size;
      // console.log(`gsize: ${JSON.stringify(r)}`)
      // console.log('grid math success')
      // user_adaptives.push(r);

      user_adaptive_grids.push(g_size);


    }

    if (!user_movement_logs[target_id]) {
      let user_movement_log = { direction, area_id: arr[j].area_id, grid_id: r }
      user_movement_logs[target_id] = [user_movement_log]
    } else {
      user_movement_logs[target_id].push({ direction, area_id: arr[j].area_id, grid_id: r })
    }


  }


  let ccc = 0;
  let dup_ids = [];
  for (let g = 0; g < user_adaptive_grids.length; g++) {
    // console.log(user_adaptive_grids[g].id)

    if (dup_ids.includes(user_adaptive_grids[g].id)) {
      continue;
    } else {
      dup_ids.push(user_adaptive_grids[g].id);

      // if (target_id === print_target_id) {
      //   print_adaptive_grids.push(user_adaptive_grids[g])
      // }

    }
    let a_start_x = Math.floor(user_adaptive_grids[g].x);
    let a_width = Math.floor(user_adaptive_grids[g].w);
    let a_start_y = Math.floor(user_adaptive_grids[g].y);
    let a_height = Math.floor(user_adaptive_grids[g].h);
    // console.log(`adaptive id[${user_adaptive_grids[g].id}] ${a_start_x}~${a_start_x + a_width}, ${a_start_y}~${a_start_y+a_height}`);
    for (let ay = a_start_y; ay < a_start_y + a_height; ay++) {
      for (let ax = a_start_x; ax < a_start_x + a_width; ax++) {
        camera_screen_ary[ay][ax].adaptive = 1;
        ccc += 1;
      }
    }

  }

  // if (target_id === print_target_id) {
  //   console.log(`target id [${target_id}] - ${dup_ids}`)
  //   console.log(`target id [${target_id}] - ${user_static_ids}`)

  //   console.log(`target id [${target_id}] - ${ccc} ${video_y * video_x}`)

  // }

  // real 수 세기
  let real_cnt = 0;
  let only_static_cnt = 0;
  let only_adaptive_cnt = 0;
  let only_static_real_cnt = 0;
  let only_adaptive_real_cnt = 0;
  let static_intersect_cnt = 0;
  let adaptive_intersect_cnt = 0;

  let static_sum_cnt = 0;
  let adaptive_sum_cnt = 0;

  for (let i = 0; i < video_y; i++) {
    for (let j = 0; j < video_x; j++) {

      if (camera_screen_ary[i][j].real === 1) {
        real_cnt += 1;
      }
      if (camera_screen_ary[i][j].real === 1 || camera_screen_ary[i][j].static === 1) {
        static_sum_cnt++;
      }
      if (camera_screen_ary[i][j].real === 1 && camera_screen_ary[i][j].static === 1) {
        static_intersect_cnt += 1;
      } else if (camera_screen_ary[i][j].static === 1) {
        only_static_cnt += 1;
      } else if (camera_screen_ary[i][j].real === 1) {
        only_static_real_cnt += 1;
      }
    }
  }
  // console.log(`target ${target_id} include grids : ${user_static_ids}`)
  let s0 = `static\t${target_id}\t${static_sum_cnt / (video_y * video_x)}\t${real_cnt / (video_x * video_y)}\t${static_intersect_cnt / (video_y * video_x)}\t${only_static_real_cnt / (video_y * video_x)}\t${only_static_cnt / (video_y * video_x)}`;
  // console.log(s0);
  excel_logs1.push(s0);

  for (let i = 0; i < video_y; i++) {
    for (let j = 0; j < video_x; j++) {

      // if (camera_screen_ary[i][j].real === 1) {
      //   real_cnt += 1;
      // }
      if (camera_screen_ary[i][j].real === 1 || camera_screen_ary[i][j].adaptive === 1) {
        adaptive_sum_cnt++;
      }

      if (camera_screen_ary[i][j].real === 1 && camera_screen_ary[i][j].adaptive === 1) {
        adaptive_intersect_cnt += 1;
      } else if (camera_screen_ary[i][j].adaptive === 1) {
        only_adaptive_cnt += 1;
      } else if (camera_screen_ary[i][j].real === 1) {
        only_adaptive_real_cnt += 1;
      }
    }
  }


  let s1 = `adaptive\t${target_id}\t${adaptive_sum_cnt / (video_y * video_x)}\t${real_cnt / (video_x * video_y)}\t${adaptive_intersect_cnt / (video_y * video_x)}\t${only_adaptive_real_cnt / (video_y * video_x)}\t${only_adaptive_cnt / (video_y * video_x)}`;

  excel_logs2.push(s1);


}

// for (let i = 0; i < excel_logs1.length; i++) {
//   fs.appendFileSync(`./grid_description/${file_name}_${split_m}.txt`, `${excel_logs1[i]}\n`)
// }
// for (let i = 0; i < excel_logs2.length; i++) {
//   fs.appendFileSync(`./grid_description/${file_name}_${split_m}.txt`, `${excel_logs2[i]}\n`)
// }

// for (let i = 0; i < print_adaptive_grids.length; i++) {
//   fs.appendFileSync(`./grid_description/${file_name}_adaptive.txt`, `${JSON.stringify(print_adaptive_grids[i])},\n`)
// }
// for (let i = 0; i < print_reals.length; i++) {
//   fs.appendFileSync(`./grid_description/${file_name}_reals.txt`, `${JSON.stringify(print_reals[i])},\n`)
// }
// for (let i = 0; i < print_static_grids.length; i++) {
//   fs.appendFileSync(`./grid_description/${file_name}_statics.txt`, `${JSON.stringify(print_static_grids[i])},\n`)
// }


// 0414 fpminer 에 넣을 user_id 유저별 영역트랜잭션, 가변그리드 트랜잭션, 영역 방향 트랜잭션 을 담은 결과 데이터

let user_movement_result = []
let grid_count = Object.keys(grid_result_intersect).length; // total grid count
let grid_count_big = Object.keys(grid_result_big).length;
let grid_count_small = Object.keys(grid_result_small).length;
console.log(`${grid_count + grid_count_big + grid_count_small} , (${grid_count}), (${grid_count_big}),(${grid_count_small})`);
let threshold_0 = 0;

// for (let user_id in user_movement_logs) {
//   let user_arr = user_movement_logs[user_id];
//   let area_groups = _.groupBy(user_arr, 'area_id');
//   let area_direction_mean_result = {};
//   let area_ids = []
//   let area_directions = [];
//   let a_list = []
//   for (let area_id in area_groups) {
//     let area_logs = area_groups[area_id];
//     let directions = [];
//     for (let i = 0; i < area_logs.length; i++) {
//       directions.push(area_logs[i].direction);

//     }
//     area_ids.push(area_id);
//     a_list.push({ area_id, direction: mathjs.mean(directions) });
//     area_directions.push(mathjs.mean(directions));
//     // area_direction_mean_result[area_id] = Math.mean(directions);
//   }
//   let grid_lists = [];
//   for (let g = 0; g < user_arr.length; g++) {
//     grid_lists.push(user_arr[g].grid_id);
//   }
//   grid_lists = [...new Set(grid_lists)]
//   let o = { user_id, grid_lists, area_list: a_list };
//   user_movement_result.push(o);
//   // fs.appendFileSync('./user_result.txt',`${JSON.stringify(o)}\n`);
// }

// let cnt = 0;
// let frequent_results_ = _.groupBy(user_movement_result, 'grid_lists');
// let f_r_keys = Object.keys(frequent_results_);
// f_r_keys.sort(function(a,b) {
//   return a-b;
// });
// let frequent_results = {};
// for (let k = 0 ; k < f_r_keys.length ; k ++) {
//   frequent_results[f_r_keys[k]] = frequent_results_[f_r_keys[k]]
// }
// for (let id in frequent_results) {
//   if (frequent_results[id].length > 2) {
    
//     let ids = id.split(',');
//     if (ids.length < threshold_0 * grid_count) {
//       continue;
//     }
//     cnt += 1;

//     ids.sort(function (a, b) {
//       return a - b;
//     })
//     // console.log(ids);
//     // fs.appendFileSync('./0428_result.txt', `${frequent_results[id].length} - ${JSON.stringify(ids)}\n`)

//   }
// }
// console.log(`total cnt : ${Object.keys(frequent_results).length}`)
// console.log(`upper cnt : ${cnt}`)
// console.log(`grid cnt: ${grid_count}`)

////////// 0414_fpminer copy & paste ////////////////

let threshold = 0.15;



// console.log(arr3);

const main = () => {

  for (let i = 0; i < user_movement_result.length; i++) {
    let g_list = user_movement_result[i].grid_lists
    // console.log(g_list)
    g_list.sort(function (a, b) {
      return a - b;
    })
    user_movement_result[i].grid_str = g_list.join('@');

    let a_list = user_movement_result[i].area_list;
    let new_a_list = [];
    for (let a = 0; a < a_list.length; a++) {
      a_list[a].direction_id = getDirectionId(a_list[a].direction)
    }
    user_movement_result[i].area_list = a_list;

  }


  // for (let i = 0; i < user_movement_result.length; i++) {
  //   console.log(JSON.stringify(user_movement_result[i]))
  // }

  let group = {}; // area id와 area 방향이 같은 list
  for (let i = 0; i < user_movement_result.length; i++) {
    let a_list = user_movement_result[i].area_list;
    a_list.sort(function (a, b) {
      return a.id - b.id;
    })
    let a_ary = [];
    for (let a = 0; a < a_list.length; a++) {
      a_ary.push(`${a_list[a].area_id}_${a_list[a].direction_id}`);
    }
    let a_str = a_ary.join('@');
    if (!group[a_str]) {
      group[a_str] = [user_movement_result[i]];
    } else {
      group[a_str].push(user_movement_result[i]);
    }
  }
  // console.log(Object.keys(group))
  // for (let a_group in group) {
  //   if (group[a_group].length > 1) {
  //     console.log(`${a_group} - ${group[a_group].length}`)
  //     console.log(`${a_group} : ${JSON.stringify(group[a_group])}`)
  //   }
  // }
  let merge_grid_list = {};
  for (let a_str in group) {
    let a_str_list = group[a_str]; // 같은 영역, 같은 방향을 가진 객체들
    // console.log(a_str_list)
    // 0416 그냥 그룹 같은 애들 병합 
    let sum_arr = [];
    for (let i = 0; i < a_str_list.length; i++) {
      sum_arr = sum_arr.concat(a_str_list[i].grid_lists);
    }
    sum_arr = [...new Set(sum_arr)]
    let ss = '[';
    for (let i = 0; i < sum_arr.length; i++) {
      if (i === sum_arr.length - 1) {
        ss += `\'${sum_arr[i]}\']`
      } else {
        ss += `\'${sum_arr[i]}\',`
      }
    }
    // console.log(`group: ${a_str}, list: ${ss}`);
    // continue;

    if (!(a_str_list.length > 1)) {
      continue;
    }




    // console.log(`${a_str_list.length} - ${JSON.stringify(a_str_list)}`)

    let group_grid_list = _.groupBy(a_str_list, 'grid_str');
    let grid_list = Object.keys(group_grid_list);
    // console.log(`a list 같고 d id list 같고 str 같은 애들 갯수 `);
    // for (let grid_id_list in group_grid_list) {
    // console.log(`count: ${ JSON.stringify(group_grid_list[grid_id_list])}`)
    //   console.log(`${grid_id_list}: ${group_grid_list[grid_id_list].length}`)
    // }
    // for (let g_id1 in group_grid_list) {
    //   for (let g_id2 in group_grid_list) {
    //   }
    // }
    for (let i = 0; i < grid_list.length; i++) {
      for (let j = 0; j < grid_list.length; j++) {
        if (i === j) {
          continue;
        } else {
          // 매칭 해보면서 , 조건 같으면
          let user_grid_list1 = grid_list[i].split('@')
          let user_grid_list2 = grid_list[j].split('@');
          let concat_list = user_grid_list1.concat(user_grid_list2);
          let dup_removed_concat_list = [...new Set(concat_list)];
          let intersect_list = user_grid_list1.filter(v => user_grid_list2.includes(v))
          // console.log(`user1 - ${user_grid_list1}`);
          // console.log('---------------')
          // console.log(`user2 - ${user_grid_list2}`);
          // console.log('---------------')
          // console.log(`dup removed - ${intersect_list}`);


          let ratio = intersect_list.length / mathjs.min([user_grid_list1.length, user_grid_list2.length]);
          // console.log(`ratio: ${ratio} dup len: ${intersect_list.length}, i len: ${user_grid_list1.length}, j len: ${user_grid_list2.length}`)
          if (ratio > threshold) {
            // console.log(`${ratio} , ${dup_removed_concat_list}`);
            let merge_grid = dup_removed_concat_list.join('@');
            merge_grid_list[grid_list[i]] = merge_grid;
            merge_grid_list[grid_list[j]] = merge_grid;
            // console.log(`1단계 병합됨`)
          } else {
            // console.log(`1단계 병합되지 않음`);
          }

        }
      }
    }


    let signal = true
    while (signal) {

      let cnt = 0;

      for (let merged_id1 in merge_grid_list) {
        let merged_list1 = merge_grid_list[merged_id1].split('@');
        for (let merged_id2 in merge_grid_list) {
          let merged_list2 = merge_grid_list[merged_id2].split('@');

          if (merge_grid_list[merged_id2] === merge_grid_list[merged_id1]) {
            continue;
          }

          let concat_list = merged_list1.concat(merged_list2);
          let dup_removed_concat_list = [...new Set(concat_list)];
          let intersect_list = merged_list1.filter(v => merged_list2.includes(v))

          let ratio = intersect_list.length / mathjs.min([merged_list1.length, merged_list2.length]);
          // console.log(`ratio: ${ratio} dup len: ${intersect_list.length}, i len: ${user_grid_list1.length}, j len: ${user_grid_list2.length}`)
          if (ratio > threshold) {
            // console.log(`${ratio} , ${dup_removed_concat_list}`);
            let merge_grid = dup_removed_concat_list.join('@');
            merge_grid_list[merged_id1] = merge_grid;
            merge_grid_list[merged_id2] = merge_grid;
            // delete[merged_id1];
            // delete[merged_id2]
            // console.log(merge_grid)
            // console.log(`2단계 병합됨`);
            cnt += 1;

          } else {
            // console.log(`2단계 병합되지 않음`);
            // signal = false;
          }

        }
      }
      if (cnt === 0) {
        console.log(`while종료`)
        break;
      }
    }

    // a_list d_list 같은 애들을 병합조건으로 수행하였을때 최종적으로 합쳐진 id 갯수가 몇개인지 확인
    let merged_group = {};
    for (let merged_id in merge_grid_list) {
      // console.log(`${merged_id} -> ${merge_grid_list[merged_id]}`)
      if (!merged_group[merge_grid_list[merged_id]]) {
        merged_group[merge_grid_list[merged_id]] = [merged_id]
      } else {
        merged_group[merge_grid_list[merged_id]].push(merged_id)
      }
    }


    for (let id in merged_group) {
      // console.log(`${a_str} group - grid_id:${id} !!!!!!!! ${merged_group[id].length}`)
      let strs = id.split('@');
      let ss = '[';
      for (let i = 0; i < strs.length; i++) {
        if (i === strs.length - 1) {
          ss += `\'${strs[i]}\']`
        } else {
          ss += `\'${strs[i]}\',`
        }
      }
      console.log(`merged - ${ss}`)
    }


  }
}

const getDirectionId = (direction) => {
  return Math.floor(direction / 90)
}

// main();