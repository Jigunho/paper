const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')

const funcSet = require('./modules/function');
const split_m = 0
// let video_x = 360;  // 
// let video_y = 240; // 사거리(4801)
let video_x = 360;  // 
let video_y = 240; // japan 거리
let static_video_x = video_x / 10;
let static_video_y = video_y / 10;
let static_grid_size = static_video_x * static_video_y;

let grid_result = {};
const split_cnt = 4;
const file_name = `0425_highway30min`
const u_lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');
const target_split = { 101: 1, 102: 1, 103: 1, 104: 2, 201: 1, 202: 1, 203: 2, 204: 2, 301: 1, 302: 2, 303: 2, 304: 1, 401: 1, 402: 2, 403: 1, 404: 1 };

// const target_split = { 101: 1, 102: 1, 103: 1, 104: 1, 201: 1, 202: 1, 203: 1, 204: 1, 301: 1, 302: 1, 303: 1, 304: 1, 401: 1, 402: 1, 403: 1, 404: 1 };
// high way
// const target_split = { 101: 1, 102: 2, 103: 2, 104: 1, 201: 1, 202: 2, 203: 2, 204: 1, 301: 1, 302: 2, 303: 2, 304: 1, 401: 1, 402: 2, 403: 2, 404: 1 };
// T car 
let area_median_result = {}; // 영역별 객체의 median 값을 저장하기 위한 변수

let grid_result_small = {};
let grid_result_big = {};
let grid_result_intersect = {};

let log_ary = [];

for (let i = 0; i < u_lines.length; i++) {
  let cols = u_lines[i].split('\t');

  let size = parseInt(cols[7]) * parseInt(cols[8]);
  let height = parseInt(cols[7]);
  let width = parseInt(cols[8]);
  if (!isNaN(size)) {


    // funcSet.getAreaId
    let a_id = funcSet.getAreaId(parseInt(cols[9]), parseInt(cols[10]), parseInt(cols[5]), parseInt(cols[6]));
    let obj = { timestamp: parseInt(cols[1]), x: parseInt(cols[5]), y: parseInt(cols[6]), width, height, size, object_id: cols[2], static_id: cols[4], area_id: a_id }
    log_ary.push(obj);

  } else {
  }
}

let area_size_logs = {};

let area_group_result = _.groupBy(log_ary, 'area_id');
for (let area_id in area_group_result) {

  let area_arr = area_group_result[area_id];

  let area_user_obj = _.groupBy(area_arr, 'object_id');

  let area_sizes = []; // 영역별 객체 대표값 사이즈 속성
  for (let user_id in area_user_obj) {
    let user_arr_ary = area_user_obj[user_id];

    let sizes = [];
    for (let i = 0; i < user_arr_ary.length; i++) {
      sizes.push(user_arr_ary[i].size);
    }
    if (sizes.length === 0) {
      continue;
    }
    area_sizes.push(mathjs.min(sizes)); // 객체의 최소 사이즈 축적

  }

  area_size_logs[area_id] = area_sizes


}

for (let area_id in area_size_logs) {
  let arr = area_size_logs[area_id];
  // if (arr.length <= 10) {
  //   continue;
  // }
  if (arr.length === 0) {
    area_median_result[area_id] = 0;
  } else {
    area_median_result[area_id] = mathjs.median(arr);
  }
  // console.log(`area[${area_id}] - ${mathjs.median(arr)}, ${arr.length}`);
}

