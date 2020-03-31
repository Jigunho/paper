const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const file_name = 'road'
const lines = fs.readFileSync(`./test0.txt`).toString().split('\n');
console.log(lines.length);

let std_ratio_result = []; // 편차/ 평균
let std_ratio_result2 = [];
// let video_x = 720;
// let video_y = 500; // bus road

let std_result = [];
let grid_result = {};
let screen_result = {};
let first_ary = [];
for (let i = 0; i < lines.length; i++) {
  let cols = lines[i].split('\t');
  cols[2] = cols[2] + '000';
  fs.appendFileSync('./test_after.txt', `${cols.join('\t')}\n`);
}