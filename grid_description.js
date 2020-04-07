const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')

const getIdModule = require('./modules/make_area');
const split_m = 0
// let video_x = 360;  // 
// let video_y = 240; // 사거리(4801)
let video_x = 960;  // 
let video_y = 540; // japan 거리
let static_grid_size = 96 * 54;
let static_video_x = video_x / 10;
let static_video_y = video_y / 10;
let grid_result = {};
let grid_result_small = {};
let grid_result_big = {};
const file_name = `0327_japan`
const u_lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');


/////////////////////////////// 가변 그리드 생성 /////////////////////////////////

const lines = fs.readFileSync(`./${file_name}_cluster_grid_result_44.csv`).toString().split('\n');
const target_area_cluster_id_small = { 102: 0, 103: 0, 104: 1, 202: 0, 203: 1, 204: 1, 302: 1, 303: 0, 304: 0, 401: 0, 402: 0, 403: 0, 404: 0 };// 큰거
const target_area_cluster_id_big = { 102: 0, 103: 0, 104: 0, 202: 0, 203: 0, 204: 0, 302: 0, 303: 1, 304: 0, 401: 0, 402: 1, 403: 0, 404: 0 } // 큰거

// const target_area_cluster_id = { 104: 0, 203: 1, 204: 1, 302: 0, 303: 1 };
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
function getGridSizeKey(id, grid_infos) {
  return grid_infos[id];
}
function getTargetGridInfo(area_id, grid_infos) {
  let infos = [];
  for (let key in grid_infos) {
    let re_key = key.substring(0, 3);
    if (re_key === area_id) {
      infos.push(grid_infos[key]);
    }
  }
  return infos;
}
function printGridStatic (ary, height, width) {
  let sss = [];
  for (let y = 0 ; y < height; y ++) {
    let str = `${y}\t`;
    for (let x = 0; x < width ; x ++) {
      if (ary[y][x].real === 1 && ary[y][x].adaptive === 1) {
        str += '*'
      } else if (ary[y][x].adaptive === 1) {
        str += 'o'
      } else if (ary[y][x].real === 1) {
        str += '^'
      } else {
        str += ' '
      }
    }
    sss.push(str);
    fs.appendFileSync('./print_test.txt',`${str}\n`);
  }
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
function getGridSize(x, y, grid_infos) {
  for (let key in grid_result) {
    if (x >= grid_infos[key].x && x <= grid_infos[key].x + grid_infos[key].w && y >= grid_infos[key].y && y <= grid_infos[key].y + grid_infos[key].h) {
      return grid_infos[key].w * grid_infos[key].h;
    }
  }
  return -1;
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
  if ((grid_size / 4) > mathjs.mean(sizes) + split_m * mathjs.std(sizes)) {

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
    if (parseInt(v.cluster_id, 10) === small_cluster_id) {
      arr2.push(v);
    }

  });
  // if (arr2.length ===) {
  //   continue;
  // }
  func(x, y, video_x / split_cnt, video_y / split_cnt, area_id, arr2, grid_result_small);
  func(x, y, video_x / split_cnt, video_y / split_cnt, area_id, arr3, grid_result_big);

}

for (let id in grid_result_big) {
  // console.log(`[big] ${id} - ${JSON.stringify(grid_result_big[id])}`);
}


/////////////////////////////////////////////////////////////////////////////////



let u_ary = [];
let t_ary = [];
// let include_static_grid_ids = ['205','204','305','304','404','603','604'] // 사람
let include_static_grid_ids = ['207', '208', '307', '308', '407', '408']; // 차량

for (let i = 0; i < u_lines.length; i++) {
  let cols = u_lines[i].split('\t');

  let size = parseInt(cols[7]) * parseInt(cols[8]);
  let height = parseInt(cols[7]);
  let width = parseInt(cols[8]);
  if (!isNaN(size)) {



    let a_id = getIdModule.getAreaId(parseInt(cols[9]), parseInt(cols[10]), parseInt(cols[5]), parseInt(cols[6]));
    let obj = { timestamp: parseInt(cols[1]), x: parseInt(cols[5]), y: parseInt(cols[6]), width, height, size, object_id: cols[2], static_id: cols[4], area_id: a_id }
    t_ary.push(obj);

  } else {
  }
}
let t_ary_result = _.groupBy(t_ary, 'object_id');
console.log(`all len : ${Object.keys(t_ary_result).length}`)
let include_cnt = 0;
let static_path_ary = [];
let print_target_id = `199`;
let target_ids = ['141', '199', '396', '448','497', '763', '765', '892', '1049', '1074', '1164', '1199', '1210', '1278', '1403', '1439', '1453']; // 차량
// let target_ids = ['8', '21', '25','29','35','40','45','56','75','134','168','186','231','232','241','269','347']; // 사람
// let target_ids = []
let print_reals = [];
let print_static_grids = [];
let print_adaptive_grids = [];

let excel_logs1 = [];
let excel_logs2 = [];

let target_object_ids = []
let raw_logs = [];
let target_logs = [];
let targets_logs = {};

