const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const lines = fs.readFileSync('./road.txt').toString().split('\n');
console.log(lines.length);
let video_x = 876;
let video_y = 540; // 
// let video_x = 980; // park
// let video_y = 580

let std_ratio_result = [];
// let video_x = 720;
// let video_y = 500; // bus road
let grid_size = (video_y / 10) * (video_x / 10)
console.log(grid_size);

let grids = {};
let grid_obj_sizes = {} // 일반 가로 세로
let grid_obj_sizes2 = {} // 일반 가로 세로

for (let i = 0 ; i < lines.length ; i ++) {
  let cols = lines[i].split('\t');
  let grid_id = cols[3];

  if (!grid_obj_sizes[cols[3]]) {
    let ary = [];
    let avg = parseInt(cols[6]) * parseInt(cols[7]);
    ary.push(avg);
    grid_obj_sizes[cols[3]] = ary;
  } else {
    let avg = parseInt(cols[6]) * parseInt(cols[7]);
    grid_obj_sizes[cols[3]].push(avg);
  }

}
let result_ary = [];
let result_ary2 = [];
let result_ary3 = [];
for (let grid_id in grid_obj_sizes) {
  let grid_ary = grid_obj_sizes[grid_id];

  let grid_max = mathjs.max(grid_ary);
  let grid_min = mathjs.min(grid_ary);
  let grid_res = [];
  for (let i = 0 ; i < grid_ary.length; i ++) {
    grid_res.push((grid_ary[i] - grid_min) /(grid_max - grid_min))
  }
  console.log(`[${grid_id}] - ${mathjs.mean(grid_res)}, ${mathjs.std(grid_res)}`)
  // result_ary.push(mathjs.std(grid_ary)/mathjs.mean(grid_ary));
  // result_ary2.push(mathjs.mean(grid_ary)/grid_size)
}
