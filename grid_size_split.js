const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const file_name = '4801_small'
const lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');
console.log(lines.length);

let video_x = 360;  // 
let video_y = 240; // 사거리(4801)

// let video_x = 876;  // road ( road_4802)
// let video_y = 540;


// let video_x = 360;  // 위, 아래 (4800) , forbus 
// let video_y = 250;

// let video_x = 980;
// let video_y = 540; // europe

// let video_x = 980; // japan4road
// let video_y = 540;

let std_ratio_result = []; // 편차/ 평균
let std_ratio_result2 = [];

let object_type = '100'; // 20차량, 100 사람
let std_result = [];
let grid_result = {};
let first_ary = [];
let second_ary = [];
let error_cnt = 0;
let not_obj = 0;

let area_size_ary = { '00': [], '01': [], '10': [], '11': [] }; // 부분영역별 사이즈를 통한 에러필터링 하기 위한 

let entry_grid = {};
let exit_grid = {};


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
    // console.log(size);
    first_ary.push(obj);

  } else {
    error_cnt++;
  }

}

// fs.appendFileSync(`./grid_raw_logs/${file_name}_down_person.txt`,strs3);
// fs.appendFileSync(`./grid_raw_logs/${file_name}_up.txt`,strs2);
// fs.appendFileSync(`./grid_raw_logs/${file_name}_down.txt`,strs1);


/////////////////////////////////////////////////////// object type 통계 /////////////////////////////////////////////////////////
let start_end_same_user = 0;
let obj_type_id_ary = _.groupBy(first_ary, 'object_id');
console.log(`obj ids : ${Object.keys(obj_type_id_ary).length}`);
let car_type_counts = [];
let person_type_counts = [];
let log_avg = [];
let ids = Object.keys(obj_type_id_ary);
let oo = 0;
for (let i = 0; i < ids.length; i++) {

  let arr = obj_type_id_ary[ids[i]];
  let grid_car_count = 0;
  let grid_person_count = 0;
  arr.sort(function (a, b) {
    return a.timestamp - b.timestamp
  })
  if (arr.length <= 2) {
    continue;
  }

  if (arr[1].static_grid_id === arr[arr.length - 1].static_grid_id) {
    // 처음시작과 끝이 동일한 그리드면 제거
    start_end_same_user++;
    // fs.appendFileSync('./ddd.txt',`${JSON.stringify(arr)}\n`);
    // console.log(JSON.stringify(arr));
    continue;
  }



  let user_count = 0;
  for (let j = 1; j < arr.length; j++) {

    if (arr[j].x === arr[j - 1].x && arr[j].y === arr[j - 1].y) {
      continue;
    }
    let velocity = Math.sqrt(Math.pow(arr[j].y - arr[j - 1].y, 2) + Math.pow(arr[j].x - arr[j - 1].x, 2)) / (arr[j].timestamp - arr[j - 1].timestamp) * 100;

    let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;


    if (velocity === Infinity) {
      continue;
    }
    user_count++;
    second_ary.push(arr[j]);

  }
  if (arr[0].object_type === '20') {
    car_type_counts.push(user_count)
    grid_car_count++;
  } else {
    person_type_counts.push(user_count);
    grid_person_count++;
  }
}
console.log(`start end same user : ${start_end_same_user}`);





















let grid_cluster_result = _.groupBy(second_ary, 'static_grid_id');
for (let grid_id in grid_cluster_result) {
  let grid_list = grid_cluster_result[grid_id];

  for (let i = 0; i < grid_list.length; i++) {

  }
}


console.log(`현재 객체가 아닌것: ${not_obj}`);
console.log(`error cnt: ${error_cnt}`);
let static_grid_result = {};
let grid_user_list = _.groupBy(first_ary, 'static_grid_id');
console.log(`static ids : ${Object.keys(grid_user_list).length}`);
let grid_ids = Object.keys(grid_user_list);
// let sizes = [];
for (let i = 0; i < grid_ids.length; i++) {
  // obj_id_sum += grid_user_list[grid_ids[i]].length
  // log_avg.push(grid_user_list[grid_ids[i]].length);
  let arr = grid_user_list[grid_ids[i]];
  arr.sort(function (a, b) {
    return a.timestamp - b.timestamp
  });

  
  for (let j = 1; j < arr.length; j++) {

    if (arr[j].x === arr[j - 1].x && arr[j].y === arr[j - 1].y) {
      continue;
    }

    let velocity = Math.sqrt(Math.pow(arr[j].y - arr[j - 1].y, 2) + Math.pow(arr[j].x - arr[j - 1].x, 2)) / (arr[j].timestamp - arr[j - 1].timestamp) * 100;

    let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;


    if (velocity === Infinity) {
      continue;
    }




    let static_log_obj = {
      timestamp: arr[j].timestamp, direction, velocity, object_id: arr[j].object_id,
      size: arr[j].size, object_type: arr[j].object_type, x: arr[j].x, y: arr[j].y, width: arr[j].width, height: arr[j].height,
      video_x: arr[j].video_x, video_y: arr[j].video_y, camera_id: arr[j].camera_id
    };
    if (!static_grid_result[grid_ids[i]]) {
      static_grid_result[grid_ids[i]] = [{ static_log_obj }];
    } else {
      static_grid_result[grid_ids[i]].push(static_log_obj);
    }


  }
}



let strs1 = ''; // 중간 이상
let strs2 = ''; // 절반 이하 
let strs3 = ''; // down 중에서 사람 

let all_car_type = 0;
let all_person_type = 0;
for (let i = 0; i < grid_ids.length; i++) {
  let arr = static_grid_result[grid_ids[i]];
  if (!arr) {
    continue;
  }
  if (arr.length < 2) {
    continue;
  }
  let sizes = [];
  let directions = [];
  let velocitys = [];
  let strs = ''
  let person_type = 0;
  let car_type = 0;
  for (let j = 1; j < arr.length; j++) {
    if (arr[j].object_type !== '20') {
      person_type++;
      all_person_type++;
    } else {
      all_car_type++;
      car_type++;
    }
    sizes.push(arr[j].size);
    let str = `${grid_ids[i]},${arr[j].object_type},${arr[j].size},${arr[j].direction},${arr[j].velocity}\n`
    strs += str;
  }
  console.log(`${grid_ids[i]}person ; ${person_type}, car: ${car_type}`);
  // fs.appendFileSync(`./grid_cluster/${file_name}_${grid_ids[i]}.txt`, strs);

  let grid_size_mean = mathjs.mean(sizes);
  // console.log(grid_size_mean)
  // 16513214504802	1583242651929	408	100	504	437	227	20	47	984	535

  for (let j = 1; j < arr.length; j++) {
    if (arr[j].size < grid_size_mean) {
      let str = `${arr[j].camera_id}\t${arr[j].timestamp}\t${arr[j].object_id}\t${arr[j].object_type}\t${grid_ids[i]}\t${arr[j].x}\t${arr[j].y}\t${arr[j].width}\t${arr[j].height}\t${arr[j].video_x}\t${arr[j].video_y}\n`
      strs1 += str;

    } else {
      let str = `${arr[j].camera_id}\t${arr[j].timestamp}\t${arr[j].object_id}\t${arr[j].object_type}\t${grid_ids[i]}\t${arr[j].x}\t${arr[j].y}\t${arr[j].width}\t${arr[j].height}\t${arr[j].video_x}\t${arr[j].video_y}\n`
      strs2 += str;
      if (arr[j].object_type === object_type) {
        strs3 += str;
      }

    }
  }


}
console.log(`${all_car_type}, ${all_person_type}`)

