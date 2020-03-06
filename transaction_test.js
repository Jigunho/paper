const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const file_name = 'road_4802'
const lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');
console.log(lines.length);



let video_x = 360;  // 위로 가는 (4800)
let video_y = 250;


let object_type = '100'; // 20차량, 100 사람
let first_ary = [];
let area_size_ary = { '00': [], '01': [], '10': [], '11': [] };
for (let i = 0; i < lines.length; i++) {
  let cols = lines[i].split('\t');
  if (cols[3] !== object_type) {
    continue;

  }
  let size = parseInt(cols[7]) * parseInt(cols[8]);
  if (!isNaN(size)) {
    let obj = { timestamp: parseInt(cols[1]), x: parseInt(cols[5]), y: parseInt(cols[6]), size, object_id: cols[2] }
    // console.log(size);
    first_ary.push(obj);

  } else {
    // error_cnt++;
  }

}
let dir_arr = [];
let log_avg = [];
let obj_id_ary = _.groupBy(first_ary, 'object_id');
let obj_id_sum = 0;
let up_cnt = 0;
let down_cnt = 0;
let area_1 = 0;
let area_2 = 0;
let area_3 = 0;
let area_4 = 0;

let am_cnt = 0;
let ids = Object.keys(obj_id_ary);
let oo = 0;
for (let i = 0; i < ids.length; i++) {
  obj_id_sum += obj_id_ary[ids[i]].length
  log_avg.push(obj_id_ary[ids[i]].length);
  let arr = obj_id_ary[ids[i]];
  arr.sort(function(a,b) {
    return a.timestamp - b.timestamp
  })

  for (let j = 1; j < arr.length; j++) {
    
    if (arr[j].x === arr[j-1].x && arr[j].y === arr[j-1].y) {
      continue;
    }
    let direction = Math.atan2(arr[j-1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;
    // console.log(direction)
    if (direction  === 90 || direction === 180 || direction === 270 || direction === 0 ) {
      am_cnt ++;
      // console.log(direction)
      // console.log(JSON.stringify(arr[j]));
      // console.log(JSON.stringify(arr[j-1]));
      // console.log('----')
    } else if (direction > 0 && direction < 90) {
      area_1 ++;
    } else  if (direction > 90 && direction < 180 ){
      area_2 ++;
    } else if (direction > 180 && direction < 270) {
      area_3 ++;
    } else {
      area_4 ++;
    }
  }
  // if (oo === 3) {
  //   break;;
  // }
  // oo ++;
}
console.log(`ambiguous : ${am_cnt}`);
console.log(`area1 - ${area_1}`)
console.log(`area2 - ${area_2}`)
console.log(`area3 - ${area_3}`)
console.log(`area4 - ${area_4}`)

console.log(`up : ${up_cnt}, down: ${down_cnt}`);
