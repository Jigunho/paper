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
let road_id = 100;
// const target_area_cluster_id = { 102: 0, 103: 0, 104: 1, 202: 0, 203: 1, 204: 1, 302: 1, 303: 0, 304: 0, 401: 0, 402: 0, 403: 0, 404: 0 }; // 작은거
const target_area_cluster_id_small = { 102: 0, 103: 0, 104: 1, 202: 0, 203: 1, 204: 1, 302: 1, 303: 0, 304: 0, 401: 0, 402: 0, 403: 0, 404: 0 };// 큰거
const target_area_cluster_id_big = { 102: 0, 103: 0, 104: 0, 202: 0, 203: 0, 204: 0, 302: 0,303: 1,304: 0, 401:0, 402: 1, 403:0, 404: 0  } // 큰거

// const target_area_cluster_id = { 104: 0, 203: 1, 204: 1, 302: 0, 303: 1 };
const target_id = []
// obj id, size, x, y , cluster id 가 있는 csv read
// min size 값으로 클러스터의 가변 그리드를 만들고
// 아래 include id 의 유저 id를 추가하여 분할한 id에 현재 target cluster id 의 id 를 타켓함
// 

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

    // if (target_ids.includes(v.grid_id)) {

    //   if (target_area_cluster_id[v.grid_id] === parseInt(v.cluster_id, 10)) {
    //     arr2.push(v);

    //   }

    // }
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

for (let area_id in grid_result_small) {
  // fs.appendFileSync(`./clustering_result/s_${file_name}_grid_result.txt`, `${JSON.stringify(grid_result_small[area_id])},\n`);
}
for (let area_id in grid_result_big) {
  // fs.appendFileSync(`./clustering_result/b_${file_name}_grid_result.txt`, `${JSON.stringify(grid_result_big[area_id])},\n`);
}



let adaptive_grid_infos = {};
let static_grid_infos = {};

const u_lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');
let include_ids = [
  28
]
let u_ary = [];
for (let i = 0; i < u_lines.length; i++) {
  let cols = u_lines[i].split('\t');

  let o_id = parseInt(cols[2]);
  // if (!include_ids.includes(o_id)) {
  //   continue;
  // }

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
  // console.log(`${obj_id} - ${arr.length}`)
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
for (let u_id in obj_cluster_infos) {
  // console.log(`${u_id}::${JSON.stringify(obj_cluster_infos[u_id])}`);
}
let obj_id_ary = _.groupBy(u_ary, 'object_id');
console.log(include_ids.length);
console.log(`obj ids : ${Object.keys(obj_id_ary).length}`);
let ids = Object.keys(obj_id_ary);

let save_target_ids = [];
let include_area_ids = ['104','204','203','303','302'];

for (let i = 0; i < ids.length; i++) {
  let arr = obj_id_ary[ids[i]];
  arr.sort(function (a, b) {
    return a.timestamp - b.timestamp
  })

  let u_ids = [];
  for (let j = 1; j < arr.length; j++) {
    u_ids.push(arr[j].area_id);
  }
  let removed_ids = [... new Set(u_ids)];
  let cnt = 0 ;
  for (let r = 0 ; r < removed_ids.length ; r ++) {
    if (include_area_ids.includes(removed_ids[r])) {
      cnt ++;
    }
  }
  if (cnt === include_area_ids.length) {
  } else {
    continue;
  }


  // csv에서 방향값을 가져오기 위한
  let csv_arr = csv_id_ary[ids[i]];
  let ds = [];
  if (!csv_arr) {
    continue;
  } else {
    // console.log(`------------ id[${ids[i]}] - ddd ------------ `)
  }
  for (let c = 0 ; c < csv_arr.length ; c++) {
    ds.push(csv_arr[c].mean_direction);
  }
  // console.log(`direction id [${ids[i]}] - ${ds}`);
  if (mathjs.mean(ds) < 100) {
    // 아래만 추가
    save_target_ids.push(ids[i])
  }




}
console.log(`target ids 목록: ${save_target_ids}`)
let objsss = {};
for (let i = 0 ; i < save_target_ids.length ; i ++) {
  let cluster_hits = obj_cluster_infos[save_target_ids[i]];
  // console.log(`[${save_target_ids[i]}] - ${JSON.stringify(cluster_hits)}`)

  let strs = []
  for (let j = 0 ; j < include_area_ids.length ; j ++) {
    let c_id = cluster_hits[include_area_ids[j]];
    strs.push(`${include_area_ids[j]}-${c_id}`);
  }
  let result_id = strs.join('\t');
  // console.log(result_id);
  if (!objsss[result_id]) {
    objsss[result_id] = [save_target_ids[i]]
  } else {
    objsss[result_id].push(save_target_ids[i])
  }
}
for (let r_id in objsss) {
  console.log(`${r_id} - len: ${objsss[r_id].length}, ${objsss[r_id]}`);
}


