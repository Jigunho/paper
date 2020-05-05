const mathjs = require('mathjs');
const fs = require('fs');
const _ = require('lodash')
// let lines = fs.readFileSync('./0502.txt').toString().split('\n');
// let result = [];
// for (let i = 0 ; i < lines.length ; i ++) {
//   let cols = lines[i].split('\t');
//   result.push({ area_id: cols[0], size: parseFloat(cols[1])});
// }
// let rr = _.groupBy(result, 'area_id');
// for (let area_id in rr) {
//   let arr = rr[area_id];
//   let acal = [];
//   for (let i = 0 ; i < arr.length ; i ++) {
//     acal.push(arr[i].size);
//   }
//   console.log(`${area_id}(${acal.length}) - ${mathjs.mean(acal)} var: ${mathjs.variance(acal)}`);
// }
// let arr = [30, 30, 30, 30, 200, 200, 200];
let arr = [30,33,35,40, 40,41, 51, 200]
let r = mathjs.variance(arr);
let mean = mathjs.mean(arr);
let std = mathjs.std(arr);
console.log(`${mean} - ${r} - ${std}`);