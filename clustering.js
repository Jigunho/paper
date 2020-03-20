const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const file_name = 'japan4road_15min'
const lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');
console.log(lines.length);

// let video_x = 360;  // 
// let video_y = 240; // 사거리(4801)

// let video_x = 876;  // road ( road_4802)
// let video_y = 540;


// let video_x = 360;  // 위, 아래 (4800) , forbus 
// let video_y = 250;

// let video_x = 980;
// let video_y = 540; // europe

let video_x = 980; // japan4road
let video_y = 540;

let std_ratio_result = []; // 편차/ 평균
let std_ratio_result2 = [];

let object_type = '20'; // 20차량, 100 사람
let std_result = [];
let grid_result = {};
let first_ary = [];
let error_cnt = 0;
let not_obj = 0;

let area_size_ary = { '00': [], '01': [], '10': [], '11': [] }; // 부분영역별 사이즈를 통한 에러필터링 하기 위한 

let entry_grid = {};
let exit_grid = {};


for (let i = 0; i < lines.length; i++) {
  let cols = lines[i].split('\t');
  // if (cols[3] !== object_type) {
  //   not_obj++;
  //   continue;

  // }
  let size = parseInt(cols[7]) * parseInt(cols[8]);
  if (!isNaN(size)) {
    let obj = { timestamp: parseInt(cols[1]), x: parseInt(cols[5]), y: parseInt(cols[6]), size, object_id: cols[2], object_type: cols[3] }
    // console.log(size);
    first_ary.push(obj);

  } else {
    error_cnt++;
  }

}
console.log(`현재 객체가 아닌것: ${not_obj}`);
console.log(`error cnt: ${error_cnt}`);
let grid_ary = {};
grid_ary[1] = first_ary;
// console.log(first_ary.length)4
function func(x, y, len_x, len_y, key, arr) {
  let ary = grid_ary[key];
  // console.log(`ary len ; ${ary.length}`)
  let grid_size = len_x * len_y;
  let sizes = [];



  for (let i = 0; i < ary.length; i++) {
    let size = ary[i].size;
    sizes.push(size);
  }

  if (sizes.length < 3) {
    grid_result[key] = { grid_size: grid_size, x, y, w: len_x, h: len_y, count: 0, obj_size_mean: 0, obj_size_mean: 0, filtered: false };

    return
  }
  else if (grid_size < mathjs.mean(sizes)) {
    grid_result[key] = {
      grid_size: grid_size, x, y, w: len_x, h: len_y, count: sizes.length, key, obj_size_mean: mathjs.mean(sizes),
      obj_size_std: mathjs.std(sizes), ratio: mathjs.std(sizes) / grid_size, key, filtered: false
    };
    std_result.push(`${grid_size}\t${mathjs.std(sizes)}\t${mathjs.mean(sizes)}\t${sizes.length}`);
    std_ratio_result.push(mathjs.mean(sizes) / grid_size)
    std_ratio_result2.push(mathjs.std(sizes) / grid_size);

    return;

  } else if (sizes.length > 10 && sizes.length <= 30) {
    grid_result[key] = {
      grid_size: grid_size, x, y, w: len_x, h: len_y, count: sizes.length, key,
      obj_size_mean: mathjs.mean(sizes), obj_size_std: mathjs.std(sizes), ratio: mathjs.std(sizes) / grid_size, filtered: false
    };
    std_result.push(`${grid_size}\t${mathjs.std(sizes)}\t${mathjs.mean(sizes)}\t${sizes.length}`);



    std_ratio_result.push(mathjs.mean(sizes) / grid_size)
    std_ratio_result2.push(mathjs.std(sizes) / grid_size);
    return;

  } else {

  }
  if (grid_size > mathjs.mean(sizes) + mathjs.std(sizes)) {

    let ary00 = [];
    let ary01 = [];
    let ary10 = [];
    let ary11 = [];


    for (let i = 0; i < ary.length; i++) {




      if (ary[i].x > x && ary[i].x < x + len_x / 2 && ary[i].y > y && ary[i].y < y + len_y / 2) {
        ary00.push(ary[i]);
      } else if (ary[i].x >= x + len_x / 2 && ary[i].x < x + len_x && ary[i].y > y && ary[i].y < y + len_y / 2) {
        ary01.push(ary[i]);
      } else if (ary[i].x > x && ary[i].x < x + len_x / 2 && ary[i].y >= y + len_y / 2 && ary[i].y < y + len_y) {
        ary10.push(ary[i]);
      } else if (ary[i].x >= x + len_x / 2 && ary[i].x < x + len_x && ary[i].y >= y + len_y / 2 && ary[i].y < y + len_y) {
        ary11.push(ary[i]);
      }
    }

    if (len_x === video_x / 2 && len_y === video_y / 2) {
      for (let n = 0; n < ary00.length; n++) {
        area_size_ary[`00`].push(ary00[n].size);
      }
      for (let n = 0; n < ary01.length; n++) {
        area_size_ary[`01`].push(ary01[n].size);
      }
      for (let n = 0; n < ary10.length; n++) {
        area_size_ary[`10`].push(ary10[n].size);
      }
      for (let n = 0; n < ary11.length; n++) {
        area_size_ary[`11`].push(ary11[n].size);
      }

    }

    grid_ary[`${key}-00`] = ary00;
    grid_ary[`${key}-01`] = ary01;
    grid_ary[`${key}-10`] = ary10;
    grid_ary[`${key}-11`] = ary11;



    func(x, y, len_x / 2, len_y / 2, `${key}-00`, ary00);
    func(x + len_x / 2, y, len_x / 2, len_y / 2, `${key}-01`, ary01);
    func(x, y + len_y / 2, len_x / 2, len_y / 2, `${key}-10`, ary10);
    func(x + len_x / 2, y + len_y / 2, len_x / 2, len_y / 2, `${key}-11`, ary11);
    delete grid_ary[key];
    return;

  } else {
    std_result.push(`${grid_size}\t${mathjs.mean(sizes)}\t${mathjs.std(sizes)}\t${sizes.length}`);
    grid_result[key] = {
      grid_size: grid_size, obj_size_mean: mathjs.mean(sizes), obj_size_std: mathjs.std(sizes), x, y, w: len_x,
      h: len_y, count: sizes.length, ratio: mathjs.std(sizes) / grid_size, filtered: false
    };
    std_ratio_result.push(mathjs.mean(sizes) / grid_size)
    std_ratio_result2.push(mathjs.std(sizes) / grid_size);
    // console.log(`grid size: ${grid_size}, sizemean: ${mathjs.mean(sizes)}`)
    return;
  }
}

