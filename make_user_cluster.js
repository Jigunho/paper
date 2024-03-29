const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')

const getIdModule = require('./modules/make_area');

// let video_x = 360;  // 
// let video_y = 240; // 사거리(4801)
let video_x = 960;  // 
let video_y = 540; // japan 거리
let static_grid_size = 96 * 54;
let grid_result = {};
let grid_result_small = {};
let grid_result_big = {};
const file_name = `0327_japan`
const lines = fs.readFileSync(`./${file_name}_cluster_grid_result_44.csv`).toString().split('\n');
const target_area_cluster_id_small = { 102: 0, 103: 0, 104: 1, 202: 0, 203: 1, 204: 1, 302: 1, 303: 0, 304: 0, 401: 0, 402: 0, 403: 0, 404: 0 };// 큰거
const target_area_cluster_id_big = { 102: 0, 103: 0, 104: 0, 202: 0, 203: 0, 204: 0, 302: 0,303: 1,304: 0, 401:0, 402: 1, 403:0, 404: 0  } // 큰거

// const target_area_cluster_id = { 104: 0, 203: 1, 204: 1, 302: 0, 303: 1 };
const target_id = []
console.log(lines.length);


let split_cnt = 4;
let col_names = lines[0].split(',');

let raw_arys = [];
for (let i = 1; i < lines.length - 1; i++) {
  let cols = lines[i].split(',');
  let obj = {};
  for (let j = 0; j < col_names.length; j++) {
    obj[col_names[j].replace('\r', '')] = cols[j].replace('\r', '');
  }
  let obj_x = obj.x;
  let obj_y = obj.y;
  if (obj_x <= 0) {
    obj_x = 1;
  }
  if (obj_x > video_x) {
    obj_x = video_x - 1;
  }
  if (obj_y <= 0) {
    obj_y = 1;
  }
  if (obj_y > video_y) {
    obj_y = video_y - 1;
  }
  if (obj.grid_id.length < 3) {
    continue;
  }
  raw_arys.push(obj);

}



