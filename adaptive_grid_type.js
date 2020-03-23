const fs = require('fs');
const _ = require('lodash');
const mathjs = require('mathjs')
const file_name = '4801_down'
// const lines = fs.readFileSync(`./0303_type/${file_name}.txt`).toString().split('\n');
const lines = fs.readFileSync(`./grid_raw_logs/${file_name}.txt`).toString().split('\n');

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

let object_type = '20'; // 20차량, 100 사람
let std_result = [];
let grid_result = {};
let first_ary = [];
let error_cnt = 0;
let not_obj = 0;

let area_size_ary = { '00': [], '01': [], '10': [], '11': [] }; // 부분영역별 사이즈를 통한 에러필터링 하기 위한 

let entry_grid = {};
let exit_grid = {};
let exit_grid_count = 0;
let entry_grid_count = 0;
let exit_grid_error = 0;
let entry_grid_error = 0;

let clustered = false ;
let cluster_ids =[1,2,3,11,12,13,15,16,17,18,20,21,24,28,29,31,32,33,34,38,39,41,42,44,48,49,51,53,54,55,57,58,59,60,61,62,64,65,66,67,69,70,71,72,74,75,78,79,80,81,82,85,86,87,88,89,90,91,92,93,94,95,96,98,99,100,101,102,103,105,106,107,108,109,110,111,112,113,114,119,120,121,123,124,126,127,128,129,130,132,134,135,137,139,140,141,142,145,146,148,149,151,152,153,154,157,160,162,163,164,165,166,170,171,172,173,174,177,178,179,188,192,193,194,196,198,199,201,203,204,206,207,208,211,213,214,215,219,221,223,224,225,228,229,230,231,234,235,239,243,244,245,247,249,250,251,253,255,256,257,258,259,260,261,262,263,264,265,267,268,269,270,271,277,278,280,281,283,284,287,288,289,290,291,294,295,296,298,299,300,301,302,304,305,306,307,313,314,315,317,319,321,322,323,324,325,326,327,329,330,331,332,333,335,336,337,338,339,340,341,342,344,345,346,348,349,350,351,352,353,354,356,357,359,360,363,364,365,366,369,372,374,375,377,378,379,381,383,384,391,392,394,396,397,399,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,432,433,434,435,436,437,438,439,442,443,444,445,446,448,450,453,454,455,456,457,458,459,460,461,465,466,467,468,469,472,474,476,477,478,479,480,481,482,483,485,486,487,488,489,491,492,493,494,495,497,498,499,500,501,502,503,505,508,509,511,512,513,514,515,516,517,519,520,521,522,524,525,526,528,530,532,533,536,538,541,544,546,551,553,554,559,560,561,562,563,568,571,572,574,575,576,581,585,586,587,589,590,592,593,596,597,600,602,603,605,606,607,609,610,612,614,617,618,619,620,621,623,624,625,630,631,632,633,634,637,639,640,643,646,647,649,654,655,658,660,662,663,664,666,667,668,669,672,673,674,675,676,677,679,683,685,687,689,692,693,696,697,698,701,703,705,706,707,709,711,715,720,721,725,727,728,730,731,734,736,738,739,740,741,744,745,746,747,748,750,752,755,756,757,758,759,760,761,762,763,764,765,766,767,768,769,770,771,772,773,775,776,777,778,779,780,781,782,783,785,786,787,788,789,791,792,795,796,797,800,801,802,803,804,805,806,807,808,809,810,811,812,815,816,818,819,820,821,822,823,824,826,828,829,830,831,832,833,834,835,836,837,838,839,840,841,842,843,844,845,846,847,848,849,850,851,852,853,855,859,860,862,863,864,866,868,869,870,871,872,873,874,876,877,878,879,880,881,884,887,888,889,892,893,894,895,897,901,902,904,905,906,909,911,917,920,921,922,924,925,926,927,929,933,934,935,939,940,944,945,950,951,954,955,963,964,965,967,969,971,973,974,978,979,981,982,983,984,985,987,988,989,990,991,992,995,996,1000,1002,1006,1007,1008,1009,1011,1012,1014,1015,1016,1017,1018,1019,1021,1022,1023,1024,1027,1029,1030,1031,1034,1035,1036,1039,1040,1041,1042,1044,1045,1047,1049,1050,1051,1052,1054,1058,1059,1061,1062,1063,1066,1068,1069,1070,1071,1072,1073,1074,1075,1077,1078,1079,1080,1081,1082,1083,1084,1085,1086,1087,1088,1089,1091,1092,1093,1094,1095,1096,1097,1098,1099,1101,1102,1103,1104,1105,1106,1107,1108,1109,1110,1112,1113,1114,1115,1116,1117,1118,1121,1122,1123,1124,1125,1126,1127,1128,1129,1130,1131,1134,1135,1136,1137,1139,1140,1141,1142,1144,1146,1147,1150,1152,1153,1154,1155,1156,1157,1158,1159,1160,1161,1162,1164,1165,1166,1167,1168,1170,1172,1173,1174,1175,1177,1178,1181,1182,1184,1188,1189,1194,1195,1197,1198,1200,1202,1205,1209,1210,1211,1214,1215,1217,1218,1220,1222,1223,1229,1232,1234,1236,1237,1240,1242,1245,1248,1251,1252,1253,1255,1258,1259,1260,1262,1264,1265,1266,1267,1268,1269,1270,1271,1273,1274,1275,1276,1277,1278,1279,1280,1281,1282,1285,1287,1289,1290,1291,1293,1294,1295,1296,1298,1299,1300,1301,1303,1304,1305,1308,1309,1310,1311,1313,1314,1315,1316,1317,1318,1319,1320,1321,1322,1324,1325,1326,1327,1328,1331,1332,1333,1334,1335,1336,1337,1338,1339,1340,1341,1343,1344,1345,1346,1347,1349,1350,1351,1352,1353,1355,1356,1357,1358,1360,1361,1362,1363,1364,1365,1366,1367,1368,1369,1370,1371,1372,1373,1374,1376,1377,1378,1379,1380,1381,1382,1383,1384,1386,1387,1394,1395,1396,1397,1399,1402,1404,1407,1411,1412,1413,1418,1419,1420,1422,1423,1425,1426,1427,1428,1430,1433,1435,1438,1439,1440,1441,1443,1444,1445,1447,1448,1454,1458,1459,1462,1465,1468,1470,1472,1475,1476,1478,1479,1480,1481,1483,1485,1488,1489,1491,1492,1494,1496,1497,1498,1500,1501,1502,1503,1504,1505,1506,1509,1511,1512,1514,1515,1517,1518,1519,1520,1521,1522,1524,1525,1527,1529,1531,1533,1534,1535,1538,1539,1540,1541,1542,1543,1544,1545,1548,1550,1554,1556,1557,1560,1562,1564,1565,1569,1570,1572,1573,1575,1576,1578,1579,1581,1583,1586,1588,1590,1591,1592,1593,1594,1595,1597,1598,1600,1601,1602,1603,1604,1606,1607,1611,1615,1617,1618,1619,1620,1621,1622,1623,1624,1625,1626,1627,1628,1629,1630,1631,1633,1634,1635,1636,1637,1638,1641,1643,1644,1645,1646,1647,1648,1649,1650,1651,1652,1654,1656,1657,1659,1660,1661,1662,1663,1664,1666,1667,1668,1669,1670,1671,1672,1673,1675,1676,1678,1683,1684,1685,1686,1688,1689,1690,1694,1695,1696,1698,1699,1700,1701,1702,1703,1704,1705,1708,1709,1710,1711,1713,1714,1715,1716,1717,1718,1719,1720,1723,1729,1731,1732,1733,1735,1739,1741,1744,1745,1747,1748,1753,1756,1757,1758,1759,1761,1762,1765,1766,1767,1768,1769,1781,1785,1793,1794,1795,1801,1803,1804,1807,1812,1819,1822,1823,1824,1825,1826,1827,1832,1833,1834,1838,1839,1840,1841,1842,1846,1847,1849,1851,1853,1854,1855,1856,1857,1859,1860,1861,1862,1863,1864,1865,1866,1867,1868,1869,1870,1871,1872,1873,1874,1875,1876,1877,1878,1879,1880,1881,1882,1883,1884,1885,1886,1887,1888,1889,1890,1893,1896,1897,1898,1899,1900,1901,1902,1904,1906,1907,1908,1909,1910,1911,1912,1913,1915,1916,1917,1918,1919,1920,1921,1923,1925,1927,1929,1930,1931,1932,1935,1936,1937,1940,1942,1944,1946,1947,1948,1949,1950,1952,1953,1955,1957,1958,1959,1960,1961,1962,1963,1964,1965,1967,1969,1972,1974,1975,1977,1978,1979,1980,1981,1982,1984,1986,1988,1989,1990,1991,1994,1995,1998,2000,2002,2003,2004,2005,2007,2008,2010,2013,2020,2022,2023,2026,2027,2031,2032,2033,2035,2036,2038,2039,2042,2043,2045,2046,2049,2050,2051,2052,2054,2057,2059,2061,2062,2065,2067,2070,2072,2074,2076,2077,2080,2081,2083,2085,2087,2088,2095,2096,2097,2099,2101,2102,2104,2106,2107,2110,2111,2113,2114,2116,2117,2118,2119,2122,2123,2124,2125,2126,2127,2128,2129,2130,2132,2134,2136,2137,2138,2139,2142,2143,2145,2146,2147,2150,2151,2152,2153,2154,2155,2156,2157,2158,2159,2161,2162,2163,2164,2165,2166,2167,2168,2169,2171,2174,2176,2178,2179,2180,2181,2182,2183,2184,2185,2186,2187,2188,2189,2190,2191,2192,2193,2194,2195,2196,2197,2198,2200,2201,2202,2203,2205,2206,2207,2208,2209,2210,2211,2213,2214,2215,2218,2219]




