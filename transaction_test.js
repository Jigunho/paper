const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const file_name = '0327_japan'
const getIdModule = require('./modules/make_area');
const lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');
console.log(lines.length);
// 순서 
// 1. 로그 데이터에서 부분 영역 ID 할당,
// 1-1 그리드 ID 트랜잭션 길이 3이하 제거 
// area 별 최소 객체 갯수 반영하여 csv로 추출
// 쥬피터 min_grid_cluster에 넣으셈
let first_ary = [];
let second_ary = [];
let static_grid_result = {};
let static_area_result = {}

let area_ratio_ary = {};
let grid_ratio_ary = {};


let video_x = 960;
let video_y = 540;
// let grid_size = (video_x / 10) * (video_y / 10);
// let area_size = (video_y / 4) * (video_x / 4);
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
        cols[3], static_grid_id: cols[4], x: parseInt(cols[5]), y: parseInt(cols[6]), width: parseInt(cols[7]),
      height: parseInt(cols[8]), video_x: cols[9], video_y: cols[10], size
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
    obj['a_id'] = a_id;
    obj['g_id'] = g_id;
    first_ary.push(obj);

  } else {
    // error_cnt++;
  }

}

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

  let user_grid = {}
  for (let j = 1; j < arr.length; j++) {
    if (!user_grid[arr[j].static_grid_id]) {
      user_grid[arr[j].static_grid_id] = true;
    }
  }
  if (Object.keys(user_grid).length < 3) {
    continue;
  }
  // console.log(`${arr[0].object_id} - ${Object.keys(user_grid).length}`);

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

    if (!static_area_result[arr[j].a_id]) {
      static_area_result[arr[j].a_id] = [{ static_log_obj }];
    } else {
      static_area_result[arr[j].a_id].push(static_log_obj);
    }

    if (!static_grid_result[arr[j].static_grid_id]) {
      static_grid_result[arr[j].static_grid_id] = [{ static_log_obj }];
    } else {
      static_grid_result[arr[j].static_grid_id].push(static_log_obj);
    }


  }
}



//////////////////////////////////////// 0317 area별 유저의 최소 사이즈만 반영 ////////////////////////////////////////////////////

let all_car_type = 0;
let all_person_type = 0;
let strs = ''

