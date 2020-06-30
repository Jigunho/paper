const _ = require('lodash')
const mathjs = require('mathjs')
const split_m = 0;
function getGridSizeKey(id, grid_infos) {
  return grid_infos[id];
}
exports.getGridSizeKey = getGridSizeKey;
function getTargetGridInfo(area_id, grid_infos) {
  let infos = [];
  for (let key in grid_infos) {
    let re_key = key.substring(0, 3);
    if (re_key === area_id) {
      infos.push(grid_infos[key]);
    }
  }
  return infos;
}
exports.getTargetGridInfo = getTargetGridInfo;
function printGridStatic (ary, height, width) {
  let sss = [];
  for (let y = 0 ; y < height; y ++) {
    let str = `${y}\t`;
    for (let x = 0; x < width ; x ++) {
      if (ary[y][x].real === 1 && ary[y][x].adaptive === 1) {
        str += '*'
      } else if (ary[y][x].adaptive === 1) {
        str += 'o'
      } else if (ary[y][x].real === 1) {
        str += '^'
      } else {
        str += ' '
      }
    }
    sss.push(str);
    fs.appendFileSync('./print_test.txt',`${str}\n`);
  }
}
function reviseXY(x, y, video_x, video_y, origin_area_id) {
  // adaptive grid id
  let return_x = x;
  let return_y = y;
  if (x > video_x) {
    return_x = video_x -1;
  } 
  if (x <= 0) {
    return_x = 1;
  }
  if (y > video_y) {
    return_y = video_y -1;
  } 
  if( y <= 0) {
    return_y = 1;
  }
  let AREA_X_SIZE = video_x / 4;
  let AREA_Y_SIZE = video_y / 4;
  let area_x = Math.ceil(x / AREA_X_SIZE);
  let area_y = Math.ceil(y / AREA_Y_SIZE);
  let area_id = `${area_x}0${area_y}`;
  // console.log(`${video_x}, ${video_y}, origin:(${x},${y}):${origin_area_id} -> revise(${return_x},${return_y}):${area_id}`)
  
  return { return_x, return_y }
}
exports.reviseXY = reviseXY;
function getGridId(x, y, grid_infos) {


  // adaptive grid id
  for (let key in grid_infos) {
    if ((x >= grid_infos[key].x && x <= grid_infos[key].x + grid_infos[key].w) && (y >= grid_infos[key].y && y <= grid_infos[key].y + grid_infos[key].h)) {
      return key;
    }
  }
  return -1;
}
exports.getGridId = getGridId;
function getGridSize(x, y, grid_infos) {
  for (let key in grid_result) {
    if (x >= grid_infos[key].x && x <= grid_infos[key].x + grid_infos[key].w && y >= grid_infos[key].y && y <= grid_infos[key].y + grid_infos[key].h) {
      return grid_infos[key].w * grid_infos[key].h;
    }
  }
  return -1;
}
function getStaticGridId(video_x, video_y, x, y) {
  let GRID_X_SIZE = video_x / 10;
  let GRID_Y_SIZE = video_y / 10;

  if (x > video_x) {
    x = video_x - 1;
  }
  if (y > video_y) {
    y = video_y - 1;
  }

  let grid_x = Math.ceil(x / GRID_X_SIZE);
  let grid_y = Math.ceil(y / GRID_Y_SIZE) - 1;

  let grid_id = parseInt(`${grid_x}0${grid_y}`);
  return grid_id

}
exports.getStaticGridId = getStaticGridId;
function getXY(video_x, video_y, area_id, split_cnt) {
  let key = area_id.split('0');
  let x_size = video_x / split_cnt;
  let y_size = video_y / split_cnt;
  let x = (parseInt(key[0], 10) - 1) * x_size;
  let y = (parseInt(key[1], 10) - 1) * y_size;
  return { x, y };
}
exports.getXY = getXY;
function func(x, y, len_x, len_y, key, arr, result_ary) {
  let ary = arr;

  let grid_size = len_x * len_y;
  let sizes = [];


  let user_obj_ary = _.groupBy(ary, 'object_id');
  for (let object_id in user_obj_ary) {
    let user_arr = user_obj_ary[object_id];
    let user_sizes = [];
    for (let i = 0 ; i < user_arr.length ; i ++) {
      user_sizes.push(user_arr[i].size);
    }
    sizes.push(mathjs.mean(user_sizes));
  }

  // for (let i = 0; i < ary.length; i++) {
  //   let size = ary[i].size;
  //   sizes.push(size);
  // }
  // console.log(`${key} user len : ${sizes.length}`)

  if (sizes.length < 3) {
    result_ary[key] = { grid_size: grid_size, x, y, w: len_x, h: len_y, count: 0, obj_size_mean: 0, obj_size_mean: 0, filtered: false, id: key };

    return
  }
  else if (grid_size < mathjs.mean(sizes)) {
    // console.log(`도달하지 말아야할 영역 ${key} gridsize: ${grid_size}, 객체 평균사이즈:${mathjs.mean(sizes)}, ${sizes.length}`)
    result_ary[key] = {
      grid_size: grid_size, x, y, w: len_x, h: len_y, count: sizes.length, key, obj_size_mean: mathjs.mean(sizes),
      obj_size_std: mathjs.std(sizes), ratio: mathjs.std(sizes) / grid_size, id: key, filtered: false,
    };

    return;

  } else if (sizes.length >= 3 && sizes.length <= 10) {
    result_ary[key] = {
      grid_size: grid_size, x, y, w: len_x, h: len_y, count: sizes.length, key,
      obj_size_mean: mathjs.mean(sizes), obj_size_std: mathjs.std(sizes), ratio: mathjs.std(sizes) / grid_size, filtered: false, id: key
    };


    return;

  } else {

  }
  if ((grid_size / 4) > mathjs.mean(sizes) + split_m * mathjs.std(sizes)) {

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

    func(x, y, len_x / 2, len_y / 2, `${key}-00`, ary00, result_ary);
    func(x + len_x / 2, y, len_x / 2, len_y / 2, `${key}-01`, ary01, result_ary);
    func(x, y + len_y / 2, len_x / 2, len_y / 2, `${key}-10`, ary10, result_ary);
    func(x + len_x / 2, y + len_y / 2, len_x / 2, len_y / 2, `${key}-11`, ary11, result_ary);
    // delete grid_ary[key];
    return;

  } else {
    result_ary[key] = {
      grid_size: grid_size, obj_size_mean: mathjs.mean(sizes), obj_size_std: mathjs.std(sizes), x, y, w: len_x,
      h: len_y, count: sizes.length, ratio: mathjs.std(sizes) / grid_size, filtered: false, id: key
    };
    return;
  }
}
exports.getAreaId = (video_x, video_y, x, y) => {
  if (x > video_x) {
    x = video_x -1;
  } 
  if ( x <= 0) {
    x = 1;
  }
  if (y > video_y) {
    y = video_y -1;
  }
  if (y <= 0) {
    y = 1;
  }
  if(isNaN(video_x)) {
    return false;
  }
  let AREA_X_SIZE = video_x / 4;
  let AREA_Y_SIZE = video_y / 4;
  let area_x = Math.ceil(x / AREA_X_SIZE);
  let area_y = Math.ceil(y / AREA_Y_SIZE);
  let area_id = `${area_x}0${area_y}`;
  // console.log(`${video_x}, ${video_y}, ${x}, ${y} - ${area_id}`)

  return area_id



}
exports.getAreaId3 = (video_x, video_y, x, y) => {
  if (x > video_x) {
    x = video_x -1;
  } 
  if ( x <= 0) {
    x = 1;
  }
  if (y > video_y) {
    y = video_y -1;
  }
  if (y <= 0) {
    y = 1;
  }
  if(isNaN(video_x)) {
    return false;
  }
  let AREA_X_SIZE = video_x / 3;
  let AREA_Y_SIZE = video_y / 3;
  let area_x = Math.ceil(x / AREA_X_SIZE);
  let area_y = Math.ceil(y / AREA_Y_SIZE);
  let area_id = `${area_x}0${area_y}`;
  // console.log(`${video_x}, ${video_y}, ${x}, ${y} - ${area_id}`)

  return area_id



}

exports.func = func;
const getDirectionId = (direction) => {
  return Math.floor(direction / 90)
}
exports.getDirectionId = getDirectionId;