for (let area_id in area_median_result) {

  let area_arr = area_group_result[area_id];
  let split_result = target_split[area_id];
  let arr0 = []  // 공통
  let arr1 = []; // 큰거 
  let arr2 = []; // 작은거

  // console.log(`area[${area_id}] split_result:${split_result}`);
  let { x, y } = funcSet.getXY(video_x, video_y, area_id, split_cnt);

  if (split_result === 1) {
    arr0 = JSON.parse(JSON.stringify(area_arr));
    funcSet.func(x, y, video_x / split_cnt, video_y / split_cnt, area_id, arr0, grid_result_intersect);
  } else if (split_result === 2) {

    let median = area_median_result[area_id];

    for (let i = 0; i < area_arr.length; i++) {
      if (area_arr[i].size > median) {
        arr1.push(area_arr[i]);
      } else {
        arr2.push(area_arr[i])
      }
    }
    funcSet.func(x, y, video_x / split_cnt, video_y / split_cnt, area_id, arr1, grid_result_big);
    funcSet.func(x, y, video_x / split_cnt, video_y / split_cnt, area_id, arr2, grid_result_small);

  }

}
// for (let a_g_id in grid_result_intersect) {
//   let grid_result = grid_result_intersect[a_g_id];
//   // console.log(JSON.stringify(grid_result));
//   fs.appendFileSync('./0407_grid_result_small.txt', `${JSON.stringify(grid_result)},\n`);
//   fs.appendFileSync('./0407_grid_result_big.txt', `${JSON.stringify(grid_result)},\n`);

// }
// for (let a_g_id in grid_result_small) {
//   let grid_result = grid_result_small[a_g_id];
//   fs.appendFileSync('./0407_grid_result_small.txt', `${JSON.stringify(grid_result)},\n`);

// }
// for (let a_g_id in grid_result_big) {
//   let grid_result = grid_result_big[a_g_id];
//   fs.appendFileSync('./0407_grid_result_big.txt', `${JSON.stringify(grid_result)},\n`);

// }