for (let area_id in static_area_result) {
  let arr = static_area_result[area_id];
  if (!arr) {
    continue;
  }
  let user_min_size = {}
  let user_size_ary = {};
  let user_type = {};

  let user_direction_ary = {};

  let user_min_vel = {};
  let user_max_vel = {};
  let user_infos = {};
  let user_vels = {};
  if (arr.length < 2) {
    continue;
  }

  for (let j = 1; j < arr.length; j++) {

    if (!user_size_ary[arr[j].object_id]) {
      user_size_ary[arr[j].object_id] = [arr[j].size];
    } else {
      user_size_ary[arr[j].object_id].push(arr[j].size);
    }

    if (!user_direction_ary[arr[j].object_id]) {
      user_direction_ary[arr[j].object_id] = [arr[j].direction]
    } else {
      user_direction_ary[arr[j].object_id].push(arr[j].direction);
    }


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

  let lens = Object.keys(user_min_size); // object ids 
  let sizes = []; // min 사이즈
  let sizes2 = []; // mean 사이즈
  let vels = [];

  for (let l = 0; l < lens.length; l++) {
    sizes.push(user_min_size[lens[l]]);
    sizes2.push(mathjs.mean(user_size_ary[lens[l]]));
    vels.push(mathjs.mean(user_vels[lens[l]]));
  }



  let size_mean = mathjs.mean(sizes2);
  let size_std = mathjs.std(sizes2);
  let vel_mean = mathjs.mean(vels);
  let vel_std = mathjs.std(vels);
  for (let l = 0; l < lens.length; l++) {
    let user_info = user_infos[lens[l]];
    if (mathjs.mean(user_size_ary[lens[l]]) < size_mean + 2.5 * size_std) {
      let ratio = mathjs.mean(user_size_ary[lens[l]]) / ((video_x / 4) * (video_y / 4))
      let str = `${area_id},${ratio},${lens[l]},${user_type[lens[l]]},${user_min_size[lens[l]]},${user_min_vel[lens[l]]},${mathjs.mean(user_vels[lens[l]])},${user_max_vel[lens[l]]},${user_info.x},${user_info.y},${mathjs.max(user_direction_ary[lens[l]])},${mathjs.min(user_direction_ary[lens[l]])},${mathjs.mean(user_direction_ary[lens[l]])},${mathjs.std(user_direction_ary[lens[l]])}\n`
      strs += str;



      if (!area_ratio_ary[area_id]) {
        area_ratio_ary[area_id] = [ratio]
      } else {
        area_ratio_ary[area_id].push(ratio);
      }


    }

  }
  // let size_mean = mathjs.mean(sizes);
  // let size_std = mathjs.std(sizes);
  // let vel_mean = mathjs.mean(vels);
  // let vel_std = mathjs.std(vels);
  // for (let l = 0; l < lens.length; l++) {
  //   let user_info = user_infos[lens[l]];
  //   if (user_min_size[lens[l]] < size_mean + 2.5 * size_std ) {
  //     let ratio = user_min_size[lens[l]] / ((video_x / 4) * (video_y / 4)) 
  //     let str = `${area_id},${ratio},${lens[l]},${user_type[lens[l]]},${user_min_size[lens[l]]},${user_min_vel[lens[l]]},${mathjs.mean(user_vels[lens[l]])},${user_max_vel[lens[l]]},${user_info.x},${user_info.y}\n`
  //     strs += str;

  //   }

  // }
}
fs.appendFileSync(`./grid_cluster/min_${file_name}_area_mean_filter2.txt`, strs);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// let strs = ''
// for (let grid_id in static_grid_result) {
//   let arr = static_grid_result[grid_id];
//   if (!arr) {
//     continue;
//   }
//   // console.log(`${grid_id}, len: ${arr.length}`)
//   let user_min_size = {}
//   let user_type = {};
//   let user_size_ary = {};
//   let user_min_vel = {};
//   let user_max_vel = {};
//   let user_infos = {};
//   let user_vels = {};
//   if (arr.length < 2) {
//     continue;
//   }
//   let car_type = 0;

//   for (let j = 1; j < arr.length; j++) {

//     if (!user_size_ary[arr[j].object_id]) {
//       user_size_ary[arr[j].object_id] = [arr[j].size];
//     } else {
//       user_size_ary[arr[j].object_id].push(arr[j].size);
//     }

//     if (!user_min_size[arr[j].object_id]) {
//       user_infos[arr[j].object_id] = arr[j]
//       user_min_size[arr[j].object_id] = arr[j].size
//       user_type[arr[j].object_id] = arr[j].object_type;
//     } else {
//       if (arr[j].size < user_min_size[arr[j].object_id]) {
//         user_min_size[arr[j].object_id] = arr[j].size;
//         user_infos[arr[j].object_id] = arr[j]
//       }
//     }
//     // console.log(arr[j].velocity)

//     if (!user_min_vel[arr[j].object_id]) {
//       user_vels[arr[j].object_id] = [arr[j].velocity];
//       user_min_vel[arr[j].object_id] = arr[j].velocity;
//       user_max_vel[arr[j].object_id] = arr[j].velocity;
//     } else {
//       user_vels[arr[j].object_id].push(arr[j].velocity);

//       if (arr[j].velocity < user_min_vel[arr[j].object_id]) {
//         user_min_vel[arr[j].object_id] = arr[j].velocity;
//       }

//       if (arr[j].velocity > user_max_vel[arr[j].object_id]) {
//         user_max_vel[arr[j].object_id] = arr[j].velocity;
//       }
//     }

//   }

//   let lens = Object.keys(user_min_size);
//   let sizes = []; // min 사이즈
//   let sizes2 = []; // mean 사이즈
//   let vels = [];

//   for (let l = 0; l < lens.length; l++) {
//     sizes.push(user_min_size[lens[l]]);
//     sizes2.push(mathjs.mean(user_size_ary[lens[l]]));
//     vels.push(mathjs.mean(user_vels[lens[l]]));
//   }


//   // console.log(`size -${sizes.length}, vels-${vels.length}`);

//   let size_mean = mathjs.mean(sizes2);
//   let size_std = mathjs.std(sizes2);
//   let vel_mean = mathjs.mean(vels);
//   let vel_std = mathjs.std(vels);
//   for (let l = 0; l < lens.length; l++) {
//     let user_info = user_infos[lens[l]];
//     // if (user_min_size[lens[l]] < size_mean + 2.5 * size_std) {
//     //   let ratio = user_min_size[lens[l]] / ((video_x / 10) * (video_y / 10)) 
//     //   let str = `${grid_id},${ratio},${user_type[lens[l]]},${user_min_size[lens[l]]},${user_min_vel[lens[l]]},${mathjs.mean(user_vels[lens[l]])},${user_max_vel[lens[l]]},${user_info.x},${user_info.y}\n`
//     //   strs += str;
//     // }
//     if (mathjs.mean(user_size_ary[lens[l]]) < size_mean + 2.5 * size_std) {
//       let ratio = mathjs.mean(user_size_ary[lens[l]]) / ((video_x / 10) * (video_y / 10))
//       let str = `${grid_id},${ratio},${lens[l]},${user_type[lens[l]]},${user_min_size[lens[l]]},${user_min_vel[lens[l]] / 100},${mathjs.mean(user_vels[lens[l]] / 100)},${user_max_vel[lens[l]] / 100},${user_info.x},${user_info.y}\n`
//       strs += str;


//       if (!grid_ratio_ary[grid_id]) {
//         grid_ratio_ary[grid_id] = [ratio]
//       } else {
//         grid_ratio_ary[grid_id].push(ratio);
//       }

//     }

//   }
// }
// fs.appendFileSync(`./grid_cluster/min_${file_name}_grid_mean_filter.txt`, strs);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

for (grid_id in area_ratio_ary) {
  let arr = area_ratio_ary[grid_id];
  let up = 0;
  let down = 0;
  if (arr.length < 10) {
    console.log(`none ${grid_id} (${arr.length})`)
    continue;
  }
  let size_mean = mathjs.mean(arr);
  let size_std = mathjs.std(arr);
  // console.log(`${grid_id} ${size_mean}(${size_std})`);
  let up_count = 0;
  let down_count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > size_mean + size_std * 1.5) {
      up_count++;
    } else if (arr[i] < size_mean - (size_std)) {
      down_count++;
    }
  }
  // console.log(`${grid_id} , ${arr.length} , up:${up_count/arr.length} down:${down_count/arr.length}`)
  // console.log(`grid id[${grid_id}] - ${up}, ${down}`);


}

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


