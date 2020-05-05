const fpgrowth = require('node-fpgrowth');
const mathjs = require('mathjs');
var transactions = [
  [1, 3, 4],
  [2, 3, 5],
  [1, 2, 3, 5],
  [2, 5],
  [1, 2, 3, 5]
];

var fpg = new fpgrowth.FPGrowth(.4);

// fpg.exec(transactions, function (itemsets) {
//   console.log(`Finished executing FPGrowth. ${itemsets.length} frequent itemset(s) were found.`);
//   for (i = 0 ; i < itemsets.length ; i ++) {
//     console.log(itemsets[i]);
//   }
// });
let arr = [1,2,3,4,5];
let arr1 = [1,4,6,7,8];
let arr3 = arr.concat(arr1)
console.log([...new Set(arr3)])
