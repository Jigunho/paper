<template>
  <div id="app" style="width: 1200px; height: 700px;">
    <canvas style="width: 100%; height: 100%; position: absolute; " id="my_canvas"></canvas>
  </div>
</template>

<script>
import { mean, std } from 'mathjs';
import vueFabricWrapper from "vue-fabric-wrapper";

export default {
  name: "App",
  components: {
    // HelloWorld
  },
  mounted: function() {
    var canvas = new fabric.Canvas("my_canvas", {
      width: 1200,
      height: 1200,
      backgroundColor: "white"
    });
    this.canvas = canvas;
    canvas.selection = false; // disable group selection
    let lines = [];
    let grid_count = 0;
    let sizes = [];

    for (let i = 0; i < this.layout.length; i++) {
      let item = this.layout[i];

      let back_ = '';
      let opacity_ = '1'
      let stroke_width_ = 1;
      
      if (item.count < 50) {
        back_ = 'black'
        stroke_width_ = 0;
      } else if (!item.filtered) {
        // back_ = 'black'
        // stroke_width_ = 0;
        // back_ = 'red';
        
      } else {
        grid_count ++;
        sizes.push(parseInt(item.grid_size));
      }
      
      let rect = new fabric.Rect({
        left: item.x,
        top: item.y,
        width: item.w,
        height: item.h,
        stroke: "red",
        strokeWidth: stroke_width_,
        selectable: false,
        fill: back_,
        opacity: opacity_
      });
      lines.push(rect);
      // canvas.add(rect);
    }
    let sum = 0 ;
    for (let i = 0 ; i < sizes.length ; i ++) {
      sum += sizes[i];
    }
    // alert(`${grid_count} mean: ${sum/sizes.length}`);

// https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/park.png
// https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/road.png
// https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/busroad.png
// https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/4800.png
// https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/4801.png
    fabric.Image.fromURL('https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/road.png', function(myImg) {
    //i create an extra var for to change some image properties
      var img1 = myImg.set({ left: 0, top: 0, 
      // width: 360, height: 240
      width: 877, height: 540

      });
      // img1.scaleToWidth(360);
      // img1.scaleToHeight(240);
      canvas.add(img1);
      for (let i = 0 ; i < lines.length ; i ++) {
        canvas.add(lines[i])
      } 
    });



    canvas.renderAll();
  },
  created() {},
  data() {
    return {
      layout: [

{"grid_size":7391.25,"x":0,"y":0,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":109.5,"y":0,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":136.875,"y":0,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":109.5,"y":16.875,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":136.875,"y":16.875,"w":27.375,"h":16.875,"count":788,"key":"1-00-00-01-00-11","obj_size_mean":1100.3984771573605,"obj_size_std":336.63071377457857,"ratio":0.7287118444638264,"filtered":false},
{"grid_size":1847.8125,"x":164.25,"y":0,"w":54.75,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"x":109.5,"y":33.75,"w":54.75,"h":33.75,"count":370,"key":"1-00-00-01-10","obj_size_mean":2623.8054054054055,"obj_size_std":853.5019745536085,"ratio":0.46189858254211863,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1620.4845360824743,"obj_size_std":1353.152495433068,"x":164.25,"y":33.75,"w":54.75,"h":33.75,"count":485,"ratio":0.7322996762025736,"filtered":false},
{"grid_size":7391.25,"x":0,"y":67.5,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":7391.25,"obj_size_mean":3179.1141154903758,"obj_size_std":5330.1615256303585,"x":109.5,"y":67.5,"w":109.5,"h":67.5,"count":2182,"ratio":0.7211448030617769,"filtered":false},
{"grid_size":7391.25,"x":219,"y":0,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":7391.25,"x":328.5,"y":0,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":219,"y":67.5,"w":27.375,"h":16.875,"count":771,"key":"1-00-01-10-00-00","obj_size_mean":657.0220492866407,"obj_size_std":277.99155977368355,"ratio":0.6017743894982496,"filtered":false},
{"grid_size":461.953125,"x":246.375,"y":67.5,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":219,"y":84.375,"w":27.375,"h":16.875,"count":266,"key":"1-00-01-10-00-10","obj_size_mean":891.5075187969925,"obj_size_std":801.795218021016,"ratio":1.7356635871248105,"filtered":false},
{"grid_size":461.953125,"obj_size_mean":352.1475409836066,"obj_size_std":137.61232057762342,"x":246.375,"y":84.375,"w":27.375,"h":16.875,"count":366,"ratio":0.29789239022384234,"filtered":false},
{"grid_size":461.953125,"x":273.75,"y":67.5,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":301.125,"y":67.5,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"obj_size_mean":387.92857142857144,"obj_size_std":408.72296019205146,"x":273.75,"y":84.375,"w":27.375,"h":16.875,"count":42,"ratio":0.8847715018532486,"filtered":false},
{"grid_size":461.953125,"x":301.125,"y":84.375,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1458.8310185185185,"obj_size_std":2317.077648143777,"x":219,"y":101.25,"w":54.75,"h":33.75,"count":432,"ratio":1.2539571239743086,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":936.7207481513701,"obj_size_std":1229.222259140884,"x":273.75,"y":101.25,"w":54.75,"h":33.75,"count":2299,"ratio":0.6652310551751782,"filtered":false},
{"grid_size":7391.25,"x":328.5,"y":67.5,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":7391.25,"x":0,"y":135,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":109.5,"y":135,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":115.48828125,"x":136.875,"y":135,"w":13.6875,"h":8.4375,"count":11,"key":"1-00-10-01-00-01-00","obj_size_mean":45,"obj_size_std":14.45683229480096,"ratio":0.12518008007674772,"filtered":false},
{"grid_size":115.48828125,"obj_size_mean":90.65714285714286,"obj_size_std":57.30000659949806,"x":150.5625,"y":135,"w":13.6875,"h":8.4375,"count":35,"ratio":0.49615429357251833,"filtered":false},
{"grid_size":115.48828125,"x":136.875,"y":143.4375,"w":13.6875,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":115.48828125,"x":150.5625,"y":143.4375,"w":13.6875,"h":8.4375,"count":13,"key":"1-00-10-01-00-01-11","obj_size_mean":187.92307692307693,"obj_size_std":300.62725024479005,"ratio":2.6030974484243616,"filtered":false},
{"grid_size":461.953125,"x":109.5,"y":151.875,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":136.875,"y":151.875,"w":27.375,"h":16.875,"count":253,"key":"1-00-10-01-00-11","obj_size_mean":476.7786561264822,"obj_size_std":265.5759659111029,"ratio":0.574898082811114,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1604.0987654320988,"obj_size_std":1548.5079137027756,"x":164.25,"y":135,"w":54.75,"h":33.75,"count":243,"ratio":0.8380222093436296,"filtered":false},
{"grid_size":461.953125,"x":109.5,"y":168.75,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":136.875,"y":168.75,"w":27.375,"h":16.875,"count":892,"key":"1-00-10-01-10-01","obj_size_mean":560.427130044843,"obj_size_std":381.86659557553014,"ratio":0.8266349439145587,"filtered":false},
{"grid_size":461.953125,"x":109.5,"y":185.625,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":136.875,"y":185.625,"w":27.375,"h":16.875,"count":1373,"key":"1-00-10-01-10-11","obj_size_mean":1035.9555717407138,"obj_size_std":781.9886178596273,"ratio":1.692787807982958,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1351.199152542373,"obj_size_std":991.9392775680661,"x":164.25,"y":168.75,"w":54.75,"h":33.75,"count":236,"ratio":0.5368181444643686,"filtered":false},
{"grid_size":7391.25,"x":0,"y":202.5,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1273.721478307445,"obj_size_std":956.4653542241041,"x":109.5,"y":202.5,"w":54.75,"h":33.75,"count":1867,"ratio":0.5176203506709172,"filtered":false},
{"grid_size":461.953125,"x":164.25,"y":202.5,"w":27.375,"h":16.875,"count":83,"key":"1-00-10-11-01-00","obj_size_mean":897.1927710843373,"obj_size_std":218.65991289690288,"ratio":0.47333788010829647,"filtered":false},
{"grid_size":461.953125,"x":191.625,"y":202.5,"w":27.375,"h":16.875,"count":28,"key":"1-00-10-11-01-01","obj_size_mean":754.75,"obj_size_std":238.80452644757773,"ratio":0.5169453642024344,"filtered":false},
{"grid_size":461.953125,"x":164.25,"y":219.375,"w":27.375,"h":16.875,"count":201,"key":"1-00-10-11-01-10","obj_size_mean":1094.0298507462687,"obj_size_std":766.39940573077,"ratio":1.6590415006517598,"filtered":false},
{"grid_size":461.953125,"x":191.625,"y":219.375,"w":27.375,"h":16.875,"count":33,"key":"1-00-10-11-01-11","obj_size_mean":733.8484848484849,"obj_size_std":248.77024053483083,"ratio":0.538518362733948,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1373.1440064360418,"obj_size_std":1038.3882047608743,"x":109.5,"y":236.25,"w":54.75,"h":33.75,"count":1243,"ratio":0.5619553957779126,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1560.9920106524635,"obj_size_std":965.3373503268622,"x":164.25,"y":236.25,"w":54.75,"h":33.75,"count":751,"ratio":0.5224217015129307,"filtered":false},
{"grid_size":7391.25,"obj_size_mean":4486.4697864607,"obj_size_std":7071.1453597843865,"x":219,"y":135,"w":109.5,"h":67.5,"count":2201,"ratio":0.9566914067017604,"filtered":false},
{"grid_size":461.953125,"obj_size_mean":428.1382113821138,"obj_size_std":250.98564314427009,"x":328.5,"y":135,"w":27.375,"h":16.875,"count":246,"ratio":0.5433140930571042,"filtered":false},
{"grid_size":461.953125,"x":355.875,"y":135,"w":27.375,"h":16.875,"count":11,"key":"1-00-11-01-00-01","obj_size_mean":629.5454545454545,"obj_size_std":10.112997936948632,"ratio":0.021891827091652712,"filtered":false},
{"grid_size":461.953125,"x":328.5,"y":151.875,"w":27.375,"h":16.875,"count":593,"key":"1-00-11-01-00-10","obj_size_mean":653.822934232715,"obj_size_std":511.43562249770866,"ratio":1.1071158410232826,"filtered":false},
{"grid_size":461.953125,"obj_size_mean":323.3181818181818,"obj_size_std":153.79240713769954,"x":355.875,"y":151.875,"w":27.375,"h":16.875,"count":88,"ratio":0.3329177763170225,"filtered":false},
{"grid_size":1847.8125,"x":383.25,"y":135,"w":54.75,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":810.7529985007496,"obj_size_std":1097.4969340024293,"x":328.5,"y":168.75,"w":54.75,"h":33.75,"count":2668,"ratio":0.5939438844592886,"filtered":false},
{"grid_size":461.953125,"obj_size_mean":388.11842105263156,"obj_size_std":188.64258742254813,"x":383.25,"y":168.75,"w":27.375,"h":16.875,"count":76,"ratio":0.40835872129352546,"filtered":false},
{"grid_size":461.953125,"x":410.625,"y":168.75,"w":27.375,"h":16.875,"count":10,"key":"1-00-11-01-11-01","obj_size_mean":1625.9,"obj_size_std":267.2225248323535,"ratio":0.5784624248019828,"filtered":false},
{"grid_size":461.953125,"x":383.25,"y":185.625,"w":27.375,"h":16.875,"count":1132,"key":"1-00-11-01-11-10","obj_size_mean":745.2765017667845,"obj_size_std":591.8727702605547,"ratio":1.2812398882690852,"filtered":false},
{"grid_size":461.953125,"x":410.625,"y":185.625,"w":27.375,"h":16.875,"count":29,"key":"1-00-11-01-11-11","obj_size_mean":654.2758620689655,"obj_size_std":383.55907503200706,"ratio":0.8302986910890733,"filtered":false},
{"grid_size":7391.25,"x":219,"y":202.5,"w":109.5,"h":67.5,"count":676,"key":"1-00-11-10","obj_size_mean":13188.662721893492,"obj_size_std":14485.910540020688,"ratio":1.9598728956564435,"filtered":false},
{"grid_size":7391.25,"obj_size_mean":2482.4880509824748,"obj_size_std":5188.5233797175615,"x":328.5,"y":202.5,"w":109.5,"h":67.5,"count":3766,"ratio":0.7019818541813038,"filtered":false},
{"grid_size":29565,"x":438,"y":0,"w":219,"h":135,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":29565,"x":657,"y":0,"w":219,"h":135,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":7391.25,"x":438,"y":135,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":7391.25,"x":547.5,"y":135,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"obj_size_mean":431.25,"obj_size_std":95.77534477445991,"x":438,"y":202.5,"w":27.375,"h":16.875,"count":4,"ratio":0.20732697668071823,"filtered":false},
{"grid_size":461.953125,"x":465.375,"y":202.5,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":438,"y":219.375,"w":27.375,"h":16.875,"count":378,"key":"1-01-10-10-00-10","obj_size_mean":640.7910052910053,"obj_size_std":503.78429578819384,"ratio":1.0905528473006734,"filtered":false},
{"grid_size":461.953125,"x":465.375,"y":219.375,"w":27.375,"h":16.875,"count":7,"key":"1-01-10-10-00-11","obj_size_mean":617.1428571428571,"obj_size_std":317.21834151019107,"ratio":0.6866894590445536,"filtered":false},
{"grid_size":1847.8125,"x":492.75,"y":202.5,"w":54.75,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1063.1938400678157,"obj_size_std":860.166858578863,"x":438,"y":236.25,"w":54.75,"h":33.75,"count":3539,"ratio":0.46550548747714554,"filtered":false},
{"grid_size":461.953125,"x":492.75,"y":236.25,"w":27.375,"h":16.875,"count":74,"key":"1-01-10-10-11-00","obj_size_mean":554.5675675675676,"obj_size_std":235.4332689727764,"ratio":0.5096475296552576,"filtered":false},
{"grid_size":461.953125,"x":520.125,"y":236.25,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":492.75,"y":253.125,"w":27.375,"h":16.875,"count":671,"key":"1-01-10-10-11-10","obj_size_mean":947.8479880774963,"obj_size_std":803.3045355641204,"ratio":1.7389308397126233,"filtered":false},
{"grid_size":461.953125,"x":520.125,"y":253.125,"w":27.375,"h":16.875,"count":92,"key":"1-01-10-10-11-11","obj_size_mean":616.5,"obj_size_std":176.66728522940988,"ratio":0.38243552358133714,"filtered":false},
{"grid_size":1847.8125,"x":547.5,"y":202.5,"w":54.75,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"x":602.25,"y":202.5,"w":54.75,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":547.5,"y":236.25,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":574.875,"y":236.25,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":547.5,"y":253.125,"w":27.375,"h":16.875,"count":4,"key":"1-01-10-11-10-10","obj_size_mean":485,"obj_size_std":79.06958960308319,"ratio":0.17116366428538218,"filtered":false},
{"grid_size":461.953125,"x":574.875,"y":253.125,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"x":602.25,"y":236.25,"w":54.75,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":7391.25,"x":657,"y":135,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":7391.25,"x":766.5,"y":135,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":7391.25,"x":657,"y":202.5,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"x":766.5,"y":202.5,"w":54.75,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"x":821.25,"y":202.5,"w":54.75,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":766.5,"y":236.25,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":115.48828125,"x":793.875,"y":236.25,"w":13.6875,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":115.48828125,"x":807.5625,"y":236.25,"w":13.6875,"h":8.4375,"count":21,"key":"1-01-11-11-10-01-01","obj_size_mean":227.9047619047619,"obj_size_std":51.01068982272712,"ratio":0.4416958090518567,"filtered":false},
{"grid_size":115.48828125,"x":793.875,"y":244.6875,"w":13.6875,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":115.48828125,"x":807.5625,"y":244.6875,"w":13.6875,"h":8.4375,"count":46,"key":"1-01-11-11-10-01-11","obj_size_mean":129.19565217391303,"obj_size_std":113.43125565052212,"ratio":0.9821884473713398,"filtered":false},
{"grid_size":461.953125,"x":766.5,"y":253.125,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":793.875,"y":253.125,"w":27.375,"h":16.875,"count":30,"key":"1-01-11-11-10-11","obj_size_mean":237.96666666666667,"obj_size_std":54.80654587970645,"ratio":0.11864092461698673,"filtered":false},
{"grid_size":461.953125,"x":821.25,"y":236.25,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":848.625,"y":236.25,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":115.48828125,"x":821.25,"y":253.125,"w":13.6875,"h":8.4375,"count":10,"key":"1-01-11-11-11-10-00","obj_size_mean":403.7,"obj_size_std":4.110960958218892,"ratio":0.03559634721136602,"filtered":false},
{"grid_size":115.48828125,"x":834.9375,"y":253.125,"w":13.6875,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":115.48828125,"x":821.25,"y":261.5625,"w":13.6875,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":115.48828125,"x":834.9375,"y":261.5625,"w":13.6875,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":848.625,"y":253.125,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":7391.25,"x":0,"y":270,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1525.9564356435644,"obj_size_std":1559.9733660740108,"x":109.5,"y":270,"w":54.75,"h":33.75,"count":505,"ratio":0.8442270880157,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1825.7996422182468,"obj_size_std":1566.4741325047462,"x":164.25,"y":270,"w":54.75,"h":33.75,"count":1118,"ratio":0.8477451757170958,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1268.0171428571427,"obj_size_std":1045.3771503743358,"x":109.5,"y":303.75,"w":54.75,"h":33.75,"count":350,"ratio":0.5657376765090266,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1203.2422907488988,"obj_size_std":860.5839309831154,"x":164.25,"y":303.75,"w":54.75,"h":33.75,"count":1135,"ratio":0.46573119890850145,"filtered":false},
{"grid_size":7391.25,"x":0,"y":337.5,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":785.9196428571429,"obj_size_std":1166.3660067385395,"x":109.5,"y":337.5,"w":54.75,"h":33.75,"count":224,"ratio":0.6312144802237994,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1604.603498542274,"obj_size_std":1819.710705813763,"x":164.25,"y":337.5,"w":54.75,"h":33.75,"count":343,"ratio":0.9847918583805246,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1663.5515463917525,"obj_size_std":1296.912986771535,"x":109.5,"y":371.25,"w":54.75,"h":33.75,"count":194,"ratio":0.7018639536054307,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1475.1809523809525,"obj_size_std":1622.003294723916,"x":164.25,"y":371.25,"w":54.75,"h":33.75,"count":105,"ratio":0.8777964727070068,"filtered":false},
{"grid_size":29565,"obj_size_mean":12268.468158347676,"obj_size_std":17756.040213006785,"x":219,"y":270,"w":219,"h":135,"count":1743,"ratio":0.6005763643837911,"filtered":false},
{"grid_size":7391.25,"x":0,"y":405,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"x":109.5,"y":405,"w":54.75,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"x":164.25,"y":405,"w":54.75,"h":33.75,"count":3,"key":"1-10-10-01-01","obj_size_mean":3270.6666666666665,"obj_size_std":536.6351957646212,"ratio":0.29041647665259396,"filtered":false},
{"grid_size":1847.8125,"x":109.5,"y":438.75,"w":54.75,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"x":164.25,"y":438.75,"w":54.75,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":7391.25,"x":0,"y":472.5,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":7391.25,"x":109.5,"y":472.5,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":219,"y":405,"w":27.375,"h":16.875,"count":45,"key":"1-10-11-00-00-00","obj_size_mean":1050.8222222222223,"obj_size_std":441.47260230489803,"ratio":0.9556653660582944,"filtered":false},
{"grid_size":461.953125,"x":246.375,"y":405,"w":27.375,"h":16.875,"count":17,"key":"1-10-11-00-00-01","obj_size_mean":1605.235294117647,"obj_size_std":354.9395246749375,"ratio":0.7683453265413834,"filtered":false},
{"grid_size":461.953125,"x":219,"y":421.875,"w":27.375,"h":16.875,"count":71,"key":"1-10-11-00-00-10","obj_size_mean":679.6619718309859,"obj_size_std":581.4447263660694,"ratio":1.258666074325332,"filtered":false},
{"grid_size":461.953125,"x":246.375,"y":421.875,"w":27.375,"h":16.875,"count":26,"key":"1-10-11-00-00-11","obj_size_mean":1856.2692307692307,"obj_size_std":712.8200085683516,"ratio":1.5430570116142228,"filtered":false},
{"grid_size":1847.8125,"x":273.75,"y":405,"w":54.75,"h":33.75,"count":40,"key":"1-10-11-00-01","obj_size_mean":3005.75,"obj_size_std":1431.9261324237186,"ratio":0.7749304285059867,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1204.2194244604316,"obj_size_std":941.8955034422455,"x":219,"y":438.75,"w":54.75,"h":33.75,"count":278,"ratio":0.5097354322704525,"filtered":false},
{"grid_size":1847.8125,"x":273.75,"y":438.75,"w":54.75,"h":33.75,"count":52,"key":"1-10-11-00-11","obj_size_mean":2913.903846153846,"obj_size_std":1384.8423745458754,"ratio":0.7494496192367328,"filtered":false},
{"grid_size":7391.25,"x":328.5,"y":405,"w":109.5,"h":67.5,"count":229,"key":"1-10-11-01","obj_size_mean":33158.12227074236,"obj_size_std":18706.055972267808,"ratio":2.5308379465270163,"filtered":false},
{"grid_size":461.953125,"x":219,"y":472.5,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":246.375,"y":472.5,"w":27.375,"h":16.875,"count":126,"key":"1-10-11-10-00-01","obj_size_mean":747.3412698412699,"obj_size_std":396.99042129902165,"ratio":0.8593738191489053,"filtered":false},
{"grid_size":461.953125,"x":219,"y":489.375,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":246.375,"y":489.375,"w":27.375,"h":16.875,"count":112,"key":"1-10-11-10-00-11","obj_size_mean":802.1160714285714,"obj_size_std":500.05916308595835,"ratio":1.0824889713343933,"filtered":false},
{"grid_size":1847.8125,"x":273.75,"y":472.5,"w":54.75,"h":33.75,"count":60,"key":"1-10-11-10-01","obj_size_mean":2262.3333333333335,"obj_size_std":1435.5004048865253,"ratio":0.7768647548853173,"filtered":false},
{"grid_size":461.953125,"x":219,"y":506.25,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":246.375,"y":506.25,"w":27.375,"h":16.875,"count":66,"key":"1-10-11-10-10-01","obj_size_mean":743.0909090909091,"obj_size_std":397.005937846419,"ratio":0.8594074081573081,"filtered":false},
{"grid_size":461.953125,"x":219,"y":523.125,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":246.375,"y":523.125,"w":27.375,"h":16.875,"count":9,"key":"1-10-11-10-10-11","obj_size_mean":680,"obj_size_std":0,"ratio":0,"filtered":false},
{"grid_size":461.953125,"x":273.75,"y":506.25,"w":27.375,"h":16.875,"count":17,"key":"1-10-11-10-11-00","obj_size_mean":751.6470588235294,"obj_size_std":325.03652509688635,"ratio":0.7036136514865796,"filtered":false},
{"grid_size":461.953125,"x":301.125,"y":506.25,"w":27.375,"h":16.875,"count":7,"key":"1-10-11-10-11-01","obj_size_mean":875.1428571428571,"obj_size_std":245.7257472409899,"ratio":0.5319278817325673,"filtered":false},
{"grid_size":461.953125,"x":273.75,"y":523.125,"w":27.375,"h":16.875,"count":5,"key":"1-10-11-10-11-10","obj_size_mean":1261.6,"obj_size_std":254.23768406748832,"ratio":0.5503538569362169,"filtered":false},
{"grid_size":461.953125,"x":301.125,"y":523.125,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":7391.25,"x":328.5,"y":472.5,"w":109.5,"h":67.5,"count":159,"key":"1-10-11-11","obj_size_mean":11280.075471698114,"obj_size_std":18603.875173610486,"ratio":2.517013383881006,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1086.946875,"obj_size_std":765.3738654466192,"x":438,"y":270,"w":54.75,"h":33.75,"count":320,"ratio":0.41420537281061753,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1137.8797208538588,"obj_size_std":864.7042151958648,"x":492.75,"y":270,"w":54.75,"h":33.75,"count":2436,"ratio":0.4679610161722928,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1516.8775510204082,"obj_size_std":1505.6789616609778,"x":438,"y":303.75,"w":54.75,"h":33.75,"count":147,"ratio":0.8148440178107778,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1183.5675675675675,"obj_size_std":766.298566592576,"x":492.75,"y":303.75,"w":54.75,"h":33.75,"count":333,"ratio":0.414705802992769,"filtered":false},
{"grid_size":461.953125,"x":547.5,"y":270,"w":27.375,"h":16.875,"count":127,"key":"1-11-00-01-00-00","obj_size_mean":726.7559055118111,"obj_size_std":290.78644639206345,"ratio":0.6294717594822277,"filtered":false},
{"grid_size":461.953125,"x":574.875,"y":270,"w":27.375,"h":16.875,"count":11,"key":"1-11-00-01-00-01","obj_size_mean":260.45454545454544,"obj_size_std":13.866244166057632,"ratio":0.030016561022414626,"filtered":false},
{"grid_size":461.953125,"x":547.5,"y":286.875,"w":27.375,"h":16.875,"count":726,"key":"1-11-00-01-00-10","obj_size_mean":1150.0881542699724,"obj_size_std":721.458230547689,"ratio":1.561756359041167,"filtered":false},
{"grid_size":461.953125,"x":574.875,"y":286.875,"w":27.375,"h":16.875,"count":96,"key":"1-11-00-01-00-11","obj_size_mean":838.6666666666666,"obj_size_std":596.1199396565597,"ratio":1.2904338284464678,"filtered":false},
{"grid_size":1847.8125,"x":602.25,"y":270,"w":54.75,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1307.8943524829601,"obj_size_std":824.3898817272361,"x":547.5,"y":303.75,"w":54.75,"h":33.75,"count":2054,"ratio":0.4461436870500855,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1275.3692810457517,"obj_size_std":732.3387595126612,"x":602.25,"y":303.75,"w":54.75,"h":33.75,"count":918,"ratio":0.3963274193202293,"filtered":false},
{"grid_size":7391.25,"obj_size_mean":3814.9803921568628,"obj_size_std":3897.2054166553557,"x":438,"y":337.5,"w":109.5,"h":67.5,"count":51,"ratio":0.5272728451419388,"filtered":false},
{"grid_size":461.953125,"x":547.5,"y":337.5,"w":27.375,"h":16.875,"count":53,"key":"1-11-00-11-00-00","obj_size_mean":891.1698113207547,"obj_size_std":542.6904393088856,"ratio":1.1747738243114723,"filtered":false},
{"grid_size":461.953125,"x":574.875,"y":337.5,"w":27.375,"h":16.875,"count":134,"key":"1-11-00-11-00-01","obj_size_mean":1271.7611940298507,"obj_size_std":580.4481828026207,"ratio":1.2565088347494582,"filtered":false},
{"grid_size":461.953125,"x":547.5,"y":354.375,"w":27.375,"h":16.875,"count":23,"key":"1-11-00-11-00-10","obj_size_mean":918.7826086956521,"obj_size_std":822.56499917369,"ratio":1.7806243851552903,"filtered":false},
{"grid_size":461.953125,"x":574.875,"y":354.375,"w":27.375,"h":16.875,"count":22,"key":"1-11-00-11-00-11","obj_size_mean":1683.5454545454545,"obj_size_std":657.2258963156265,"ratio":1.4227112249010687,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1746.2642335766423,"obj_size_std":1299.6804793313622,"x":602.25,"y":337.5,"w":54.75,"h":33.75,"count":2055,"ratio":0.7033616664739318,"filtered":false},
{"grid_size":1847.8125,"x":547.5,"y":371.25,"w":54.75,"h":33.75,"count":6,"key":"1-11-00-11-10","obj_size_mean":2386.3333333333335,"obj_size_std":522.6094781638261,"ratio":0.2828260324918389,"filtered":false},
{"grid_size":1847.8125,"x":602.25,"y":371.25,"w":54.75,"h":33.75,"count":438,"key":"1-11-00-11-11","obj_size_mean":2239.865296803653,"obj_size_std":1756.4414272996262,"ratio":0.9505517617721637,"filtered":false},
{"grid_size":7391.25,"x":657,"y":270,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":7391.25,"x":766.5,"y":270,"w":109.5,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1617.104761904762,"obj_size_std":973.5288615730892,"x":657,"y":337.5,"w":54.75,"h":33.75,"count":840,"ratio":0.5268547872541663,"filtered":false},
{"grid_size":461.953125,"x":711.75,"y":337.5,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":739.125,"y":337.5,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"obj_size_mean":413.25,"obj_size_std":276.49348122747904,"x":711.75,"y":354.375,"w":27.375,"h":16.875,"count":32,"ratio":0.5985314662120297,"filtered":false},
{"grid_size":461.953125,"x":739.125,"y":354.375,"w":27.375,"h":16.875,"count":9,"key":"1-11-01-10-01-11","obj_size_mean":836,"obj_size_std":0,"ratio":0,"filtered":false},
{"grid_size":1847.8125,"x":657,"y":371.25,"w":54.75,"h":33.75,"count":1557,"key":"1-11-01-10-10","obj_size_mean":2066.8664097623637,"obj_size_std":1340.468964625509,"ratio":0.7254355972943732,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1525.5152838427948,"obj_size_std":605.0016557673503,"x":711.75,"y":371.25,"w":54.75,"h":33.75,"count":1145,"ratio":0.3274150682319501,"filtered":false},
{"grid_size":7391.25,"x":766.5,"y":337.5,"w":109.5,"h":67.5,"count":15,"key":"1-11-01-11","obj_size_mean":965.5333333333333,"obj_size_std":245.59602912874945,"ratio":0.033227942381701264,"filtered":false},
{"grid_size":7391.25,"x":438,"y":405,"w":109.5,"h":67.5,"count":77,"key":"1-11-10-00","obj_size_mean":23094.272727272728,"obj_size_std":24616.834230726374,"ratio":3.3305373557553017,"filtered":false},
{"grid_size":7391.25,"x":547.5,"y":405,"w":109.5,"h":67.5,"count":136,"key":"1-11-10-01","obj_size_mean":11312.875,"obj_size_std":15876.328137122659,"ratio":2.1479896008283657,"filtered":false},
{"grid_size":7391.25,"x":438,"y":472.5,"w":109.5,"h":67.5,"count":293,"key":"1-11-10-10","obj_size_mean":12917.767918088737,"obj_size_std":19852.80549480216,"ratio":2.685987552146411,"filtered":false},
{"grid_size":1847.8125,"x":547.5,"y":472.5,"w":54.75,"h":33.75,"count":72,"key":"1-11-10-11-00","obj_size_mean":2209.722222222222,"obj_size_std":1629.1947654361559,"ratio":0.8816883560621848,"filtered":false},
{"grid_size":1847.8125,"x":602.25,"y":472.5,"w":54.75,"h":33.75,"count":91,"key":"1-11-10-11-01","obj_size_mean":2241.3736263736264,"obj_size_std":1449.839183789795,"ratio":0.7846246217025781,"filtered":false},
{"grid_size":1847.8125,"x":547.5,"y":506.25,"w":54.75,"h":33.75,"count":46,"key":"1-11-10-11-10","obj_size_mean":1950.0217391304348,"obj_size_std":1171.670421788775,"ratio":0.6340851259469102,"filtered":false},
{"grid_size":1847.8125,"x":602.25,"y":506.25,"w":54.75,"h":33.75,"count":5,"key":"1-11-10-11-11","obj_size_mean":2147.8,"obj_size_std":345.95837899955535,"ratio":0.18722591117851803,"filtered":false},
{"grid_size":1847.8125,"x":657,"y":405,"w":54.75,"h":33.75,"count":557,"key":"1-11-11-00-00","obj_size_mean":2163.4075403949732,"obj_size_std":1137.5225387033654,"ratio":0.6156049592171097,"filtered":false},
{"grid_size":1847.8125,"x":711.75,"y":405,"w":54.75,"h":33.75,"count":1365,"key":"1-11-11-00-01","obj_size_mean":2133.348717948718,"obj_size_std":1205.5223287237382,"ratio":0.6524051161704655,"filtered":false},
{"grid_size":1847.8125,"x":657,"y":438.75,"w":54.75,"h":33.75,"count":142,"key":"1-11-11-00-10","obj_size_mean":2285.542253521127,"obj_size_std":1945.2186138449288,"ratio":1.0527142845093476,"filtered":false},
{"grid_size":1847.8125,"x":711.75,"y":438.75,"w":54.75,"h":33.75,"count":561,"key":"1-11-11-00-11","obj_size_mean":2182.590017825312,"obj_size_std":1454.0914454099723,"ratio":0.786925862559092,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1650.1098726114649,"obj_size_std":713.4387929975007,"x":766.5,"y":405,"w":54.75,"h":33.75,"count":628,"ratio":0.3860991269392867,"filtered":false},
{"grid_size":1847.8125,"x":821.25,"y":405,"w":54.75,"h":33.75,"count":16,"key":"1-11-11-01-01","obj_size_mean":667.6875,"obj_size_std":553.8214777043833,"ratio":0.2997173564441107,"filtered":false},
{"grid_size":1847.8125,"x":766.5,"y":438.75,"w":54.75,"h":33.75,"count":969,"key":"1-11-11-01-10","obj_size_mean":2066.299277605779,"obj_size_std":1043.533995419691,"ratio":0.5647401970815172,"filtered":false},
{"grid_size":1847.8125,"x":821.25,"y":438.75,"w":54.75,"h":33.75,"count":516,"key":"1-11-11-01-11","obj_size_mean":1887.906976744186,"obj_size_std":678.7544382516963,"ratio":0.3673286322349786,"filtered":false},
{"grid_size":1847.8125,"x":657,"y":472.5,"w":54.75,"h":33.75,"count":132,"key":"1-11-11-10-00","obj_size_mean":2317.628787878788,"obj_size_std":1313.2261678857506,"ratio":0.7106923282994084,"filtered":false},
{"grid_size":1847.8125,"x":711.75,"y":472.5,"w":54.75,"h":33.75,"count":135,"key":"1-11-11-10-01","obj_size_mean":2120.074074074074,"obj_size_std":1171.0119213078997,"ratio":0.6337287583604395,"filtered":false},
{"grid_size":1847.8125,"x":657,"y":506.25,"w":54.75,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":711.75,"y":506.25,"w":27.375,"h":16.875,"count":3,"key":"1-11-11-10-11-00","obj_size_mean":1446.6666666666667,"obj_size_std":42.770706486254504,"ratio":0.09258668070760319,"filtered":false},
{"grid_size":461.953125,"x":739.125,"y":506.25,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":711.75,"y":523.125,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":739.125,"y":523.125,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":1847.8125,"x":766.5,"y":472.5,"w":54.75,"h":33.75,"count":401,"key":"1-11-11-11-00","obj_size_mean":2212.2568578553614,"obj_size_std":1121.2150045192498,"ratio":0.6067796405313037,"filtered":false},
{"grid_size":1847.8125,"x":821.25,"y":472.5,"w":54.75,"h":33.75,"count":603,"key":"1-11-11-11-01","obj_size_mean":1913.8358208955224,"obj_size_std":1035.3394605547696,"ratio":0.5603054750169564,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1165.8955223880596,"obj_size_std":694.2704069812784,"x":766.5,"y":506.25,"w":54.75,"h":33.75,"count":67,"ratio":0.3757255711720093,"filtered":false},
{"grid_size":1847.8125,"x":821.25,"y":506.25,"w":54.75,"h":33.75,"count":219,"key":"1-11-11-11-11","obj_size_mean":1878.1050228310503,"obj_size_std":840.4751020562658,"ratio":0.4548486938237867,"filtered":false},
{"grid_size":461.953125,"x":109.5,"y":67.5,"w":27.375,"h":16.875,"count":15,"key":"1-00-00-11-00-00","obj_size_mean":182.2,"obj_size_std":27.058666422634886,"ratio":0.0585744850684469,"filtered":false},
{"grid_size":461.953125,"x":136.875,"y":67.5,"w":27.375,"h":16.875,"count":18,"key":"1-00-00-11-00-01","obj_size_mean":3014.1666666666665,"obj_size_std":1537.5235340140518,"ratio":3.328310711209177,"filtered":false},
{"grid_size":115.48828125,"x":109.5,"y":84.375,"w":13.6875,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":115.48828125,"x":123.1875,"y":84.375,"w":13.6875,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":115.48828125,"x":109.5,"y":92.8125,"w":13.6875,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":115.48828125,"x":123.1875,"y":92.8125,"w":13.6875,"h":8.4375,"count":75,"key":"1-00-00-11-00-10-11","obj_size_mean":263.6533333333333,"obj_size_std":126.68224702661266,"ratio":1.0969272869546032,"filtered":false},
{"grid_size":461.953125,"x":136.875,"y":84.375,"w":27.375,"h":16.875,"count":214,"key":"1-00-00-11-00-11","obj_size_mean":741.5,"obj_size_std":450.33606387067783,"ratio":0.9748522945281035,"filtered":false},
{"grid_size":1847.8125,"x":164.25,"y":67.5,"w":54.75,"h":33.75,"count":378,"key":"1-00-00-11-01","obj_size_mean":2038.2804232804233,"obj_size_std":1475.4459167484542,"ratio":0.7984824849644941,"filtered":false},
{"grid_size":115.48828125,"x":109.5,"y":101.25,"w":13.6875,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":115.48828125,"x":123.1875,"y":101.25,"w":13.6875,"h":8.4375,"count":335,"key":"1-00-00-11-10-00-01","obj_size_mean":226.68358208955223,"obj_size_std":100.87020265438852,"ratio":0.8734237063934877,"filtered":false},
{"grid_size":115.48828125,"x":109.5,"y":109.6875,"w":13.6875,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":115.48828125,"x":123.1875,"y":109.6875,"w":13.6875,"h":8.4375,"count":20,"key":"1-00-00-11-10-00-11","obj_size_mean":137.65,"obj_size_std":13.354577374147983,"ratio":0.11563577905570382,"filtered":false},
{"grid_size":461.953125,"x":136.875,"y":101.25,"w":27.375,"h":16.875,"count":223,"key":"1-00-00-11-10-01","obj_size_mean":491.5336322869955,"obj_size_std":403.5621763372791,"ratio":0.8735998405407023,"filtered":false},
{"grid_size":461.953125,"x":109.5,"y":118.125,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"obj_size_mean":217.36046511627907,"obj_size_std":332.5255907990417,"x":136.875,"y":118.125,"w":27.375,"h":16.875,"count":86,"ratio":0.7198253952693614,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1450.1472868217054,"obj_size_std":1504.6056793296761,"x":164.25,"y":101.25,"w":54.75,"h":33.75,"count":387,"ratio":0.8142631783959012,"filtered":false},
{"grid_size":461.953125,"x":219,"y":101.25,"w":27.375,"h":16.875,"count":38,"key":"1-00-01-10-10-00","obj_size_mean":1364.078947368421,"obj_size_std":1860.577407929097,"ratio":4.027632474461769,"filtered":false},
{"grid_size":461.953125,"x":246.375,"y":101.25,"w":27.375,"h":16.875,"count":338,"key":"1-00-01-10-10-01","obj_size_mean":684.9940828402367,"obj_size_std":707.8079422067376,"ratio":1.5322072823010724,"filtered":false},
{"grid_size":115.48828125,"x":219,"y":118.125,"w":13.6875,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":115.48828125,"x":232.6875,"y":118.125,"w":13.6875,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":115.48828125,"x":219,"y":126.5625,"w":13.6875,"h":8.4375,"count":3,"key":"1-00-01-10-10-10-10","obj_size_mean":250,"obj_size_std":0,"ratio":0,"filtered":false},
{"grid_size":115.48828125,"x":232.6875,"y":126.5625,"w":13.6875,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":246.375,"y":118.125,"w":27.375,"h":16.875,"count":9,"key":"1-00-01-10-10-11","obj_size_mean":2205.4444444444443,"obj_size_std":826.8760655489903,"ratio":1.789956644516671,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1308.8703703703704,"obj_size_std":1181.0361304251749,"x":219,"y":135,"w":54.75,"h":33.75,"count":54,"ratio":0.6391536643599797,"filtered":false},
{"grid_size":461.953125,"obj_size_mean":320.05426356589146,"obj_size_std":184.98535879890957,"x":273.75,"y":135,"w":27.375,"h":16.875,"count":129,"ratio":0.400441838766454,"filtered":false},
{"grid_size":461.953125,"x":301.125,"y":135,"w":27.375,"h":16.875,"count":794,"key":"1-00-11-00-01-01","obj_size_mean":479.7103274559194,"obj_size_std":249.27103653174967,"ratio":0.539602446745543,"filtered":false},
{"grid_size":461.953125,"x":273.75,"y":151.875,"w":27.375,"h":16.875,"count":28,"key":"1-00-11-00-01-10","obj_size_mean":1525.107142857143,"obj_size_std":1811.1617581047706,"ratio":3.920661340054298,"filtered":false},
{"grid_size":461.953125,"x":301.125,"y":151.875,"w":27.375,"h":16.875,"count":112,"key":"1-00-11-00-01-11","obj_size_mean":882.9375,"obj_size_std":704.7015121906464,"ratio":1.5254827255268517,"filtered":false},
{"grid_size":1847.8125,"x":219,"y":168.75,"w":54.75,"h":33.75,"count":214,"key":"1-00-11-00-10","obj_size_mean":3072.3831775700933,"obj_size_std":614.7360385454625,"ratio":0.3326831258828818,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1292.121951219512,"obj_size_std":1261.2207815272066,"x":273.75,"y":168.75,"w":54.75,"h":33.75,"count":41,"ratio":0.6825480299149435,"filtered":false},
{"grid_size":461.953125,"x":328.5,"y":168.75,"w":27.375,"h":16.875,"count":598,"key":"1-00-11-01-10-00","obj_size_mean":825.5852842809364,"obj_size_std":647.5588189791652,"ratio":1.4017846918541035,"filtered":false},
{"grid_size":461.953125,"x":355.875,"y":168.75,"w":27.375,"h":16.875,"count":1267,"key":"1-00-11-01-10-01","obj_size_mean":624.7719021310181,"obj_size_std":381.1543134315623,"ratio":0.8250930512301703,"filtered":false},
{"grid_size":461.953125,"x":328.5,"y":185.625,"w":27.375,"h":16.875,"count":27,"key":"1-00-11-01-10-10","obj_size_mean":370.037037037037,"obj_size_std":115.06736538001805,"ratio":0.24908883424052614,"filtered":false},
{"grid_size":461.953125,"x":355.875,"y":185.625,"w":27.375,"h":16.875,"count":760,"key":"1-00-11-01-10-11","obj_size_mean":866.3,"obj_size_std":634.7860693861289,"ratio":1.3741352423714612,"filtered":false},
{"grid_size":1847.8125,"x":219,"y":202.5,"w":54.75,"h":33.75,"count":148,"key":"1-00-11-10-00","obj_size_mean":3236.162162162162,"obj_size_std":1306.7609541196202,"ratio":0.7071934810050372,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1690.0526315789473,"obj_size_std":1288.0752233230917,"x":273.75,"y":202.5,"w":54.75,"h":33.75,"count":38,"ratio":0.697081128806679,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1451,"obj_size_std":1252.002626563969,"x":219,"y":236.25,"w":54.75,"h":33.75,"count":53,"ratio":0.677559344665094,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1780.2,"obj_size_std":1203.24734688167,"x":273.75,"y":236.25,"w":54.75,"h":33.75,"count":10,"ratio":0.6511739404737602,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1014.3897058823529,"obj_size_std":1030.1433857247766,"x":328.5,"y":202.5,"w":54.75,"h":33.75,"count":136,"ratio":0.557493460902974,"filtered":false},
{"grid_size":461.953125,"x":383.25,"y":202.5,"w":27.375,"h":16.875,"count":897,"key":"1-00-11-11-01-00","obj_size_mean":1073.964325529543,"obj_size_std":749.3780731338277,"ratio":1.6221950509238956,"filtered":false},
{"grid_size":461.953125,"x":410.625,"y":202.5,"w":27.375,"h":16.875,"count":552,"key":"1-00-11-11-01-01","obj_size_mean":603.2391304347826,"obj_size_std":469.8978157343467,"ratio":1.0171980452223301,"filtered":false},
{"grid_size":461.953125,"x":383.25,"y":219.375,"w":27.375,"h":16.875,"count":244,"key":"1-00-11-11-01-10","obj_size_mean":842.7131147540983,"obj_size_std":465.3520987321038,"ratio":1.007357832533558,"filtered":false},
{"grid_size":461.953125,"x":410.625,"y":219.375,"w":27.375,"h":16.875,"count":1020,"key":"1-00-11-11-01-11","obj_size_mean":938.2107843137255,"obj_size_std":659.1186800776137,"ratio":1.4268085751722401,"filtered":false},
{"grid_size":1847.8125,"x":328.5,"y":236.25,"w":54.75,"h":33.75,"count":24,"key":"1-00-11-11-10","obj_size_mean":3845.2083333333335,"obj_size_std":699.1053897764579,"ratio":0.3783421693361517,"filtered":false},
{"grid_size":461.953125,"x":383.25,"y":236.25,"w":27.375,"h":16.875,"count":19,"key":"1-00-11-11-11-00","obj_size_mean":671.6842105263158,"obj_size_std":264.5751421580516,"ratio":0.5727315778155015,"filtered":false},
{"grid_size":461.953125,"x":410.625,"y":236.25,"w":27.375,"h":16.875,"count":540,"key":"1-00-11-11-11-01","obj_size_mean":1086.7574074074073,"obj_size_std":686.3973048818808,"ratio":1.4858592089443725,"filtered":false},
{"grid_size":461.953125,"x":383.25,"y":253.125,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":410.625,"y":253.125,"w":27.375,"h":16.875,"count":20,"key":"1-00-11-11-11-11","obj_size_mean":740,"obj_size_std":261.3066357648363,"ratio":0.5656561707745484,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1176.9571428571428,"obj_size_std":803.8997780874863,"x":219,"y":270,"w":54.75,"h":33.75,"count":70,"ratio":0.4350548435447245,"filtered":false},
{"grid_size":1847.8125,"x":273.75,"y":270,"w":54.75,"h":33.75,"count":141,"key":"1-10-01-00-01","obj_size_mean":5642.744680851064,"obj_size_std":1136.9804773060443,"ratio":0.6153116061862577,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1370.3592814371257,"obj_size_std":602.1097068266733,"x":219,"y":303.75,"w":54.75,"h":33.75,"count":167,"ratio":0.32585000200327324,"filtered":false},
{"grid_size":1847.8125,"x":273.75,"y":303.75,"w":54.75,"h":33.75,"count":31,"key":"1-10-01-00-11","obj_size_mean":2482.2258064516127,"obj_size_std":2003.9958201832228,"ratio":1.0845233594767991,"filtered":false},
{"grid_size":1847.8125,"x":328.5,"y":270,"w":54.75,"h":33.75,"count":8,"key":"1-10-01-01-00","obj_size_mean":2276.25,"obj_size_std":1610.9022094998284,"ratio":0.8717887824115425,"filtered":false},
{"grid_size":1847.8125,"x":383.25,"y":270,"w":54.75,"h":33.75,"count":38,"key":"1-10-01-01-01","obj_size_mean":2615.7631578947367,"obj_size_std":1920.7011871964535,"ratio":1.039445932526408,"filtered":false},
{"grid_size":1847.8125,"x":328.5,"y":303.75,"w":54.75,"h":33.75,"count":18,"key":"1-10-01-01-10","obj_size_mean":1280,"obj_size_std":1028.2132989974864,"ratio":0.5564489356996375,"filtered":false},
{"grid_size":1847.8125,"x":383.25,"y":303.75,"w":54.75,"h":33.75,"count":12,"key":"1-10-01-01-11","obj_size_mean":1992.25,"obj_size_std":1818.4952383270575,"ratio":0.9841340711392836,"filtered":false},
{"grid_size":461.953125,"x":219,"y":337.5,"w":27.375,"h":16.875,"count":138,"key":"1-10-01-10-00-00","obj_size_mean":982.963768115942,"obj_size_std":430.505227032711,"ratio":0.9319240497241165,"filtered":false},
{"grid_size":461.953125,"x":246.375,"y":337.5,"w":27.375,"h":16.875,"count":32,"key":"1-10-01-10-00-01","obj_size_mean":1672.8125,"obj_size_std":492.56913302241304,"ratio":1.0662751399774881,"filtered":false},
{"grid_size":461.953125,"x":219,"y":354.375,"w":27.375,"h":16.875,"count":136,"key":"1-10-01-10-00-10","obj_size_mean":943.3382352941177,"obj_size_std":406.8377093958872,"ratio":0.8806904583574084,"filtered":false},
{"grid_size":461.953125,"x":246.375,"y":354.375,"w":27.375,"h":16.875,"count":16,"key":"1-10-01-10-00-11","obj_size_mean":1963.5625,"obj_size_std":596.7218189128554,"ratio":1.2917367295931927,"filtered":false},
{"grid_size":1847.8125,"x":273.75,"y":337.5,"w":54.75,"h":33.75,"count":7,"key":"1-10-01-10-01","obj_size_mean":2469.4285714285716,"obj_size_std":1911.3684327502863,"ratio":1.0343952282768334,"filtered":false},
{"grid_size":461.953125,"x":219,"y":371.25,"w":27.375,"h":16.875,"count":100,"key":"1-10-01-10-10-00","obj_size_mean":837.16,"obj_size_std":465.13329728414885,"ratio":1.0068841882694242,"filtered":false},
{"grid_size":461.953125,"x":246.375,"y":371.25,"w":27.375,"h":16.875,"count":6,"key":"1-10-01-10-10-01","obj_size_mean":1669.3333333333333,"obj_size_std":542.9705946611351,"ratio":1.1753802827097124,"filtered":false},
{"grid_size":461.953125,"x":219,"y":388.125,"w":27.375,"h":16.875,"count":55,"key":"1-10-01-10-10-10","obj_size_mean":911.5636363636364,"obj_size_std":589.9122584988999,"ratio":1.2769959257206018,"filtered":false},
{"grid_size":461.953125,"x":246.375,"y":388.125,"w":27.375,"h":16.875,"count":8,"key":"1-10-01-10-10-11","obj_size_mean":1232.875,"obj_size_std":59.06518795848726,"ratio":0.12785969996087213,"filtered":false},
{"grid_size":1847.8125,"x":273.75,"y":371.25,"w":54.75,"h":33.75,"count":35,"key":"1-10-01-10-11","obj_size_mean":2605.9142857142856,"obj_size_std":1344.967687594118,"ratio":0.7278702182143036,"filtered":false},
{"grid_size":1847.8125,"x":328.5,"y":337.5,"w":54.75,"h":33.75,"count":19,"key":"1-10-01-11-00","obj_size_mean":5336.684210526316,"obj_size_std":1526.4726606217785,"ratio":0.8260971611685592,"filtered":false},
{"grid_size":1847.8125,"x":383.25,"y":337.5,"w":54.75,"h":33.75,"count":20,"key":"1-10-01-11-01","obj_size_mean":831.4,"obj_size_std":753.8156552534997,"ratio":0.40795029541877204,"filtered":false},
{"grid_size":1847.8125,"x":328.5,"y":371.25,"w":54.75,"h":33.75,"count":11,"key":"1-10-01-11-10","obj_size_mean":1758.4545454545455,"obj_size_std":528.6101330160752,"ratio":0.2860734695842112,"filtered":false},
{"grid_size":1847.8125,"x":383.25,"y":371.25,"w":54.75,"h":33.75,"count":8,"key":"1-10-01-11-11","obj_size_mean":1905.375,"obj_size_std":372.5935884349825,"ratio":0.2016403658027979,"filtered":false},
{"grid_size":1847.8125,"x":328.5,"y":405,"w":54.75,"h":33.75,"count":3,"key":"1-10-11-01-00","obj_size_mean":2639.3333333333335,"obj_size_std":85.44783984006462,"ratio":0.04624270040389088,"filtered":false},
{"grid_size":1847.8125,"x":383.25,"y":405,"w":54.75,"h":33.75,"count":3,"key":"1-10-11-01-01","obj_size_mean":2628,"obj_size_std":73,"ratio":0.03950617283950617,"filtered":false},
{"grid_size":1847.8125,"x":328.5,"y":438.75,"w":54.75,"h":33.75,"count":18,"key":"1-10-11-01-10","obj_size_mean":3222.1111111111113,"obj_size_std":935.3513268153114,"ratio":0.5061938518195496,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1832.142857142857,"obj_size_std":382.46848609675396,"x":383.25,"y":438.75,"w":54.75,"h":33.75,"count":7,"ratio":0.2069844673616798,"filtered":false},
{"grid_size":1847.8125,"x":328.5,"y":472.5,"w":54.75,"h":33.75,"count":44,"key":"1-10-11-11-00","obj_size_mean":2490.75,"obj_size_std":1642.8445994393312,"ratio":0.8890753793684864,"filtered":false},
{"grid_size":461.953125,"x":383.25,"y":472.5,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":410.625,"y":472.5,"w":27.375,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false},
{"grid_size":461.953125,"x":383.25,"y":489.375,"w":27.375,"h":16.875,"count":5,"key":"1-10-11-11-01-10","obj_size_mean":1147.4,"obj_size_std":557.1707996655963,"ratio":1.2061197760391735,"filtered":false},
{"grid_size":461.953125,"x":410.625,"y":489.375,"w":27.375,"h":16.875,"count":5,"key":"1-10-11-11-01-11","obj_size_mean":1145.8,"obj_size_std":544.1931642349066,"ratio":1.1780268057173693,"filtered":false},
{"grid_size":1847.8125,"x":328.5,"y":506.25,"w":54.75,"h":33.75,"count":33,"key":"1-10-11-11-10","obj_size_mean":1960.878787878788,"obj_size_std":1481.3713190312833,"ratio":0.8016891968374947,"filtered":false},
{"grid_size":1847.8125,"x":383.25,"y":506.25,"w":54.75,"h":33.75,"count":27,"key":"1-10-11-11-11","obj_size_mean":1226.6296296296296,"obj_size_std":1567.9751555171683,"ratio":0.848557500026203,"filtered":false},
{"grid_size":1847.8125,"x":438,"y":405,"w":54.75,"h":33.75,"count":7,"key":"1-11-10-00-00","obj_size_mean":2501.1428571428573,"obj_size_std":152.03116848355862,"ratio":0.08227629615210343,"filtered":false},
{"grid_size":1847.8125,"x":492.75,"y":405,"w":54.75,"h":33.75,"count":13,"key":"1-11-10-00-01","obj_size_mean":5904.615384615385,"obj_size_std":4058.374131317071,"ratio":2.196312738071136,"filtered":false},
{"grid_size":1847.8125,"x":438,"y":438.75,"w":54.75,"h":33.75,"count":12,"key":"1-11-10-00-10","obj_size_mean":2028.5,"obj_size_std":607.8895683203713,"ratio":0.3289779500465395,"filtered":false},
{"grid_size":1847.8125,"x":492.75,"y":438.75,"w":54.75,"h":33.75,"count":12,"key":"1-11-10-00-11","obj_size_mean":2448.1666666666665,"obj_size_std":793.9149065157292,"ratio":0.42965122625576413,"filtered":false},
{"grid_size":1847.8125,"x":547.5,"y":405,"w":54.75,"h":33.75,"count":11,"key":"1-11-10-01-00","obj_size_mean":3219.2727272727275,"obj_size_std":2794.3805070501444,"ratio":1.5122640998749302,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1764.8823529411766,"obj_size_std":755.8923189588334,"x":602.25,"y":405,"w":54.75,"h":33.75,"count":34,"ratio":0.4090741452170246,"filtered":false},
{"grid_size":1847.8125,"x":547.5,"y":438.75,"w":54.75,"h":33.75,"count":16,"key":"1-11-10-01-10","obj_size_mean":4998.6875,"obj_size_std":4237.116971381209,"ratio":2.2930448686656297,"filtered":false},
{"grid_size":1847.8125,"x":602.25,"y":438.75,"w":54.75,"h":33.75,"count":33,"key":"1-11-10-01-11","obj_size_mean":2101.3030303030305,"obj_size_std":376.7682050054519,"ratio":0.20389958667638186,"filtered":false},
{"grid_size":1847.8125,"x":438,"y":472.5,"w":54.75,"h":33.75,"count":42,"key":"1-11-10-10-00","obj_size_mean":3686.6428571428573,"obj_size_std":2680.0118294372032,"ratio":1.4503700074748944,"filtered":false},
{"grid_size":1847.8125,"x":492.75,"y":472.5,"w":54.75,"h":33.75,"count":57,"key":"1-11-10-10-01","obj_size_mean":2705.3508771929824,"obj_size_std":1550.3385170806598,"ratio":0.8390128961031814,"filtered":false},
{"grid_size":1847.8125,"x":438,"y":506.25,"w":54.75,"h":33.75,"count":66,"key":"1-11-10-10-10","obj_size_mean":2048.5454545454545,"obj_size_std":1375.0019209141058,"ratio":0.7441241581135022,"filtered":false},
{"grid_size":1847.8125,"obj_size_mean":1469.7954545454545,"obj_size_std":756.2833103806098,"x":492.75,"y":506.25,"w":54.75,"h":33.75,"count":44,"ratio":0.4092857421305516,"filtered":false},

      ]
    };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.griditem {
  background-color: #2c3e50;
  color: bisque;
  font-size: 15px;
  height: 100%;
  width: 100%;
}
.gridtext {
  font-size: 20px;
  color: aqua;
  padding: 1px;
  background-color: #2c3e50;
}
.canvas {
  border: 1px solid #ccc;
}
</style>
