const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs');
const getIdModule = require('./modules/make_area');
const lines = fs.readFileSync(`./4801_cluster_result2.csv`).toString().split('\n');

console.log(lines.length);

let video_x = 360;  // 
let video_y = 240; // 사거리(4801)
let split_cnt = 3;
let cell_size = video_x / split_cnt * video_y / split_cnt; // 864

let col_names = lines[0].split(',');

let raw_arys = [];
for (let i = 1; i < lines.length; i++) {
  let cols = lines[i].split(',');
  let obj = {};
  for (let j = 0; j < col_names.length; j++) {
    obj[col_names[j]] = cols[j];
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
  // let a_id = getIdModule.getAreaId(video_x, video_y, obj_x, obj_y);
  // let g_id = getIdModule.getGridId(video_x, video_y, obj_x, obj_y);
  if (obj.grid_id.length < 3) {
    continue;
  }
  // console.log(`${obj.grid_id},  x:${obj_x}, y:${obj_y} ,a_id:${a_id}, g_id:${g_id},`);
  raw_arys.push(obj);

}
let obj_trans = _.groupBy(raw_arys, 'object_id');
// console.log(Object.keys(obj_trans));
let error_cnt = 0;
for (let user_id in Object.keys(obj_trans)) {
  let user_trans = obj_trans[user_id]
  if (user_trans) {
    // console.log(`${user_id} - ${user_trans.length}`);
  } else {
    error_cnt += 1;
  }
}
console.log(`error user len : ${error_cnt}`);



let adaptive_grid_cells1 = []; // 작은거 
let adaptive_grid_cells2 = []; // 큰거

let grids_logs = _.groupBy(raw_arys, 'grid_id');
let grid_cell_infos = [];
for (let grid_id in grids_logs) {
  let grid_logs = grids_logs[grid_id];
  if (!grid_logs) {
    console.log(`${grid_id} undefined`);
    continue;
  }
  // 추후 클러스터 갯수대로 변환
  let size_means = { '0': [], '1': [] };
  for (let i = 0; i < grid_logs.length - 1; i++) {
    size_means[grid_logs[i].cluster_id].push(grid_logs[i].size);
  }
  if (size_means[0].length === 0 || size_means[1].length === 0) {
    console.log(`${grid_id} empty`);
    continue;
  }
  // console.log(`${grid_id} cluster(0) result: ${mathjs.mean(size_means[0])}(${size_means[0].length}) cluster(1)result: ${mathjs.mean(size_means[1])}(${size_means[1].length})`);

  let smalls = [];
  let bigs = [];
  if (mathjs.mean(size_means[0]) > mathjs.mean(size_means[1])) {
    bigs = size_means[0];
    smalls = size_means[1];

  } else {
    bigs = size_means[1];
    smalls = size_means[0];
  }

  let init_cell_size = cell_size;
  let x = -1;
  let y = -1;
  let x_y_id = grid_id.split('0');
  
  if (grid_id.length === 3) {
    y = parseInt(x_y_id[0], 10);
    if (x_y_id[1] === '') {
      x = 0;
    } else {
      x = parseInt(x_y_id[1], 10);
    }
  } else {
    // console.log('grid cell error !!!!!!!!!!!!!!!!!!');
    // continue;
  }

  let top = (y - 1) * video_y / split_cnt;
  let left = (x - 1) * video_x / split_cnt;
  // console.log(`grid_id(${grid_id}) :  (${y})${top}, (${x})${left}`);

  // continue;

  if (mathjs.mean(bigs) < cell_size / 16) {
    // 16 등분
    let xs_size = video_x / split_cnt / 4;
    let ys_size = video_y / split_cnt / 4;
    for (let xs = 0; xs < 4; xs++) {
      for (let ys = 0; ys < 4; ys++) {
        let grid_info = { grid_id: `${grid_id}-${ys}-${xs}`, grid_size: cell_size / 16, x: left + xs_size * xs, y: top + ys_size * ys, w: xs_size, h: ys_size, mean_size: mathjs.mean(bigs) };
        adaptive_grid_cells2.push(grid_info);
      }
    }
  } else if (mathjs.mean(bigs) > cell_size / 16 && mathjs.mean(bigs) < cell_size / 4) {
    // 4등분
    let xs_size = video_x / split_cnt / 2;
    let ys_size = video_y / split_cnt / 2;
    for (let xs = 0; xs < 2; xs++) {
      for (let ys = 0; ys < 2; ys++) {
        let grid_info = { grid_id: `${grid_id}-${ys}-${xs}`, grid_size: cell_size / 4, x: left + xs_size * xs, y: top + ys_size * ys, w: xs_size, h: ys_size, mean_size: mathjs.mean(bigs) };
        adaptive_grid_cells2.push(grid_info);

      }
    }
  } else {
    // 그냥 
    let grid_info = { grid_id, grid_size: cell_size, x: left, y: top, w: video_x / split_cnt, h: video_y / split_cnt, mean_size: mathjs.mean(bigs) };
    adaptive_grid_cells2.push(grid_info);
  }
  if (mathjs.mean(smalls) < cell_size / 64) {

    let xs_size = video_x / split_cnt / 8;
    let ys_size = video_y / split_cnt / 8;
    for (let xs = 0; xs < 16; xs++) {
      for (let ys = 0; ys < 16; ys++) {
        let grid_info = { grid_id: `${grid_id}-${ys}-${xs}`, grid_size: cell_size / 64, x: left + xs_size * xs, y: top + ys_size * ys, w: xs_size, h: ys_size, mean_size: mathjs.mean(smalls) };
        adaptive_grid_cells1.push(grid_info);
      }
    }

  }
  else if (mathjs.mean(smalls) < cell_size / 16) {
    // 16 등분
    let xs_size = video_x / split_cnt / 4;
    let ys_size = video_y / split_cnt / 4;
    for (let xs = 0; xs < 4; xs++) {
      for (let ys = 0; ys < 4; ys++) {
        let grid_info = { grid_id: `${grid_id}-${ys}-${xs}`, grid_size: cell_size / 16, x: left + xs_size * xs, y: top + ys_size * ys, w: xs_size, h: ys_size, mean_size: mathjs.mean(smalls) };
        adaptive_grid_cells1.push(grid_info);
      }
    }
  } else if (mathjs.mean(smalls) < cell_size / 4) {
    // 4등분
    let xs_size = video_x / split_cnt / 2;
    let ys_size = video_y / split_cnt / 2;
    for (let xs = 0; xs < 2; xs++) {
      for (let ys = 0; ys < 2; ys++) {
        let grid_info = { grid_id: `${grid_id}-${ys}-${xs}`, grid_size: cell_size / 4, x: left + xs_size * xs, y: top + ys_size * ys, w: xs_size, h: ys_size, mean_size: mathjs.mean(smalls) };
        adaptive_grid_cells1.push(grid_info);

      }
    }
  } else {
    // 그냥 
    let grid_info = { grid_id, grid_size: cell_size, x: left, y: top, w: video_x / split_cnt, h: video_y / split_cnt, mean_size: mathjs.mean(smalls) };
    adaptive_grid_cells1.push(grid_info);
  }


}
for (let i = 0; i < adaptive_grid_cells2.length; i++) {
  fs.appendFileSync(`./clustering_result2/4801_area_big.txt`, `${JSON.stringify(adaptive_grid_cells2[i])},\n`);
}
for (let i = 0; i < adaptive_grid_cells1.length; i++) {
  fs.appendFileSync(`./clustering_result2/4801_area_small.txt`, `${JSON.stringify(adaptive_grid_cells1[i])},\n`);
}
console.log(adaptive_grid_cells2.length); // 큰거
console.log(adaptive_grid_cells1.length); // 작은거