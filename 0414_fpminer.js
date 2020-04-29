const _ = require('lodash');
const fs = require('fs');
// let result = [{ user_id: 4, grid_list: ['404-01', '404-0001'], area_list: [{ id: '101', direction: 30 }, { id: '102', direction: 50 }] }];
let threshold = 0.3;


let lines = fs.readFileSync('./user_result.txt').toString().split('\n');
let result = []
for (let i = 0 ; i < lines.length ; i ++) {
  result.push(JSON.parse(JSON.stringify(lines[i])))
}
console.log(result.length);


// console.log(arr3);

const main = () => {

  for (let i = 0; i < result.length; i++) {
    let g_list = result[i].grid_lists
    console.log(g_list)
    // g_list.sort(function (a, b) {
    //   return a - b;
    // })
    // result[i].grid_str = g_list.join('@');
  
    // let a_list = result[i].area_list;
    // for (let a = 0; a < a_list.length; a++) {
    //   a_list[a].direction_id = getDirectionId[a_list[a].direction];
    // }
    // result[i].area_list = a_list;
  
  }
  

  for (let i = 0; i < result.length; i++) {
    console.log(JSON.stringify(result[i]))
  }

  // let group = {}; // area id와 area 방향이 같은 list
  // for (let i = 0; i < result.length; i++) {
  //   let a_list = result[i].area_list;
  //   a_list.sort(function (a, b) {
  //     return a.id - b.id;
  //   })
  //   let a_ary = [];
  //   for (let a = 0; a < a_list.length; a++) {
  //     a_ary.push(`${a_list[a].id}_${a_list[a].direction_id}`);
  //   }
  //   let a_str = a_ary.join('@');
  //   if (!group(a_str)) {
  //     group[a_str] = [result[i]];
  //   } else {
  //     group[a_str].push(result[i]);
  //   }
  // }
  
  // let merge_grid_list = {};
  // for (let a_str in group) {
  //   let a_str_list = group[a_str]; // 같은 영역, 같은 방향을 가진 객체들
  
  //   let group_grid_list = _.groupBy(a_str_list, 'grid_str');
  //   let grid_list = Object.keys(group_grid_list);
  //   for (let i = 0; i < grid_list.length; i++) {
  //     for (let j = 0; j < grid_list.length; j++) {
  //       if (i === j) {
  //         continue;
  //       } else {
  //         // 매칭 해보면서 , 조건 같으면
  //         let user_grid_list1 = grid_list[i].grid_str.split('@')
  //         let user_grid_list2 = grid_list[i].grid_str.split('@');
  //         let concat_list = user_grid_list1.concat(user_grid_list2);
  //         let dup_removed_concat_list = [...new Set(concat_list)];

  //         let ratio = dup_removed_concat_list.length / Math.min([user_grid_list1.length, user_grid_list2.length]);

  //         if (ratio > threshold) {
  //           console.log(`${ratio} , ${dup_removed_concat_list}`);
  //           let merge_grid = dup_removed_concat_list.join('@');
  //           merge_grid_list[grid_list[i].grid_str] = merge_grid;
  //           merge_grid_list[grid_list[j].grid_str] = merge_grid;
  
  //         }
          
  //       }
  //     }
  //   }
  
  //   let merged_group = {};
  
  //   for (let i = 0; i < a_str_list.length; i++) {
  //     if (merge_grid_list[a_str_list].grid_str) {
  
  //     }
  //   }
  // }
}
const getDirectionId = (direction) => {
  return Math.floor(direction / 90)
}

// main();