for (let i = 0; i < lines.length; i++) {
  let cols = lines[i].split('\t');
  // if (cols[3] !== object_type) {
  //   not_obj++;
  //   continue;

  // }
  let o_id = parseInt(cols[2]);
  // if (clustered && !cluster_ids.includes(o_id)) {
  //   continue;
  // }
  let size = parseInt(cols[7]) * parseInt(cols[8]);
  if (!isNaN(size)) {
    let obj = { timestamp: parseInt(cols[1]), x: parseInt(cols[5]), y: parseInt(cols[6]), size, object_id: cols[2] }
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
console.log(`--- first len : ${first_ary.length}`);
console.log(`raw grid result 갯수: ${Object.keys(grid_result).length}`);
// console.log(mathjs.mean(std_ratio_result));
// console.log(mathjs.mean(std_ratio_result2));



// // road - 980 - 540
// for (let key in grid_result) {
//   fs.appendFileSync(`./result/${file_name}_${object_type}_raw_result.txt`, `${JSON.stringify(grid_result[key])},\n`)
// }
function getGridSize(id) {
  return grid_result[id];
}

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
  second_ary.push(first_ary[i]);
  // if (x > 0 && x <= video_x / 2 && y > 0 && y <= video_y / 2) {
  //   //00
  //   if (s > size00mean - size00std) {
  //     second_ary.push(first_ary[i])
  //   }
  // } else if (x > video_x / 2 && y > 0 && y <= video_y) {
  //   // 01
  //   if (s > size01mean - size01std) {
  //     second_ary.push(first_ary[i])
  //   }
  // } else if (x > 0 && x < video_x / 2 && y > video_y / 2) {
  //   // 10
  //   if (s > size10mean - size10std) {
  //     second_ary.push(first_ary[i])
  //   }
  // } else if (x >= video_x / 2 && y > video_y / 2) {
  //   // 11
  //   if (s > size11mean - size11std) {
  //     second_ary.push(first_ary[i])
  //   }
  // } else {
  //   area_error++;
  // }
}
console.log(`area error ${error_cnt}, scond_ary len ${second_ary.length} fist: ${first_ary.length}`);

grid_ary = {};
grid_ary[1] = second_ary;
func(0, 0, video_x, video_y, `1`, second_ary)
console.log(`filtered grid result 갯수: ${Object.keys(grid_result).length}`);

// for (let key in grid_result) {
//   fs.appendFileSync(`./result/${file_name}_${object_type}_fil_result.txt`, `${JSON.stringify(grid_result[key])},\n`)
// }


let grid_velocity_result = {};
let grid_direction_result = {};
for (let key in grid_result) {
  grid_direction_result[key] = []; // 방향 클러스터링 값
  grid_velocity_result[key] = [];  // 속도 클러스터링 값

  entry_grid[key] = 0;
  exit_grid[key] = 0;
}

let mean_x_y_error = 0;
let mean_x_y_success = 0;
let obj_id_sum = 0;
let obj_id_ary = _.groupBy(second_ary, 'object_id');
console.log(`obj ids : ${Object.keys(obj_id_ary).length}`);
let log_avg = [];
let ids = Object.keys(obj_id_ary);
let oo = 0;
for (let i = 0; i < ids.length; i++) {
  obj_id_sum += obj_id_ary[ids[i]].length
  log_avg.push(obj_id_ary[ids[i]].length);
  let arr = obj_id_ary[ids[i]];
  arr.sort(function (a, b) {
    return a.timestamp - b.timestamp
  })

  for (let j = 1; j < arr.length; j++) {


    // if (arr[j].x === arr[j - 1].x && arr[j].y === arr[j - 1].y) {
    //   continue;
    // }
    let velocity = Math.sqrt( Math.pow(arr[j].y - arr[j-1].y, 2) + Math.pow(arr[j].x - arr[j-1].x, 2)) / ( arr[j] .timestamp - arr[j-1].timestamp ) * 100;
    // console.log(velocity);

    let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;

    let mean_x = (arr[j].x + arr[j - 1].x) / 2;
    let mean_y = (arr[j].y + arr[j - 1].y) / 2;
    // let mean_x = arr[j-1].x;
    // let mean_y = arr[j-1].y;
    let r = getGridId(mean_x, mean_y);

    if (j === 1 && r !== -1) {
      entry_grid[r] += 1;
      entry_grid_count += 1;
    } else if (j === 1 && r === -1) {
      entry_grid_error += 1;
    }

    if (j === arr.length - 1 && r !== -1) {
      exit_grid[r] += 1;
      exit_grid_count += 1;
    } else if (j == arr.length === -1 && r === -1) {
      exit_grid_error += 1;
    }

    if (r === -1) {
      mean_x_y_error++;
    } else {
      mean_x_y_success++;
      grid_direction_result[r].push(direction);
      grid_velocity_result[r].push(velocity);
    }


    // console.log(`${arr[j].timestamp} ${arr[j].object_id} (${r}) - ${direction}`);

  }
}

////////////////////////////////////////////// 유저별 grid trace 결과 저장 //////////////////////////////////////////////////////
let gr_lens = [];
let user_obj_result = {};
for (let i = 0; i < ids.length; i++) {
  let arr = obj_id_ary[ids[i]];
  // console.log(JSON.stringify(arr));
  arr.sort(function (a, b) {
    return a.timestamp - b.timestamp
  })
  if (arr.length <= 1) {
    continue;
  }
  let grs = [];
  let user_traces = [];
  for (let j = 1; j < arr.length; j++) {
    if (arr[j].x === arr[j - 1].x && arr[j].y === arr[j - 1].y) {
      continue;
    }
    let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
    direction = (direction + 360) % 360;

    let mean_x = (arr[j].x + arr[j - 1].x) / 2;
    let mean_y = (arr[j].y + arr[j - 1].y) / 2;
    let r = getGridId(mean_x, mean_y);
    let grid_info = getGridSize(r);
    if (r === -1) {
      continue;
    }
    let trace_obj = { grid_id: r, grid_info };
    grs.push(r);
    user_traces.push(trace_obj);
  }
  let grs_dup_removed = [... new Set(grs)];
  if (grs_dup_removed.length > 0) {
    fs.appendFileSync(`./result/${file_name}_${object_type}_user_grid_traces.txt`, `${grs_dup_removed.join(',')}\t${ids[i]}\n`);
    gr_lens.push(grs_dup_removed.length);

  }

  user_obj_result[ids[i]] = user_traces;
}
for (let i = 0; i < ids.length; i++) {
  let res = user_obj_result[ids[i]];
  if (res) {
    // fs.appendFileSync(`./result/${file_name}_${object_type}_user_trace_result.txt`, `{ ${ids[i]} :${JSON.stringify(res)}}\n`);

  } else {
    // fs.appendFileSync(`./result/${file_name}_${object_type}_user_trace_result.txt`, `{ ${ids[i]} : []}\n`);

  }
}
console.log(`grid transaction mean len : ${mathjs.mean(gr_lens)}`);
console.log(`grid transaction std len : ${mathjs.std(gr_lens)}`);

/////////////////////////////////////////////////////////////////////  velocity,  direction, entry  통계값 저장  ///////////////////////////////////////////////////////////////////////////////

///////////////

console.log('---------------')
console.log(`제자리 obj : ${oo}`);
console.log(`total obj transaction sum : ${obj_id_sum}`);
console.log(mean_x_y_error);
console.log(mean_x_y_success);
let log_sum = 0;
let dir_sum = 0;
for (let key in grid_direction_result) {

  log_sum += grid_result[key].count;
  dir_sum += grid_direction_result[key].length

  if (grid_direction_result[key].length === 0) {
    // console.log(`${key}(0)`);
    grid_result[key]['direction_mean'] = 0
    grid_result[key]['direction_std'] = 0
    grid_result[key]['direction_count'] = grid_direction_result[key].length;
    grid_result[key]['entry_count'] = entry_grid[key];
    grid_result[key]['exit_count'] = exit_grid[key];
    grid_result[key]['velocity_mean'] = 0;
    grid_result[key]['velocity_std'] = 0;
    grid_result[key]['veocity_count'] = grid_velocity_result[key].length;
    grid_result[key]['grid_id'] = key

  } else {
    grid_result[key]['direction_mean'] = mathjs.mean(grid_direction_result[key]);
    grid_result[key]['direction_std'] = mathjs.std(grid_direction_result[key]);
    grid_result[key]['direction_count'] = grid_direction_result[key].length;
    grid_result[key]['entry_count'] = entry_grid[key];
    grid_result[key]['exit_count'] = exit_grid[key];
    grid_result[key]['velocity_mean'] = mathjs.mean(grid_velocity_result[key])
    grid_result[key]['velocity_std'] = mathjs.std(grid_velocity_result[key]);
    grid_result[key]['veocity_count'] = grid_velocity_result[key].length;
    grid_result[key]['grid_id'] = key

  }
  if (clustered) {
    fs.appendFileSync(`./result/${file_name}_${object_type}_fill_direction_clustered2_result.txt`, `${JSON.stringify(grid_result[key])},\n`)

  } else {
    fs.appendFileSync(`./result/${file_name}_${object_type}_fill_direction_result.txt`, `${JSON.stringify(grid_result[key])},\n`)

  }

}

//// 해당 id 들의 트랜잭션 집합값




console.log(`entry count : ${entry_grid_count}/${entry_grid_error}, exit count : ${exit_grid_count}/${exit_grid_error}`);
console.log(`log sum : ${log_sum}, dir sum: ${dir_sum}`);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////// 해당 id 그리드 통계 /////////////////////////////////////////////////////////


// let include_ids = ["57","352","725","771","777","1344","1550","1619","1620","2096"]
// let specific_obj_grid_result = {};
// for (let i = 0; i < ids.length; i++) {


//   if (!include_ids.includes(ids[i])) {
//     continue;
//   }

//   let arr = obj_id_ary[ids[i]];
//   arr.sort(function (a, b) {
//     return a.timestamp - b.timestamp
//   })

//   for (let j = 1; j < arr.length; j++) {


//     if (arr[j].x === arr[j - 1].x && arr[j].y === arr[j - 1].y) {
//       continue;
//     }
//     let direction = Math.atan2(arr[j - 1].y - arr[j].y, arr[j].x - arr[j - 1].x) * 180 / Math.PI;
//     direction = (direction + 360) % 360;

//     let mean_x = (arr[j].x + arr[j - 1].x) / 2;
//     let mean_y = (arr[j].y + arr[j - 1].y) / 2;
//     // let mean_x = arr[j-1].x;
//     // let mean_y = arr[j-1].y;
//     let r = getGridId(mean_x, mean_y);
//     if (r === -1) {
//       continue;
//     }
//     if (!specific_obj_grid_result[r]) {
//       specific_obj_grid_result[r] = [direction];
//     } else {
//       specific_obj_grid_result[r].push(direction);
//     }

//   }
// }
// let all_grid_direction_mean = [];
// let all_grid_direction_std = [];
// let prev_grid_direction_mean = [];
// let prev_grid_direction_std = [];
// for (let key in specific_obj_grid_result) {
//   let grid_info = getGridSize(key)
//   let arr = specific_obj_grid_result[key];
//   let obj = { user_support: include_ids.length, log_support: arr.length, mean: mathjs.mean(arr), std:mathjs.std(arr), grid_info };
//   all_grid_direction_mean.push(mathjs.mean(arr))
//   all_grid_direction_std.push(mathjs.std(arr));
//   prev_grid_direction_mean.push(grid_info.direction_mean);
//   prev_grid_direction_std.push(grid_info.direction_std);
//   console.log(`${key} - ${mathjs.mean(arr)}`);
//   fs.appendFileSync(`./result/${file_name}_${object_type}_specific_user_info.txt`, `'${key}': ${JSON.stringify(obj)},\n`)
// }
// console.log(`all grid mean : ${mathjs.mean(all_grid_direction_mean)}`);
// console.log(`all grid std : ${mathjs.mean(all_grid_direction_std)}`);
// console.log(`prev grid mean : ${mathjs.mean(prev_grid_direction_mean)}`);
// console.log(`prev grid std : ${mathjs.mean(prev_grid_direction_std)}`);



////////////////////////////////////////////////////////// jupyter 시각화용 방향, 속도, 그리드 id /////////////////////////////////////
for (let key in grid_velocity_result) {
  let velocity_arr = grid_velocity_result[key];
  let direction_arr = grid_direction_result[key];
  let result = [];
  if (velocity_arr.length === 0){
    continue;
  }
  // result.push(key);
  result.push(mathjs.mean(velocity_arr));
  // result.push(mathjs.std(velocity_arr));
  // result.push(velocity_arr.length);
  result.push(mathjs.mean(direction_arr));
  // result.push(mathjs.std(direction_arr));
  // result.push(direction_arr.length);
  // fs.appendFileSync(`./result/${file_name}_grid_python_result2.txt`,`${result.join(',')}\n`);
}

//