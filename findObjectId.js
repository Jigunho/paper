const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const file_name = 'japan_user'
const getIdModule = require('./modules/make_area');
const lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');
let target_ids = [260000, 341000,406000]
let result = {};
for (let i = 0 ; i < lines.length ; i ++) {
  let cols = lines[i].split('\t');
  let id = parseInt(cols[2]);
  if (target_ids.includes(id)) {
    // let obj = {
    //   camera_id: cols[0], timestamp: parseInt(cols[1]), object_id: cols[2], object_type:
    //     cols[3], static_grid_id: cols[4], x: parseInt(cols[5]), y: parseInt(cols[6]), width: parseInt(cols[7]), height: parseInt(cols[8]), video_x: cols[9], video_y: cols[10], size
    // }
    let aid = getIdModule.getAreaId(parseInt(cols[9]), parseInt(cols[10]), parseInt(cols[5]), parseInt(cols[6]));
    if (!aid) {
      continue;
    }
    if (!result[id]) {
      result[id] = [aid]
    } else {
      result[id].push(aid);
    }
  }
}
for (let id in result) {
  let arr = result[id];
  let grs_dup_removed = [... new Set(arr)];

  console.log(`${id} - ${grs_dup_removed.join(',')}`);
}