func(0, 0, video_x, video_y, `1`, first_ary)
console.log(`--- first len : ${first_ary.length}`);
console.log(`raw grid result 갯수: ${Object.keys(grid_result).length}`);
// console.log(mathjs.mean(std_ratio_result));
// console.log(mathjs.mean(std_ratio_result2));



// // road - 980 - 540
function getGridSize(id) {
  return grid_result[id];
}

function getGridId(x, y) {
  for (let key in grid_result) {
    if (x >= grid_result[key].x && x <= grid_result[key].x + grid_result[key].w && y >= grid_result[key].y && y <= grid_result[key].y + grid_result[key].h) {
      return key;
    }
  }
  return -1;
}


let user_ary_list = {};
let grid_velocity_result = {};
let grid_direction_result = {};
for (let key in grid_result) {
  grid_direction_result[key] = []; // 방향 클러스터링 값
  grid_velocity_result[key] = [];  // 속도 클러스터링 값

  entry_grid[key] = 0;
  exit_grid[key] = 0;
}
//////////////////////////////////////////////////////////////////////// 방향, 속도 통계 ////////////////////////////////////////////////////////////////////
let mean_x_y_error = 0;
let mean_x_y_success = 0;
let obj_id_sum = 0;
let obj_id_ary = _.groupBy(first_ary, 'object_id');
console.log(`obj ids : ${Object.keys(obj_id_ary).length}`);
let log_avg = [];
let ids = Object.keys(obj_id_ary);
let oo = 0;
for (let i = 0; i < ids.length; i++) {
  obj_id_sum += obj_id_ary[ids[i]].length
  log_avg.push(obj_id_ary[ids[i]].length);
  let arr = obj_id_ary[ids[i]];
  arr.sort(function (a, b) {
    return a.timestamp - b.timestamp
  })

  for (let j = 1; j < arr.length; j++) {

    if (arr[j].x === arr[j - 1].x && arr[j].y === arr[j - 1].y) {
      continue;
    }
    let velocity = Math.sqrt(Math.pow(arr[j].y - arr[j - 1].y, 2) + Math.pow(arr[j].x - arr[j - 1].x, 2)) / (arr[j].timestamp - arr[j - 1].timestamp) * 100;

    let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;

    let mean_x = (arr[j].x + arr[j - 1].x) / 2;
    let mean_y = (arr[j].y + arr[j - 1].y) / 2;
    // let mean_x = arr[j-1].x;
    // let mean_y = arr[j-1].y;
    let r = getGridId(mean_x, mean_y);




    if (r === -1) {
      mean_x_y_error++;
    } else {
      mean_x_y_success++;
      grid_direction_result[r].push(direction);
      grid_velocity_result[r].push(velocity);




      let user_log_obj = { timestamp: arr[j].timestamp, grid_id: r, direction, velocity, size: arr[j].size, object_type: arr[j].object_type };
      if (!user_ary_list[ids[i]]) {
        user_ary_list[ids[i]] = [{ user_log_obj }];
      } else {
        user_ary_list[ids[i]].push(user_log_obj);
      }

    }

  }
}
let cnt = 0;
for (let user_id in user_ary_list) {

  let user_arr = user_ary_list[user_id];
  let d_means = []
  let v_means = [];
  let s_means = [];
  for (let j = 0; j < user_arr.length; j++) {
    if (user_arr[j].direction === undefined || user_arr[j].velocity === undefined || user_arr[j].size === undefined) {
      continue;
    }
    d_means.push(user_arr[j].direction);
    v_means.push(user_arr[j].velocity);
    s_means.push(user_arr[j].size);
    // if (j > 0)
    // fs.appendFileSync(`./clustering_result/${file_name}_user_raw_transactions.txt`, `${user_id},${user_arr[j].object_type},${user_arr[j].grid_id},${user_arr[j].size},${user_arr[j].direction},${user_arr[j].velocity}\n`);

  }
  // if (v_means.length < 1) {
  //   continue;
  // }
  // if (mathjs.mean(v_means) >= 2.5 ) {
  //   fs.appendFileSync(`./clustering_result/${file_name}_upper_velocity_5_user_id.txt`, `${user_id},`);
  //   cnt ++;
  // }
  
  if (user_arr.length > 1)
  // fs.appendFileSync(`./clustering_result/${file_name}_all_type_mean_transactions.txt`, `${user_id},${user_arr[1].object_type},${mathjs.mean(s_means)},${mathjs.mean(d_means)},${mathjs.mean(v_means)},${d_means.length}\n`);

}
console.log(` id cnt : ${cnt}`)


