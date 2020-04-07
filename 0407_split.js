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

const target_split = { 101: 1, 102: 1, 103: 1, 104: 2, 201: 1, 202: 1, 203: 2, 204: 2, 301: 1, 302: 2, 303: 2, 304: 1, 401: 1, 402: 2, 403: 1, 404: 1 };
let area_median_result = {}; // 영역별 객체의 median 값을 저장하기 위한 변수

let grid_result_small = {};
let grid_result_big = {};
let grid_result_intersect = {};

let log_ary = [];

for (let i = 0; i < u_lines.length; i++) {
  let cols = u_lines[i].split('\t');

  let size = parseInt(cols[7]) * parseInt(cols[8]);
  let height = parseInt(cols[7]);
  let width = parseInt(cols[8]);
  if (!isNaN(size)) {


    // funcSet.getAreaId
    let a_id = funcSet.getAreaId(parseInt(cols[9]), parseInt(cols[10]), parseInt(cols[5]), parseInt(cols[6]));
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
// for (let a_g_id in grid_result_intersect) {
//   let grid_result = grid_result_intersect[a_g_id];
//   // console.log(JSON.stringify(grid_result));
//   fs.appendFileSync('./0407_grid_result_small.txt', `${JSON.stringify(grid_result)},\n`);
//   fs.appendFileSync('./0407_grid_result_big.txt', `${JSON.stringify(grid_result)},\n`);

// }
// for (let a_g_id in grid_result_small) {
//   let grid_result = grid_result_small[a_g_id];
//   fs.appendFileSync('./0407_grid_result_small.txt', `${JSON.stringify(grid_result)},\n`);

// }
// for (let a_g_id in grid_result_big) {
//   let grid_result = grid_result_big[a_g_id];
//   fs.appendFileSync('./0407_grid_result_big.txt', `${JSON.stringify(grid_result)},\n`);

// }

const print_target_id = `45`;
// let target_ids = ['141', '199', '396', '448','497', '763', '765', '892', '1049', '1074', '1164', '1199', '1210', '1278', '1403', '1439', '1453']; // 차량
let target_ids = ['8', '21', '25','29','35','40','45','56','75','134','168','186','231','232','241','269','347']; // 사람

let targets_logs = {};

let print_reals = [];
let print_static_grids = [];
let print_adaptive_grids = [];

let excel_logs1 = [];
let excel_logs2 = [];


let user_obj_ary = _.groupBy(log_ary, 'object_id');
for (let user_id in user_obj_ary) {

  if (!target_ids.includes(user_id)) {
    continue;
  }
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
    if (target_id === print_target_id) {
      let obj = { x: start_x, y: start_y, w: static_video_x, h: static_video_y}
      print_static_grids.push(obj)
    }

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
    for (let a = 0 ; a < area_arr.length ; a ++) {
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





  let user_adaptive_grids = [];

  for (let j = 1; j < arr.length; j++) {

    if (arr[j].x === arr[j - 1].x || arr[j].y === arr[j - 1].y) {
      continue;
    }

    let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;

    let mean_x = (arr[j].x + arr[j - 1].x) / 2;
    let mean_y = (arr[j].y + arr[j - 1].y) / 2;

    let mean_width = (arr[j].width + arr[j-1].width) / 2;
    let mean_height = (arr[j].height + arr[j-1].height) / 2;

    if (target_id === print_target_id) {
      
      let obj = { x: mean_x - mean_width/2, y: mean_y - mean_height/2 , w: mean_width, h: mean_height };
      print_reals.push(obj)
    }



    // const target_split = { 101: 1, 102: 1, 103: 1, 104: 2, 201: 1, 202: 1, 203: 2, 204: 2, 301: 0, 302: 2, 303: 2, 304: 1, 401: 1, 402: 2, 403: 1, 404: 1 };
    
    let u_area_result = user_area_result[arr[j].area_id]

    let r = -1;
    let g_info = null;
    let g_size = -1;
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
      r = funcSet.getGridId(mean_x, mean_y, grid_result_small);
      g_info = funcSet.getTargetGridInfo(arr[j].area_id, grid_result_intersect);
      g_size = funcSet.getGridSizeKey(r, grid_result_intersect);

    }

    if (r == -1 || g_size === -1 || g_size === undefined) {
      console.log(`grid_id:${r}, x,y(${mean_x},${mean_y}) grid_size:${g_size})`);
      // break;
    } else {
      // g_size = g_size.grid_size;
      // console.log(`gsize: ${JSON.stringify(g_size)}`)
      // console.log('grid math success')
      // user_adaptives.push(r);

      user_adaptive_grids.push(g_size);

    
    }
  }
  // console.log(`${target_id} adaptive: ${JSON.stringify(user_adaptive_grids)}`);


  let ccc = 0;
  let dup_ids = [];
  for (let g = 0; g < user_adaptive_grids.length; g++) {
    // console.log(user_adaptive_grids[g].id)
    
    if (dup_ids.includes(user_adaptive_grids[g].id)) {
      continue;
    } else {
      dup_ids.push(user_adaptive_grids[g].id);
  
      if (target_id === print_target_id) {
        print_adaptive_grids.push(user_adaptive_grids[g])
      }

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
  console.log(`target id [${target_id}] - ${dup_ids}`)
  console.log(`target id [${target_id}] - ${user_static_ids}`)

  console.log(`target id [${target_id}] - ${ccc} ${video_y * video_x}`)

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
  let s0 = `static\t${target_id}\t${static_sum_cnt/(video_y*video_x)}\t${real_cnt / (video_x * video_y)}\t${static_intersect_cnt / (video_y * video_x)}\t${only_static_real_cnt / (video_y * video_x)}\t${only_static_cnt / (video_y * video_x)}`;
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


  let s1 = `adaptive\t${target_id}\t${adaptive_sum_cnt/(video_y*video_x)}\t${real_cnt / (video_x * video_y)}\t${adaptive_intersect_cnt / (video_y * video_x)}\t${only_adaptive_real_cnt / (video_y * video_x)}\t${only_adaptive_cnt / (video_y * video_x)}`;

  excel_logs2.push(s1);


}

// for (let i = 0 ; i < excel_logs1.length ; i ++) {
//   fs.appendFileSync(`./grid_description/${file_name}_${split_m}.txt`, `${excel_logs1[i]}\n`)
// }
// for (let i = 0 ; i < excel_logs2.length ; i ++) {
//   fs.appendFileSync(`./grid_description/${file_name}_${split_m}.txt`, `${excel_logs2[i]}\n`)
// }

for (let i = 0 ; i < print_adaptive_grids.length ; i ++) {
  fs.appendFileSync(`./grid_description/${file_name}_adaptive.txt`, `${JSON.stringify(print_adaptive_grids[i])},\n`)
}
for (let i = 0 ; i < print_reals.length ; i ++) {
  fs.appendFileSync(`./grid_description/${file_name}_reals.txt`, `${JSON.stringify(print_reals[i])},\n`)
}
for (let i = 0 ; i < print_static_grids.length ; i ++) {
  fs.appendFileSync(`./grid_description/${file_name}_statics.txt`, `${JSON.stringify(print_static_grids[i])},\n`)
}