let grid_ary = {};
grid_ary[1] = raw_arys;
function getGridSize(id, grid_infos) {
  return grid_infos[id];
}
function getTargetGridInfo(area_id, grid_infos) {
  let infos = [];
  for (let key in grid_infos) {
    let re_key = key.substring(0,3);
    if (re_key === area_id) {
      infos.push(grid_infos[key]);
    }
  }
  return infos;
}
function getGridId(x, y, grid_infos) {
  // adaptive grid id
  for (let key in grid_infos) {
    if (x >= grid_infos[key].x && x <= grid_infos[key].x + grid_infos[key].w && y >= grid_infos[key].y && y <= grid_infos[key].y + grid_infos[key].h) {
      return key;
    }
  }
  return -1;
}
function getGridSize(x,y, grid_infos) {
  for (let key in grid_result) {
    if (x >= grid_infos[key].x && x <= grid_infos[key].x + grid_infos[key].w && y >= grid_infos[key].y && y <= grid_infos[key].y + grid_infos[key].h) {
      return grid_infos[key].w * grid_infos[key].h;
    }
  }
}
function getStaticGridId(x, y) {
  let GRID_X_SIZE = video_x / 10;
  let GRID_Y_SIZE = video_y / 10;

  if (x > video_x) {
    x = video_x - 1;
  }
  if (y > video_y) {
    y = video_y - 1;
  }

  let grid_x = Math.ceil(x / GRID_X_SIZE);
  let grid_y = Math.ceil(y / GRID_Y_SIZE) - 1;

  let grid_id = parseInt(`${grid_x}0${grid_y}`);
  return grid_id

}
function getXY(area_id) {
  let key = area_id.split('0');
  let x_size = video_x / split_cnt;
  let y_size = video_y / split_cnt;
  let x = (parseInt(key[0], 10) - 1) * x_size;
  let y = (parseInt(key[1], 10) - 1) * y_size;
  return { x, y };
}
function func(x, y, len_x, len_y, key, arr, result_ary) {
  let ary = arr;

  // console.log(`func ${key} len: ${ary.length}`)
  let grid_size = len_x * len_y;
  let sizes = [];



  for (let i = 0; i < ary.length; i++) {
    let size = ary[i].size;
    sizes.push(size);
  }

  if (sizes.length < 3) {
    result_ary[key] = { grid_size: grid_size, x, y, w: len_x, h: len_y, count: 0, obj_size_mean: 0, obj_size_mean: 0, filtered: false, id: key };

    return
  }
  else if (grid_size < mathjs.mean(sizes)) {
    result_ary[key] = {
      grid_size: grid_size, x, y, w: len_x, h: len_y, count: sizes.length, key, obj_size_mean: mathjs.mean(sizes),
      obj_size_std: mathjs.std(sizes), ratio: mathjs.std(sizes) / grid_size, id: key, filtered: false,
    };

    return;

  } else if (sizes.length > 5 && sizes.length <= 10) {
    result_ary[key] = {
      grid_size: grid_size, x, y, w: len_x, h: len_y, count: sizes.length, key,
      obj_size_mean: mathjs.mean(sizes), obj_size_std: mathjs.std(sizes), ratio: mathjs.std(sizes) / grid_size, filtered: false, id: key
    };


    return;

  } else {

  }
  // if (grid_size > mathjs.mean(sizes) + mathjs.std(sizes)) {

  if (grid_size / 4 > mathjs.mean(sizes) - mathjs.std(sizes)) {
    
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

    func(x, y, len_x / 2, len_y / 2, `${key}-00`, ary00, result_ary);
    func(x + len_x / 2, y, len_x / 2, len_y / 2, `${key}-01`, ary01, result_ary);
    func(x, y + len_y / 2, len_x / 2, len_y / 2, `${key}-10`, ary10, result_ary);
    func(x + len_x / 2, y + len_y / 2, len_x / 2, len_y / 2, `${key}-11`, ary11, result_ary);
    // delete grid_ary[key];
    return;

  } else {
    result_ary[key] = {
      grid_size: grid_size, obj_size_mean: mathjs.mean(sizes), obj_size_std: mathjs.std(sizes), x, y, w: len_x,
      h: len_y, count: sizes.length, ratio: mathjs.std(sizes) / grid_size, filtered: false, id: key
    };
    // std_result.push(`${grid_size}\t${mathjs.mean(sizes)}\t${mathjs.std(sizes)}\t${sizes.length}`);
    // std_ratio_result.push(mathjs.mean(sizes) / grid_size)
    // std_ratio_result2.push(mathjs.std(sizes) / grid_size);
    // console.log(`grid size: ${grid_size}, sizemean: ${mathjs.mean(sizes)}`)
    return;
  }
}
let area_id_logs = _.groupBy(raw_arys, 'grid_id');
console.log(`key kind: ${Object.keys(area_id_logs)}`)
// console.log(`target grid id - ${Object.keys(target_area_cluster_id)}`);
// let target_ids = Object.keys(target_area_cluster_id);
for (let area_id in area_id_logs) {
  let arr = area_id_logs[area_id];

  let { x, y } = getXY(area_id);



  // console.log(`${area_id}, size: ${arr.length}`);
  let arr2 = []; // small
  let arr3 = []; // big
  // console.log(JSON.stringify(target_area_cluster_id));
  arr.forEach(v => {

    let big_cluster_id = target_area_cluster_id_big[v.grid_id]
    let small_cluster_id = target_area_cluster_id_small[v.grid_id];
    if (parseInt(v.cluster_id, 10) === big_cluster_id) {
      arr3.push(v);
    } 
    if (parseInt(v.cluster_id, 10) === small_cluster_id){
      arr2.push(v);
    }

  });
  // if (arr2.length ===) {
  //   continue;
  // }
  func(x, y, video_x / split_cnt, video_y / split_cnt, area_id, arr2, grid_result_small);
  func(x, y, video_x / split_cnt, video_y / split_cnt, area_id, arr3, grid_result_big);

}
// func(0, 0, video_x, video_y, `1`, raw_arys)
console.log(`--- first len : ${raw_arys.length}`);
console.log(`small grid result 갯수: ${Object.keys(grid_result_small).length}`);
console.log(`big grid result 갯수: ${Object.keys(grid_result_big).length}`);



