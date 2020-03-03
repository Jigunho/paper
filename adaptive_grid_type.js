const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const file_name = 'road_4802'
const lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');
console.log(lines.length);

// let video_x = 360;  // 
// let video_y = 240; // 사거리(4801)

let video_x = 876;  // road ( road_4802)
let video_y = 540;


let std_ratio_result = []; // 편차/ 평균
let std_ratio_result2 = [];

let object_type = '100'; // 20차량, 100 사람
let std_result = [];
let grid_result = {};
let first_ary = [];
let error_cnt = 0;
let not_obj = 0;
let area_size_ary = { '00': [], '01': [], '10': [], '11': [] };
for (let i = 0; i < lines.length; i++) {
  let cols = lines[i].split('\t');
  if (cols[3] !== object_type) {
    not_obj++;
    continue;

  }
  let size = parseInt(cols[7]) * parseInt(cols[8]);
  if (!isNaN(size)) {
    let obj = { x: parseInt(cols[5]), y: parseInt(cols[6]), size, object_id: cols[2] }
    // console.log(size);
    first_ary.push(obj);

  } else {
    error_cnt++;
  }

}
console.log(`현재 객체가 아닌것: ${not_obj}`);
console.log(`error cnt: ${error_cnt}`);
let grid_ary = {};
grid_ary[1] = first_ary;
// console.log(first_ary.length)4
function func(x, y, len_x, len_y, key, arr) {
  let ary = grid_ary[key];
  // console.log(`ary len ; ${ary.length}`)
  let grid_size = len_x * len_y;
  let sizes = [];



  for (let i = 0; i < ary.length; i++) {
    let size = ary[i].size;
    sizes.push(size);
  }

  if (sizes.length < 3) {
    grid_result[key] = { grid_size: grid_size, x, y, w: len_x, h: len_y, count: 0, obj_size_mean: 0, obj_size_mean: 0, filtered: false };

    return
  }
  else if (grid_size < mathjs.mean(sizes)) {
    grid_result[key] = {
      grid_size: grid_size, x, y, w: len_x, h: len_y, count: sizes.length, key, obj_size_mean: mathjs.mean(sizes),
      obj_size_std: mathjs.std(sizes), ratio: mathjs.std(sizes) / grid_size, key, filtered: false
    };
    std_result.push(`${grid_size}\t${mathjs.std(sizes)}\t${mathjs.mean(sizes)}\t${sizes.length}`);
    std_ratio_result.push(mathjs.mean(sizes) / grid_size)
    std_ratio_result2.push(mathjs.std(sizes) / grid_size);

    return;

  } else if (sizes.length > 10 && sizes.length <= 30) {
    grid_result[key] = {
      grid_size: grid_size, x, y, w: len_x, h: len_y, count: sizes.length, key,
      obj_size_mean: mathjs.mean(sizes), obj_size_std: mathjs.std(sizes), ratio: mathjs.std(sizes) / grid_size, filtered: false
    };
    std_result.push(`${grid_size}\t${mathjs.std(sizes)}\t${mathjs.mean(sizes)}\t${sizes.length}`);



    std_ratio_result.push(mathjs.mean(sizes) / grid_size)
    std_ratio_result2.push(mathjs.std(sizes) / grid_size);
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

    if (len_x === video_x / 2 && len_y === video_y / 2) {
      for (let n = 0; n < ary00.length; n++) {
        area_size_ary[`00`].push(ary00[n].size);
      }
      for (let n = 0; n < ary01.length; n++) {
        area_size_ary[`01`].push(ary01[n].size);
      }
      for (let n = 0; n < ary10.length; n++) {
        area_size_ary[`10`].push(ary10[n].size);
      }
      for (let n = 0; n < ary11.length; n++) {
        area_size_ary[`11`].push(ary11[n].size);
      }

    }

    grid_ary[`${key}-00`] = ary00;
    grid_ary[`${key}-01`] = ary01;
    grid_ary[`${key}-10`] = ary10;
    grid_ary[`${key}-11`] = ary11;



    func(x, y, len_x / 2, len_y / 2, `${key}-00`, ary00);
    func(x + len_x / 2, y, len_x / 2, len_y / 2, `${key}-01`, ary01);
    func(x, y + len_y / 2, len_x / 2, len_y / 2, `${key}-10`, ary10);
    func(x + len_x / 2, y + len_y / 2, len_x / 2, len_y / 2, `${key}-11`, ary11);
    delete grid_ary[key];
    return;

  } else {
    std_result.push(`${grid_size}\t${mathjs.mean(sizes)}\t${mathjs.std(sizes)}\t${sizes.length}`);
    grid_result[key] = {
      grid_size: grid_size, obj_size_mean: mathjs.mean(sizes), obj_size_std: mathjs.std(sizes), x, y, w: len_x,
      h: len_y, count: sizes.length, ratio: mathjs.std(sizes) / grid_size, filtered: false
    };
    std_ratio_result.push(mathjs.mean(sizes) / grid_size)
    std_ratio_result2.push(mathjs.std(sizes) / grid_size);
    // console.log(`grid size: ${grid_size}, sizemean: ${mathjs.mean(sizes)}`)
    return;
  }
}

