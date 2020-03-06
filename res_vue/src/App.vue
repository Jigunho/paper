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
      let dir_degree = item.direction_mean
      if (item.count < 30) {
        back_ = 'black'
        stroke_width_ = 0;
      }
      else if (item.direction_count === 0) {
        back_ = 'black'
        stroke_width_ = 0;
      }
      if (item.entry_count > 100) {
        back_ = 'green'
      }
      if (item.exit_count > 100) {
        back_ = 'red'
      } 
      // else if (dir_degree >= 0 && dir_degree < 45  ) {
      //   back_ = '#550000'
      //   opacity_ = 1
      // } else if (dir_degree >= 45 && dir_degree < 90  ) {
      //   back_ = '#aa0000'
      //   opacity_ = 1
      // } 
      // else if (dir_degree >= 90 && dir_degree < 135  ) {
      //   back_ = '#005500'
      //   opacity_ = 1
      // }  
      // else if (dir_degree >= 135 && dir_degree < 180  ) {
      //   back_ = '#00aa00'
      //   opacity_ = 1
      // } 
      // else if (dir_degree >= 180 && dir_degree < 225 ) {
      //   back_ = '#000055'
      //   opacity_ = 1
      // } else if (dir_degree >= 225 && dir_degree < 270) {
      //   back_ = '#0000aa'
      //   opacity_ = 1

      // } else if (dir_degree >= 270 && dir_degree < 315) {
      //   back_ = '#555555'
      //   opacity_ = 1

      // } else if (dir_degree >= 315 && dir_degree < 360) {
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
// https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/forbus.png

    fabric.Image.fromURL('https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/4800.png', function(myImg) {
    //i create an extra var for to change some image properties
      var img1 = myImg.set({ left: 0, top: 0, 
      // width: 360, height: 240
      // width: 877, height: 540

      });
      img1.scaleToWidth(360);
      img1.scaleToHeight(240);
      canvas.add(img1);
      for (let i = 0 ; i < lines.length ; i ++) {
        canvas.add(lines[i])
      } 
    });
    let rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        stroke: "red",
        strokeWidth: 1,
        selectable: false,
        fill: '',
        // opacity: ''
      });
      canvas.add(rect);
 var triangle = new fabric.Triangle({
            width: 10, 
            height: 15, 
            fill: 'red', 
            left: 235, 
            top: 65,
            angle: 90
        });

        var line = new fabric.Line([50, 100, 200, 100], {
            left: 75,
            top: 70,
            stroke: 'red'
        });

        var objs = [line, triangle];
        var alltogetherObj = new fabric.Group(objs);
        // canvas.add(alltogetherObj)

        alltogetherObj.rotate(135);
        let objss = [rect, alltogetherObj];
        let aaa = new fabric.Group(objss);
        // canvas.add(alltogetherObj);

    canvas.renderAll();
  },
  created() {},
  data() {
    return {
      layout: [

{"grid_size":5625,"x":0,"y":0,"w":90,"h":62.5,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":1406.25,"x":90,"y":0,"w":45,"h":31.25,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":1406.25,"x":135,"y":0,"w":45,"h":31.25,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":90,"y":31.25,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":112.5,"y":31.25,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":123.75,"y":31.25,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":112.5,"y":39.0625,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":123.75,"y":39.0625,"w":5.625,"h":3.90625,"count":12,"key":"1-00-01-10-01-11-00","obj_size_mean":44.083333333333336,"obj_size_std":15.482884000395307,"ratio":0.7046432540624353,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":129.375,"y":39.0625,"w":5.625,"h":3.90625,"count":8,"key":"1-00-01-10-01-11-01","obj_size_mean":43.75,"obj_size_std":6.943650748294136,"ratio":0.31601326072236424,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":123.75,"y":42.96875,"w":5.625,"h":3.90625,"count":6,"key":"1-00-01-10-01-11-10","obj_size_mean":28,"obj_size_std":0,"ratio":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":129.375,"y":42.96875,"w":5.625,"h":3.90625,"count":5,"key":"1-00-01-10-01-11-11","obj_size_mean":29.6,"obj_size_std":3.577708763999663,"ratio":0.16282550108158467,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":90,"y":46.875,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":112.5,"y":46.875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":123.75,"y":46.875,"w":11.25,"h":7.8125,"count":12,"key":"1-00-01-10-11-01","obj_size_mean":86.08333333333333,"obj_size_std":32.32634257447669,"ratio":0.36780194218071255,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":112.5,"y":54.6875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":123.75,"y":54.6875,"w":11.25,"h":7.8125,"count":24,"key":"1-00-01-10-11-11","obj_size_mean":169.75,"obj_size_std":101.69145575668117,"ratio":1.1570227854982391,"filtered":false,"direction_mean":175.75592724810667,"direction_std":124.4413581304394,"direction_count":12,"entry_count":6,"exit_count":1},
{"grid_size":87.890625,"x":135,"y":31.25,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":146.25,"y":31.25,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":135,"y":39.0625,"w":11.25,"h":7.8125,"count":32,"key":"1-00-01-11-00-10","obj_size_mean":93.28125,"obj_size_std":23.58270877625822,"ratio":0.2683188198543157,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":146.25,"y":39.0625,"w":11.25,"h":7.8125,"count":15,"key":"1-00-01-11-00-11","obj_size_mean":105.2,"obj_size_std":18.245155912891352,"ratio":0.20758932949778605,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":157.5,"y":31.25,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":135,"y":46.875,"w":5.625,"h":3.90625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":140.625,"y":46.875,"w":5.625,"h":3.90625,"count":13,"key":"1-00-01-11-10-00-01","obj_size_mean":15,"obj_size_std":0,"ratio":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":135,"y":50.78125,"w":5.625,"h":3.90625,"count":4,"key":"1-00-01-11-10-00-10","obj_size_mean":78.5,"obj_size_std":67.28298447601742,"ratio":3.0621233823751925,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":140.625,"y":50.78125,"w":5.625,"h":3.90625,"count":20,"key":"1-00-01-11-10-00-11","obj_size_mean":16.4,"obj_size_std":1.2311740225021852,"ratio":0.05603209773521056,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":146.25,"y":46.875,"w":5.625,"h":3.90625,"count":12,"key":"1-00-01-11-10-01-00","obj_size_mean":12.666666666666666,"obj_size_std":3.550501458394378,"ratio":0.16158726637314857,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":151.875,"y":46.875,"w":5.625,"h":3.90625,"count":37,"key":"1-00-01-11-10-01-01","obj_size_mean":34.270270270270274,"obj_size_std":33.529960606273576,"ratio":1.5259857627032951,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":146.25,"y":50.78125,"w":5.625,"h":3.90625,"count":6,"key":"1-00-01-11-10-01-10","obj_size_mean":44,"obj_size_std":0,"ratio":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":151.875,"y":50.78125,"w":5.625,"h":3.90625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":135,"y":54.6875,"w":11.25,"h":7.8125,"count":44,"key":"1-00-01-11-10-10","obj_size_mean":183.86363636363637,"obj_size_std":46.38694228310723,"ratio":0.5277803210877978,"filtered":false,"direction_mean":251.86304903312322,"direction_std":103.405557085064,"direction_count":34,"entry_count":5,"exit_count":1},
{"grid_size":21.97265625,"x":146.25,"y":54.6875,"w":5.625,"h":3.90625,"count":8,"key":"1-00-01-11-10-11-00","obj_size_mean":23.125,"obj_size_std":9.672309518856984,"ratio":0.44019755321375786,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":151.875,"y":54.6875,"w":5.625,"h":3.90625,"count":10,"key":"1-00-01-11-10-11-01","obj_size_mean":47.5,"obj_size_std":31.323580042304656,"ratio":1.4255709317031096,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":146.25,"y":58.59375,"w":5.625,"h":3.90625,"count":3,"key":"1-00-01-11-10-11-10","obj_size_mean":86.33333333333333,"obj_size_std":59.138256089720244,"ratio":2.6914477438166013,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":151.875,"y":58.59375,"w":5.625,"h":3.90625,"count":29,"key":"1-00-01-11-10-11-11","obj_size_mean":42.96551724137931,"obj_size_std":35.059625495739084,"ratio":1.5956025114505255,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":157.5,"y":46.875,"w":5.625,"h":3.90625,"count":27,"key":"1-00-01-11-11-00-00","obj_size_mean":31.14814814814815,"obj_size_std":18.498864213999116,"ratio":0.8419038646726709,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":163.125,"y":46.875,"w":5.625,"h":3.90625,"count":7,"key":"1-00-01-11-11-00-01","obj_size_mean":103.85714285714286,"obj_size_std":32.595646802543904,"ratio":1.4834641033691092,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":157.5,"y":50.78125,"w":5.625,"h":3.90625,"count":3,"key":"1-00-01-11-11-00-10","obj_size_mean":42.666666666666664,"obj_size_std":25.403411844343534,"ratio":1.1561374990492346,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":163.125,"y":50.78125,"w":5.625,"h":3.90625,"count":17,"key":"1-00-01-11-11-00-11","obj_size_mean":36.294117647058826,"obj_size_std":33.120546315471515,"ratio":1.5073528634241258,"filtered":false,"direction_mean":108.43494882292202,"direction_std":0,"direction_count":1,"entry_count":0,"exit_count":1},
{"grid_size":87.890625,"x":168.75,"y":46.875,"w":11.25,"h":7.8125,"count":21,"key":"1-00-01-11-11-01","obj_size_mean":173.9047619047619,"obj_size_std":30.420231363197686,"ratio":0.3461146323990492,"filtered":false,"direction_mean":166.3844194479936,"direction_std":21.39314069583827,"direction_count":4,"entry_count":0,"exit_count":1},
{"grid_size":87.890625,"x":157.5,"y":54.6875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":168.75,"y":54.6875,"w":11.25,"h":7.8125,"count":26,"key":"1-00-01-11-11-11","obj_size_mean":211.6153846153846,"obj_size_std":56.562939756046575,"ratio":0.6435605590021299,"filtered":false,"direction_mean":128.73937005403926,"direction_std":88.28860444900462,"direction_count":24,"entry_count":0,"exit_count":1},
{"grid_size":5625,"x":0,"y":62.5,"w":90,"h":62.5,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":90,"y":62.5,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":112.5,"y":62.5,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":123.75,"y":62.5,"w":11.25,"h":7.8125,"count":110,"key":"1-00-11-00-01-01","obj_size_mean":107.06363636363636,"obj_size_std":121.37025596301224,"ratio":1.3809238011791616,"filtered":false,"direction_mean":217.72578509910173,"direction_std":76.8032016347595,"direction_count":8,"entry_count":1,"exit_count":0},
{"grid_size":87.890625,"x":112.5,"y":70.3125,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":221.18592516570965,"direction_std":0,"direction_count":1,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":123.75,"y":70.3125,"w":11.25,"h":7.8125,"count":205,"key":"1-00-11-00-01-11","obj_size_mean":102.24878048780488,"obj_size_std":79.51748827857274,"ratio":0.9047323110806499,"filtered":false,"direction_mean":219.47542100414256,"direction_std":70.52427224044204,"direction_count":36,"entry_count":13,"exit_count":0},
{"grid_size":87.890625,"x":90,"y":78.125,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":101.25,"y":78.125,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":90,"y":85.9375,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":101.25,"y":85.9375,"w":11.25,"h":7.8125,"count":4,"key":"1-00-11-00-10-11","obj_size_mean":224.25,"obj_size_std":65.443996414237,"ratio":0.7446072480908744,"filtered":false,"direction_mean":229.6087372057305,"direction_std":9.217474411461012,"direction_count":4,"entry_count":0,"exit_count":1},
{"grid_size":87.890625,"x":112.5,"y":78.125,"w":11.25,"h":7.8125,"count":73,"key":"1-00-11-00-11-00","obj_size_mean":114.97260273972603,"obj_size_std":73.46710764438505,"ratio":0.8358924247538921,"filtered":false,"direction_mean":231.33564829111623,"direction_std":16.672745805076513,"direction_count":13,"entry_count":1,"exit_count":0},
{"grid_size":87.890625,"x":123.75,"y":78.125,"w":11.25,"h":7.8125,"count":254,"key":"1-00-11-00-11-01","obj_size_mean":104.18897637795276,"obj_size_std":87.93477930600764,"ratio":1.0005023778816868,"filtered":false,"direction_mean":231.8591543317174,"direction_std":54.08289318890254,"direction_count":51,"entry_count":7,"exit_count":2},
{"grid_size":87.890625,"x":112.5,"y":85.9375,"w":11.25,"h":7.8125,"count":367,"key":"1-00-11-00-11-10","obj_size_mean":112.4850136239782,"obj_size_std":76.58959658367148,"ratio":0.8714194100186622,"filtered":false,"direction_mean":235.78103878293433,"direction_std":35.720474331543855,"direction_count":55,"entry_count":11,"exit_count":2},
{"grid_size":87.890625,"x":123.75,"y":85.9375,"w":11.25,"h":7.8125,"count":231,"key":"1-00-11-00-11-11","obj_size_mean":158.67099567099567,"obj_size_std":137.36940035936422,"ratio":1.562958510755433,"filtered":false,"direction_mean":224.7097096258967,"direction_std":64.05218123129943,"direction_count":55,"entry_count":5,"exit_count":0},
{"grid_size":87.890625,"x":135,"y":62.5,"w":11.25,"h":7.8125,"count":219,"key":"1-00-11-01-00-00","obj_size_mean":145.56164383561645,"obj_size_std":113.15131376373729,"ratio":1.287410503267411,"filtered":false,"direction_mean":236.17590888363958,"direction_std":84.86573296444705,"direction_count":62,"entry_count":11,"exit_count":5},
{"grid_size":87.890625,"x":146.25,"y":62.5,"w":11.25,"h":7.8125,"count":244,"key":"1-00-11-01-00-01","obj_size_mean":116.83196721311475,"obj_size_std":95.12331417595718,"ratio":1.0822919301797795,"filtered":false,"direction_mean":221.50170656081866,"direction_std":112.39046166044274,"direction_count":49,"entry_count":13,"exit_count":2},
{"grid_size":87.890625,"x":135,"y":70.3125,"w":11.25,"h":7.8125,"count":328,"key":"1-00-11-01-00-10","obj_size_mean":97.7560975609756,"obj_size_std":76.33473860206836,"ratio":0.8685196925390889,"filtered":false,"direction_mean":253.73477199156514,"direction_std":56.21020577821602,"direction_count":54,"entry_count":6,"exit_count":5},
{"grid_size":87.890625,"x":146.25,"y":70.3125,"w":11.25,"h":7.8125,"count":136,"key":"1-00-11-01-00-11","obj_size_mean":219.64705882352942,"obj_size_std":150.92855947553286,"ratio":1.7172316100327294,"filtered":false,"direction_mean":235.88457704575563,"direction_std":88.87934968761182,"direction_count":79,"entry_count":10,"exit_count":1},
{"grid_size":87.890625,"x":157.5,"y":62.5,"w":11.25,"h":7.8125,"count":18,"key":"1-00-11-01-01-00","obj_size_mean":195.66666666666666,"obj_size_std":42.4208605731273,"ratio":0.48265512474313726,"filtered":false,"direction_mean":231.92307692307693,"direction_std":90.79086001501544,"direction_count":13,"entry_count":3,"exit_count":0},
{"grid_size":87.890625,"x":168.75,"y":62.5,"w":11.25,"h":7.8125,"count":6,"key":"1-00-11-01-01-01","obj_size_mean":185.16666666666666,"obj_size_std":33.6952024280411,"ratio":0.3833765254034898,"filtered":false,"direction_mean":108.40785957986087,"direction_std":77.16471092015601,"direction_count":21,"entry_count":0,"exit_count":3},
{"grid_size":87.890625,"x":157.5,"y":70.3125,"w":11.25,"h":7.8125,"count":112,"key":"1-00-11-01-01-10","obj_size_mean":207.49107142857142,"obj_size_std":59.0380844460414,"ratio":0.6717222052527377,"filtered":false,"direction_mean":243.88873741271055,"direction_std":78.9447324824038,"direction_count":84,"entry_count":17,"exit_count":2},
{"grid_size":87.890625,"x":168.75,"y":70.3125,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":227.8155566842112,"direction_std":0,"direction_count":1,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":135,"y":78.125,"w":11.25,"h":7.8125,"count":389,"key":"1-00-11-01-10-00","obj_size_mean":103.92544987146529,"obj_size_std":82.4669699272699,"ratio":0.9382908578391598,"filtered":false,"direction_mean":238.46592120879868,"direction_std":44.29124583259944,"direction_count":56,"entry_count":8,"exit_count":0},
{"grid_size":87.890625,"x":146.25,"y":78.125,"w":11.25,"h":7.8125,"count":134,"key":"1-00-11-01-10-01","obj_size_mean":240.1492537313433,"obj_size_std":210.77185426026662,"ratio":2.398115319583478,"filtered":false,"direction_mean":249.95726294626144,"direction_std":52.4014689372036,"direction_count":85,"entry_count":9,"exit_count":2},
{"grid_size":87.890625,"x":135,"y":85.9375,"w":11.25,"h":7.8125,"count":585,"key":"1-00-11-01-10-10","obj_size_mean":134.17777777777778,"obj_size_std":106.1002329725723,"ratio":1.2071848729323782,"filtered":false,"direction_mean":221.15321015387428,"direction_std":71.66210470290451,"direction_count":108,"entry_count":18,"exit_count":1},
{"grid_size":87.890625,"x":146.25,"y":85.9375,"w":11.25,"h":7.8125,"count":266,"key":"1-00-11-01-10-11","obj_size_mean":187.23684210526315,"obj_size_std":148.3043794942005,"ratio":1.687374273356237,"filtered":false,"direction_mean":236.18195991466817,"direction_std":70.51614058474287,"direction_count":82,"entry_count":13,"exit_count":1},
{"grid_size":87.890625,"x":157.5,"y":78.125,"w":11.25,"h":7.8125,"count":570,"key":"1-00-11-01-11-00","obj_size_mean":115.3280701754386,"obj_size_std":102.68548437347114,"ratio":1.1683326222048271,"filtered":false,"direction_mean":232.74572292082303,"direction_std":81.5898997326806,"direction_count":90,"entry_count":8,"exit_count":5},
{"grid_size":87.890625,"x":168.75,"y":78.125,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":249.0850167767428,"direction_std":59.404934457370445,"direction_count":5,"entry_count":0,"exit_count":1},
{"grid_size":87.890625,"x":157.5,"y":85.9375,"w":11.25,"h":7.8125,"count":641,"key":"1-00-11-01-11-10","obj_size_mean":112.87363494539781,"obj_size_std":77.95015198460348,"ratio":0.8868995070248218,"filtered":false,"direction_mean":241.60574976873798,"direction_std":62.41943724568952,"direction_count":86,"entry_count":9,"exit_count":2},
{"grid_size":87.890625,"x":168.75,"y":85.9375,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":213.23300816223832,"direction_std":38.765801816604416,"direction_count":4,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":90,"y":93.75,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":101.25,"y":93.75,"w":11.25,"h":7.8125,"count":17,"key":"1-00-11-10-00-01","obj_size_mean":282.52941176470586,"obj_size_std":180.92233058935085,"ratio":2.0584940724832808,"filtered":false,"direction_mean":239.0028849353138,"direction_std":20.826043183558564,"direction_count":19,"entry_count":3,"exit_count":0},
{"grid_size":87.890625,"x":90,"y":101.5625,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":236.3099324740202,"direction_std":0,"direction_count":1,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":101.25,"y":101.5625,"w":11.25,"h":7.8125,"count":132,"key":"1-00-11-10-00-11","obj_size_mean":211.1818181818182,"obj_size_std":88.94031090309505,"ratio":1.0119430929418816,"filtered":false,"direction_mean":229.3585130787863,"direction_std":42.19880756010411,"direction_count":110,"entry_count":24,"exit_count":1},
{"grid_size":87.890625,"x":112.5,"y":93.75,"w":11.25,"h":7.8125,"count":533,"key":"1-00-11-10-01-00","obj_size_mean":125.45778611632271,"obj_size_std":97.00422729517837,"ratio":1.103692541669585,"filtered":false,"direction_mean":226.75543268614587,"direction_std":46.61143401963911,"direction_count":84,"entry_count":13,"exit_count":1},
{"grid_size":87.890625,"x":123.75,"y":93.75,"w":11.25,"h":7.8125,"count":391,"key":"1-00-11-10-01-01","obj_size_mean":141.3631713554987,"obj_size_std":129.65508909160712,"ratio":1.4751867914422856,"filtered":false,"direction_mean":231.08829584766204,"direction_std":57.54387764495788,"direction_count":50,"entry_count":10,"exit_count":2},
{"grid_size":87.890625,"x":112.5,"y":101.5625,"w":11.25,"h":7.8125,"count":184,"key":"1-00-11-10-01-10","obj_size_mean":164.08152173913044,"obj_size_std":145.1713849999657,"ratio":1.6517277582218322,"filtered":false,"direction_mean":222.8985732526337,"direction_std":53.33888570819659,"direction_count":38,"entry_count":9,"exit_count":0},
{"grid_size":87.890625,"x":123.75,"y":101.5625,"w":11.25,"h":7.8125,"count":141,"key":"1-00-11-10-01-11","obj_size_mean":200.13475177304966,"obj_size_std":167.42171816183043,"ratio":1.9048871044190485,"filtered":false,"direction_mean":245.60312413321034,"direction_std":41.13654162087433,"direction_count":80,"entry_count":16,"exit_count":0},
{"grid_size":87.890625,"x":90,"y":109.375,"w":11.25,"h":7.8125,"count":23,"key":"1-00-11-10-10-00","obj_size_mean":248.30434782608697,"obj_size_std":88.51524510840373,"ratio":1.007106788788949,"filtered":false,"direction_mean":241.9404626201672,"direction_std":17.93757088989639,"direction_count":19,"entry_count":2,"exit_count":0},
{"grid_size":87.890625,"x":101.25,"y":109.375,"w":11.25,"h":7.8125,"count":280,"key":"1-00-11-10-10-01","obj_size_mean":209.64642857142857,"obj_size_std":83.88424342773145,"ratio":0.9544162807777444,"filtered":false,"direction_mean":236.4619434838372,"direction_std":17.573890744120614,"direction_count":235,"entry_count":65,"exit_count":0},
{"grid_size":87.890625,"x":90,"y":117.1875,"w":11.25,"h":7.8125,"count":177,"key":"1-00-11-10-10-10","obj_size_mean":229.35593220338984,"obj_size_std":63.7386610357618,"ratio":0.7252043211180009,"filtered":false,"direction_mean":235.92999843637742,"direction_std":17.46483213420184,"direction_count":202,"entry_count":30,"exit_count":0},
{"grid_size":87.890625,"x":101.25,"y":117.1875,"w":11.25,"h":7.8125,"count":172,"key":"1-00-11-10-10-11","obj_size_mean":255.97093023255815,"obj_size_std":186.1792956914353,"ratio":2.1183066532003307,"filtered":false,"direction_mean":235.59512689714848,"direction_std":29.85227338428136,"direction_count":168,"entry_count":41,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":282.2167577413479,"obj_size_std":191.50568022406478,"x":112.5,"y":109.375,"w":22.5,"h":15.625,"count":549,"ratio":0.5447272681928954,"filtered":false,"direction_mean":241.66879964922612,"direction_std":29.943671024116366,"direction_count":517,"entry_count":96,"exit_count":1},
{"grid_size":87.890625,"x":135,"y":93.75,"w":11.25,"h":7.8125,"count":542,"key":"1-00-11-11-00-00","obj_size_mean":137.34317343173433,"obj_size_std":138.01974308758332,"ratio":1.5703579657965037,"filtered":false,"direction_mean":221.65317402895596,"direction_std":77.63507464159086,"direction_count":91,"entry_count":18,"exit_count":0},
{"grid_size":87.890625,"x":146.25,"y":93.75,"w":11.25,"h":7.8125,"count":510,"key":"1-00-11-11-00-01","obj_size_mean":168.3607843137255,"obj_size_std":137.64439544928018,"ratio":1.5660873437784768,"filtered":false,"direction_mean":236.3064316341645,"direction_std":73.96641886796851,"direction_count":103,"entry_count":22,"exit_count":0},
{"grid_size":87.890625,"x":135,"y":101.5625,"w":11.25,"h":7.8125,"count":109,"key":"1-00-11-11-00-10","obj_size_mean":209.6605504587156,"obj_size_std":277.42133420136344,"ratio":3.156438291357735,"filtered":false,"direction_mean":251.7329499603221,"direction_std":51.12130027602702,"direction_count":37,"entry_count":9,"exit_count":0},
{"grid_size":87.890625,"x":146.25,"y":101.5625,"w":11.25,"h":7.8125,"count":397,"key":"1-00-11-11-00-11","obj_size_mean":168.7153652392947,"obj_size_std":106.64889572931794,"ratio":1.213427435853573,"filtered":false,"direction_mean":250.14219164574536,"direction_std":58.81767380326684,"direction_count":165,"entry_count":42,"exit_count":0},
{"grid_size":87.890625,"x":157.5,"y":93.75,"w":11.25,"h":7.8125,"count":576,"key":"1-00-11-11-01-00","obj_size_mean":130.05729166666666,"obj_size_std":93.81555548568154,"ratio":1.0674125424148655,"filtered":false,"direction_mean":235.21018628189563,"direction_std":80.60884312894842,"direction_count":86,"entry_count":21,"exit_count":0},
{"grid_size":87.890625,"x":168.75,"y":93.75,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":195.05305030336956,"direction_std":44.27949615772362,"direction_count":3,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":157.5,"y":101.5625,"w":11.25,"h":7.8125,"count":268,"key":"1-00-11-11-01-10","obj_size_mean":174.33582089552237,"obj_size_std":92.91375276906388,"ratio":1.0571520315057934,"filtered":false,"direction_mean":254.7153545116868,"direction_std":51.750116815935655,"direction_count":77,"entry_count":27,"exit_count":0},
{"grid_size":87.890625,"x":168.75,"y":101.5625,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":193.87213081761035,"direction_std":16.825177078297145,"direction_count":2,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":267.3867102396514,"obj_size_std":174.23408250041106,"x":135,"y":109.375,"w":22.5,"h":15.625,"count":918,"ratio":0.49559916800116927,"filtered":false,"direction_mean":255.7420584538706,"direction_std":31.64587925440993,"direction_count":935,"entry_count":142,"exit_count":1},
{"grid_size":87.890625,"x":157.5,"y":109.375,"w":11.25,"h":7.8125,"count":181,"key":"1-00-11-11-11-00","obj_size_mean":222.77900552486187,"obj_size_std":84.15974097647728,"ratio":0.957550830665697,"filtered":false,"direction_mean":245.61326871886465,"direction_std":43.87653769968154,"direction_count":141,"entry_count":33,"exit_count":0},
{"grid_size":87.890625,"x":168.75,"y":109.375,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":213.07067782276167,"direction_std":0,"direction_count":1,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":157.5,"y":117.1875,"w":11.25,"h":7.8125,"count":78,"key":"1-00-11-11-11-10","obj_size_mean":241.32051282051282,"obj_size_std":78.85009509085893,"ratio":0.8971388597004394,"filtered":false,"direction_mean":259.7630813551504,"direction_std":16.987047213884658,"direction_count":66,"entry_count":6,"exit_count":0},
{"grid_size":87.890625,"x":168.75,"y":117.1875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":174.384689878313,"direction_std":18.339082337492435,"direction_count":2,"entry_count":0,"exit_count":0},
{"grid_size":1406.25,"x":180,"y":0,"w":45,"h":31.25,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":1406.25,"x":225,"y":0,"w":45,"h":31.25,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":180,"y":31.25,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":202.5,"y":31.25,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":180,"y":46.875,"w":11.25,"h":7.8125,"count":51,"key":"1-01-00-10-10-00","obj_size_mean":180.2156862745098,"obj_size_std":31.2942893994992,"ratio":0.35605947050096864,"filtered":false,"direction_mean":169.78283800539143,"direction_std":57.28891902862684,"direction_count":33,"entry_count":0,"exit_count":4},
{"grid_size":87.890625,"x":191.25,"y":46.875,"w":11.25,"h":7.8125,"count":6,"key":"1-01-00-10-10-01","obj_size_mean":167.83333333333334,"obj_size_std":30.386948952908497,"ratio":0.34573595253087,"filtered":false,"direction_mean":168.75,"direction_std":22.5,"direction_count":4,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":180,"y":54.6875,"w":11.25,"h":7.8125,"count":1779,"key":"1-01-00-10-10-10","obj_size_mean":238.1292861157954,"obj_size_std":81.42928869563202,"ratio":0.9264843513814133,"filtered":false,"direction_mean":144.14548089599938,"direction_std":73.76615480164222,"direction_count":960,"entry_count":0,"exit_count":52},
{"grid_size":87.890625,"x":191.25,"y":54.6875,"w":11.25,"h":7.8125,"count":308,"key":"1-01-00-10-10-11","obj_size_mean":269.4577922077922,"obj_size_std":108.50401831822181,"ratio":1.234534608420657,"filtered":false,"direction_mean":151.609522508523,"direction_std":66.2353521277568,"direction_count":211,"entry_count":0,"exit_count":3},
{"grid_size":87.890625,"x":202.5,"y":46.875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":213.75,"y":46.875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":202.5,"y":54.6875,"w":11.25,"h":7.8125,"count":138,"key":"1-01-00-10-11-10","obj_size_mean":172.4927536231884,"obj_size_std":120.05626700167221,"ratio":1.3659735267745816,"filtered":false,"direction_mean":144.46087372057303,"direction_std":66.97866519786854,"direction_count":40,"entry_count":0,"exit_count":1},
{"grid_size":87.890625,"x":213.75,"y":54.6875,"w":11.25,"h":7.8125,"count":20,"key":"1-01-00-10-11-11","obj_size_mean":287.15,"obj_size_std":59.104969067084824,"ratio":0.6724832036077206,"filtered":false,"direction_mean":98.855017059026,"direction_std":77.09980139669561,"direction_count":3,"entry_count":0,"exit_count":0},
{"grid_size":1406.25,"x":225,"y":31.25,"w":45,"h":31.25,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":5625,"x":270,"y":0,"w":90,"h":62.5,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":316.8559088402867,"obj_size_std":166.6215235430525,"x":180,"y":62.5,"w":22.5,"h":15.625,"count":10882,"ratio":0.4739456669669049,"filtered":false,"direction_mean":142.63374609697013,"direction_std":73.22122208681286,"direction_count":6874,"entry_count":2,"exit_count":123},
{"grid_size":351.5625,"obj_size_mean":290.03268160411017,"obj_size_std":155.42954465232802,"x":202.5,"y":62.5,"w":22.5,"h":15.625,"count":7007,"ratio":0.4421107047888441,"filtered":false,"direction_mean":141.81651456255508,"direction_std":59.27433583649843,"direction_count":4749,"entry_count":4,"exit_count":103},
{"grid_size":87.890625,"x":180,"y":78.125,"w":11.25,"h":7.8125,"count":4097,"key":"1-01-10-00-10-00","obj_size_mean":161.39736392482305,"obj_size_std":96.91280649822278,"ratio":1.1026523761575568,"filtered":false,"direction_mean":122.99533772242933,"direction_std":65.886166670063,"direction_count":1508,"entry_count":2,"exit_count":63},
{"grid_size":87.890625,"x":191.25,"y":78.125,"w":11.25,"h":7.8125,"count":545,"key":"1-01-10-00-10-01","obj_size_mean":312.70642201834863,"obj_size_std":276.49764993258185,"ratio":3.145928817010709,"filtered":false,"direction_mean":139.86292267138663,"direction_std":86.67337835946276,"direction_count":334,"entry_count":1,"exit_count":5},
{"grid_size":87.890625,"x":180,"y":85.9375,"w":11.25,"h":7.8125,"count":3966,"key":"1-01-10-00-10-10","obj_size_mean":162.59858799798286,"obj_size_std":73.25159695885202,"ratio":0.8334403920651607,"filtered":false,"direction_mean":113.59699954054693,"direction_std":56.12496744189553,"direction_count":1775,"entry_count":1,"exit_count":54},
{"grid_size":87.890625,"x":191.25,"y":85.9375,"w":11.25,"h":7.8125,"count":536,"key":"1-01-10-00-10-11","obj_size_mean":238.88432835820896,"obj_size_std":180.6150179965753,"ratio":2.054997538094368,"filtered":false,"direction_mean":122.87031576733327,"direction_std":66.59244630391714,"direction_count":316,"entry_count":1,"exit_count":14},
{"grid_size":351.5625,"obj_size_mean":303.06615485135575,"obj_size_std":166.5096901586409,"x":202.5,"y":78.125,"w":22.5,"h":15.625,"count":6122,"ratio":0.4736275631179119,"filtered":false,"direction_mean":130.34590453412574,"direction_std":59.67579396235075,"direction_count":5257,"entry_count":12,"exit_count":102},
{"grid_size":351.5625,"x":225,"y":62.5,"w":22.5,"h":15.625,"count":31,"key":"1-01-10-01-00","obj_size_mean":444.2903225806452,"obj_size_std":150.73291910934984,"ratio":0.428751414355484,"filtered":false,"direction_mean":133.75044368297011,"direction_std":45.3571089184784,"direction_count":23,"entry_count":0,"exit_count":1},
{"grid_size":351.5625,"x":247.5,"y":62.5,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":225,"y":78.125,"w":11.25,"h":7.8125,"count":1319,"key":"1-01-10-01-10-00","obj_size_mean":216.29946929492039,"obj_size_std":131.6235455619692,"ratio":1.497583451727294,"filtered":false,"direction_mean":128.94791615576173,"direction_std":44.16765440153731,"direction_count":966,"entry_count":1,"exit_count":21},
{"grid_size":87.890625,"x":236.25,"y":78.125,"w":11.25,"h":7.8125,"count":18,"key":"1-01-10-01-10-01","obj_size_mean":117,"obj_size_std":0,"ratio":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":225,"y":85.9375,"w":11.25,"h":7.8125,"count":5086,"key":"1-01-10-01-10-10","obj_size_mean":194.36354699174203,"obj_size_std":117.37897242049812,"ratio":1.3355118639843342,"filtered":false,"direction_mean":125.79132985195214,"direction_std":43.38334799878351,"direction_count":2802,"entry_count":0,"exit_count":49},
{"grid_size":87.890625,"x":236.25,"y":85.9375,"w":11.25,"h":7.8125,"count":92,"key":"1-01-10-01-10-11","obj_size_mean":345.4021739130435,"obj_size_std":275.35252369083975,"ratio":3.1328998251046656,"filtered":false,"direction_mean":131.18876547292038,"direction_std":49.903708068995456,"direction_count":76,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":247.5,"y":78.125,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":180,"y":93.75,"w":11.25,"h":7.8125,"count":1652,"key":"1-01-10-10-00-00","obj_size_mean":208.385593220339,"obj_size_std":71.22164658251943,"ratio":0.8103440677833321,"filtered":false,"direction_mean":102.86115363847514,"direction_std":42.778048960364224,"direction_count":1111,"entry_count":1,"exit_count":15},
{"grid_size":87.890625,"x":191.25,"y":93.75,"w":11.25,"h":7.8125,"count":1050,"key":"1-01-10-10-00-01","obj_size_mean":230.52190476190475,"obj_size_std":104.52894927073486,"ratio":1.1893071561470276,"filtered":false,"direction_mean":107.07245614221407,"direction_std":48.41399364008251,"direction_count":963,"entry_count":1,"exit_count":23},
{"grid_size":87.890625,"x":180,"y":101.5625,"w":11.25,"h":7.8125,"count":670,"key":"1-01-10-10-00-10","obj_size_mean":222.8865671641791,"obj_size_std":62.44836885741201,"ratio":0.7105236634443322,"filtered":false,"direction_mean":102.95742349467886,"direction_std":42.06480589652604,"direction_count":407,"entry_count":0,"exit_count":3},
{"grid_size":87.890625,"x":191.25,"y":101.5625,"w":11.25,"h":7.8125,"count":2818,"key":"1-01-10-10-00-11","obj_size_mean":230.26614620298085,"obj_size_std":72.87473604153297,"ratio":0.8291525522947751,"filtered":false,"direction_mean":102.0759690328775,"direction_std":43.183771303401535,"direction_count":2099,"entry_count":1,"exit_count":32},
{"grid_size":87.890625,"x":202.5,"y":93.75,"w":11.25,"h":7.8125,"count":1499,"key":"1-01-10-10-01-00","obj_size_mean":191.3822548365577,"obj_size_std":110.96720058103728,"ratio":1.2625601488331353,"filtered":false,"direction_mean":118.1936887466572,"direction_std":51.02567270932324,"direction_count":841,"entry_count":0,"exit_count":19},
{"grid_size":87.890625,"x":213.75,"y":93.75,"w":11.25,"h":7.8125,"count":1131,"key":"1-01-10-10-01-01","obj_size_mean":236.28205128205127,"obj_size_std":202.6069411176795,"ratio":2.3052167522722646,"filtered":false,"direction_mean":109.92002333256842,"direction_std":63.12708275015181,"direction_count":404,"entry_count":0,"exit_count":8},
{"grid_size":87.890625,"x":202.5,"y":101.5625,"w":11.25,"h":7.8125,"count":853,"key":"1-01-10-10-01-10","obj_size_mean":177.04572098475967,"obj_size_std":98.43074599383714,"ratio":1.119923154418769,"filtered":false,"direction_mean":129.31409972308978,"direction_std":55.08085123133362,"direction_count":311,"entry_count":0,"exit_count":8},
{"grid_size":87.890625,"x":213.75,"y":101.5625,"w":11.25,"h":7.8125,"count":3397,"key":"1-01-10-10-01-11","obj_size_mean":192.27877539005004,"obj_size_std":106.67157720178633,"ratio":1.213685500606991,"filtered":false,"direction_mean":118.42718333047516,"direction_std":48.55290728007436,"direction_count":1573,"entry_count":0,"exit_count":42},
{"grid_size":87.890625,"x":180,"y":109.375,"w":11.25,"h":7.8125,"count":438,"key":"1-01-10-10-10-00","obj_size_mean":222.63013698630138,"obj_size_std":57.19467903016276,"ratio":0.6507483480765185,"filtered":false,"direction_mean":130.97610878119693,"direction_std":67.83804430645867,"direction_count":163,"entry_count":0,"exit_count":2},
{"grid_size":87.890625,"x":191.25,"y":109.375,"w":11.25,"h":7.8125,"count":3770,"key":"1-01-10-10-10-01","obj_size_mean":240.46684350132625,"obj_size_std":66.55460626931831,"ratio":0.7572435202197995,"filtered":false,"direction_mean":103.37562794587843,"direction_std":40.03194120288969,"direction_count":3125,"entry_count":0,"exit_count":33},
{"grid_size":87.890625,"x":180,"y":117.1875,"w":11.25,"h":7.8125,"count":49,"key":"1-01-10-10-10-10","obj_size_mean":244.3469387755102,"obj_size_std":66.14899565262,"ratio":0.7526285727586987,"filtered":false,"direction_mean":111.86630778612776,"direction_std":58.02116323033784,"direction_count":15,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":191.25,"y":117.1875,"w":11.25,"h":7.8125,"count":2960,"key":"1-01-10-10-10-11","obj_size_mean":268.9266891891892,"obj_size_std":70.56254213583279,"ratio":0.8028449238565863,"filtered":false,"direction_mean":99.97800585960596,"direction_std":29.83280496678211,"direction_count":3003,"entry_count":0,"exit_count":17},
{"grid_size":87.890625,"x":202.5,"y":109.375,"w":11.25,"h":7.8125,"count":73,"key":"1-01-10-10-11-00","obj_size_mean":238.8904109589041,"obj_size_std":134.77857990503406,"ratio":1.5334807313639431,"filtered":false,"direction_mean":155.43484982517555,"direction_std":69.36267139057165,"direction_count":45,"entry_count":0,"exit_count":2},
{"grid_size":87.890625,"x":213.75,"y":109.375,"w":11.25,"h":7.8125,"count":2877,"key":"1-01-10-10-11-01","obj_size_mean":234.2082029892249,"obj_size_std":100.04434045892555,"ratio":1.1382822736659974,"filtered":false,"direction_mean":116.0453385675617,"direction_std":42.591283543669405,"direction_count":2483,"entry_count":1,"exit_count":58},
{"grid_size":87.890625,"x":202.5,"y":117.1875,"w":11.25,"h":7.8125,"count":5,"key":"1-01-10-10-11-10","obj_size_mean":347.8,"obj_size_std":135.1784006415226,"ratio":1.538029802854657,"filtered":false,"direction_mean":174.15369473569655,"direction_std":85.74065148236988,"direction_count":4,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":213.75,"y":117.1875,"w":11.25,"h":7.8125,"count":2126,"key":"1-01-10-10-11-11","obj_size_mean":252.62841015992475,"obj_size_std":92.83348392883528,"ratio":1.0562387504791926,"filtered":false,"direction_mean":111.6676763050157,"direction_std":30.81273267162888,"direction_count":2307,"entry_count":1,"exit_count":16},
{"grid_size":351.5625,"obj_size_mean":256.6461116820829,"obj_size_std":165.58451964145814,"x":225,"y":93.75,"w":22.5,"h":15.625,"count":5838,"ratio":0.4709959669801476,"filtered":false,"direction_mean":121.4700012807412,"direction_std":35.20428654876407,"direction_count":5086,"entry_count":1,"exit_count":88},
{"grid_size":351.5625,"x":247.5,"y":93.75,"w":22.5,"h":15.625,"count":56,"key":"1-01-10-11-01","obj_size_mean":736.9821428571429,"obj_size_std":452.7315677115937,"ratio":1.2877697926018665,"filtered":false,"direction_mean":126.51171189571295,"direction_std":26.315482650334086,"direction_count":44,"entry_count":0,"exit_count":1},
{"grid_size":351.5625,"obj_size_mean":312.4606993006993,"obj_size_std":246.91750695351246,"x":225,"y":109.375,"w":22.5,"h":15.625,"count":3575,"ratio":0.702343130889991,"filtered":false,"direction_mean":123.36882273783498,"direction_std":28.9765880594245,"direction_count":3719,"entry_count":0,"exit_count":33},
{"grid_size":351.5625,"obj_size_mean":345.1316504854369,"obj_size_std":233.04683907696048,"x":247.5,"y":109.375,"w":22.5,"h":15.625,"count":2575,"ratio":0.6628887867077987,"filtered":false,"direction_mean":122.74011362446593,"direction_std":26.21139637269016,"direction_count":2558,"entry_count":2,"exit_count":4},
{"grid_size":1406.25,"x":270,"y":62.5,"w":45,"h":31.25,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":1406.25,"x":315,"y":62.5,"w":45,"h":31.25,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":270,"y":93.75,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":292.5,"y":93.75,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":270,"y":109.375,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":292.5,"y":109.375,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":303.75,"y":109.375,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":292.5,"y":117.1875,"w":11.25,"h":7.8125,"count":3,"key":"1-01-11-10-11-10","obj_size_mean":154.66666666666666,"obj_size_std":11.060440015358038,"ratio":0.1258432286191848,"filtered":false,"direction_mean":103.28252558853899,"direction_std":82.4239381366688,"direction_count":2,"entry_count":0,"exit_count":2},
{"grid_size":87.890625,"x":303.75,"y":117.1875,"w":11.25,"h":7.8125,"count":5,"key":"1-01-11-10-11-11","obj_size_mean":162.2,"obj_size_std":8.843076387773657,"ratio":0.10061455801200249,"filtered":false,"direction_mean":135.5021312506972,"direction_std":107.38566908612323,"direction_count":6,"entry_count":0,"exit_count":2},
{"grid_size":351.5625,"x":315,"y":93.75,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":337.5,"y":93.75,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":315,"y":109.375,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":326.25,"y":109.375,"w":11.25,"h":7.8125,"count":24,"key":"1-01-11-11-10-01","obj_size_mean":68.75,"obj_size_std":12.742431683842426,"ratio":0.14498055604727383,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":315,"y":117.1875,"w":11.25,"h":7.8125,"count":117,"key":"1-01-11-11-10-10","obj_size_mean":94.8974358974359,"obj_size_std":53.47338761499848,"ratio":0.6084083213084271,"filtered":false,"direction_mean":169.25813139713472,"direction_std":74.3963051058353,"direction_count":16,"entry_count":1,"exit_count":2},
{"grid_size":87.890625,"x":326.25,"y":117.1875,"w":11.25,"h":7.8125,"count":111,"key":"1-01-11-11-10-11","obj_size_mean":146.03603603603602,"obj_size_std":126.70250969229441,"ratio":1.4415929991656609,"filtered":false,"direction_mean":189.93686152452622,"direction_std":72.46805425735535,"direction_count":24,"entry_count":8,"exit_count":2},
{"grid_size":351.5625,"x":337.5,"y":109.375,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":116.56505117707798,"direction_std":0,"direction_count":1,"entry_count":0,"exit_count":0},
{"grid_size":1406.25,"x":0,"y":125,"w":45,"h":31.25,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":45,"y":125,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":325.0846153846154,"obj_size_std":169.22046693040863,"x":67.5,"y":125,"w":22.5,"h":15.625,"count":130,"ratio":0.48133821704649565,"filtered":false,"direction_mean":237.42230853399482,"direction_std":11.129768580373346,"direction_count":142,"entry_count":5,"exit_count":0},
{"grid_size":351.5625,"x":45,"y":140.625,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":347.7308248914616,"obj_size_std":149.83285341170165,"x":67.5,"y":140.625,"w":22.5,"h":15.625,"count":691,"ratio":0.4261912274821736,"filtered":false,"direction_mean":238.88165227496847,"direction_std":17.343327494915457,"direction_count":644,"entry_count":16,"exit_count":3},
{"grid_size":1406.25,"x":0,"y":156.25,"w":45,"h":31.25,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":228.81407483429035,"direction_std":0,"direction_count":1,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":45,"y":156.25,"w":22.5,"h":15.625,"count":34,"key":"1-10-00-11-00","obj_size_mean":440.0882352941176,"obj_size_std":276.4838060518422,"ratio":0.7864428261030177,"filtered":false,"direction_mean":236.6145858462613,"direction_std":12.091267119578328,"direction_count":28,"entry_count":1,"exit_count":1},
{"grid_size":351.5625,"x":67.5,"y":156.25,"w":22.5,"h":15.625,"count":643,"key":"1-10-00-11-01","obj_size_mean":426.89113530326597,"obj_size_std":173.31099655144834,"ratio":0.4929735013018975,"filtered":false,"direction_mean":238.53509040048712,"direction_std":13.357910360757653,"direction_count":532,"entry_count":14,"exit_count":0},
{"grid_size":351.5625,"x":45,"y":171.875,"w":22.5,"h":15.625,"count":408,"key":"1-10-00-11-10","obj_size_mean":566.1617647058823,"obj_size_std":245.00655019840045,"ratio":0.696907520564339,"filtered":false,"direction_mean":237.88718370658304,"direction_std":18.386588909844622,"direction_count":350,"entry_count":6,"exit_count":0},
{"grid_size":351.5625,"x":67.5,"y":171.875,"w":22.5,"h":15.625,"count":185,"key":"1-10-00-11-11","obj_size_mean":518.4378378378378,"obj_size_std":272.97317847952155,"ratio":0.7764570410084168,"filtered":false,"direction_mean":236.00171442672269,"direction_std":33.537022053095484,"direction_count":135,"entry_count":1,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":282.6501501501501,"obj_size_std":229.42581314407394,"x":90,"y":125,"w":22.5,"h":15.625,"count":666,"ratio":0.6525889796098103,"filtered":false,"direction_mean":237.23221159141224,"direction_std":17.05712491279419,"direction_count":644,"entry_count":56,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":314.8711453744493,"obj_size_std":192.96329555981984,"x":112.5,"y":125,"w":22.5,"h":15.625,"count":908,"ratio":0.5488733740368209,"filtered":false,"direction_mean":250.1237263332581,"direction_std":20.07811987628257,"direction_count":837,"entry_count":121,"exit_count":1},
{"grid_size":351.5625,"x":90,"y":140.625,"w":22.5,"h":15.625,"count":175,"key":"1-10-01-00-10","obj_size_mean":493.0571428571429,"obj_size_std":448.48496834439214,"ratio":1.2756905766240487,"filtered":false,"direction_mean":244.0558726733375,"direction_std":23.34716571283399,"direction_count":167,"entry_count":10,"exit_count":0},
{"grid_size":351.5625,"x":112.5,"y":140.625,"w":22.5,"h":15.625,"count":757,"key":"1-10-01-00-11","obj_size_mean":431.41875825627477,"obj_size_std":286.39582132611395,"ratio":0.8146370028831685,"filtered":false,"direction_mean":249.25060643813126,"direction_std":16.856195919230558,"direction_count":680,"entry_count":33,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":308.26271186440675,"obj_size_std":149.99208505926515,"x":135,"y":125,"w":22.5,"h":15.625,"count":1180,"ratio":0.42664415305746534,"filtered":false,"direction_mean":260.0986351891933,"direction_std":16.840898896606294,"direction_count":1161,"entry_count":72,"exit_count":1},
{"grid_size":351.5625,"x":157.5,"y":125,"w":22.5,"h":15.625,"count":25,"key":"1-10-01-01-01","obj_size_mean":269,"obj_size_std":76.81850905435053,"ratio":0.2185059813101526,"filtered":false,"direction_mean":257.7168380271174,"direction_std":26.882502205340803,"direction_count":11,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":135,"y":140.625,"w":22.5,"h":15.625,"count":1206,"key":"1-10-01-01-10","obj_size_mean":404.61442786069654,"obj_size_std":178.03114490209146,"ratio":0.5063997010548379,"filtered":false,"direction_mean":260.0372993648044,"direction_std":17.932441571869013,"direction_count":1064,"entry_count":35,"exit_count":1},
{"grid_size":351.5625,"x":157.5,"y":140.625,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":270,"direction_std":0,"direction_count":1,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":90,"y":156.25,"w":22.5,"h":15.625,"count":518,"key":"1-10-01-10-00","obj_size_mean":533.6679536679536,"obj_size_std":360.6814871599925,"ratio":1.025938452366201,"filtered":false,"direction_mean":249.4956857700884,"direction_std":15.269072391808468,"direction_count":498,"entry_count":14,"exit_count":0},
{"grid_size":351.5625,"x":112.5,"y":156.25,"w":22.5,"h":15.625,"count":265,"key":"1-10-01-10-01","obj_size_mean":680.1396226415094,"obj_size_std":446.5177464064756,"ratio":1.2700949231117529,"filtered":false,"direction_mean":252.5830030022738,"direction_std":14.600753113423787,"direction_count":236,"entry_count":8,"exit_count":0},
{"grid_size":351.5625,"x":90,"y":171.875,"w":22.5,"h":15.625,"count":647,"key":"1-10-01-10-10","obj_size_mean":713.596599690881,"obj_size_std":453.553983857765,"ratio":1.290109109639865,"filtered":false,"direction_mean":252.2984665768725,"direction_std":18.026829329406752,"direction_count":587,"entry_count":11,"exit_count":0},
{"grid_size":351.5625,"x":112.5,"y":171.875,"w":22.5,"h":15.625,"count":104,"key":"1-10-01-10-11","obj_size_mean":1167.1923076923076,"obj_size_std":820.9355553024071,"ratio":2.335105579526847,"filtered":false,"direction_mean":254.87450643541078,"direction_std":14.99638819870041,"direction_count":75,"entry_count":1,"exit_count":0},
{"grid_size":351.5625,"x":135,"y":156.25,"w":22.5,"h":15.625,"count":928,"key":"1-10-01-11-00","obj_size_mean":514.9450431034483,"obj_size_std":204.75706182183237,"ratio":0.5824200869598787,"filtered":false,"direction_mean":260.38125492260184,"direction_std":16.610529953838075,"direction_count":875,"entry_count":15,"exit_count":0},
{"grid_size":351.5625,"x":157.5,"y":156.25,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":135,"y":171.875,"w":22.5,"h":15.625,"count":891,"key":"1-10-01-11-10","obj_size_mean":663.0314253647587,"obj_size_std":262.9302533229304,"ratio":0.7478904983407798,"filtered":false,"direction_mean":261.9456123676774,"direction_std":16.943215882053096,"direction_count":757,"entry_count":11,"exit_count":0},
{"grid_size":351.5625,"x":157.5,"y":171.875,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":0,"y":187.5,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":22.5,"y":187.5,"w":22.5,"h":15.625,"count":23,"key":"1-10-10-00-01","obj_size_mean":784.3478260869565,"obj_size_std":593.2327160027239,"ratio":1.687417503296637,"filtered":false,"direction_mean":233.12960919790598,"direction_std":7.5473472969326565,"direction_count":6,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":0,"y":203.125,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":22.5,"y":203.125,"w":22.5,"h":15.625,"count":224,"key":"1-10-10-00-11","obj_size_mean":748.9241071428571,"obj_size_std":335.37892169943467,"ratio":0.9539667106117253,"filtered":false,"direction_mean":233.47503287018378,"direction_std":24.082659170389356,"direction_count":192,"entry_count":5,"exit_count":1},
{"grid_size":351.5625,"x":45,"y":187.5,"w":22.5,"h":15.625,"count":504,"key":"1-10-10-01-00","obj_size_mean":611.156746031746,"obj_size_std":238.06713646644926,"ratio":0.677168743726789,"filtered":false,"direction_mean":238.65824027627625,"direction_std":16.545852478340077,"direction_count":393,"entry_count":8,"exit_count":0},
{"grid_size":351.5625,"x":67.5,"y":187.5,"w":22.5,"h":15.625,"count":62,"key":"1-10-10-01-01","obj_size_mean":841.8709677419355,"obj_size_std":620.0014670493213,"ratio":1.763559728495847,"filtered":false,"direction_mean":234.9252473153169,"direction_std":32.76294279100702,"direction_count":29,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":45,"y":203.125,"w":22.5,"h":15.625,"count":282,"key":"1-10-10-01-10","obj_size_mean":648.5673758865248,"obj_size_std":332.4014488571645,"ratio":0.9454974545270457,"filtered":false,"direction_mean":236.84811425124093,"direction_std":29.978394709510667,"direction_count":214,"entry_count":7,"exit_count":1},
{"grid_size":351.5625,"x":67.5,"y":203.125,"w":22.5,"h":15.625,"count":153,"key":"1-10-10-01-11","obj_size_mean":928.2483660130719,"obj_size_std":723.9562657720435,"ratio":2.059253378196035,"filtered":false,"direction_mean":242.76686913325432,"direction_std":20.721129295395187,"direction_count":116,"entry_count":1,"exit_count":2},
{"grid_size":351.5625,"x":0,"y":218.75,"w":22.5,"h":15.625,"count":49,"key":"1-10-10-10-00","obj_size_mean":754.9183673469388,"obj_size_std":573.9830803522108,"ratio":1.6326629841129552,"filtered":false,"direction_mean":242.54223840462237,"direction_std":18.833449741790577,"direction_count":5,"entry_count":0,"exit_count":1},
{"grid_size":351.5625,"x":22.5,"y":218.75,"w":22.5,"h":15.625,"count":1224,"key":"1-10-10-10-01","obj_size_mean":646.9133986928105,"obj_size_std":233.59862218778377,"ratio":0.6644583031119183,"filtered":false,"direction_mean":235.23632846810114,"direction_std":14.375367670703007,"direction_count":307,"entry_count":7,"exit_count":69},
{"grid_size":351.5625,"x":0,"y":234.375,"w":22.5,"h":15.625,"count":76,"key":"1-10-10-10-10","obj_size_mean":818.8157894736842,"obj_size_std":264.2002629585527,"ratio":0.7515029701932165,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":22.5,"y":234.375,"w":22.5,"h":15.625,"count":685,"key":"1-10-10-10-11","obj_size_mean":745.2905109489051,"obj_size_std":230.1527308443014,"ratio":0.6546566566237907,"filtered":false,"direction_mean":235.2898487952886,"direction_std":11.796249495063131,"direction_count":13,"entry_count":0,"exit_count":5},
{"grid_size":351.5625,"x":45,"y":218.75,"w":22.5,"h":15.625,"count":141,"key":"1-10-10-11-00","obj_size_mean":621.4964539007092,"obj_size_std":378.56942416934146,"ratio":1.0768196954150158,"filtered":false,"direction_mean":232.40237707136907,"direction_std":48.31879450912508,"direction_count":29,"entry_count":1,"exit_count":4},
{"grid_size":351.5625,"x":67.5,"y":218.75,"w":22.5,"h":15.625,"count":927,"key":"1-10-10-11-01","obj_size_mean":859.3948220064725,"obj_size_std":411.3104373981821,"ratio":1.1699496885992735,"filtered":false,"direction_mean":243.22335461621685,"direction_std":27.391066706391495,"direction_count":269,"entry_count":2,"exit_count":57},
{"grid_size":351.5625,"x":45,"y":234.375,"w":22.5,"h":15.625,"count":48,"key":"1-10-10-11-10","obj_size_mean":949.5208333333334,"obj_size_std":818.4337660091812,"ratio":2.32798937887056,"filtered":false,"direction_mean":258.70491868574663,"direction_std":24.049655446970753,"direction_count":2,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":67.5,"y":234.375,"w":22.5,"h":15.625,"count":869,"key":"1-10-10-11-11","obj_size_mean":1069.7548906789414,"obj_size_std":398.99052457437114,"ratio":1.1349063810115445,"filtered":false,"direction_mean":242.63251602106686,"direction_std":12.016781179735714,"direction_count":42,"entry_count":0,"exit_count":17},
{"grid_size":1406.25,"obj_size_mean":1149,"obj_size_std":799.5732050838534,"x":90,"y":187.5,"w":45,"h":31.25,"count":1216,"ratio":0.5685853902818513,"filtered":false,"direction_mean":250.12591024912774,"direction_std":21.950542745166285,"direction_count":987,"entry_count":17,"exit_count":4},
{"grid_size":351.5625,"x":135,"y":187.5,"w":22.5,"h":15.625,"count":796,"key":"1-10-11-01-00","obj_size_mean":809.643216080402,"obj_size_std":225.82902942831964,"ratio":0.6423581281516647,"filtered":false,"direction_mean":261.62695292512285,"direction_std":13.00005541386569,"direction_count":598,"entry_count":7,"exit_count":0},
{"grid_size":351.5625,"x":157.5,"y":187.5,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":135,"y":203.125,"w":22.5,"h":15.625,"count":625,"key":"1-10-11-01-10","obj_size_mean":953.2464,"obj_size_std":240.68089195830663,"ratio":0.6846034260147389,"filtered":false,"direction_mean":259.56555104368596,"direction_std":23.448553866258116,"direction_count":588,"entry_count":13,"exit_count":5},
{"grid_size":351.5625,"x":157.5,"y":203.125,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":10.13415267321983,"direction_std":7.719708552203021,"direction_count":2,"entry_count":0,"exit_count":0},
{"grid_size":1406.25,"obj_size_mean":1137.1125690607735,"obj_size_std":645.1187001512941,"x":90,"y":218.75,"w":45,"h":31.25,"count":1448,"ratio":0.45875107566314244,"filtered":false,"direction_mean":255.20337134468377,"direction_std":28.61996080260602,"direction_count":368,"entry_count":3,"exit_count":81},
{"grid_size":351.5625,"x":135,"y":218.75,"w":22.5,"h":15.625,"count":1280,"key":"1-10-11-11-00","obj_size_mean":940.33359375,"obj_size_std":210.5468670708752,"ratio":0.5988888663349339,"filtered":false,"direction_mean":257.19368671111675,"direction_std":29.25016487746905,"direction_count":434,"entry_count":3,"exit_count":99},
{"grid_size":351.5625,"x":157.5,"y":218.75,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":8.797410709991084,"direction_std":0,"direction_count":1,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":135,"y":234.375,"w":22.5,"h":15.625,"count":777,"key":"1-10-11-11-10","obj_size_mean":954.9021879021878,"obj_size_std":169.89558863908542,"ratio":0.48325856324006516,"filtered":false,"direction_mean":262.0042725194425,"direction_std":15.448824277418304,"direction_count":23,"entry_count":0,"exit_count":9},
{"grid_size":351.5625,"x":157.5,"y":234.375,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":323.36635105608156,"obj_size_std":85.86354272745551,"x":180,"y":125,"w":22.5,"h":15.625,"count":5492,"ratio":0.244234077091429,"filtered":false,"direction_mean":99.23753894060444,"direction_std":26.159044072505736,"direction_count":5188,"entry_count":3,"exit_count":6},
{"grid_size":351.5625,"obj_size_mean":333.05874673629245,"obj_size_std":307.9705196747795,"x":202.5,"y":125,"w":22.5,"h":15.625,"count":766,"ratio":0.876005033741595,"filtered":false,"direction_mean":109.20467338219855,"direction_std":27.05811215415832,"direction_count":1071,"entry_count":1,"exit_count":7},
{"grid_size":351.5625,"x":180,"y":140.625,"w":22.5,"h":15.625,"count":4219,"key":"1-11-00-00-10","obj_size_mean":390.594216639014,"obj_size_std":102.91583622260156,"ratio":0.2927383785887333,"filtered":false,"direction_mean":99.78326031288934,"direction_std":23.570254885773238,"direction_count":3915,"entry_count":4,"exit_count":7},
{"grid_size":351.5625,"x":202.5,"y":140.625,"w":22.5,"h":15.625,"count":411,"key":"1-11-00-00-11","obj_size_mean":478.18491484184915,"obj_size_std":316.7175857727774,"ratio":0.9008855773092335,"filtered":false,"direction_mean":102.79308285034296,"direction_std":28.771158805890238,"direction_count":343,"entry_count":0,"exit_count":2},
{"grid_size":351.5625,"x":225,"y":125,"w":22.5,"h":15.625,"count":3281,"key":"1-11-00-01-00","obj_size_mean":383.633648277964,"obj_size_std":318.24580527442345,"ratio":0.9052325127805823,"filtered":false,"direction_mean":112.93857316649772,"direction_std":26.572920606107708,"direction_count":3408,"entry_count":3,"exit_count":13},
{"grid_size":351.5625,"x":247.5,"y":125,"w":22.5,"h":15.625,"count":4672,"key":"1-11-00-01-01","obj_size_mean":459.0353167808219,"obj_size_std":241.8887559108122,"ratio":0.6880391279240881,"filtered":false,"direction_mean":126.35085372360528,"direction_std":22.741163048011124,"direction_count":4726,"entry_count":4,"exit_count":7},
{"grid_size":351.5625,"x":225,"y":140.625,"w":22.5,"h":15.625,"count":3939,"key":"1-11-00-01-10","obj_size_mean":427.17542523483115,"obj_size_std":255.26632930705605,"ratio":0.7260908922511816,"filtered":false,"direction_mean":111.44994370285468,"direction_std":25.278090734539216,"direction_count":3703,"entry_count":4,"exit_count":11},
{"grid_size":351.5625,"x":247.5,"y":140.625,"w":22.5,"h":15.625,"count":2043,"key":"1-11-00-01-11","obj_size_mean":622.9676945668135,"obj_size_std":401.2483091752351,"ratio":1.1413285238762243,"filtered":false,"direction_mean":122.5853539570214,"direction_std":21.387793211981293,"direction_count":2154,"entry_count":0,"exit_count":1},
{"grid_size":351.5625,"x":180,"y":156.25,"w":22.5,"h":15.625,"count":1766,"key":"1-11-00-10-00","obj_size_mean":474.2519818799547,"obj_size_std":115.6423833711671,"ratio":0.32893833492243085,"filtered":false,"direction_mean":100.09762541548884,"direction_std":19.882869154748274,"direction_count":1911,"entry_count":1,"exit_count":0},
{"grid_size":351.5625,"x":202.5,"y":156.25,"w":22.5,"h":15.625,"count":1675,"key":"1-11-00-10-01","obj_size_mean":469.1044776119403,"obj_size_std":146.40115817079555,"ratio":0.4164299610191518,"filtered":false,"direction_mean":100.90441272565509,"direction_std":20.285124731363727,"direction_count":1556,"entry_count":2,"exit_count":1},
{"grid_size":351.5625,"x":180,"y":171.875,"w":22.5,"h":15.625,"count":492,"key":"1-11-00-10-10","obj_size_mean":544.4146341463414,"obj_size_std":96.87734928111693,"ratio":0.27556223795517704,"filtered":false,"direction_mean":99.80739928959028,"direction_std":19.473531935456602,"direction_count":433,"entry_count":2,"exit_count":2},
{"grid_size":351.5625,"x":202.5,"y":171.875,"w":22.5,"h":15.625,"count":2711,"key":"1-11-00-10-11","obj_size_mean":531.2047215049797,"obj_size_std":154.84955605654739,"ratio":0.4404609594497348,"filtered":false,"direction_mean":100.39659945143579,"direction_std":20.406108765260218,"direction_count":2627,"entry_count":10,"exit_count":4},
{"grid_size":351.5625,"x":225,"y":156.25,"w":22.5,"h":15.625,"count":2913,"key":"1-11-00-11-00","obj_size_mean":520.1651218674906,"obj_size_std":232.19867894300825,"ratio":0.660476242326779,"filtered":false,"direction_mean":111.8846216979295,"direction_std":22.72871598029953,"direction_count":2982,"entry_count":2,"exit_count":2},
{"grid_size":351.5625,"x":247.5,"y":156.25,"w":22.5,"h":15.625,"count":229,"key":"1-11-00-11-01","obj_size_mean":1426.4978165938865,"obj_size_std":1103.9577073025744,"ratio":3.1401463674384336,"filtered":false,"direction_mean":118.23449943086388,"direction_std":26.760468632402127,"direction_count":269,"entry_count":0,"exit_count":1},
{"grid_size":351.5625,"x":225,"y":171.875,"w":22.5,"h":15.625,"count":1706,"key":"1-11-00-11-10","obj_size_mean":593.7491207502931,"obj_size_std":255.80919234419542,"ratio":0.727635036001267,"filtered":false,"direction_mean":110.6275342083896,"direction_std":20.72740461367604,"direction_count":1736,"entry_count":8,"exit_count":2},
{"grid_size":351.5625,"x":247.5,"y":171.875,"w":22.5,"h":15.625,"count":983,"key":"1-11-00-11-11","obj_size_mean":711.3021363173957,"obj_size_std":577.0215321278915,"ratio":1.6413056913860027,"filtered":false,"direction_mean":110.08367994652744,"direction_std":22.344665856372583,"direction_count":935,"entry_count":8,"exit_count":1},
{"grid_size":351.5625,"x":270,"y":125,"w":22.5,"h":15.625,"count":45,"key":"1-11-01-00-00","obj_size_mean":850.4,"obj_size_std":868.5432003700743,"ratio":2.4705228810526556,"filtered":false,"direction_mean":122.27563129083859,"direction_std":24.31274503286143,"direction_count":46,"entry_count":0,"exit_count":2},
{"grid_size":87.890625,"x":292.5,"y":125,"w":11.25,"h":7.8125,"count":7,"key":"1-11-01-00-01-00","obj_size_mean":246,"obj_size_std":45.13313638558703,"ratio":0.5135147962093457,"filtered":false,"direction_mean":113.39062704361272,"direction_std":93.92724945618235,"direction_count":8,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":303.75,"y":125,"w":11.25,"h":7.8125,"count":27,"key":"1-11-01-00-01-01","obj_size_mean":245.25925925925927,"obj_size_std":70.58905591389372,"ratio":0.8031465917314129,"filtered":false,"direction_mean":137.91470819091626,"direction_std":93.72032594969593,"direction_count":20,"entry_count":0,"exit_count":2},
{"grid_size":87.890625,"x":292.5,"y":132.8125,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":303.75,"y":132.8125,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":270,"y":140.625,"w":22.5,"h":15.625,"count":1790,"key":"1-11-01-00-10","obj_size_mean":674.9977653631285,"obj_size_std":377.4049915728351,"ratio":1.0735075315849532,"filtered":false,"direction_mean":122.22479332511912,"direction_std":17.36070128981534,"direction_count":1814,"entry_count":0,"exit_count":1},
{"grid_size":351.5625,"x":292.5,"y":140.625,"w":22.5,"h":15.625,"count":14,"key":"1-11-01-00-11","obj_size_mean":79,"obj_size_std":53.74440936936175,"ratio":0.15287298665062898,"filtered":false,"direction_mean":135,"direction_std":0,"direction_count":3,"entry_count":1,"exit_count":0},
{"grid_size":87.890625,"x":315,"y":125,"w":11.25,"h":7.8125,"count":64,"key":"1-11-01-01-00-00","obj_size_mean":147.578125,"obj_size_std":119.35339079741836,"ratio":1.3579763575172934,"filtered":false,"direction_mean":154.7568870222597,"direction_std":81.95169624220775,"direction_count":14,"entry_count":5,"exit_count":0},
{"grid_size":87.890625,"x":326.25,"y":125,"w":11.25,"h":7.8125,"count":123,"key":"1-11-01-01-00-01","obj_size_mean":138.45528455284554,"obj_size_std":112.0527724057366,"ratio":1.274911543816381,"filtered":false,"direction_mean":111.5807515524802,"direction_std":126.63446808016843,"direction_count":25,"entry_count":6,"exit_count":0},
{"grid_size":87.890625,"obj_size_mean":87.08108108108108,"obj_size_std":49.74232401887549,"x":315,"y":132.8125,"w":11.25,"h":7.8125,"count":37,"ratio":0.5659571088369834,"filtered":false,"direction_mean":174.91496043231407,"direction_std":161.12270094557985,"direction_count":3,"entry_count":1,"exit_count":0},
{"grid_size":87.890625,"x":326.25,"y":132.8125,"w":11.25,"h":7.8125,"count":25,"key":"1-11-01-01-00-11","obj_size_mean":141.24,"obj_size_std":107.92600860466088,"ratio":1.2279581423463637,"filtered":false,"direction_mean":87.6344194479936,"direction_std":175.26883889598716,"direction_count":4,"entry_count":1,"exit_count":0},
{"grid_size":87.890625,"x":337.5,"y":125,"w":11.25,"h":7.8125,"count":140,"key":"1-11-01-01-01-00","obj_size_mean":211.69285714285715,"obj_size_std":56.53850746447395,"ratio":0.6432825738180148,"filtered":false,"direction_mean":123.18612950865561,"direction_std":124.73938287396724,"direction_count":56,"entry_count":10,"exit_count":2},
{"grid_size":87.890625,"x":348.75,"y":125,"w":11.25,"h":7.8125,"count":32,"key":"1-11-01-01-01-01","obj_size_mean":192.6875,"obj_size_std":43.26843258155437,"ratio":0.4922986107056853,"filtered":false,"direction_mean":82.40998537797772,"direction_std":96.01848001678891,"direction_count":7,"entry_count":0,"exit_count":1},
{"grid_size":87.890625,"x":337.5,"y":132.8125,"w":11.25,"h":7.8125,"count":101,"key":"1-11-01-01-01-10","obj_size_mean":239.84158415841586,"obj_size_std":52.65486353097256,"ratio":0.5990953361746212,"filtered":false,"direction_mean":118.86082900357893,"direction_std":133.93769331418468,"direction_count":35,"entry_count":4,"exit_count":2},
{"grid_size":87.890625,"x":348.75,"y":132.8125,"w":11.25,"h":7.8125,"count":18,"key":"1-11-01-01-01-11","obj_size_mean":179.16666666666666,"obj_size_std":40.95370413470485,"ratio":0.46596214482153075,"filtered":false,"direction_mean":103.11501125432996,"direction_std":113.92296667781632,"direction_count":6,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":315,"y":140.625,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":81.4692343900519,"direction_std":0,"direction_count":1,"entry_count":0,"exit_count":1},
{"grid_size":87.890625,"obj_size_mean":86.17241379310344,"obj_size_std":72.73651992578068,"x":337.5,"y":140.625,"w":11.25,"h":7.8125,"count":58,"ratio":0.827579960044438,"filtered":false,"direction_mean":22.5,"direction_std":31.81980515339464,"direction_count":2,"entry_count":1,"exit_count":0},
{"grid_size":87.890625,"obj_size_mean":52.99065420560748,"obj_size_std":46.2677799229868,"x":348.75,"y":140.625,"w":11.25,"h":7.8125,"count":107,"ratio":0.526424518234872,"filtered":false,"direction_mean":136.46623511833184,"direction_std":104.33680416818855,"direction_count":3,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":337.5,"y":148.4375,"w":5.625,"h":3.90625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":343.125,"y":148.4375,"w":5.625,"h":3.90625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":337.5,"y":152.34375,"w":5.625,"h":3.90625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":343.125,"y":152.34375,"w":5.625,"h":3.90625,"count":9,"key":"1-11-01-01-11-10-11","obj_size_mean":40,"obj_size_std":0,"ratio":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":348.75,"y":148.4375,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":270,"y":156.25,"w":22.5,"h":15.625,"count":2922,"key":"1-11-01-10-00","obj_size_mean":711.8993839835729,"obj_size_std":307.09543093936054,"ratio":0.8735158924497366,"filtered":false,"direction_mean":121.46518211584215,"direction_std":19.33867131837411,"direction_count":2968,"entry_count":4,"exit_count":1},
{"grid_size":351.5625,"x":292.5,"y":156.25,"w":22.5,"h":15.625,"count":38,"key":"1-11-01-10-01","obj_size_mean":826.2894736842105,"obj_size_std":1071.6314641803574,"ratio":3.048196164779683,"filtered":false,"direction_mean":125.48161775331931,"direction_std":9.75028351594347,"direction_count":34,"entry_count":0,"exit_count":1},
{"grid_size":351.5625,"x":270,"y":171.875,"w":22.5,"h":15.625,"count":1958,"key":"1-11-01-10-10","obj_size_mean":777.8079673135853,"obj_size_std":333.5328627961606,"ratio":0.9487156986201901,"filtered":false,"direction_mean":121.26131613110546,"direction_std":19.78514160648472,"direction_count":1951,"entry_count":11,"exit_count":0},
{"grid_size":351.5625,"x":292.5,"y":171.875,"w":22.5,"h":15.625,"count":842,"key":"1-11-01-10-11","obj_size_mean":890.3147268408551,"obj_size_std":516.2456963712758,"ratio":1.468432203011629,"filtered":false,"direction_mean":123.35403837510553,"direction_std":15.690048631934763,"direction_count":792,"entry_count":7,"exit_count":1},
{"grid_size":351.5625,"x":315,"y":156.25,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":337.5,"y":156.25,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":315,"y":171.875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":326.25,"y":171.875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":315,"y":179.6875,"w":11.25,"h":7.8125,"count":3,"key":"1-11-01-11-10-10","obj_size_mean":204.33333333333334,"obj_size_std":21.221058723196006,"ratio":0.24144849036169677,"filtered":false,"direction_mean":135.76281496685806,"direction_std":1.7057061201488948,"direction_count":5,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":326.25,"y":179.6875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":337.5,"y":171.875,"w":5.625,"h":3.90625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":343.125,"y":171.875,"w":5.625,"h":3.90625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":337.5,"y":175.78125,"w":5.625,"h":3.90625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":21.97265625,"x":343.125,"y":175.78125,"w":5.625,"h":3.90625,"count":9,"key":"1-11-01-11-11-00-11","obj_size_mean":56,"obj_size_std":0,"ratio":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":348.75,"y":171.875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":337.5,"y":179.6875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":348.75,"y":179.6875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":180,"y":187.5,"w":22.5,"h":15.625,"count":44,"key":"1-11-10-00-00","obj_size_mean":620.0454545454545,"obj_size_std":89.48741747215134,"ratio":0.2545419874763416,"filtered":false,"direction_mean":98.4410263269419,"direction_std":27.654668876258178,"direction_count":51,"entry_count":1,"exit_count":0},
{"grid_size":351.5625,"x":202.5,"y":187.5,"w":22.5,"h":15.625,"count":2557,"key":"1-11-10-00-01","obj_size_mean":580.8689870942511,"obj_size_std":184.83460558145623,"ratio":0.5257517669872532,"filtered":false,"direction_mean":100.17630491332761,"direction_std":22.655375208558436,"direction_count":2340,"entry_count":153,"exit_count":3},
{"grid_size":351.5625,"x":180,"y":203.125,"w":22.5,"h":15.625,"count":13,"key":"1-11-10-00-10","obj_size_mean":673.2307692307693,"obj_size_std":77.47274127733988,"ratio":0.22036690852221122,"filtered":false,"direction_mean":81.92928111773745,"direction_std":24.57602289885518,"direction_count":13,"entry_count":1,"exit_count":0},
{"grid_size":351.5625,"x":202.5,"y":203.125,"w":22.5,"h":15.625,"count":1517,"key":"1-11-10-00-11","obj_size_mean":604.9367172050099,"obj_size_std":184.127594147871,"ratio":0.5237407122428331,"filtered":false,"direction_mean":101.53701019003393,"direction_std":25.54843447194801,"direction_count":1286,"entry_count":427,"exit_count":2},
{"grid_size":351.5625,"x":225,"y":187.5,"w":22.5,"h":15.625,"count":166,"key":"1-11-10-01-00","obj_size_mean":835.0602409638554,"obj_size_std":594.5652111319887,"ratio":1.6912077116643234,"filtered":false,"direction_mean":110.7853415026472,"direction_std":27.45228582924255,"direction_count":168,"entry_count":10,"exit_count":0},
{"grid_size":351.5625,"x":247.5,"y":187.5,"w":22.5,"h":15.625,"count":2094,"key":"1-11-10-01-01","obj_size_mean":659.8424068767908,"obj_size_std":296.1018503461903,"ratio":0.8422452632069413,"filtered":false,"direction_mean":109.15497246302098,"direction_std":24.094466953156065,"direction_count":1958,"entry_count":118,"exit_count":4},
{"grid_size":351.5625,"x":225,"y":203.125,"w":22.5,"h":15.625,"count":13,"key":"1-11-10-01-10","obj_size_mean":1656.3846153846155,"obj_size_std":768.0080878981178,"ratio":2.184556338910202,"filtered":false,"direction_mean":97.90360622319224,"direction_std":38.4407347701486,"direction_count":8,"entry_count":4,"exit_count":0},
{"grid_size":351.5625,"x":247.5,"y":203.125,"w":22.5,"h":15.625,"count":1437,"key":"1-11-10-01-11","obj_size_mean":661.0201809324983,"obj_size_std":237.22244654914917,"ratio":0.6747660701842465,"filtered":false,"direction_mean":112.37456554018456,"direction_std":26.64856951154427,"direction_count":1282,"entry_count":392,"exit_count":4},
{"grid_size":351.5625,"x":180,"y":218.75,"w":22.5,"h":15.625,"count":28,"key":"1-11-10-10-00","obj_size_mean":458.57142857142856,"obj_size_std":25.559558002653436,"ratio":0.07270274276310311,"filtered":false,"direction_mean":101.9273112034892,"direction_std":94.71351856355864,"direction_count":7,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":202.5,"y":218.75,"w":22.5,"h":15.625,"count":58,"key":"1-11-10-10-01","obj_size_mean":535.551724137931,"obj_size_std":147.6716571665278,"ratio":0.42004382482923464,"filtered":false,"direction_mean":124.451762211941,"direction_std":83.9629314480806,"direction_count":12,"entry_count":4,"exit_count":0},
{"grid_size":351.5625,"x":180,"y":234.375,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":202.5,"y":234.375,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":225,"y":218.75,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":247.5,"y":218.75,"w":22.5,"h":15.625,"count":132,"key":"1-11-10-11-01","obj_size_mean":600.75,"obj_size_std":160.93103994668218,"ratio":0.4577594025150071,"filtered":false,"direction_mean":116.02942970027937,"direction_std":65.30848823389199,"direction_count":51,"entry_count":29,"exit_count":0},
{"grid_size":351.5625,"x":225,"y":234.375,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":247.5,"y":234.375,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":270,"y":187.5,"w":22.5,"h":15.625,"count":263,"key":"1-11-11-00-00","obj_size_mean":1147.4980988593156,"obj_size_std":993.5434537361824,"ratio":2.82607915729403,"filtered":false,"direction_mean":118.2546250922812,"direction_std":19.562938940574956,"direction_count":264,"entry_count":18,"exit_count":0},
{"grid_size":351.5625,"x":292.5,"y":187.5,"w":22.5,"h":15.625,"count":2018,"key":"1-11-11-00-01","obj_size_mean":839.422200198216,"obj_size_std":312.3613332685152,"ratio":0.8884944590748877,"filtered":false,"direction_mean":117.48205960128948,"direction_std":22.659985084140647,"direction_count":1924,"entry_count":122,"exit_count":2},
{"grid_size":351.5625,"x":270,"y":203.125,"w":22.5,"h":15.625,"count":46,"key":"1-11-11-00-10","obj_size_mean":1815.108695652174,"obj_size_std":1396.2922366556822,"ratio":3.9716756953761627,"filtered":false,"direction_mean":106.62431636054006,"direction_std":48.309244824874646,"direction_count":30,"entry_count":10,"exit_count":0},
{"grid_size":351.5625,"x":292.5,"y":203.125,"w":22.5,"h":15.625,"count":1284,"key":"1-11-11-00-11","obj_size_mean":786.5155763239875,"obj_size_std":286.0905059969124,"ratio":0.8137685503912174,"filtered":false,"direction_mean":114.31572056305454,"direction_std":23.929326822036362,"direction_count":1129,"entry_count":383,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":168.984126984127,"obj_size_std":326.8693190650228,"x":315,"y":187.5,"w":22.5,"h":15.625,"count":126,"ratio":0.9297616186738427,"filtered":false,"direction_mean":125.68732628032724,"direction_std":19.887148560397332,"direction_count":30,"entry_count":9,"exit_count":1},
{"grid_size":351.5625,"x":337.5,"y":187.5,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":315,"y":203.125,"w":22.5,"h":15.625,"count":105,"key":"1-11-11-01-10","obj_size_mean":1082.2666666666667,"obj_size_std":695.5121144035173,"ratio":1.9783455698588936,"filtered":false,"direction_mean":123.99655668662926,"direction_std":26.01536702315151,"direction_count":80,"entry_count":35,"exit_count":0},
{"grid_size":351.5625,"x":337.5,"y":203.125,"w":22.5,"h":15.625,"count":13,"key":"1-11-11-01-11","obj_size_mean":71.92307692307692,"obj_size_std":14.902245571621853,"ratio":0.0423886096259466,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":270,"y":218.75,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":141.0376442915968,"direction_std":60.68042773602108,"direction_count":2,"entry_count":2,"exit_count":0},
{"grid_size":351.5625,"x":292.5,"y":218.75,"w":22.5,"h":15.625,"count":96,"key":"1-11-11-10-01","obj_size_mean":718.8645833333334,"obj_size_std":279.55015065718726,"ratio":0.7951648729804438,"filtered":false,"direction_mean":125.0281798302424,"direction_std":32.224054923764434,"direction_count":45,"entry_count":35,"exit_count":0},
{"grid_size":351.5625,"x":270,"y":234.375,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":292.5,"y":234.375,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":315,"y":218.75,"w":22.5,"h":15.625,"count":28,"key":"1-11-11-11-00","obj_size_mean":604.75,"obj_size_std":425.93493025908873,"ratio":1.2115482460702969,"filtered":false,"direction_mean":109.84891548422397,"direction_std":23.611670168920977,"direction_count":10,"entry_count":10,"exit_count":0},
{"grid_size":351.5625,"x":337.5,"y":218.75,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":315,"y":234.375,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":337.5,"y":234.375,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":1406.25,"x":90,"y":31.25,"w":45,"h":31.25,"count":11,"key":"1-00-01-10","obj_size_mean":242.27272727272728,"obj_size_std":108.09818768979515,"ratio":0.07686982235718766,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":135,"y":31.25,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":135,"y":46.875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":146.25,"y":46.875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":146.25,"y":54.6875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":157.5,"y":46.875,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":245.92753623188406,"obj_size_std":120.425510151758,"x":112.5,"y":62.5,"w":22.5,"h":15.625,"count":69,"ratio":0.3425436733205561,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":271.51485148514854,"obj_size_std":122.503659310672,"x":112.5,"y":78.125,"w":22.5,"h":15.625,"count":202,"ratio":0.3484548531503559,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":257.9306930693069,"obj_size_std":109.53319894310636,"x":135,"y":62.5,"w":22.5,"h":15.625,"count":303,"ratio":0.311561099215947,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":289.22087378640776,"obj_size_std":160.96207786969592,"x":135,"y":78.125,"w":22.5,"h":15.625,"count":412,"ratio":0.4578476881626906,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":264.76851851851853,"obj_size_std":124.21205472574046,"x":157.5,"y":78.125,"w":22.5,"h":15.625,"count":216,"ratio":0.35331428899766176,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":298.1694915254237,"obj_size_std":186.80914926667955,"x":112.5,"y":93.75,"w":22.5,"h":15.625,"count":295,"ratio":0.5313682468029997,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":283.47238095238095,"obj_size_std":199.0206405418458,"x":135,"y":93.75,"w":22.5,"h":15.625,"count":525,"ratio":0.5661031553190281,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":242.015503875969,"obj_size_std":122.55645785435937,"x":157.5,"y":93.75,"w":22.5,"h":15.625,"count":258,"ratio":0.3486050356746222,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":257.4845360824742,"obj_size_std":99.17242070863058,"x":202.5,"y":46.875,"w":22.5,"h":15.625,"count":97,"ratio":0.28209044112677145,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":232.94853221502098,"obj_size_std":130.2808274998699,"x":180,"y":78.125,"w":22.5,"h":15.625,"count":5246,"ratio":0.37057657599962995,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":249.48216340621403,"obj_size_std":127.0708507902146,"x":225,"y":78.125,"w":22.5,"h":15.625,"count":4345,"ratio":0.3614459755810549,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":244.40928725701943,"obj_size_std":132.42327525091895,"x":202.5,"y":93.75,"w":22.5,"h":15.625,"count":4630,"ratio":0.37667064960261387,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":256.27272727272725,"obj_size_std":111.15978731761913,"x":315,"y":109.375,"w":22.5,"h":15.625,"count":55,"ratio":0.31618783948122775,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":292.5,"y":140.625,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":303.75,"y":140.625,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":292.5,"y":148.4375,"w":11.25,"h":7.8125,"count":4,"key":"1-11-01-00-11-10","obj_size_mean":158,"obj_size_std":20.784609690826528,"ratio":0.23648267026007072,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":87.890625,"x":303.75,"y":148.4375,"w":11.25,"h":7.8125,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"obj_size_mean":248.8452380952381,"obj_size_std":114.6017193301942,"x":315,"y":125,"w":22.5,"h":15.625,"count":84,"ratio":0.3259782238725524,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":337.5,"y":140.625,"w":22.5,"h":15.625,"count":26,"key":"1-11-01-01-11","obj_size_mean":189.15384615384616,"obj_size_std":27.94235825078809,"ratio":0.07948048569113056,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":351.5625,"x":337.5,"y":171.875,"w":22.5,"h":15.625,"count":0,"obj_size_mean":0,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":1406.25,"obj_size_mean":934.796511627907,"obj_size_std":681.3588241442408,"x":315,"y":187.5,"w":45,"h":31.25,"count":172,"ratio":0.4845218305025712,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},
{"grid_size":1406.25,"x":315,"y":218.75,"w":45,"h":31.25,"count":30,"key":"1-11-11-11","obj_size_mean":778.8,"obj_size_std":277.6864269713915,"ratio":0.1974659036241006,"filtered":false,"direction_mean":0,"direction_std":0,"direction_count":0,"entry_count":0,"exit_count":0},


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