for (let user_id in t_ary_result) {
  let arr = t_ary_result[user_id];
  let cnt = 0;
  let user_statics = [];
  if (arr.length < 3) {
    continue;
  }
  ///// 모든 유저 다 include /////
  // for (let k = 0 ; k < arr.length ; k ++) {
  //   u_ary.push(arr[k]);
  // }

  for (let k = 0; k < arr.length; k++) {
    if (user_statics.includes(arr[k].static_id)) {
      continue;
    } 
    user_statics.push(arr[k].static_id);
    if (include_static_grid_ids.includes(arr[k].static_id)) {
      cnt++;
    }
  }
  if (cnt >= 5) {
    for (let k = 0; k < arr.length; k++) {
      u_ary.push(arr[k]);
    }
    include_cnt += 1;
    let dup_removed = [... new Set(user_statics)];
    static_path_ary.push(dup_removed.length);
    // console.log(`[${user_id}] - ${dup_removed}`)
    if (target_ids.includes(user_id)) {
      targets_logs[user_id] = JSON.parse(JSON.stringify(arr));
    }

  } else {
  }
}
// console.log(`total user  - ${static_path_ary.length}`)
// let target_user_grid_logs = _.groupBy(raw_logs, 'static_id');
// for (let static_id in target_user_grid_logs) {
//   let arr = target_user_grid_logs[static_id];
//   let sizes = [];
//   for (let s = 0 ; s < arr.length ; s++) {
//     sizes.push(arr[s].size);
//   }

// }

console.log(`include cnt - ${include_cnt}`);
let csv_id_ary = _.groupBy(raw_arys, 'object_id');
let obj_cluster_infos = {};
for (let obj_id in csv_id_ary) {
  let arr = csv_id_ary[obj_id];

  for (let j = 0; j < arr.length; j++) {
    let grid_id = arr[j].grid_id;
    let cluster_id = arr[j].cluster_id;
    if (j === 0) {
      obj_cluster_infos[obj_id] = {}
      obj_cluster_infos[obj_id][grid_id] = cluster_id
    } else {
      obj_cluster_infos[obj_id][grid_id] = cluster_id;
    }
  }
}


let csv_ids_obj = _.groupBy(raw_arys, 'object_id');
let csv_ids = Object.keys(csv_ids_obj);

console.log(`id\treal cnt\tintersect cnt\tobject only\tgrid only`);
for (let target_id in targets_logs) {

  let target_logs = targets_logs[target_id];
  // console.log(`${target_id} start`)
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



  if (!csv_ids.includes(target_id)) {
    console.log(`target id not include!! `);
    continue;
  }


  let arr = targets_logs[target_id];
  // console.log(`${target_id} include - ${arr.length}`)

  arr.sort(function (a, b) {
    return a.timestamp - b.timestamp
  })



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


    if (!obj_cluster_infos[target_id]) {
      // console.log(`[${ids[i]}] not ! ${obj_cluster_infos[ids[i]]}`);
      break;;
    } else {
      // console.log(`[${ids[i]}] exist ! ${obj_cluster_infos[ids[i]]}`);
    }

    let cluster_id = obj_cluster_infos[target_id][arr[j].area_id];
    if (!cluster_id) {
      // console.log(`cur areaid-${arr[j].area_id}, ${ids[i]} - ${JSON.stringify(obj_cluster_infos[ids[i]])}`)
      break;
    } else {
      // console.log(`cur exist!!`)
    }
    let big_cluster_id = target_area_cluster_id_big[arr[j].area_id]
    let small_cluster_id = target_area_cluster_id_small[arr[j].area_id];
    // console.log(`${ids[i]} area:${arr[j].area_id}: ${cluster_id} - ${big_cluster_id}, ${small_cluster_id}`)
    let r = -1;
    let g_info = null;
    let g_size = -1;
    if (parseInt(cluster_id, 10) === big_cluster_id) {
      r = getGridId(mean_x, mean_y, grid_result_big)
      g_info = getTargetGridInfo(arr[j].area_id, grid_result_big);
      g_size = getGridSizeKey(r, grid_result_big);
    } else {
      r = getGridId(mean_x, mean_y, grid_result_small);
      g_info = getTargetGridInfo(arr[j].area_id, grid_result_small);
      g_size = getGridSizeKey(r, grid_result_small);

    }
    if (r == -1 || g_size === -1) {
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


  // console.log(JSON.stringify(user_adaptive_grids));
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

for (let i = 0 ; i < excel_logs1.length ; i ++) {
  fs.appendFileSync(`./grid_description/${file_name}_${split_m}.txt`, `${excel_logs1[i]}\n`)
}
for (let i = 0 ; i < excel_logs2.length ; i ++) {
  fs.appendFileSync(`./grid_description/${file_name}_${split_m}.txt`, `${excel_logs2[i]}\n`)
}

for (let i = 0 ; i < print_adaptive_grids.length ; i ++) {
  fs.appendFileSync(`./grid_description/${file_name}_adaptive.txt`, `${JSON.stringify(print_adaptive_grids[i])},\n`)
}
for (let i = 0 ; i < print_reals.length ; i ++) {
  fs.appendFileSync(`./grid_description/${file_name}_reals.txt`, `${JSON.stringify(print_reals[i])},\n`)
}
for (let i = 0 ; i < print_static_grids.length ; i ++) {
  fs.appendFileSync(`./grid_description/${file_name}_statics.txt`, `${JSON.stringify(print_static_grids[i])},\n`)
}