let adaptive_grid_infos = {};
let static_grid_infos = {};

const u_lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');
// let include_ids = [
//   8,9,10,12,15,35,40,55,134,169,177,185,186,195,197,203,210,231,232,234,259,265,269,280,300,347,387,388,406,409,432,434,440,450,452,476,511,528,542,556,583,594,609,621,654,655,676,770,784,856,891,925,929,1001,1017,1044,1047,1157,1224,1312,1323,1394,1431,1458,1462,1624,1633
// ] // 아래로가는 ( 100이상 )
// let include_ids = [54,75,131,145,155,271,344,365,405,490,526,559,603,627,630,636,651,697,704,796,1014,1097,1433,1490,1500] 
//  위로가는 ( 90이하)
let include_ids = [8,9,10,12,40,55,134,145,169,185,195,197,203,210,231,232,234,259,265,269,280,300,365,388,406,432,434,440,452,476,490,526,542,556,621,654,655,784,796,929,1014,1224,1394,1458] 
// 270 이상 혹은 90 - 180
let u_ary = [];
for (let i = 0; i < u_lines.length; i++) {
  let cols = u_lines[i].split('\t');

  let o_id = parseInt(cols[2]);
  if (!include_ids.includes(o_id)) {
    continue;
  }

  let size = parseInt(cols[7]) * parseInt(cols[8]);
  if (!isNaN(size)) {
    let a_id = getIdModule.getAreaId(parseInt(cols[9]), parseInt(cols[10]), parseInt(cols[5]), parseInt(cols[6]));
    // console.log(`${cols[4]} -> ${a_id}`)
    let obj = { timestamp: parseInt(cols[1]), x: parseInt(cols[5]), y: parseInt(cols[6]), size, object_id: cols[2], static_id: cols[4], area_id: a_id }
    // console.log(size);
    u_ary.push(obj);

  } else {
  }
}

let csv_id_ary = _.groupBy(raw_arys, 'object_id');
let obj_cluster_infos = {};
for (let obj_id in csv_id_ary) {
  let arr = csv_id_ary[obj_id];
  
  for (let j = 0 ; j < arr.length ; j ++) {
    let grid_id = arr[j].grid_id;
    let cluster_id = arr[j].cluster_id;
    if (j === 0) {
      obj_cluster_infos[obj_id] = { }
      obj_cluster_infos[obj_id][grid_id] = cluster_id
    } else {
      obj_cluster_infos[obj_id][grid_id] = cluster_id;
    }
  }
}
// for (let u_id in obj_cluster_infos) {
//   console.log(JSON.stringify(obj_cluster_infos[u_id]));
// }

let save_grid_infos = {}; // 저장할 grid info 

let obj_id_ary = _.groupBy(u_ary, 'object_id');
console.log(include_ids.length);
console.log(`obj ids : ${Object.keys(obj_id_ary).length}`);
let include_area_ids = ['103','202','203','302']; // 사람 area id 
let log_avg = [];
let ids = Object.keys(obj_id_ary);
let user_transactions = {};
let obj_cnt = 0;

let save_target_ids = [];

