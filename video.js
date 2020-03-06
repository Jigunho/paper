const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const lines = fs.readFileSync('./0303_type/4800.txt').toString().split('\n');
console.log(lines.length);

let screen_width = 12;
let screen_hight = 30;
// let video_x = 876;
// let video_y = 540;
// let video_x = 980;
// let video_y = 580
let grids = {};
let grid_obj_sizes = {} // 일반 가로 세로
let grid_obj_sizes2 = {}; // 높이, 넓이 / 2 ^ 2
let objs = {};
let x_max = -1;
let y_max = -1;
for (let i = 0 ; i < lines.length ; i ++) {
  let cols = lines[i].split('\t');

  let x = parseInt(cols[5]);
  let y = parseInt(cols[6]);
  if(x_max < x) {
    x_max = x;
  }
  if (y_max < y) {
    y_max = y;
  }
  if (!objs[cols[1]]) {
    objs[cols[1]] = 1;
  } else {
    objs[cols[1]] += 1;
  }

  if (!grids[cols[3]]) {
    grids[cols[3]] = 1;
  } else {
    grids[cols[3]] += 1;
  }
  if (!grid_obj_sizes[cols[3]]) {
    let ary = [];
    let avg = parseInt(cols[6]) * parseInt(cols[7]);
    ary.push(avg);
    grid_obj_sizes[cols[3]] = ary;
  } else {
    let avg = parseInt(cols[6]) * parseInt(cols[7]);
    grid_obj_sizes[cols[3]].push(avg);
  }

  if (!grid_obj_sizes2[cols[3]]) {
    let ary = [];

    let avg = (parseInt(cols[6]) + parseInt(cols[7])) / 2;
    ary.push(avg*avg);
    grid_obj_sizes2[cols[3]] = ary;
  } else {
    let avg = (parseInt(cols[6]) + parseInt(cols[7])) / 2;
    grid_obj_sizes2[cols[3]].push(avg * avg);
  }
}
console.log(`user len: ${Object.keys(objs).length}`);
console.log(`grids len: ${Object.keys(grids).length}`);
console.log(`grid_obj_sizes len: ${Object.keys(grid_obj_sizes).length}`);
for (let grid in grid_obj_sizes) {
  let grid_avg = mathjs.mean(grid_obj_sizes[grid]);
  let grid_std = mathjs.std(grid_obj_sizes[grid]);
  let grid_avg2 = mathjs.mean(grid_obj_sizes2[grid]);
  let grid_std2 = mathjs.std(grid_obj_sizes2[grid]);
 console.log(`${grid} - ${grid_avg}/${grid_avg2} , ${grid_std}/${grid_std2}  :: support: ${grid_obj_sizes[grid].length}/${grid_obj_sizes2[grid].length}`)
}
console.log(`max: ${x_max} ${y_max}`)
