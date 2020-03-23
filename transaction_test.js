const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const file_name = '4801'
const getIdModule = require('./modules/make_area');
const lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');
console.log(lines.length);

let first_ary = [];
let second_ary = [];
let static_grid_result = {};
let static_area_result = {}


let video_x = 360;
let video_y = 240;
let object_type = '20'
for (let i = 0; i < lines.length; i++) {
  let cols = lines[i].split('\t');
  // if (cols[3] !== object_type) {
  //   not_obj++;
  //   continue;
  // }

  let size = parseInt(cols[7]) * parseInt(cols[8]);
  if (!isNaN(size)) {

    let obj = {
      camera_id: cols[0], timestamp: parseInt(cols[1]), object_id: cols[2], object_type:
        cols[3], static_grid_id: cols[4], x: parseInt(cols[5]), y: parseInt(cols[6]), width: parseInt(cols[7]), height: parseInt(cols[8]), video_x: cols[9], video_y: cols[10], size
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
    let a_id = getIdModule.getAreaId(video_x, video_y, obj_x, obj_y);
    let g_id = getIdModule.getGridId(video_x, video_y, obj_x, obj_y);
    // if (obj.static_grid_id.length < 3) {
    //   continue;
    // }
    // console.log(`${obj.static_grid_id},  x:${obj_x}, y:${obj_y} ,a_id:${a_id}, g_id:${g_id},`);
    obj['a_id'] = a_id;
    obj['g_id'] = g_id;
    // console.log(JSON.stringify(obj))
    first_ary.push(obj);

  } else {
    // error_cnt++;
  }

}

let start_end_same_user = 0;
let obj_type_id_ary = _.groupBy(first_ary, 'object_id');
console.log(`obj ids : ${Object.keys(obj_type_id_ary).length}`);
let ids = Object.keys(obj_type_id_ary);


for (let i = 0; i < ids.length; i++) {

  let arr = obj_type_id_ary[ids[i]];
  let grid_car_count = 0;
  let grid_person_count = 0;
  let min_size = -1;
  arr.sort(function (a, b) {
    return a.timestamp - b.timestamp
  })
  if (arr.length <= 2) {
    continue;
  }

  let grid_check = false;

  if (arr[1].static_grid_id === arr[arr.length - 1].static_grid_id) {
    // 처음시작과 끝이 동일한 그리드면 제거
    start_end_same_user++;
    continue;
  }


  let user_vel = [];
  let sizes = [];
  for (let j = 1; j < arr.length; j++) {

    // if (check_grid.includes(arr[j].static_grid_id)) {
    //   grid_check = true;
    // }

    if (arr[j].x === arr[j - 1].x && arr[j].y === arr[j - 1].y) {
      continue;
    }
    let velocity = Math.sqrt(Math.pow(arr[j].y - arr[j - 1].y, 2) + Math.pow(arr[j].x - arr[j - 1].x, 2)) / (arr[j].timestamp - arr[j - 1].timestamp) * 100;

    let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;

    let size = (arr[j].size + arr[j - 1].size) / 2


    if (velocity === Infinity) {
      continue;
    }
    user_vel.push(velocity);
    sizes.push(size)

    second_ary.push(arr[j]);

    let static_log_obj = {
      timestamp: arr[j].timestamp, direction, velocity, object_id: arr[j].object_id,
      size: arr[j].size, object_type: arr[j].object_type, x: arr[j].x, y: arr[j].y, width: arr[j].width, height: arr[j].height,
      video_x: arr[j].video_x, video_y: arr[j].video_y, camera_id: arr[j].camera_id, a_id: arr[j].a_id
    };
    // console.log(arr[j].a_id)
    if (!static_area_result[arr[j].a_id]) {
      static_area_result[arr[j].a_id] = [{ static_log_obj }];
    } else {
      static_area_result[arr[j].a_id].push(static_log_obj);
    }


  }
  // if (!grid_check) {
  //   not_include_cnt++; 
  //   continue;
  // } else {
  //   include_cnt ++;
  // }
  // for (let m = 0 ; m < user_vel.length ; m ++) {
  //   if (user_vel[m] > 5) {
  //     vel_up_10 ++;
  //   } else {
  //     vel_down_10 ++;
  //   }
  // }
  // if (arr[0].object_type === '20') {
  //   console.log(`car ${arr[0].object_id} velocuty:${mathjs.mean(user_vel)}, sizes:${mathjs.mean(sizes)}, support: ${sizes.length}`)
  //   c_cnt ++;
  // } else {
  //   p_cnt++;
  //   console.log(`person ${arr[0].object_id}(${arr[0].object_type}) velocuty:${mathjs.mean(user_vel)}, sizes:${mathjs.mean(sizes)}, support: ${sizes.length}`)

  // }
}
console.log('---------')

console.log(Object.keys(static_area_result));
console.log('---------')







// let grid_cluster_result = _.groupBy(second_ary, 'static_grid_id');
// for (let grid_id in grid_cluster_result) {
//   let grid_list = grid_cluster_result[grid_id];

//   for (let i = 0; i < grid_list.length; i++) {

//   }
// }


// let static_grid_result = {};
// let grid_user_list = _.groupBy(first_ary, 'static_grid_id');
// console.log(`static ids : ${Object.keys(grid_user_list).length}`);
// let grid_ids = Object.keys(grid_user_list);
// // let sizes = [];
// for (let i = 0; i < grid_ids.length; i++) {
//   // obj_id_sum += grid_user_list[grid_ids[i]].length
//   // log_avg.push(grid_user_list[grid_ids[i]].length);
//   let arr = grid_user_list[grid_ids[i]];
//   arr.sort(function (a, b) {
//     return a.timestamp - b.timestamp
//   });


//   for (let j = 1; j < arr.length; j++) {

//     if (arr[j].x === arr[j - 1].x && arr[j].y === arr[j - 1].y) {
//       continue;
//     }

//     let velocity = Math.sqrt(Math.pow(arr[j].y - arr[j - 1].y, 2) + Math.pow(arr[j].x - arr[j - 1].x, 2)) / (arr[j].timestamp - arr[j - 1].timestamp) * 100;

//     let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
//     direction = (direction + 360) % 360;


//     if (velocity === Infinity) {
//       continue;
//     }





//   }
// }


//////////////////////////////////////// 0317 그리드별 유저의 최소 사이즈만 반영 ////////////////////////////////////////////////////
let strs1 = ''; // 중간 이상
let strs2 = ''; // 절반 이하 
let strs3 = ''; // down 중에서 사람 

let all_car_type = 0;
let all_person_type = 0;
// let grid_user_list = _.groupBy(second_ary, 'a_id');
// console.log(`area ids : ${Object.keys(grid_user_list)}`);

// let grid_ids = Object.keys(grid_user_list);
let strs = ''

for (let area_id in static_area_result) {
  let arr = static_area_result[area_id];
  if (!arr) {
    continue;
  }
  console.log(`${area_id}, len: ${arr.length}`)
  let user_min_size = {}
  let user_type = {};

  let user_min_vel = {};
  let user_max_vel = {};
  let user_infos = {};
  let user_vels = {};
  if (arr.length < 2) {
    continue;
  }
  let car_type = 0;

  for (let j = 1; j < arr.length; j++) {


    if (!user_min_size[arr[j].object_id]) {
      user_infos[arr[j].object_id] = arr[j]
      user_min_size[arr[j].object_id] = arr[j].size
      user_type[arr[j].object_id] = arr[j].object_type;
    } else {
      if (arr[j].size < user_min_size[arr[j].object_id]) {
        user_min_size[arr[j].object_id] = arr[j].size;
        user_infos[arr[j].object_id] = arr[j]
      }
    }
    // console.log(arr[j].velocity)

    if (!user_min_vel[arr[j].object_id]) {
      user_vels[arr[j].object_id] = [arr[j].velocity];
      user_min_vel[arr[j].object_id] = arr[j].velocity;
      user_max_vel[arr[j].object_id] = arr[j].velocity;
    } else {
      user_vels[arr[j].object_id].push(arr[j].velocity);

      if (arr[j].velocity < user_min_vel[arr[j].object_id]) {
        user_min_vel[arr[j].object_id] = arr[j].velocity;
      }

      if (arr[j].velocity > user_max_vel[arr[j].object_id]) {
        user_max_vel[arr[j].object_id] = arr[j].velocity;
      }
    }

  }

  let lens = Object.keys(user_min_size);
  let sizes = [];
  let vels = [];

  for (let l = 0; l < lens.length; l++) {
    sizes.push(user_min_size[lens[l]]);
    vels.push(mathjs.mean(user_vels[lens[l]]));
  }

  // console.log(`size -${sizes.length}, vels-${vels.length}`);

  let size_mean = mathjs.mean(sizes);
  let size_std = mathjs.std(sizes);
  let vel_mean = mathjs.mean(vels);
  let vel_std = mathjs.std(vels);
  for (let l = 0; l < lens.length; l++) {
    let user_info = user_infos[lens[l]];
    if (mathjs.mean(user_vels[lens[l]]) < vel_mean + 2.5 * vel_std && user_min_size[lens[l]] < size_mean + 2.5 * size_std ) {
      let str = `${area_id},${lens[l]},${user_type[lens[l]]},${user_min_size[lens[l]]},${user_min_vel[lens[l]]},${mathjs.mean(user_vels[lens[l]])},${user_max_vel[lens[l]]},${user_info.x},${user_info.y}\n`
      strs += str;
    }
  }
}
fs.appendFileSync(`./grid_cluster/min_${file_name}.txt`, strs);

console.log(`${all_car_type}, ${all_person_type}`)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// 



// let strs1 = ''; // 중간 이상
// let strs2 = ''; // 절반 이하 
// let strs3 = ''; // down 중에서 사람 

// let all_car_type = 0;
// let all_person_type = 0;
// let grid_user_list = _.groupBy(first_ary, 'static_grid_id');
// console.log(`static ids : ${Object.keys(grid_user_list).length}`);
// let grid_ids = Object.keys(grid_user_list);

// for (let i = 0; i < grid_ids.length; i++) {
//   let arr = static_grid_result[grid_ids[i]];
//   if (!arr) {
//     continue;
//   }
//   if (arr.length < 2) {
//     continue;
//   }
//   let sizes3 = [];
//   let sizes20 = [];
//   let sizes100 = [];
//   let directions = [];
//   let velocitys3 = [];
//   let velocitys20 = [];
//   let velocitys100 = [];
//   let strs = ''
//   let person_type = 0;
//   let car_type = 0;
//   for (let j = 1; j < arr.length; j++) {
//     if (arr[j].object_type !== '20') {
//       person_type++;
//       all_person_type++;
//       sizes20.push(arr[j].size);
//       velocitys20.push(arr[j].velocity);

//     } else if (arr[j].object_type === '3') {
//       all_car_type++;
//       car_type++;
//       sizes3.push(arr[j].size);
//       velocitys3.push(arr[j].velocity);

//     } else {
//       sizes100.push(arr[j].size);
//       velocitys100.push(arr[j].velocity);

//     }
//   }
//   console.log(`${grid_ids[i]} - 3(${sizes3.length}), 100(${sizes100.length}), 20(${sizes20.length})`);
//   // let size_mean3 = mathjs.mean(sizes3);
//   // let size_std3 = mathjs.std(sizes3);
//   // let vel_mean3 = mathjs.mean(velocitys3);
//   // let vel_std3 = mathjs.std(velocitys3);

//   let size_mean20 = mathjs.mean(sizes20);
//   let size_std20 = mathjs.std(sizes20);
//   let vel_mean20 = mathjs.mean(velocitys20);
//   let vel_std20 = mathjs.std(velocitys20);

//   let size_mean100 = mathjs.mean(sizes100);
//   let size_std100 = mathjs.std(sizes100);
//   let vel_mean100 = mathjs.mean(velocitys100);
//   let vel_std100 = mathjs.std(velocitys100);
//   if (vel_std100.length === 0) {
//     continue;
//   }
//   for (let j = 1; j < arr.length; j++) {

//     if (arr[j].type === '3') {
//       let str = `${grid_ids[i]},${arr[j].object_type},${arr[j].size},${arr[j].direction},${arr[j].velocity}\n`
//       strs += str;
//     } else if (arr[j].type === '20') {
//       // 차량   노 필터링
//       // if (arr[j].size < (size_mean20 + size_std20 * 2)) {
//         let str = `${grid_ids[i]},${arr[j].object_type},${arr[j].size},${arr[j].direction},${arr[j].velocity}\n`
//         strs += str;
//       // }
//     } else {
//       // 사람 , 속도 필터링
//       if (arr[j].velocity < (vel_mean100 + vel_std100 * 2) && arr[j].size < (size_mean100 + size_std100)) {
//         let str = `${grid_ids[i]},${arr[j].object_type},${arr[j].size},${arr[j].direction},${arr[j].velocity}\n`
//         strs += str;
//       }
//     }
//     //  if (arr[j].velocity < vel_mean + vel_std && arr[j].size < size_mean + size_std) {
//     // // }
//   }
//   // console.log(`${grid_ids[i]}person ; ${person_type}, car: ${car_type}`);
//   fs.appendFileSync(`./grid_cluster/${file_name}_${grid_ids[i]}.txt`, strs);

//   // let grid_size_mean = mathjs.mean(sizes);
//   // console.log(grid_size_mean)
//   // 16513214504802	1583242651929	408	100	504	437	227	20	47	984	535

//   // for (let j = 1; j < arr.length; j++) {
//   //   if (arr[j].size < grid_size_mean) {
//   //     let str = `${arr[j].camera_id}\t${arr[j].timestamp}\t${arr[j].object_id}\t${arr[j].object_type}\t${grid_ids[i]}\t${arr[j].x}\t${arr[j].y}\t${arr[j].width}\t${arr[j].height}\t${arr[j].video_x}\t${arr[j].video_y}\n`
//   //     strs1 += str;

//   //   } else {
//   //     let str = `${arr[j].camera_id}\t${arr[j].timestamp}\t${arr[j].object_id}\t${arr[j].object_type}\t${grid_ids[i]}\t${arr[j].x}\t${arr[j].y}\t${arr[j].width}\t${arr[j].height}\t${arr[j].video_x}\t${arr[j].video_y}\n`
//   //     strs2 += str;
//   //     if (arr[j].object_type === object_type) {
//   //       strs3 += str;
//   //     }

//   //   }
//   // }


// }
// console.log(`${all_car_type}, ${all_person_type}`)


// fs.appendFileSync(`./grid_raw_logs/${file_name}_down_person.txt`,strs3);
// fs.appendFileSync(`./grid_raw_logs/${file_name}_up.txt`,strs2);
// fs.appendFileSync(`./grid_raw_logs/${file_name}_down.txt`,strs1);