for (let i = 0; i < ids.length; i++) {
  let arr = obj_id_ary[ids[i]];
  arr.sort(function (a, b) {
    return a.timestamp - b.timestamp
  })



  let directions = []
  for (let j = 1; j < arr.length; j++) {

    if (arr[j].x === arr[j - 1].x || arr[j].y === arr[j - 1].y) {
      continue;
    }

    // let velocity = Math.sqrt(Math.pow(arr[j].y - arr[j - 1].y, 2) + Math.pow(arr[j].x - arr[j - 1].x, 2)) / (arr[j].timestamp - arr[j - 1].timestamp) * 100;

    let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;
    // directions.push(direction);
    let mean_x = (arr[j].x + arr[j - 1].x) / 2;
    let mean_y = (arr[j].y + arr[j - 1].y) / 2;

    let cluster_id = obj_cluster_infos[ids[i]][arr[j].area_id];
    let big_cluster_id = target_area_cluster_id_big[arr[j].grid_id]
    let small_cluster_id = target_area_cluster_id_small[arr[j].grid_id];
    let r = -1;
    let g_info = null;
    if (parseInt(cluster_id, 10) === big_cluster_id) {
      r = getGridId(mean_x, mean_y, grid_result_big)
      g_info = getTargetGridInfo(arr[j].area_id, grid_result_big);
    } else {
      r = getGridId(mean_x, mean_y, grid_result_small);
      g_info = getTargetGridInfo(arr[j].area_id, grid_result_small);
    }
    if (r == -1) {
      // console.log('grid_error');
      continue;
    }
    
    if (!include_area_ids.includes(arr[j].area_id)) {
      delete user_transactions[ids[i]];
      // console.log('delete');
      break;
    }

    if (!save_grid_infos[arr[j].area_id]) {
      save_grid_infos[arr[j].area_id] = g_info
    }


    let grid_info = { grid_id: r, direction };

    if (!user_transactions[ids[i]]) {
      user_transactions[ids[i]] = [grid_info];
    } else {
      user_transactions[ids[i]].push(grid_info);
    }

    // let s_id = getStaticGridId(arr[j].x, arr[j].y)
    // let s = -1;
    // if (arr[j].size <= static_grid_size) {
    //   s = 1 - arr[j].size / static_grid_size
    // } else {
    //   s = 1 - static_grid_size / arr[j].size
    // }
    // if (!static_grid_infos[s_id]) {
      
    //   static_grid_infos[s_id] = [s]
    // } else {
    //   static_grid_infos[s_id].push(s);
    // }

    // let s0 = -1;
    // if (arr[j].size <= adaptive_grid_size) {
    //   s0 = 1 - arr[j].size / adaptive_grid_size;
    // } else {
    //   s0 = 1 - adaptive_grid_size / arr[j].size
    // }

    // if (!adaptive_grid_infos[r]) {
    //   adaptive_grid_infos[r] = [s0];
    // } else {
    //   adaptive_grid_infos[r].push(s0);
    // }

  }
}
let str = '';
for (let area_id in save_grid_infos) {
  console.log(area_id);
  // console.log(`[${area_id}] : ${JSON.stringify(save_grid_infos[area_id])}`)
  let arr = save_grid_infos[area_id];
  for (let i = 0 ; i < arr.length ; i ++) {
    str += `${JSON.stringify(arr[i])},\n`
  }
}
fs.appendFileSync('./tmp.txt', str);

let grss = {};
let all_ids = [];
let user_per_ids = [];
for (let user_id in user_transactions) {
  let arr = user_transactions[user_id];
  let r_ids = [];
  arr.forEach(v => {
    r_ids.push(v.grid_id);
  })
  let removed_ids = [... new Set(r_ids)];

  console.log(`${user_id} - tracks: ${JSON.stringify(removed_ids)}`);
  all_ids = all_ids.concat(removed_ids);
  user_per_ids.push({ user_id, grids: removed_ids });
}
let dup_all_ids = [... new Set(all_ids)];
// console.log(dup_all_ids);

for (let i = 0 ; i < user_per_ids.length; i++) {
  
  for (let j = 0 ; j < user_per_ids.length ; j ++) {
  
    if (j===i) {
      continue;
    }
    let arr = user_per_ids[i].grids;
    
    let concat_arr = arr.concat(user_per_ids[j].grids);
    concat_arr = [...new Set(concat_arr)];
    // console.log(`id[${user_per_ids[i].user_id},${user_per_ids[j].user_id}] / arr: ${arr.length}, concat_arr: ${concat_arr.length}`)
    // let dup_arr = [...new Set(arr)];
  	var d = concat_arr.filter(function (item, pos) {return arr.indexOf(item) != pos}); // 교
  	var e = concat_arr.filter(function (item, pos) {return arr.indexOf(item) == pos}); // 합
    // console.log(`id[${user_per_ids[i].user_id},${user_per_ids[j].user_id}] ratio : ${d.length / e.length}`)
  }
}