//////////////////////////////////////////////// //// 유저별 grid trace 결과 저장 /////////////////////////////////////////////////////////////
// let gr_lens = [];
// let user_obj_result = {};
// for (let i = 0; i < ids.length; i++) {

//   let arr = obj_id_ary[ids[i]];

//   arr.sort(function (a, b) {
//     return a.timestamp - b.timestamp
//   })
//   if (arr.length <= 1) {
//     continue;
//   }

//   let grs = [];
//   let user_traces = [];
//   for (let j = 1; j < arr.length; j++) {
//     if (arr[j].x === arr[j - 1].x && arr[j].y === arr[j - 1].y) {
//       continue;
//     }
//     let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
//     direction = (direction + 360) % 360;

//     let mean_x = (arr[j].x + arr[j - 1].x) / 2;
//     let mean_y = (arr[j].y + arr[j - 1].y) / 2;
//     let r = getGridId(mean_x, mean_y);
//     let grid_info = getGridSize(r);
//     if (r === -1) {
//       continue;
//     }
//     let trace_obj = { grid_id: r, grid_info };
//     grs.push(r);
//     user_traces.push(trace_obj);
//   }
//   let grs_dup_removed = [... new Set(grs)];
//   if (grs_dup_removed.length > 0) {
//     fs.appendFileSync(`./clustering_result/${file_name}_${object_type}_user_grid_traces.txt`, `${grs_dup_removed.join(',')}\t${ids[i]}\n`);
//     gr_lens.push(grs_dup_removed.length);