func(0, 0, video_x, video_y, `1`, first_ary)
// console.log(mathjs.mean(std_ratio_result));
// console.log(mathjs.mean(std_ratio_result2));



// // road - 980 - 540
// for (let key in grid_result) {
//   fs.appendFileSync(`./result/${file_name}_${object_type}_raw_result.txt`, `${JSON.stringify(grid_result[key])},\n`)
// }


function getGridId(x, y) {
  for (let key in grid_result) {
    if (x >= grid_result[key].x && x <= grid_result[key].x + grid_result[key].w && y >= grid_result[key].y && y <= grid_result[key].y + grid_result[key].h) {
        return key;
    }
  }
  return -1;
}

let size00mean = mathjs.mean(area_size_ary['00']);
let size01mean = mathjs.mean(area_size_ary['01']);
let size10mean = mathjs.mean(area_size_ary['10']);
let size11mean = mathjs.mean(area_size_ary['11']);

let size11std = mathjs.std(area_size_ary['11']);
let size00std = mathjs.std(area_size_ary['00']);
let size01std = mathjs.std(area_size_ary['01']);
let size10std = mathjs.std(area_size_ary['10']);

let area_error = 0;
let second_ary = [];
for (let i = 0; i < first_ary.length; i++) {
  let x = first_ary[i].x;
  let y = first_ary[i].y;
  let s = first_ary[i].size
  if (x > 0 && x <= video_x / 2 && y > 0 && y <= video_y / 2) {
    //00
    if (s > size00mean - size00std) {
      second_ary.push(first_ary[i])
    }
  } else if (x > video_x / 2 && y > 0 && y <= video_y) {
    // 01
    if (s > size01mean - size01std) {
      second_ary.push(first_ary[i])
    }
  } else if (x > 0 && x < video_x / 2 && y > video_y / 2) {
    // 10
    if (s > size10mean - size10std) {
      second_ary.push(first_ary[i])
    }
  } else if (x >= video_x / 2 && y > video_y / 2) {
    // 11
    if (s > size11mean - size11std) {
      second_ary.push(first_ary[i])
    }
  } else {
    area_error++;
  }
}
console.log(`area error ${error_cnt}, scond_ary len ${second_ary.length} fist: ${first_ary.length}`);

grid_ary = {};
grid_ary[1] = second_ary;
func(0, 0, video_x, video_y, `1`, second_ary)
// for (let key in grid_result) {
//   fs.appendFileSync(`./result/${file_name}_${object_type}_fil_result.txt`, `${JSON.stringify(grid_result[key])},\n`)
// }



// 방향 클러스터링값
let grid_direction_result = {};
for (let key in grid_result) {
  grid_direction_result[key] = [];
}
let mean_x_y_error = 0;
let mean_x_y_success = 0;
let obj_id_ary = _.groupBy(second_ary, 'object_id');
console.log(`obj ids : ${Object.keys(obj_id_ary).length}`);
let log_avg = [];
let ids = Object.keys(obj_id_ary);
for (let i = 0; i < ids.length; i++) {
  log_avg.push(obj_id_ary[ids[i]].length);
  let arr = obj_id_ary[ids[i]];
  if (arr.length === 1) {
    continue;
  }
  for (let j = 1; j < arr.length; j++) {
    let direction = Math.atan2(arr[j].x - arr[j - 1].x, arr[j].y - arr[j - 1].y) / Math.PI;
    let mean_x = (arr[j].x + arr[j - 1].x) / 2;
    let mean_y = (arr[j].y + arr[j - 1].y) / 2;
    let r = getGridId(mean_x,mean_y);
    if (r === -1) {
      mean_x_y_error ++;
    } else {
      mean_x_y_success ++;
      grid_direction_result[r].push(direction);
    }
  }
}
console.log(mean_x_y_error);
console.log(mean_x_y_success);
for (let key in grid_direction_result) {
  if (grid_direction_result[key].length === 0) {
    console.log(`${key}(0)`);
    
  } else {
    console.log(`${key}(${grid_direction_result[key].length}) - ${mathjs.mean(grid_direction_result[key])}`)

  }
}