//// 0303 고정 그리드, adaptive 그리드 편차 비교
console.log(`static grid - ${Object.keys(static_grid_infos)}`)
console.log(`adaptive grid - ${Object.keys(adaptive_grid_infos)}`)

for (let s_id in static_grid_infos) {
  let arr = static_grid_infos[s_id];
  // if (arr.length < 100) {
  //   continue;
  // }
  // fs.appendFileSync(`./clustering_result3/${file_name}_0330_static_grid_result.txt`, `${s_id}\t${arr.length}\t${mathjs.mean(arr)}\t${mathjs.std(arr)}\n`);
}
for (let a_id in adaptive_grid_infos) {
  let arr = adaptive_grid_infos[a_id];
  // if (arr.length < 100) {
  //   continue;
  // }
  // fs.appendFileSync(`./clustering_result3/${file_name}_0330_adaptive_grid_result.txt`, `${a_id}\t${arr.length}\t${mathjs.mean(arr)}\t${mathjs.std(arr)}\n`);
  // console.log(`adaptive id ${a_id} - ${arr.length} mean: ${mathjs.mean(arr)}(${mathjs.std(arr)})`);


}

// group 나중에
// console.log(`user final ids len : ${Object.keys(user_transactions).length}`);
// for (let user_id in user_transactions) {
//   let arr = user_transactions[user_id];
//   let r_ids = [];
//   console.log(`user id[${user_id}] len: ${JSON.stringify(arr)}`)
//   arr.forEach(v => {
//     r_ids.push(v.grid_id);
//   })
//   let grs_dup_removed = [... new Set(r_ids)];
//   // console.log(grs_dup_removed.join(','));
//   // arr.filter((item, index) => arr.indexOf(item) === index);
//   // console.log(`${user_id} - ${arr.join('\t')}`)
//   // fs.appendFileSync(`./user_result/4801_target.tt`, `${user_id} : ${grs_dup_removed.join(',')}\n`);
//   if (!gr_max[grs_dup_removed.join(',')]) {
//     gr_max[grs_dup_removed.join(',')] = [user_id];
//   } else {
//     gr_max[grs_dup_removed.join(',')].push(user_id)
//   }
// }
// console.log(Object.keys(gr_max).length);
// let group_ids = [];
// for (let grs in gr_max) {

//   if (gr_max[grs].length >= 2) {
//     let id_strs = [];
//     let ids = grs.split(',');
//     group_ids.push(ids);
//     let str = `[`;
//     for (let j = 0; j < ids.length; j++) {
//       let id_info = getGridSize(ids[j]);
//       id_strs.push(`"${ids[j]}"`);
//       if (j === ids.length - 1) {
//         str += JSON.stringify(id_info);
//       } else {
//         str += JSON.stringify(id_info) + ',';
//       }
//     }
//     str += ']';
//     // console.log(id_strs.join(','));
//     // fs.appendFileSync('./user_result/4801_grid_info.txt', `${str},\n`)
//     fs.appendFileSync('./user_result/4801_target_grid_id_info.txt', `${id_strs.join(',')},\n`)

//   }
// }

// let group_id2 = JSON.parse(JSON.stringify(group_ids));
// for (let i = 0 ; i < group_id2.length ; i ++) {
//   let cnt = 0;
//   //console.log(group_id2[i]);
//   for (let j = 0 ; j < group_ids.length ; j ++) {
//     if (i === j) {
//       continue;
//     } else {
//       if (group_id2[i].includes(group_ids[j])) {

//       }
//     }
//   }
// }



//////////////////////////////////////// 타겟 아이디의 고정 그리드 비율
