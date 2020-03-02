const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const lines = fs.readFileSync('./road.txt').toString().split('\n');
console.log(lines.length);

let screen_width = 12;
let screen_hight = 30;
// let video_x = 876;
// let video_y = 540;
let video_x = 980;
let video_y = 580
let grids = {};
let grid_obj_sizes = {} // 일반 가로 세로
let grid_obj_sizes2 = {}; // 높이, 넓이 / 2 ^ 2
let objs = {};
let x_max = -1;
let y_max = -1;
// for (let i = 0 ; i < lines.length ; i ++) {
//   let cols = lines[i].split('\t');

//   let x = parseInt(cols[4]);
//   let y = parseInt(cols[5]);
//   if(x_max < x) {
//     x_max = x;
//   }
//   if (y_max < y) {
//     y_max = y;
//   }
//   if (!objs[cols[1]]) {
//     objs[cols[1]] = 1;
//   } else {
//     objs[cols[1]] += 1;
//   }

//   if (!grids[cols[3]]) {
//     grids[cols[3]] = 1;
//   } else {
//     grids[cols[3]] += 1;
//   }
//   if (!grid_obj_sizes[cols[3]]) {
//     let ary = [];
//     let avg = parseInt(cols[6]) * parseInt(cols[7]);
//     ary.push(avg);
//     grid_obj_sizes[cols[3]] = ary;
//   } else {
//     let avg = parseInt(cols[6]) * parseInt(cols[7]);
//     grid_obj_sizes[cols[3]].push(avg);
//   }

//   if (!grid_obj_sizes2[cols[3]]) {
//     let ary = [];

//     let avg = (parseInt(cols[6]) + parseInt(cols[7])) / 2;
//     ary.push(avg*avg);
//     grid_obj_sizes2[cols[3]] = ary;
//   } else {
//     let avg = (parseInt(cols[6]) + parseInt(cols[7])) / 2;
//     grid_obj_sizes2[cols[3]].push(avg * avg);
//   }
// }
// console.log(`user len: ${Object.keys(objs).length}`);
// console.log(`grids len: ${Object.keys(grids).length}`);
// console.log(`grid_obj_sizes len: ${Object.keys(grid_obj_sizes).length}`);
// for (let grid in grid_obj_sizes) {
//   let grid_avg = mathjs.mean(grid_obj_sizes[grid]);
//   let grid_std = mathjs.std(grid_obj_sizes[grid]);
//   let grid_avg2 = mathjs.mean(grid_obj_sizes2[grid]);
//   let grid_std2 = mathjs.std(grid_obj_sizes2[grid]);
//  console.log(`${grid} - ${grid_avg}/${grid_avg2} , ${grid_std}/${grid_std2}  :: support: ${grid_obj_sizes[grid].length}/${grid_obj_sizes2[grid].length}`)
// }
// console.log(`max: ${x_max} ${y_max}`)

let grid_result = {};
let screen_result = {};
let first_ary = [];
for (let i = 0; i < lines.length; i++) {
  let cols = lines[i].split('\t');
  let size = parseInt(cols[6]) * parseInt(cols[7]);
  if (!isNaN(size)) {
    let obj = { x: parseInt(cols[4]), y: parseInt(cols[5]), size }
    // console.log(size);
    first_ary.push(obj);

  }

}
let grid_ary = {};
grid_ary[1] = first_ary;
// console.log(first_ary.length)
function func(x, y, len_x, len_y, key, arr) {
  let ary = grid_ary[key];
  // console.log(`ary len ; ${ary.length}`)
  let grid_size = len_x * len_y;
  let sizes = [];



  for (let i = 0; i < ary.length; i++) {
    let size = ary[i].size;
    sizes.push(size);
  }
  if (sizes.length === 0) {
    // console.log(`key[${key}] : gridsize:${grid_size}, sizemean [x]`);
    grid_result[key] = { grid_size1: grid_size, x, y, w: len_x, h: len_y, count: 0  };

    return
  }
  else if (sizes.length < 10) {
    // console.log(`key[${key}] : gridsize:${grid_size}, sizemean ${mathjs.mean(sizes)}`);
    grid_result[key] = { grid_size1: grid_size, x, y, w: len_x, h: len_y, count: sizes.length  };

    return;

  }
  if (grid_size > mathjs.mean(sizes) * 1.8) {

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
    // console.log(`[${key}][00] - ${ary00.length}`);
    // console.log(`[${key}][01] - ${ary01.length}`);
    // console.log(`[${key}][10] - ${ary10.length}`);
    // console.log(`[${key}][11] - ${ary11.length}`);

    grid_ary[`${key}-00`] = ary00;
    grid_ary[`${key}-01`] = ary01;
    grid_ary[`${key}-10`] = ary10;
    grid_ary[`${key}-11`] = ary11;

    func(x, y, len_x / 2, len_y / 2, `${key}-00`, ary00);
    func(x + len_x / 2, y, len_x / 2, len_y / 2, `${key}-01`, ary01);
    func(x, y + len_y / 2, len_x / 2, len_y / 2, `${key}-10`, ary10);
    func(x + len_x / 2, y + len_y / 2, len_x / 2, len_y / 2, `${key}-11`, ary11);
    delete grid_ary[key];

  } else {
    let screen_x = x / video_x * screen_width;
    let screen_y = y / video_y * screen_hight;
    let screen_len_x = len_x / video_x * screen_width;
    let screen_len_y = len_y / video_y * screen_hight;
    
    screen_result[key] = { x: screen_x, y: screen_y, w: screen_len_x, h: screen_len_y, i: key };
    grid_result[key] = { grid_size1: grid_size, obj_size_mean: mathjs.mean(sizes), obj_size_std: mathjs.std(sizes), x, y, w: len_x, h: len_y, count: sizes.length  };
    // console.log(`key[${key}] : gridsize:${grid_size}, sizemean ${mathjs.mean(sizes)}`);
    return;
  }
}
// function makeKey(key) {
//   let keys = key.split('-');
//   let key_x = 0;
//   let key_y = 0;
//   let grid_x = video_x / Math.pow(2, keys.length)
//   let grid_y = video_y / Math.pow(2, keys.length)
//   for (let i = 1; i < keys.length; i++) {

//     if (keys[i] === '00') {

//     } else if (keys[i] === '01') {
//       key_x += video_x / Math.pow(2,i);
//     } else if (keys[i] === '10') {
//       key_y += video_y / Math.pow(2,i);
//     } else if (keys[i] === '11') {
//       key_x += video_x / Math.pow(2,i);
//       key_y += video_y / Math.pow(2,i);
//     }
//   }
//   console.log(`[${key}] ${key_x},${key_y} grid_x: ${grid_x}, grid_y: ${grid_y}`);

// }
func(0, 0, video_x, video_y, `1`, first_ary)

// road - 980 - 540
console.log(Object.keys(grid_result).length)
for (let key in grid_result) {
  fs.appendFileSync('./road_result.txt', `${JSON.stringify(grid_result[key])},\n`)
  // console.log(screen_result[key])
}