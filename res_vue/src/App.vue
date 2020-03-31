<template>
  <div id="app" style="width: 1200px; height: 700px;">
    <canvas style="width: 100%; height: 100%; position: absolute; " id="my_canvas"></canvas>
  </div>
</template>

<script>
import { mean, std } from "mathjs";
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
    let cc = 0;
    for (let i = 0; i < this.layout.length; i++) {
      let item = this.layout[i];

      let back_ = "";
      let opacity_ = "1";
      let stroke_width_ = 1;

      let item_id = item.id;
      if (this.grid_ids.includes(item_id)) {
        back_ = 'blue'
        opacity_ = 0.6
      }


      /////////////// 0320 새로운 grid 산출방식 //////////////////////

      ///////////////////////////////////

      // let dir_degree = item.direction_mean
      // if (item.count < 50) {
      //   back_ = 'black'
      //   stroke_width_ = 0;
      // }

      // else if (item.direction_count === 0) {
      //   back_ = 'black'
      //   stroke_width_ = 0;

      // } else {
      //   cc += 1;
      // }

      // if(this.transactions[this.rank].grids.includes(item.grid_id)) {
      //   back_ = 'green'
      // }
      // if (item.entry_count > 100) {
      //   back_ = 'green'
      // }
      // if (item.exit_count > 100) {
      //   back_ = 'red'
      // }

      //  if (dir_degree >= 0 && dir_degree < 45 && this.transactions[this.rank].grids.includes(item.grid_id)  ) {
      //   back_ = '#550000'
      //   opacity_ = 1
      // } else if (dir_degree >= 45 && dir_degree < 90  && this.transactions[this.rank].grids.includes(item.grid_id) ) {
      //   back_ = '#aa0000'
      //   opacity_ = 1
      // }
      // else if (dir_degree >= 90 && dir_degree < 135  && this.transactions[this.rank].grids.includes(item.grid_id) ) {
      //   back_ = '#005500'
      //   opacity_ = 1
      // }
      // else if (dir_degree >= 135 && dir_degree < 180  && this.transactions[this.rank].grids.includes(item.grid_id) ) {
      //   back_ = '#00aa00'
      //   opacity_ = 1
      // }
      // else if (dir_degree >= 180 && dir_degree < 225  && this.transactions[this.rank].grids.includes(item.grid_id)) {
      //   back_ = '#000055'
      //   opacity_ = 1
      // } else if (dir_degree >= 225 && dir_degree < 270 && this.transactions[this.rank].grids.includes(item.grid_id)) {
      //   back_ = '#0000aa'
      //   opacity_ = 1

      // } else if (dir_degree >= 270 && dir_degree < 315 && this.transactions[this.rank].grids.includes(item.grid_id)) {
      //   back_ = '#555555'
      //   opacity_ = 1

      // } else if (dir_degree >= 315 && dir_degree < 360 && this.transactions[this.rank].grids.includes(item.grid_id)) {
      //   back_ = '#aaaaaa';
      //   opacity_ = 1;
      // }

      let rect = new fabric.Rect({
        left: item.x,
        top: item.y,
        width: item.w,
        height: item.h,
        stroke: "white",
        strokeWidth: 1,
        selectable: false,
        fill: back_,
        opacity: opacity_
      });
      lines.push(rect);
    }
    // alert(cc);
    let sum = 0;
    for (let i = 0; i < sizes.length; i++) {
      sum += sizes[i];
    }
    // alert(`${grid_count} mean: ${sum/sizes.length}`);


    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/park.png
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/road.png
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/busroad.png
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/4800.png
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/4801.png
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/forbus.png
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/europe.png
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/japan.png

    fabric.Image.fromURL(
      "https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/japan.png",
      function(myImg) {
        //i create an extra var for to change some image properties
        var img1 = myImg.set({
          left: 0,
          top: 0
          // width: 360, height: 240
          // width: 877, height: 540 // road
          // width: 1080, height: 540 // europe
          //       width: 1080, height: 540 // japan
        });
        img1.scaleToWidth(960);
        img1.scaleToHeight(540);
        canvas.add(img1);
        for (let i = 0; i < lines.length; i++) {
          canvas.add(lines[i]);
        }
      }
    );

    canvas.renderAll();
  },
  created() {},
  data() {
    return {
      specific_grids: {},

      grid_ids : [

      ],
      rank: 39,
      transactions: [
      
      ],
      layout: [
{"grid_size":32400,"x":0,"y":135,"w":240,"h":135,"count":0,"obj_size_mean":0,"filtered":false,"id":"102"},
{"grid_size":32400,"x":0,"y":270,"w":240,"h":135,"count":0,"obj_size_mean":0,"filtered":false,"id":"103"},
{"grid_size":32400,"x":240,"y":135,"w":240,"h":135,"count":0,"obj_size_mean":0,"filtered":false,"id":"202"},
{"grid_size":32400,"x":480,"y":405,"w":240,"h":135,"count":0,"obj_size_mean":0,"filtered":false,"id":"304"},
{"grid_size":32400,"x":720,"y":0,"w":240,"h":135,"count":0,"obj_size_mean":0,"filtered":false,"id":"401"},
{"grid_size":32400,"x":720,"y":270,"w":240,"h":135,"count":0,"obj_size_mean":0,"filtered":false,"id":"403"},
{"grid_size":8100,"x":0,"y":405,"w":120,"h":67.5,"count":15,"key":"104-00","obj_size_mean":12917,"obj_size_std":5565.501966836158,"ratio":0.6870990082513776,"id":"104-00","filtered":false},
{"grid_size":8100,"x":120,"y":405,"w":120,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false,"id":"104-01"},
{"grid_size":8100,"obj_size_mean":7805.014492753623,"obj_size_std":4153.922853558583,"x":0,"y":472.5,"w":120,"h":67.5,"count":69,"ratio":0.5128299819208126,"filtered":false,"id":"104-10"},
{"grid_size":8100,"obj_size_mean":4823.136363636364,"obj_size_std":5329.991917222983,"x":120,"y":472.5,"w":120,"h":67.5,"count":22,"ratio":0.6580236934843189,"filtered":false,"id":"104-11"},
{"grid_size":2025,"obj_size_mean":1610.2560975609756,"obj_size_std":1060.6492748414153,"x":240,"y":270,"w":60,"h":33.75,"count":82,"ratio":0.523777419674773,"filtered":false,"id":"203-00-00"},
{"grid_size":506.25,"x":300,"y":270,"w":30,"h":16.875,"count":27,"key":"203-00-01-00","obj_size_mean":1244.851851851852,"obj_size_std":1186.5649096869015,"ratio":2.343831920369188,"id":"203-00-01-00","filtered":false},
{"grid_size":506.25,"x":330,"y":270,"w":30,"h":16.875,"count":28,"key":"203-00-01-01","obj_size_mean":945.7857142857143,"obj_size_std":351.4922007609375,"ratio":0.69430558175,"id":"203-00-01-01","filtered":false},
{"grid_size":506.25,"x":300,"y":286.875,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"203-00-01-10"},
{"grid_size":506.25,"x":330,"y":286.875,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"203-00-01-11"},
{"grid_size":2025,"x":240,"y":303.75,"w":60,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false,"id":"203-00-10"},
{"grid_size":2025,"x":300,"y":303.75,"w":60,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false,"id":"203-00-11"},
{"grid_size":506.25,"x":360,"y":270,"w":30,"h":16.875,"count":9,"key":"203-01-00-00","obj_size_mean":930,"obj_size_std":265.8519324736986,"ratio":0.525139619701133,"id":"203-01-00-00","filtered":false},
{"grid_size":506.25,"x":390,"y":270,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"203-01-00-01"},
{"grid_size":506.25,"x":360,"y":286.875,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"203-01-00-10"},
{"grid_size":506.25,"x":390,"y":286.875,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"203-01-00-11"},
{"grid_size":2025,"x":420,"y":270,"w":60,"h":33.75,"count":17,"key":"203-01-01","obj_size_mean":3375.470588235294,"obj_size_std":2931.0016017917633,"ratio":1.4474081984156855,"id":"203-01-01","filtered":false},
{"grid_size":2025,"x":360,"y":303.75,"w":60,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false,"id":"203-01-10"},
{"grid_size":2025,"x":420,"y":303.75,"w":60,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false,"id":"203-01-11"},
{"grid_size":8100,"x":240,"y":337.5,"w":120,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false,"id":"203-10"},
{"grid_size":2025,"x":360,"y":337.5,"w":60,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false,"id":"203-11-00"},
{"grid_size":2025,"x":420,"y":337.5,"w":60,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false,"id":"203-11-01"},
{"grid_size":2025,"x":360,"y":371.25,"w":60,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false,"id":"203-11-10"},
{"grid_size":2025,"x":420,"y":371.25,"w":60,"h":33.75,"count":15,"key":"203-11-11","obj_size_mean":2028.7333333333333,"obj_size_std":1441.8821760198748,"ratio":0.7120405807505554,"id":"203-11-11","filtered":false},
{"grid_size":8100,"x":240,"y":405,"w":120,"h":67.5,"count":6,"key":"204-00","obj_size_mean":2553.5,"obj_size_std":4015.683640427866,"ratio":0.49576341239850197,"filtered":false,"id":"204-00"},
{"grid_size":2025,"obj_size_mean":1823,"obj_size_std":1041.0201727152073,"x":360,"y":405,"w":60,"h":33.75,"count":5,"ratio":0.5140840359087443,"filtered":false,"id":"204-01-00"},
{"grid_size":2025,"x":420,"y":405,"w":60,"h":33.75,"count":18,"key":"204-01-01","obj_size_mean":3961.1666666666665,"obj_size_std":4345.058413605859,"ratio":2.1457078585707943,"id":"204-01-01","filtered":false},
{"grid_size":2025,"x":360,"y":438.75,"w":60,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false,"id":"204-01-10"},
{"grid_size":2025,"x":420,"y":438.75,"w":60,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false,"id":"204-01-11"},
{"grid_size":8100,"x":240,"y":472.5,"w":120,"h":67.5,"count":7,"key":"204-10","obj_size_mean":2419.5714285714284,"obj_size_std":3460.9888691501096,"ratio":0.42728257643828516,"filtered":false,"id":"204-10"},
{"grid_size":8100,"x":360,"y":472.5,"w":120,"h":67.5,"count":0,"obj_size_mean":0,"filtered":false,"id":"204-11"},
{"grid_size":2025,"x":480,"y":135,"w":60,"h":33.75,"count":6,"key":"302-00-00","obj_size_mean":119.16666666666667,"obj_size_std":120.44653032224159,"ratio":0.059479768060366214,"filtered":false,"id":"302-00-00"},
{"grid_size":506.25,"x":540,"y":135,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-00-01-00"},
{"grid_size":506.25,"x":570,"y":135,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-00-01-01"},
{"grid_size":506.25,"x":540,"y":151.875,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-00-01-10"},
{"grid_size":506.25,"obj_size_mean":353,"obj_size_std":165.5203914930121,"x":570,"y":151.875,"w":30,"h":16.875,"count":3,"ratio":0.3269538597392832,"filtered":false,"id":"302-00-01-11"},
{"grid_size":506.25,"x":480,"y":168.75,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-00-10-00"},
{"grid_size":506.25,"x":510,"y":168.75,"w":30,"h":16.875,"count":3,"key":"302-00-10-01","obj_size_mean":537,"obj_size_std":489.97857095999615,"ratio":0.9678589055999924,"id":"302-00-10-01","filtered":false},
{"grid_size":506.25,"x":480,"y":185.625,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-00-10-10"},
{"grid_size":506.25,"obj_size_mean":417.25,"obj_size_std":134.81518213218175,"x":510,"y":185.625,"w":30,"h":16.875,"count":16,"ratio":0.2663015943351738,"filtered":false,"id":"302-00-10-11"},
{"grid_size":506.25,"x":540,"y":168.75,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-00-11-00"},
{"grid_size":506.25,"x":570,"y":168.75,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-00-11-01"},
{"grid_size":506.25,"x":540,"y":185.625,"w":30,"h":16.875,"count":14,"key":"302-00-11-10","obj_size_mean":520.6428571428571,"obj_size_std":391.80540836233746,"ratio":0.7739366091107901,"id":"302-00-11-10","filtered":false},
{"grid_size":506.25,"x":570,"y":185.625,"w":30,"h":16.875,"count":8,"key":"302-00-11-11","obj_size_mean":251.5,"obj_size_std":88.26906916598006,"ratio":0.17435865514267665,"filtered":false,"id":"302-00-11-11"},
{"grid_size":2025,"x":600,"y":135,"w":60,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-01-00"},
{"grid_size":506.25,"x":660,"y":135,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-01-01-00"},
{"grid_size":506.25,"x":690,"y":135,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-01-01-01"},
{"grid_size":506.25,"x":660,"y":151.875,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-01-01-10"},
{"grid_size":126.5625,"x":690,"y":151.875,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-01-01-11-00"},
{"grid_size":126.5625,"x":705,"y":151.875,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-01-01-11-01"},
{"grid_size":126.5625,"x":690,"y":160.3125,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-01-01-11-10"},
{"grid_size":126.5625,"x":705,"y":160.3125,"w":15,"h":8.4375,"count":14,"key":"302-01-01-11-11","obj_size_mean":250.28571428571428,"obj_size_std":178.17253028862373,"ratio":1.4077829553669037,"id":"302-01-01-11-11","filtered":false},
{"grid_size":506.25,"x":600,"y":168.75,"w":30,"h":16.875,"count":8,"key":"302-01-10-00","obj_size_mean":230.375,"obj_size_std":142.8165031480206,"ratio":0.2821066728849789,"filtered":false,"id":"302-01-10-00"},
{"grid_size":126.5625,"x":630,"y":168.75,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-01-10-01-00"},
{"grid_size":126.5625,"x":645,"y":168.75,"w":15,"h":8.4375,"count":5,"key":"302-01-10-01-01","obj_size_mean":160.4,"obj_size_std":127.56488545050318,"ratio":1.007920082571877,"id":"302-01-10-01-01","filtered":false},
{"grid_size":126.5625,"x":630,"y":177.1875,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-01-10-01-10"},
{"grid_size":126.5625,"x":645,"y":177.1875,"w":15,"h":8.4375,"count":6,"key":"302-01-10-01-11","obj_size_mean":373.3333333333333,"obj_size_std":145.40243005763924,"ratio":1.1488587066282607,"id":"302-01-10-01-11","filtered":false},
{"grid_size":506.25,"obj_size_mean":367.06666666666666,"obj_size_std":296.18827667228027,"x":600,"y":185.625,"w":30,"h":16.875,"count":15,"ratio":0.5850632625625289,"filtered":false,"id":"302-01-10-10"},
{"grid_size":506.25,"x":630,"y":185.625,"w":30,"h":16.875,"count":7,"key":"302-01-10-11","obj_size_mean":413.7142857142857,"obj_size_std":130.2698664129126,"ratio":0.25732319291439526,"filtered":false,"id":"302-01-10-11"},
{"grid_size":126.5625,"x":660,"y":168.75,"w":15,"h":8.4375,"count":3,"key":"302-01-11-00-00","obj_size_mean":164.33333333333334,"obj_size_std":113.2975433684832,"ratio":0.8951904661213488,"id":"302-01-11-00-00","filtered":false},
{"grid_size":126.5625,"x":675,"y":168.75,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-01-11-00-01"},
{"grid_size":126.5625,"x":660,"y":177.1875,"w":15,"h":8.4375,"count":4,"key":"302-01-11-00-10","obj_size_mean":401,"obj_size_std":222.952909826268,"ratio":1.7616032381334756,"id":"302-01-11-00-10","filtered":false},
{"grid_size":126.5625,"x":675,"y":177.1875,"w":15,"h":8.4375,"count":4,"key":"302-01-11-00-11","obj_size_mean":200,"obj_size_std":93.94679345246436,"ratio":0.7422956519700888,"id":"302-01-11-00-11","filtered":false},
{"grid_size":506.25,"obj_size_mean":315.81081081081084,"obj_size_std":206.41191796957816,"x":690,"y":168.75,"w":30,"h":16.875,"count":37,"ratio":0.4077272453720062,"filtered":false,"id":"302-01-11-01"},
{"grid_size":506.25,"x":660,"y":185.625,"w":30,"h":16.875,"count":6,"key":"302-01-11-10","obj_size_mean":537.3333333333334,"obj_size_std":366.4716451059572,"ratio":0.7238946076167055,"id":"302-01-11-10","filtered":false},
{"grid_size":506.25,"x":690,"y":185.625,"w":30,"h":16.875,"count":4,"key":"302-01-11-11","obj_size_mean":799.5,"obj_size_std":794.3989342053944,"ratio":1.5691830799118902,"id":"302-01-11-11","filtered":false},
{"grid_size":506.25,"x":480,"y":202.5,"w":30,"h":16.875,"count":11,"key":"302-10-00-00","obj_size_mean":616.6363636363636,"obj_size_std":261.8844297499463,"ratio":0.5173025772838445,"id":"302-10-00-00","filtered":false},
{"grid_size":506.25,"obj_size_mean":480.525,"obj_size_std":198.84254658732706,"x":510,"y":202.5,"w":30,"h":16.875,"count":40,"ratio":0.39277540066632505,"filtered":false,"id":"302-10-00-01"},
{"grid_size":506.25,"x":480,"y":219.375,"w":30,"h":16.875,"count":17,"key":"302-10-00-10","obj_size_mean":583,"obj_size_std":345.62027573624783,"ratio":0.6827067175036994,"id":"302-10-00-10","filtered":false},
{"grid_size":506.25,"x":510,"y":219.375,"w":30,"h":16.875,"count":10,"key":"302-10-00-11","obj_size_mean":638,"obj_size_std":223.05455237078962,"ratio":0.4406015849299548,"id":"302-10-00-11","filtered":false},
{"grid_size":506.25,"x":540,"y":202.5,"w":30,"h":16.875,"count":12,"key":"302-10-01-00","obj_size_mean":655.3333333333334,"obj_size_std":285.53692113863895,"ratio":0.5640235479281757,"id":"302-10-01-00","filtered":false},
{"grid_size":506.25,"obj_size_mean":379.5,"obj_size_std":192.19426724966684,"x":570,"y":202.5,"w":30,"h":16.875,"count":12,"ratio":0.37964299703637894,"filtered":false,"id":"302-10-01-01"},
{"grid_size":506.25,"x":540,"y":219.375,"w":30,"h":16.875,"count":3,"key":"302-10-01-10","obj_size_mean":739.6666666666666,"obj_size_std":69.94521665799122,"ratio":0.1381633909293654,"id":"302-10-01-10","filtered":false},
{"grid_size":506.25,"x":570,"y":219.375,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-10-01-11"},
{"grid_size":2025,"x":480,"y":236.25,"w":60,"h":33.75,"count":7,"key":"302-10-10","obj_size_mean":709.2857142857143,"obj_size_std":165.31053030152503,"ratio":0.08163482977853088,"filtered":false,"id":"302-10-10"},
{"grid_size":2025,"x":540,"y":236.25,"w":60,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-10-11"},
{"grid_size":506.25,"x":600,"y":202.5,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-11-00-00"},
{"grid_size":506.25,"x":630,"y":202.5,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-11-00-01"},
{"grid_size":506.25,"x":600,"y":219.375,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-11-00-10"},
{"grid_size":506.25,"x":630,"y":219.375,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-11-00-11"},
{"grid_size":2025,"obj_size_mean":1603.1875,"obj_size_std":789.704266904179,"x":660,"y":202.5,"w":60,"h":33.75,"count":16,"ratio":0.3899774157551501,"filtered":false,"id":"302-11-01"},
{"grid_size":506.25,"x":600,"y":236.25,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-11-10-00"},
{"grid_size":506.25,"x":630,"y":236.25,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-11-10-01"},
{"grid_size":506.25,"x":600,"y":253.125,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-11-10-10"},
{"grid_size":506.25,"x":630,"y":253.125,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-11-10-11"},
{"grid_size":506.25,"x":660,"y":236.25,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-11-11-00"},
{"grid_size":506.25,"x":690,"y":236.25,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-11-11-01"},
{"grid_size":506.25,"x":660,"y":253.125,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-11-11-10"},
{"grid_size":506.25,"obj_size_mean":472.1818181818182,"obj_size_std":531.2170588717606,"x":690,"y":253.125,"w":30,"h":16.875,"count":11,"ratio":1.049317647154095,"filtered":false,"id":"302-11-11-11"},
{"grid_size":2025,"x":480,"y":270,"w":60,"h":33.75,"count":7,"key":"303-00-00","obj_size_mean":384.14285714285717,"obj_size_std":366.58715588130315,"ratio":0.18103069426237192,"filtered":false,"id":"303-00-00"},
{"grid_size":2025,"x":540,"y":270,"w":60,"h":33.75,"count":6,"key":"303-00-01","obj_size_mean":1610.6666666666667,"obj_size_std":1079.1905608680363,"ratio":0.5329336103052031,"filtered":false,"id":"303-00-01"},
{"grid_size":2025,"x":480,"y":303.75,"w":60,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false,"id":"303-00-10"},
{"grid_size":2025,"x":540,"y":303.75,"w":60,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false,"id":"303-00-11"},
{"grid_size":2025,"obj_size_mean":1560.6666666666667,"obj_size_std":1990.8915925618182,"x":600,"y":270,"w":60,"h":33.75,"count":3,"ratio":0.9831563420058361,"filtered":false,"id":"303-01-00"},
{"grid_size":2025,"obj_size_mean":1451.1384615384616,"obj_size_std":1197.0987307460675,"x":660,"y":270,"w":60,"h":33.75,"count":65,"ratio":0.591159867035095,"filtered":false,"id":"303-01-01"},
{"grid_size":2025,"x":600,"y":303.75,"w":60,"h":33.75,"count":10,"key":"303-01-10","obj_size_mean":910.4,"obj_size_std":610.0732560748569,"ratio":0.3012707437406701,"filtered":false,"id":"303-01-10"},
{"grid_size":2025,"x":660,"y":303.75,"w":60,"h":33.75,"count":10,"key":"303-01-11","obj_size_mean":377.5,"obj_size_std":302.68841698647435,"ratio":0.14947576147480215,"filtered":false,"id":"303-01-11"},
{"grid_size":8100,"x":480,"y":337.5,"w":120,"h":67.5,"count":8,"key":"303-10","obj_size_mean":1057.125,"obj_size_std":967.6760729411765,"ratio":0.1194661818445897,"filtered":false,"id":"303-10"},
{"grid_size":8100,"x":600,"y":337.5,"w":120,"h":67.5,"count":8,"key":"303-11","obj_size_mean":603.375,"obj_size_std":332.48112191306654,"ratio":0.04104705208803291,"filtered":false,"id":"303-11"},
{"grid_size":506.25,"x":720,"y":135,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-00-00"},
{"grid_size":126.5625,"x":750,"y":135,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-00-01-00"},
{"grid_size":126.5625,"x":765,"y":135,"w":15,"h":8.4375,"count":7,"key":"402-00-00-01-01","obj_size_mean":94.57142857142857,"obj_size_std":69.0503611934969,"ratio":0.5455831007881237,"filtered":false,"id":"402-00-00-01-01"},
{"grid_size":126.5625,"x":750,"y":143.4375,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-00-01-10"},
{"grid_size":126.5625,"x":765,"y":143.4375,"w":15,"h":8.4375,"count":5,"key":"402-00-00-01-11","obj_size_mean":212.8,"obj_size_std":199.25912777085017,"ratio":1.5743931083128901,"id":"402-00-00-01-11","filtered":false},
{"grid_size":126.5625,"x":720,"y":151.875,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-00-10-00"},
{"grid_size":126.5625,"x":735,"y":151.875,"w":15,"h":8.4375,"count":9,"key":"402-00-00-10-01","obj_size_mean":279.8888888888889,"obj_size_std":146.25187558151558,"ratio":1.1555703749650614,"id":"402-00-00-10-01","filtered":false},
{"grid_size":126.5625,"x":720,"y":160.3125,"w":15,"h":8.4375,"count":7,"key":"402-00-00-10-10","obj_size_mean":239.71428571428572,"obj_size_std":164.38949103244028,"ratio":1.2988799291452071,"id":"402-00-00-10-10","filtered":false},
{"grid_size":126.5625,"x":735,"y":160.3125,"w":15,"h":8.4375,"count":20,"key":"402-00-00-10-11","obj_size_mean":215.9,"obj_size_std":135.15367471687065,"ratio":1.0678808866518175,"id":"402-00-00-10-11","filtered":false},
{"grid_size":126.5625,"x":750,"y":151.875,"w":15,"h":8.4375,"count":5,"key":"402-00-00-11-00","obj_size_mean":294.8,"obj_size_std":239.2899914329891,"ratio":1.8906863520631236,"id":"402-00-00-11-00","filtered":false},
{"grid_size":126.5625,"x":765,"y":151.875,"w":15,"h":8.4375,"count":3,"key":"402-00-00-11-01","obj_size_mean":179.33333333333334,"obj_size_std":71.05866121264411,"ratio":0.5614511503221263,"id":"402-00-00-11-01","filtered":false},
{"grid_size":126.5625,"x":750,"y":160.3125,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-00-11-10"},
{"grid_size":126.5625,"x":765,"y":160.3125,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-00-11-11"},
{"grid_size":126.5625,"x":780,"y":135,"w":15,"h":8.4375,"count":7,"key":"402-00-01-00-00","obj_size_mean":124.71428571428571,"obj_size_std":65.23729578933175,"ratio":0.5154551766070657,"filtered":false,"id":"402-00-01-00-00"},
{"grid_size":126.5625,"x":795,"y":135,"w":15,"h":8.4375,"count":6,"key":"402-00-01-00-01","obj_size_mean":62,"obj_size_std":17.158088471621774,"ratio":0.13557008175108562,"filtered":false,"id":"402-00-01-00-01"},
{"grid_size":126.5625,"x":780,"y":143.4375,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-01-00-10"},
{"grid_size":126.5625,"x":795,"y":143.4375,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-01-00-11"},
{"grid_size":506.25,"x":810,"y":135,"w":30,"h":16.875,"count":7,"key":"402-00-01-01","obj_size_mean":113.85714285714286,"obj_size_std":79.85492798700355,"ratio":0.15773812935704404,"filtered":false,"id":"402-00-01-01"},
{"grid_size":126.5625,"x":780,"y":151.875,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-01-10-00"},
{"grid_size":126.5625,"x":795,"y":151.875,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-01-10-01"},
{"grid_size":126.5625,"x":780,"y":160.3125,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-01-10-10"},
{"grid_size":126.5625,"x":795,"y":160.3125,"w":15,"h":8.4375,"count":3,"key":"402-00-01-10-11","obj_size_mean":248,"obj_size_std":220.5719837150675,"ratio":1.7427909824400394,"id":"402-00-01-10-11","filtered":false},
{"grid_size":506.25,"x":810,"y":151.875,"w":30,"h":16.875,"count":8,"key":"402-00-01-11","obj_size_mean":78.875,"obj_size_std":30.43230191753493,"ratio":0.0601131889729085,"filtered":false,"id":"402-00-01-11"},
{"grid_size":126.5625,"x":720,"y":168.75,"w":15,"h":8.4375,"count":17,"key":"402-00-10-00-00","obj_size_mean":268.29411764705884,"obj_size_std":144.40557672138323,"ratio":1.140982334588707,"id":"402-00-10-00-00","filtered":false},
{"grid_size":126.5625,"x":735,"y":168.75,"w":15,"h":8.4375,"count":5,"key":"402-00-10-00-01","obj_size_mean":156.6,"obj_size_std":52.2379172632294,"ratio":0.4127440376353928,"id":"402-00-10-00-01","filtered":false},
{"grid_size":126.5625,"x":720,"y":177.1875,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-10-00-10"},
{"grid_size":126.5625,"x":735,"y":177.1875,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-10-00-11"},
{"grid_size":506.25,"x":750,"y":168.75,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-10-01"},
{"grid_size":126.5625,"x":720,"y":185.625,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-10-10-00"},
{"grid_size":126.5625,"x":735,"y":185.625,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-10-10-01"},
{"grid_size":126.5625,"x":720,"y":194.0625,"w":15,"h":8.4375,"count":3,"key":"402-00-10-10-10","obj_size_mean":300.3333333333333,"obj_size_std":138.15329649824986,"ratio":1.0915816019614804,"id":"402-00-10-10-10","filtered":false},
{"grid_size":126.5625,"x":735,"y":194.0625,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-10-10-11"},
{"grid_size":506.25,"x":750,"y":185.625,"w":30,"h":16.875,"count":3,"key":"402-00-10-11","obj_size_mean":749.3333333333334,"obj_size_std":257.1951269626494,"ratio":0.5080397569632581,"id":"402-00-10-11","filtered":false},
{"grid_size":126.5625,"x":780,"y":168.75,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-11-00-00"},
{"grid_size":126.5625,"x":795,"y":168.75,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-11-00-01"},
{"grid_size":126.5625,"x":780,"y":177.1875,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-11-00-10"},
{"grid_size":126.5625,"x":795,"y":177.1875,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-11-00-11"},
{"grid_size":126.5625,"x":810,"y":168.75,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-11-01-00"},
{"grid_size":126.5625,"x":825,"y":168.75,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-11-01-01"},
{"grid_size":126.5625,"x":810,"y":177.1875,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-11-01-10"},
{"grid_size":126.5625,"x":825,"y":177.1875,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-11-01-11"},
{"grid_size":506.25,"x":780,"y":185.625,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00-11-10"},
{"grid_size":506.25,"obj_size_mean":374.4,"obj_size_std":194.38827125112257,"x":810,"y":185.625,"w":30,"h":16.875,"count":5,"ratio":0.3839768321009829,"filtered":false,"id":"402-00-11-11"},
{"grid_size":126.5625,"x":840,"y":135,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-01-00-00-00"},
{"grid_size":126.5625,"obj_size_mean":103.25,"obj_size_std":116.19918244118588,"x":855,"y":135,"w":15,"h":8.4375,"count":4,"ratio":0.91811699706616,"filtered":false,"id":"402-01-00-00-01"},
{"grid_size":126.5625,"x":840,"y":143.4375,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-01-00-00-10"},
{"grid_size":126.5625,"x":855,"y":143.4375,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-01-00-00-11"},
{"grid_size":506.25,"x":870,"y":135,"w":30,"h":16.875,"count":6,"key":"402-01-00-01","obj_size_mean":444.3333333333333,"obj_size_std":143.1665696546043,"ratio":0.28279816228069987,"filtered":false,"id":"402-01-00-01"},
{"grid_size":506.25,"x":840,"y":151.875,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-01-00-10"},
{"grid_size":506.25,"x":870,"y":151.875,"w":30,"h":16.875,"count":7,"key":"402-01-00-11","obj_size_mean":340.85714285714283,"obj_size_std":386.80159796784216,"ratio":0.7640525391957376,"filtered":false,"id":"402-01-00-11"},
{"grid_size":506.25,"x":900,"y":135,"w":30,"h":16.875,"count":7,"key":"402-01-01-00","obj_size_mean":574,"obj_size_std":191.95138273358006,"ratio":0.37916322515275075,"id":"402-01-01-00","filtered":false},
{"grid_size":506.25,"obj_size_mean":328,"obj_size_std":418.7266411395387,"x":930,"y":135,"w":30,"h":16.875,"count":3,"ratio":0.8271143528682245,"filtered":false,"id":"402-01-01-01"},
{"grid_size":506.25,"x":900,"y":151.875,"w":30,"h":16.875,"count":4,"key":"402-01-01-10","obj_size_mean":713.5,"obj_size_std":206.37910100912188,"ratio":0.4076624217464136,"id":"402-01-01-10","filtered":false},
{"grid_size":506.25,"obj_size_mean":343.8333333333333,"obj_size_std":245.72373006112275,"x":930,"y":151.875,"w":30,"h":16.875,"count":12,"ratio":0.4853802075281437,"filtered":false,"id":"402-01-01-11"},
{"grid_size":2025,"x":840,"y":168.75,"w":60,"h":33.75,"count":6,"key":"402-01-10","obj_size_mean":238.83333333333334,"obj_size_std":154.26006180041114,"ratio":0.07617780829649932,"filtered":false,"id":"402-01-10"},
{"grid_size":506.25,"x":900,"y":168.75,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-01-11-00"},
{"grid_size":506.25,"x":930,"y":168.75,"w":30,"h":16.875,"count":6,"key":"402-01-11-01","obj_size_mean":425.5,"obj_size_std":305.2865866689855,"ratio":0.603035232926391,"filtered":false,"id":"402-01-11-01"},
{"grid_size":506.25,"x":900,"y":185.625,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-01-11-10"},
{"grid_size":506.25,"x":930,"y":185.625,"w":30,"h":16.875,"count":7,"key":"402-01-11-11","obj_size_mean":409.7142857142857,"obj_size_std":248.01526450719,"ratio":0.4899066953228445,"filtered":false,"id":"402-01-11-11"},
{"grid_size":506.25,"x":720,"y":202.5,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-10-00-00"},
{"grid_size":506.25,"x":750,"y":202.5,"w":30,"h":16.875,"count":3,"key":"402-10-00-01","obj_size_mean":652,"obj_size_std":411.5725938397745,"ratio":0.8129829014119003,"id":"402-10-00-01","filtered":false},
{"grid_size":506.25,"x":720,"y":219.375,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-10-00-10"},
{"grid_size":506.25,"x":750,"y":219.375,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-10-00-11"},
{"grid_size":506.25,"x":780,"y":202.5,"w":30,"h":16.875,"count":7,"key":"402-10-01-00","obj_size_mean":338.14285714285717,"obj_size_std":244.51341379116508,"ratio":0.48298945934057297,"filtered":false,"id":"402-10-01-00"},
{"grid_size":506.25,"obj_size_mean":394,"obj_size_std":276.64236841091423,"x":810,"y":202.5,"w":30,"h":16.875,"count":13,"ratio":0.5464540610585961,"filtered":false,"id":"402-10-01-01"},
{"grid_size":506.25,"x":780,"y":219.375,"w":30,"h":16.875,"count":7,"key":"402-10-01-10","obj_size_mean":204.42857142857142,"obj_size_std":189.7795713829223,"ratio":0.3748732274230564,"filtered":false,"id":"402-10-01-10"},
{"grid_size":126.5625,"x":810,"y":219.375,"w":15,"h":8.4375,"count":3,"key":"402-10-01-11-00","obj_size_mean":166,"obj_size_std":96.27045237246992,"ratio":0.7606554261528488,"id":"402-10-01-11-00","filtered":false},
{"grid_size":126.5625,"x":825,"y":219.375,"w":15,"h":8.4375,"count":6,"key":"402-10-01-11-01","obj_size_mean":253,"obj_size_std":217.68601241237343,"ratio":1.7199882462212222,"id":"402-10-01-11-01","filtered":false},
{"grid_size":126.5625,"x":810,"y":227.8125,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-10-01-11-10"},
{"grid_size":126.5625,"x":825,"y":227.8125,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-10-01-11-11"},
{"grid_size":506.25,"obj_size_mean":361.75,"obj_size_std":376.7566632898924,"x":720,"y":236.25,"w":30,"h":16.875,"count":4,"ratio":0.744210692918306,"filtered":false,"id":"402-10-10-00"},
{"grid_size":506.25,"x":750,"y":236.25,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-10-10-01"},
{"grid_size":506.25,"obj_size_mean":335.962962962963,"obj_size_std":272.251083416857,"x":720,"y":253.125,"w":30,"h":16.875,"count":27,"ratio":0.5377799178604583,"filtered":false,"id":"402-10-10-10"},
{"grid_size":506.25,"x":750,"y":253.125,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-10-10-11"},
{"grid_size":2025,"x":780,"y":236.25,"w":60,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-10-11"},
{"grid_size":506.25,"x":840,"y":202.5,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-11-00-00"},
{"grid_size":126.5625,"x":870,"y":202.5,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-11-00-01-00"},
{"grid_size":126.5625,"x":885,"y":202.5,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-11-00-01-01"},
{"grid_size":126.5625,"x":870,"y":210.9375,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-11-00-01-10"},
{"grid_size":126.5625,"x":885,"y":210.9375,"w":15,"h":8.4375,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-11-00-01-11"},
{"grid_size":506.25,"x":840,"y":219.375,"w":30,"h":16.875,"count":6,"key":"402-11-00-10","obj_size_mean":361.1666666666667,"obj_size_std":204.41469288352698,"ratio":0.4037821093995595,"filtered":false,"id":"402-11-00-10"},
{"grid_size":506.25,"x":870,"y":219.375,"w":30,"h":16.875,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-11-00-11"},
{"grid_size":506.25,"x":900,"y":202.5,"w":30,"h":16.875,"count":8,"key":"402-11-01-00","obj_size_mean":389.25,"obj_size_std":281.90411237055156,"ratio":0.556847629373929,"filtered":false,"id":"402-11-01-00"},
{"grid_size":506.25,"obj_size_mean":407.4,"obj_size_std":326.11623694627656,"x":930,"y":202.5,"w":30,"h":16.875,"count":5,"ratio":0.6441802211284475,"filtered":false,"id":"402-11-01-01"},
{"grid_size":506.25,"obj_size_mean":440.7692307692308,"obj_size_std":274.3529216921621,"x":900,"y":219.375,"w":30,"h":16.875,"count":13,"ratio":0.5419316971697029,"filtered":false,"id":"402-11-01-10"},
{"grid_size":506.25,"obj_size_mean":410.9230769230769,"obj_size_std":187.98513307283173,"x":930,"y":219.375,"w":30,"h":16.875,"count":13,"ratio":0.37132865792164294,"filtered":false,"id":"402-11-01-11"},
{"grid_size":2025,"x":840,"y":236.25,"w":60,"h":33.75,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-11-10"},
{"grid_size":2025,"x":900,"y":236.25,"w":60,"h":33.75,"count":6,"key":"402-11-11","obj_size_mean":160.5,"obj_size_std":154.96806122553124,"ratio":0.07652743764223766,"filtered":false,"id":"402-11-11"},

   ]
  }
  
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