// 787	1566164088000	CZWEeKNZVbvU2w8I+4K63CyDI4s3y5FQILKRLvzR2Ln9ZyA1eAPy5Vir3b7W/73H	1	1	0402	295	588	15	15	1	1	640	640
// 788	1566164091000	CZWEeKNZVbvU2w8I+4K63CyDI4s3y5FQILKRLvzR2Ln9ZyA1eAPy5Vir3b7W/73H	1	1	0402	279	630	15	15	1	1	640	640


// 16513214504800	1583237917645	908	20	703	225	83	9	5	360	240
// FRAME   1566204882000   21      1       16513214504700  0104    306     110     1       1       1       1       640     640
//           id     timestamp object_id, object_type, camera_id, grid_id, objectX, object Y , width, height, size , videoX, videoY
let str = `${i + 1}\t${ddd[0]}\t${ddd[2]}\t${1}\t${1}\t${ll2}${ll1}\t${videoX}\t${videoY}\t${15}\t${15}\t1\t1\t${width}\t${height}\n`;

let strs = [];
strs.push('12345')
strs.push(ddd[0]);
strs.push(`${ll2}${ll1}`);
strs.push('20');
strs.push(videoX);
strs.push(videoY);
strs.push('15');
strs.push('15')
strs.push(width);
strs.push(height)