const print_target_id = `21`;
//let target_ids = ['141', '199', '396', '448','497', '763', '765', '892', '1049', '1074', '1164', '1199', '1210', '1278', '1403', '1439', '1453']; // 차량
// let target_ids = ['8', '21', '25','29','35','40','45','56','75','134','168','186','231','232','241','269','347']; // 사람
// let target_ids = [4,6,7,22,24,26,28,37,46,47,48,50,57,59,65,72,90,94,97,98,104,109,110,118,120,122,123,124,126,130,138,141,145,146,148,154,155,173,176,179,183,190,195,199,209,211,212,216,228,247,248,255,267,272,284,296,305,308,315,319,320,323,325,328,329,337,360,363,366,372,375,396,403,409,416,417,419,423,430,438,444,448,456,461,462,480,481,486,492,497,529,544,549,551,557,560,571,590,605,606,608,609,614,615,618,619,622,624,630,633,638,644,658,665,669,691,700,710,711,719,721,725,726,728,734,735,741,746,754,763,765,768,772,773,781,783,784,785,786,787,789,793,794,799,800,804,817,819,820,824,825,830,838,840,841,849,854,885,887,892,894,896,902,905,911,917,924,956,962,974,981,986,990,995,1024,1033,1042,1049,1056,1069,1071,1074,1082,1089,1093,1118,1132,1158,1162,1164,1167,1175,1178,1182,1187,1192,1195,1199,1205,1210,1216,1221,1233,1266,1275,1278,1284,1294,1295,1304,1313,1322,1337,1353,1359,1363,1369,1377,1380,1386,1403,1407,1423,1434,1436,1439,1446,1453,1473,1482,1484,1508,1510,1523,1528,1533,1537,1547,1550,1559,1562,1574,1581,1584,1585,1588,1598,1608,1609,1613,1628,1638,1639,1641,1646,1648]
// 사람
let target_ids = [1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,54,55,56,57,58,60,61,62,63,64,65,66,67,69,70,71,72,73,74,75,76,77,79,80,81,82,84,85,86,87,88,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,125,126,127,128,129,130,132,133,134,135,136,137,138,139,140,142,143,144,145,147,149,150,151,152,154,155,156,157,158,159,161,162,164,165,166,167,168,170,173,174,175,177,178,179,180,181,182,184,185,186,187,188,189,190,191,192,193,194,196,197,198,200,201,202,203,204,205,206,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,249,250,251,252,253,254,256,257,258,259,260,261,262,263,264,269,270,271,272,273,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,297,298,299,300,301,302,304,305,306,307,309,310,311,313,314,316,317,318,319,321,322,324,327,330,331,332,333,334,335,336,338,339,340,342,343,344,345,346,347,348,349,350,352,353,354,355,356,357,358,359,361,362,363,364,365,366,367,368,369,370,371,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,393,394,395,397,398,399,400,401,402,404,405,406,407,408,410,411,412,413,414,415,418,419,420,421,422,424,426,427,428,429,431,432,433,434,435,436,437,440,441,443,445,446,449,450,451,454,455,457,458,459,460,463,464,465,466,467,468,469,470,471,472,474,475,476,478,479,482,484,485,487,488,489,490,491,493,494,495,496,498,499,500,501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,519,520,521,522,523,525,526,527,528,529,530,531,533,534,535,536,537,540,541,542,543,544,545,547,548,549,550,551,552,554,555,557,558,559,560,561,562,563,564,565,566,567,568,569,570,571,572,573,574,576,577,578,579,580,581,582,583,584,585,586,587,588,590,591,592,593,594,595,596,597,598,599,600,601,602,603,604,607,608,609,610,612,613,614,616,617,618,619,620,621,625,626,627,628,629,630,631,632,634,635,636,637,639,640,641,642,643,644,645,646,647,648,649,650,651,652,653,654,655,656,658,659,660,661,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,680,681,682,683,684,685,686,687,688,689,690,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,710,711,712,713,714,715,716,717,719,720,721,722,723,724,725,728,729,730,731,732,733,734,735,736,738,740,741,742,743,745,746,747,748,749,750,751,752,753,755,756,757,758,759,760,761,762,764,765,766,767,768,769,770,771,772,774,776,777,778,779,780,781,782,783,784,785,786,787,788,790,791,792,793,794,795,796,797,798,799,801,802,803,804,805,806,807,808,809,810,811,812,813,814,815,816,817,818,819,821,822,823,824,825,826,827,828,829,830,831,832,833,834,835,836,837,838,839,840,841,842,843,844,845,846,847,848,849,850,851,852,853,854,856,857,858,859,860,861,862,863,865,866,867,868,869,870,871,872,873,874,875,876,877,879,880,881,883,885,886,889,890,891,893,894,895,896,897,899,900,902,903,905,906,907,908,909,910,911,913,914,915,916,918,919,920,921,922,923,925,926,928,929,930,931,932,933,934,935,936,937,938,939,940,941,942,943,944,945,946,947,948,949,950,951,952,953,954,956,957,958,959,960,961,962,963,964,965,966,967,968,970,971,972,973,974,976,977,978,979,980,981,982,983,984,985,986,987,989,990,991,992,993,995,997,998,999,1001,1002,1003,1004,1005,1006,1007,1009,1010,1011,1012,1013,1014,1015,1016,1017,1018,1019,1020,1021,1022,1023,1025,1026,1027,1028,1029,1030,1031,1032,1034,1035,1036,1037,1038,1039,1040,1041,1043,1044,1045,1046,1047,1048,1050,1051,1052,1053,1054,1055,1056,1057,1058,1059,1061,1062,1064,1065,1066,1067,1068,1070,1071,1072,1074,1075,1076,1077,1078,1079,1080,1081,1083,1084,1085,1086,1087,1088,1089,1090,1091,1092,1093,1094,1095,1096,1097,1098,1099,1100,1101,1102,1103,1104,1105,1106,1107,1109,1110,1112,1113,1114,1115,1117,1118,1119,1120,1121,1122,1123,1124,1125,1126,1127,1128,1129,1130,1132,1133,1135,1136,1137,1138,1139,1140,1141,1142,1143,1144,1146,1147,1148,1149,1150,1151,1152,1153,1154,1155,1156,1157,1159,1161,1162,1163,1165,1166,1169,1170,1171,1172,1173,1174,1176,1177,1179,1180,1181,1183,1184,1185,1186,1188,1189,1190,1191,1193,1194,1195,1196,1197,1198,1200,1201,1203,1204,1205,1206,1207,1208,1209,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220,1221,1222,1223,1224,1225,1226,1227,1228,1229,1230,1231,1234,1235,1236,1237,1238,1241,1242,1243,1245,1246,1247,1248,1250,1251,1252,1253,1254,1255,1256,1257,1258,1260,1261,1262,1263,1264,1265,1266,1267,1268,1269,1270,1271,1272,1274,1275,1276,1277,1278,1279,1280,1281,1282,1283,1285,1286,1288,1289,1290,1291,1292,1293,1294,1296,1297,1299,1300,1301,1302,1303,1304,1305,1306,1307,1308,1309,1310,1311,1312,1313,1314,1315,1316,1317,1318,1319,1320,1321,1322,1323,1324,1325,1326,1327,1328,1329,1330,1331,1332,1333,1334,1335,1336,1337,1338,1339,1340,1341,1342,1343,1344,1345,1346,1347,1348,1349,1350,1351,1352,1354,1355,1356,1357,1361,1362,1364,1365,1366,1367,1368,1370,1371,1372,1373,1374,1375,1376,1377,1379,1381,1382,1383,1384,1385,1387,1388,1389,1390,1391,1392,1393,1394,1395,1396,1397,1400,1401,1402,1405,1406,1408,1409,1410,1411,1412,1413,1414,1415,1416,1417,1418,1419,1420,1421,1422,1424,1425,1426,1427,1428,1429,1430,1431,1432,1433,1434,1435,1437,1438,1440,1441,1442,1443,1444,1445,1447,1448,1449,1450,1451,1452,1454,1456,1457,1458,1459,1460,1461,1462,1463,1464,1465,1466,1467,1468,1469,1470,1471,1472,1473,1474,1475,1477,1479,1480,1481,1482,1483,1484,1485,1486,1487,1488,1489,1490,1491,1494,1495,1496,1497,1498,1499,1500,1501,1503,1504,1505,1506,1507,1508,1509,1511,1512,1513,1514,1515,1516,1517,1518,1519,1520,1521,1522,1524,1525,1526,1527,1528,1529,1530,1531,1532,1534,1535,1536,1537,1538,1539,1540,1541,1542,1543,1544,1545,1546,1547,1548,1549,1550,1551,1552,1553,1554,1555,1556,1557,1558,1559,1560,1561,1563,1564,1565,1566,1567,1568,1569,1570,1571,1572,1573,1574,1575,1576,1578,1579,1582,1583,1585,1586,1587,1589,1590,1591,1592,1593,1594,1595,1596,1597,1599,1600,1601,1602,1603,1604,1605,1606,1607,1608,1609,1610,1611,1612,1614,1615,1616,1617,1618,1619,1620,1621,1623,1624,1625,1626,1627,1629,1630,1631,1632,1633,1634,1635,1636,1637,1638,1640,1641,1642,1643,1644,1645,1646,1647,1648];
let targets_logs = {};

