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
