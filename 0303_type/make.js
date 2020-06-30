const fs = require('fs');
let lines = fs.readFileSync('./onlyperson.txt').toString().split('\n');
let strs = '';
console.log(lines.length);
for (let i = 0 ; i <lines.length ; i ++) {
  let cols = lines[i].split('\t');
  let arr = [];
  arr.push('1234');
  arr.push(cols[0]);
  arr.push(cols[1]);
  arr.push(cols[2]);
  arr.push(cols[3]);
  arr.push(cols[4]);
  arr.push(cols[5]);
  arr.push(cols[6]);
  
  arr.push(cols[7]);
  arr.push(876)
  arr.push(540);
  
  strs += `${arr.join('\t')}\n`;
}
fs.appendFileSync('./person.txt', strs);