let print_reals = [];
let print_static_grids = [];
let print_adaptive_grids = [];

let excel_logs1 = [];
let excel_logs2 = [];


let static_grid_infos = {}; // 그리드별 
let adaptive_grid_infos = {};


let user_obj_ary = _.groupBy(log_ary, 'object_id');
for (let user_id in user_obj_ary) {

  if (!target_ids.includes(parseInt(user_id, 10))) {
    continue;
  }
  let arr = user_obj_ary[user_id];
  
  targets_logs[user_id] = JSON.parse(JSON.stringify(arr));

}
// console.log(Object.keys(targets_logs))
for (let target_id in targets_logs) {

  let target_logs = targets_logs[target_id];
  let user_static_ids = [];
  let camera_screen_ary = [];
  for (let i = 0; i < video_y; i++) {
    let ys = [];
    for (let j = 0; j < video_x; j++) {
      ys.push({ real: 0, static: 0, adaptive: 0 });
    }
    camera_screen_ary.push(ys);
  }


  let up_cnt = 0; // 사이즈가 grid 크기 보다 큰 경우
  let down_cnt = 0;
  let up_grids = [];
  let down_grids = [];
  // console.log(`camera_screen_ary y : ${camera_screen_ary.length}, x: ${camera_screen_ary[0].length}`)
  for (let i = 0; i < target_logs.length; i++) {

    ///////////////////////////// 실제 좌표 ////////////////////////////

    let dup_static_ids = [];
    // console.log(`${target_logs[i].y} ${target_logs[i].x}`);
    let obj_y = target_logs[i].y;
    let obj_x = target_logs[i].x;
    let width = target_logs[i].width;
    let height = target_logs[i].height;
    let start_x = Math.floor(obj_x - (width / 2));
    let end_x = Math.floor(obj_x + (width / 2));
    let start_y = Math.floor(obj_y - (height / 2));
    let end_y = Math.floor(obj_y + (height / 2));

    if (start_x < 0) {
      // console.log(`x: ${start_x} -> 0`)
      start_x = 1;
    }
    if (end_x >= video_x) {
      // console.log(`x: ${end_x} -> 539`)
      end_x = video_x - 1;

    }
    if (start_y < 0) {
      // console.log(`y: ${start_y} -> 0`)
      start_y = 1;

    }
    if (end_y >= video_y) {
      // console.log(`y: ${end_y} -> 539`)
      end_y = video_y - 1;
    }


    ///////////////////////////// 고정 그리드 /////////////////////////

    let s_id = target_logs[i].static_id
    if (!user_static_ids.includes(s_id)) {
      user_static_ids.push(s_id);
    }


    for (let y = start_y; y < end_y; y++) {
      for (let x = start_x; x < end_x; x++) {
        camera_screen_ary[y][x].real = 1;
      }
    }
  }
  // console.log(`up cnt: ${up_cnt}[${up_grids}], down cnt: ${down_cnt}[${down_grids}]`);

  for (let i = 0; i < user_static_ids.length; i++) {

    let y_id = -1;
    let x_id = -1;
    if (user_static_ids[i].length === 3) {
      let splits = user_static_ids[i].split('0');
      x_id = parseInt(splits[0], 10);
      y_id = parseInt(splits[1], 10);
    } else {
      let splits = user_static_ids[i].split('0');

      x_id = 10;
      y_id = parseInt(splits[2], 10);
    }




    let start_x = (x_id - 1) * static_video_x;
    let start_y = (y_id) * static_video_y;
    for (let y = start_y; y < start_y + static_video_y; y++) {
      for (let x = start_x; x < start_x + static_video_x; x++) {
        camera_screen_ary[y][x].static = 1;
      }
    }
    if (target_id === print_target_id) {
      let obj = { x: start_x, y: start_y, w: static_video_x, h: static_video_y}
      print_static_grids.push(obj)
    }

    // console.log(`${user_static_ids[i]} start_x : ${start_x}, end_x : ${start_x + static_video_x} start_y : ${start_y}, end_y : ${start_y + static_video_y}`);

  }
  // console.log(`${target_id} static logs : ${print_static_grids}`)



  ///////////////////////////// 고정 영역 id 발급 /////////////////////////////

  let arr = targets_logs[target_id];

  arr.sort(function (a, b) {
    return a.timestamp - b.timestamp
  })


  let user_area_logs = _.groupBy(arr, 'area_id');
  let user_area_result = {};

  for (let area_id in user_area_logs) {
    let area_arr = user_area_logs[area_id];
    let sizes = [];
    for (let a = 0 ; a < area_arr.length ; a ++) {
      sizes.push(area_arr[a].size);
    }


    let area_is = target_split[area_id];

    if (area_is === 1) {
      user_area_result[area_id] = -1;
    } else if (area_is === 2) {

      let user_mean = mathjs.mean(sizes);
      if (user_mean > area_median_result[area_id]) {
        // 크면 
        user_area_result[area_id] = 1;
      } else {
        user_area_result[area_id] = 0;
      }
    }

  }





  let user_adaptive_grids = [];

  for (let j = 1; j < arr.length; j++) {

    if (arr[j].x === arr[j - 1].x || arr[j].y === arr[j - 1].y) {
      continue;
    }

    let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;

    let mean_x = (arr[j].x + arr[j - 1].x) / 2;
    let mean_y = (arr[j].y + arr[j - 1].y) / 2;

    let mean_width = (arr[j].width + arr[j-1].width) / 2;
    let mean_height = (arr[j].height + arr[j-1].height) / 2;

    if (target_id === print_target_id) {
      
      let obj = { x: mean_x - mean_width/2, y: mean_y - mean_height/2 , w: mean_width, h: mean_height };
      print_reals.push(obj)
    }



    ////////////////////////    고정 그리드의  그리드별 오차율을 구하기 위한         //////////////////// 
    let s_id = funcSet.getStaticGridId(video_x, video_y, mean_x, mean_y)
    let s = -1;
    if (arr[j].size <= static_grid_size) {
      s = 1 - arr[j].size / static_grid_size
      // static_small += 1;
    } else {
      // static_big += 1;
      s = 1 - static_grid_size / arr[j].size
    }
    if (!static_grid_infos[s_id]) {
      static_grid_infos[s_id] = [s]
    } else {
      static_grid_infos[s_id].push(s);
    }


    
    let u_area_result = user_area_result[arr[j].area_id]

    let r = -1;
    let g_info = null;
    let g_size = -1;
    // console.log(`${arr[j].area_id} - ${u_area_result}`)
    if (u_area_result === 1) {
      // big
      r = funcSet.getGridId(mean_x, mean_y, grid_result_big)
      g_info = funcSet.getTargetGridInfo(arr[j].area_id, grid_result_big);
      g_size = funcSet.getGridSizeKey(r, grid_result_big);




    } else if (u_area_result === 0) {
      // small
      r = funcSet.getGridId(mean_x, mean_y, grid_result_small);
      g_info = funcSet.getTargetGridInfo(arr[j].area_id, grid_result_small);
      g_size = funcSet.getGridSizeKey(r, grid_result_small);

    } else if (u_area_result === -1) {
      // 중립
      r = funcSet.getGridId(mean_x, mean_y, grid_result_intersect);
      g_info = funcSet.getTargetGridInfo(arr[j].area_id, grid_result_intersect);
      g_size = funcSet.getGridSizeKey(r, grid_result_intersect);

    }
   
 

    

    if (r == -1 || g_size === -1 || g_size === undefined) {

    } else {
      // console.log(`gsize: ${JSON.stringify(g_size)}`)
      // console.log('grid math success')
      // user_adaptives.push(r);

      user_adaptive_grids.push(g_size);

      let adaptive_grid_size = g_size.grid_size;


      let s0 = -1;
      if (arr[j].size <= adaptive_grid_size) {
        s0 = 1 - arr[j].size / adaptive_grid_size;
        // adaptive_big_small += 1;
      } else {
        s0 = 1 - adaptive_grid_size / arr[j].size;
        // adaptive_big_big += 1;
      }
      if (!adaptive_grid_infos[r]) {
        adaptive_grid_infos[r] = [s0];
      } else {
        adaptive_grid_infos[r].push(s0);
      } 

    
    }
  }
  // console.log(`${target_id} adaptive: ${JSON.stringify(user_adaptive_grids)}`);


  let ccc = 0;
  let dup_ids = [];
  for (let g = 0; g < user_adaptive_grids.length; g++) {
    // console.log(user_adaptive_grids[g].id)
    
    if (dup_ids.includes(user_adaptive_grids[g].id)) {
      continue;
    } else {
      dup_ids.push(user_adaptive_grids[g].id);
  

    }
    let a_start_x = Math.floor(user_adaptive_grids[g].x);
    let a_width = Math.floor(user_adaptive_grids[g].w);
    let a_start_y = Math.floor(user_adaptive_grids[g].y);
    let a_height = Math.floor(user_adaptive_grids[g].h);
    // console.log(`adaptive id[${user_adaptive_grids[g].id}] ${a_start_x}~${a_start_x + a_width}, ${a_start_y}~${a_start_y+a_height}`);
    for (let ay = a_start_y; ay < a_start_y + a_height; ay++) {
      for (let ax = a_start_x; ax < a_start_x + a_width; ax++) {
        camera_screen_ary[ay][ax].adaptive = 1;
        ccc += 1;
      }
    }

  }


  // real 수 세기
  let real_cnt = 0;
  let only_static_cnt = 0;
  let only_adaptive_cnt = 0;
  let only_static_real_cnt = 0;
  let only_adaptive_real_cnt = 0;
  let static_intersect_cnt = 0;
  let adaptive_intersect_cnt = 0;

  let static_sum_cnt = 0;
  let adaptive_sum_cnt = 0;

  for (let i = 0; i < video_y; i++) {
    for (let j = 0; j < video_x; j++) {

      if (camera_screen_ary[i][j].real === 1) {
        real_cnt += 1;
      }
      if (camera_screen_ary[i][j].real === 1 || camera_screen_ary[i][j].static === 1) {
        static_sum_cnt++;
      }
      if (camera_screen_ary[i][j].real === 1 && camera_screen_ary[i][j].static === 1) {
        static_intersect_cnt += 1;
      } else if (camera_screen_ary[i][j].static === 1) {
        only_static_cnt += 1;
      } else if (camera_screen_ary[i][j].real === 1) {
        only_static_real_cnt += 1;
      }
    }
  }
  // console.log(`target ${target_id} include grids : ${user_static_ids}`)
  let s0 = `static\t${target_id}\t${static_sum_cnt/(video_y*video_x)}\t${real_cnt / (video_x * video_y)}\t${static_intersect_cnt / (video_y * video_x)}\t${only_static_real_cnt / (video_y * video_x)}\t${only_static_cnt / (video_y * video_x)}`;
  // console.log(s0);
  excel_logs1.push(s0);

  for (let i = 0; i < video_y; i++) {
    for (let j = 0; j < video_x; j++) {

      // if (camera_screen_ary[i][j].real === 1) {
      //   real_cnt += 1;
      // }
      if (camera_screen_ary[i][j].real === 1 || camera_screen_ary[i][j].adaptive === 1) {
        adaptive_sum_cnt++;
      }

      if (camera_screen_ary[i][j].real === 1 && camera_screen_ary[i][j].adaptive === 1) {
        adaptive_intersect_cnt += 1;
      } else if (camera_screen_ary[i][j].adaptive === 1) {
        only_adaptive_cnt += 1;
      } else if (camera_screen_ary[i][j].real === 1) {
        only_adaptive_real_cnt += 1;
      }
    }
  }


  let s1 = `adaptive\t${target_id}\t${adaptive_sum_cnt/(video_y*video_x)}\t${real_cnt / (video_x * video_y)}\t${adaptive_intersect_cnt / (video_y * video_x)}\t${only_adaptive_real_cnt / (video_y * video_x)}\t${only_adaptive_cnt / (video_y * video_x)}`;

  excel_logs2.push(s1);


}
for (let r in adaptive_grid_infos) {
  let str = `${r}\t${adaptive_grid_infos[r].length}\t${mathjs.mean(adaptive_grid_infos[r])}`;
  fs.appendFileSync(`./grid_description/${file_name}_${split_m}_adaptive_grid.txt`, `${str}\n`)
}