//   }

//   user_obj_result[ids[i]] = user_traces;
// }
// for (let i = 0; i < ids.length; i++) {
//   let res = user_obj_result[ids[i]];
//   if (res) {
//     fs.appendFileSync(`./clustering_result/${file_name}_${object_type}_user_trace_result.txt`, `{ ${ids[i]} :${JSON.stringify(res)}}\n`);

//   } else {
//     fs.appendFileSync(`./clustering_result/${file_name}_${object_type}_user_trace_result.txt`, `{ ${ids[i]} : []}\n`);

//   }
// }
// console.log(`grid transaction mean len : ${mathjs.mean(gr_lens)}`);
// console.log(`grid transaction std len : ${mathjs.std(gr_lens)}`);

// /////////////////////////////////////////////////////////////////////  velocity,  direction, entry  통계값 저장  ///////////////////////////////////////////////////////////////////////////////

// ///////////////

// console.log('---------------')
// console.log(`제자리 obj : ${oo}`);
// console.log(`total obj transaction sum : ${obj_id_sum}`);
// console.log(mean_x_y_error);
// console.log(mean_x_y_success);
// let log_sum = 0;
// let dir_sum = 0;
// for (let key in grid_direction_result) {

//   log_sum += grid_result[key].count;
//   dir_sum += grid_direction_result[key].length

//   if (grid_direction_result[key].length === 0) {
//     // console.log(`${key}(0)`);
//     grid_result[key]['direction_mean'] = 0
//     grid_result[key]['direction_std'] = 0
//     grid_result[key]['direction_count'] = grid_direction_result[key].length;
//     grid_result[key]['entry_count'] = entry_grid[key];
//     grid_result[key]['exit_count'] = exit_grid[key];
//     grid_result[key]['velocity_mean'] = 0;
//     grid_result[key]['velocity_std'] = 0;
//     grid_result[key]['veocity_count'] = grid_velocity_result[key].length;
//     grid_result[key]['grid_id'] = key

//   } else {
//     grid_result[key]['direction_mean'] = mathjs.mean(grid_direction_result[key]);
//     grid_result[key]['direction_std'] = mathjs.std(grid_direction_result[key]);
//     grid_result[key]['direction_count'] = grid_direction_result[key].length;
//     grid_result[key]['entry_count'] = entry_grid[key];
//     grid_result[key]['exit_count'] = exit_grid[key];
//     grid_result[key]['velocity_mean'] = mathjs.mean(grid_velocity_result[key])
//     grid_result[key]['velocity_std'] = mathjs.std(grid_velocity_result[key]);
//     grid_result[key]['veocity_count'] = grid_velocity_result[key].length;
//     grid_result[key]['grid_id'] = key

//   }
//   // fs.appendFileSync(`./clustering_result/${file_name}_${object_type}_fill_direction_result.txt`, `${JSON.stringify(grid_result[key])},\n`)

// }

// //// 해당 id 들의 트랜잭션 집합값



// ////////////////////////////////////////////////////////// jupyter 시각화용 방향, 속도, 그리드 id /////////////////////////////////////
// for (let key in grid_velocity_result) {
//   let velocity_arr = grid_velocity_result[key];
//   let direction_arr = grid_direction_result[key];
//   let result = [];
//   if (velocity_arr.length === 0) {
//     continue;
//   }
//   // result.push(key);
//   result.push(mathjs.mean(velocity_arr));
//   // result.push(mathjs.std(velocity_arr));
//   // result.push(velocity_arr.length);
//   result.push(mathjs.mean(direction_arr));
//   // result.push(mathjs.std(direction_arr));
//   // result.push(direction_arr.length);
//   fs.appendFileSync(`./clustering_result/${file_name}_grid_python_result2.txt`, `${result.join(',')}\n`);
// }