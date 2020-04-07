const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')

const funcSet = require('./modules/function');
const split_m = 0
// let video_x = 360;  // 
// let video_y = 240; // 사거리(4801)
let video_x = 960;  // 
let video_y = 540; // japan 거리
let static_grid_size = 96 * 54;
let static_video_x = video_x / 10;
let static_video_y = video_y / 10;
let grid_result = {};
const split_cnt = 4;
const file_name = `0327_japan`
let log_ary = [];
const u_lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');

for (let i = 0; i < u_lines.length; i++) {
  let cols = u_lines[i].split('\t');

  let size = parseInt(cols[7]) * parseInt(cols[8]);
  let height = parseInt(cols[7]);
  let width = parseInt(cols[8]);
  if (!isNaN(size)) {

    let a_id = funcSet.getAreaId(parseInt(cols[9]), parseInt(cols[10]), parseInt(cols[5]), parseInt(cols[6]));
    let obj = { timestamp: parseInt(cols[1]), x: parseInt(cols[5]), y: parseInt(cols[6]), width, height, size, object_id: cols[2], static_id: cols[4], area_id: a_id }
    log_ary.push(obj);

  } else {
  }
}
let obj_group_result = _.groupBy(log_ary, 'object_id');
let include_static_grid_ids = ['207', '208', '307', '308', '407', '408']; // 차량
// let include_static_grid_ids = ['205','204','305','304','404','603','604'] // 사람

for (let user_id in obj_group_result) {
  let arr = obj_group_result[user_id];

  let cnt = 0;
  let user_includes = [];
  for (let i = 0 ; i < arr.length ; i ++) {
    if (!user_includes.includes(arr[i].static_id)) {
      user_includes.push(arr[i].static_id);
      cnt++;
    } else {

    }
    
  }
  if (cnt >= 4) {
    console.log(`${user_id} - ${user_includes}`)
  }

}