for (let r in static_grid_infos) {
  let str = `${r}\t${static_grid_infos[r].length}\t${mathjs.mean(static_grid_infos[r])}`;

  fs.appendFileSync(`./grid_description/${file_name}_${split_m}_static_grid.txt`, `${str}\n`)

}
for (let i = 0 ; i < excel_logs1.length ; i ++) {
  fs.appendFileSync(`./grid_description/${file_name}_${split_m}.txt`, `${excel_logs1[i]}\n`)
}
for (let i = 0 ; i < excel_logs2.length ; i ++) {
  fs.appendFileSync(`./grid_description/${file_name}_${split_m}.txt`, `${excel_logs2[i]}\n`)
}

// for (let i = 0 ; i < print_adaptive_grids.length ; i ++) {
//   fs.appendFileSync(`./grid_description/${file_name}_adaptive.txt`, `${JSON.stringify(print_adaptive_grids[i])},\n`)
// }
// for (let i = 0 ; i < print_reals.length ; i ++) {
//   fs.appendFileSync(`./grid_description/${file_name}_reals.txt`, `${JSON.stringify(print_reals[i])},\n`)
// }
// for (let i = 0 ; i < print_static_grids.length ; i ++) {
//   fs.appendFileSync(`./grid_description/${file_name}_statics.txt`, `${JSON.stringify(print_static_grids[i])},\n`)
// }
