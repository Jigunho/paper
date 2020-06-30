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
    let total = 0;
    for (let i = 0; i < this.layout.length; i++) {
      let item = this.layout[i];

      let back_ = '';
      let opacity_ = "1";
      let stroke_ = 'white';
      // if(this.transactions.includes(item.id)) {
      //   back_ = 'green';
      //   opacity_ = '0.5'
      // }
   
      if(item.count < 3 ) {
        // back_ = 'black'
      } else {
        total += 1;
      }

   
      let rect = new fabric.Rect({
        left: item.x,
        top: item.y,
        width: item.w,
        height: item.h,
        stroke: stroke_,
        strokeWidth: 1,
        selectable: false,
        fill: back_,
        opacity: opacity_
      });
      lines.push(rect);
    }
    // alert(total);

    for (let i = 0 ; i < this.real_logs.length ; i ++) {
      let item = this.real_logs[i];
      let back_ = 'white';
      let opacity_ = 1
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
      // lines.push(rect);
    }

    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/park.png
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/road.png
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/busroad.png
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/4800.png
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/4801.png
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/forbus.png
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/europe.png
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/japan.png
    //https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/thum.jpg
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/0425_T_car.png
    // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/italy1.png
        // https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/italy2.png
        //https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/0425_highway.png

    fabric.Image.fromURL(
      "https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/0425_T_car.png",
      function(myImg) {
        //i create an extra var for to change some image properties
        var img1 = myImg.set({
          left: 0,
          top: 0,
          // width: 360, height: 240
          // width: 1000, height: 640 // road
          // width: 1080, height: 540 // europe
              //  width: 320, height: 180 // T car
        //  width: 960, height: 540
          
        });
        // img1.
        // img1.scaleToWidth(876);
        // img1.scaleToHeight(640);
        img1.scaleToWidth(320);
        img1.scaleToHeight(180);
        
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


      real_logs: [
      ],

      transactions: 
[
"404-00","403-10","403-00","302-11","302-01-11","302-01-10","302-01-00"
  ]
,
      layout: [
{"grid_size":3600,"obj_size_mean":1185.3422779636546,"obj_size_std":840.279809008205,"x":240,"y":135,"w":80,"h":45,"count":103,"ratio":0.2334110580578347,"filtered":false,"id":"404"},
{"grid_size":900,"x":0,"y":0,"w":40,"h":22.5,"count":6,"key":"101-00","obj_size_mean":80.70833333333333,"obj_size_std":77.76091831162147,"ratio":0.08640102034624607,"filtered":false,"id":"101-00"},
{"grid_size":900,"x":40,"y":0,"w":40,"h":22.5,"count":3,"key":"101-01","obj_size_mean":55.208333333333336,"obj_size_std":27.996744602423572,"ratio":0.03110749400269286,"filtered":false,"id":"101-01"},
{"grid_size":900,"x":0,"y":22.5,"w":40,"h":22.5,"count":3,"key":"101-10","obj_size_mean":459.5833333333333,"obj_size_std":611.9999148965082,"ratio":0.6799999054405648,"filtered":false,"id":"101-10"},
{"grid_size":225,"obj_size_mean":109.24166666666667,"obj_size_std":90.18820693937856,"x":40,"y":22.5,"w":20,"h":11.25,"count":14,"ratio":0.4008364752861269,"filtered":false,"id":"101-11-00"},
{"grid_size":225,"obj_size_mean":154.19073725981622,"obj_size_std":105.13497244649679,"x":60,"y":22.5,"w":20,"h":11.25,"count":19,"ratio":0.4672665442066524,"filtered":false,"id":"101-11-01"},
{"grid_size":225,"obj_size_mean":217.89875,"obj_size_std":78.84053406688564,"x":40,"y":33.75,"w":20,"h":11.25,"count":20,"ratio":0.35040237363060284,"filtered":false,"id":"101-11-10"},
{"grid_size":225,"x":60,"y":33.75,"w":20,"h":11.25,"count":53,"key":"101-11-11","obj_size_mean":266.64155013032877,"obj_size_std":119.0576061320492,"ratio":0.5291449161424409,"id":"101-11-11","filtered":false},
{"grid_size":900,"x":0,"y":135,"w":40,"h":22.5,"count":0,"obj_size_mean":0,"filtered":false,"id":"104-00"},
{"grid_size":900,"x":40,"y":135,"w":40,"h":22.5,"count":4,"key":"104-01","obj_size_mean":255.34652777777777,"obj_size_std":205.04836094444425,"ratio":0.2278315121604936,"filtered":false,"id":"104-01"},
{"grid_size":900,"x":0,"y":157.5,"w":40,"h":22.5,"count":0,"obj_size_mean":0,"filtered":false,"id":"104-10"},
{"grid_size":900,"x":40,"y":157.5,"w":40,"h":22.5,"count":9,"key":"104-11","obj_size_mean":283.2753489193005,"obj_size_std":262.57408699578133,"ratio":0.29174898555086815,"filtered":false,"id":"104-11"},
{"grid_size":900,"x":80,"y":0,"w":40,"h":22.5,"count":0,"obj_size_mean":0,"filtered":false,"id":"201-00"},
{"grid_size":900,"x":120,"y":0,"w":40,"h":22.5,"count":0,"obj_size_mean":0,"filtered":false,"id":"201-01"},
{"grid_size":900,"obj_size_mean":231.87496645193954,"obj_size_std":119.93551253427626,"x":80,"y":22.5,"w":40,"h":22.5,"count":60,"ratio":0.1332616805936403,"filtered":false,"id":"201-10"},
{"grid_size":225,"x":120,"y":22.5,"w":20,"h":11.25,"count":0,"obj_size_mean":0,"filtered":false,"id":"201-11-00"},
{"grid_size":225,"x":140,"y":22.5,"w":20,"h":11.25,"count":3,"key":"201-11-01","obj_size_mean":63.94444444444445,"obj_size_std":27.438989561354994,"ratio":0.12195106471713331,"filtered":false,"id":"201-11-01"},
{"grid_size":225,"obj_size_mean":207.93336776859505,"obj_size_std":104.48848104639337,"x":120,"y":33.75,"w":20,"h":11.25,"count":22,"ratio":0.4643932490950817,"filtered":false,"id":"201-11-10"},
{"grid_size":225,"obj_size_mean":179.8445767195767,"obj_size_std":143.9555844273463,"x":140,"y":33.75,"w":20,"h":11.25,"count":18,"ratio":0.6398025974548724,"filtered":false,"id":"201-11-11"},
{"grid_size":900,"obj_size_mean":472.7499368686869,"obj_size_std":473.5601642711199,"x":80,"y":135,"w":40,"h":22.5,"count":20,"ratio":0.5261779603012443,"filtered":false,"id":"204-00"},
{"grid_size":900,"obj_size_mean":652.1244891443168,"obj_size_std":402.8712038268051,"x":120,"y":135,"w":40,"h":22.5,"count":30,"ratio":0.4476346709186723,"filtered":false,"id":"204-01"},
{"grid_size":900,"obj_size_mean":540.7488492063492,"obj_size_std":401.3560339440448,"x":80,"y":157.5,"w":40,"h":22.5,"count":20,"ratio":0.44595114882671644,"filtered":false,"id":"204-10"},
{"grid_size":900,"obj_size_mean":629.1230158730158,"obj_size_std":331.9491591319276,"x":120,"y":157.5,"w":40,"h":22.5,"count":15,"ratio":0.36883239903547516,"filtered":false,"id":"204-11"},
{"grid_size":900,"x":160,"y":0,"w":40,"h":22.5,"count":3,"key":"301-00","obj_size_mean":101.84722222222221,"obj_size_std":90.8611992169823,"ratio":0.10095688801886922,"filtered":false,"id":"301-00"},
{"grid_size":225,"x":200,"y":0,"w":20,"h":11.25,"count":9,"key":"301-01-00","obj_size_mean":92.89722222222221,"obj_size_std":48.743211421922354,"ratio":0.2166364952085438,"filtered":false,"id":"301-01-00"},
{"grid_size":225,"x":220,"y":0,"w":20,"h":11.25,"count":0,"obj_size_mean":0,"filtered":false,"id":"301-01-01"},
{"grid_size":225,"obj_size_mean":127.92355442176871,"obj_size_std":54.45976241385876,"x":200,"y":11.25,"w":20,"h":11.25,"count":14,"ratio":0.24204338850603893,"filtered":false,"id":"301-01-10"},
{"grid_size":225,"x":220,"y":11.25,"w":20,"h":11.25,"count":0,"obj_size_mean":0,"filtered":false,"id":"301-01-11"},
{"grid_size":225,"x":160,"y":22.5,"w":20,"h":11.25,"count":4,"key":"301-10-00","obj_size_mean":58.33333333333333,"obj_size_std":19.24260319649547,"ratio":0.0855226808733132,"filtered":false,"id":"301-10-00"},
{"grid_size":225,"x":180,"y":22.5,"w":20,"h":11.25,"count":6,"key":"301-10-01","obj_size_mean":266.92857142857144,"obj_size_std":510.73955332099604,"ratio":2.269953570315538,"id":"301-10-01","filtered":false},
{"grid_size":225,"obj_size_mean":135.2840909090909,"obj_size_std":109.45281647399901,"x":160,"y":33.75,"w":20,"h":11.25,"count":11,"ratio":0.4864569621066623,"filtered":false,"id":"301-10-10"},
{"grid_size":225,"x":180,"y":33.75,"w":20,"h":11.25,"count":15,"key":"301-10-11","obj_size_mean":279.3988888888889,"obj_size_std":320.1443447057748,"ratio":1.4228637542478881,"id":"301-10-11","filtered":false},
{"grid_size":225,"obj_size_mean":154.89680657506744,"obj_size_std":93.185426285363,"x":200,"y":22.5,"w":20,"h":11.25,"count":23,"ratio":0.41415745015716887,"filtered":false,"id":"301-11-00"},
{"grid_size":225,"x":220,"y":22.5,"w":20,"h":11.25,"count":8,"key":"301-11-01","obj_size_mean":383.9114583333333,"obj_size_std":577.0729853109951,"ratio":2.564768823604423,"id":"301-11-01","filtered":false},
{"grid_size":225,"obj_size_mean":188.70888798701304,"obj_size_std":105.81497308315728,"x":200,"y":33.75,"w":20,"h":11.25,"count":32,"ratio":0.4702887692584768,"filtered":false,"id":"301-11-10"},
{"grid_size":225,"x":220,"y":33.75,"w":20,"h":11.25,"count":21,"key":"301-11-11","obj_size_mean":254.97313070527358,"obj_size_std":234.57995314045607,"ratio":1.042577569513138,"id":"301-11-11","filtered":false},
{"grid_size":900,"obj_size_mean":621.2044913419913,"obj_size_std":312.52800188752275,"x":160,"y":135,"w":40,"h":22.5,"count":34,"ratio":0.34725333543058085,"filtered":false,"id":"304-00"},
{"grid_size":900,"obj_size_mean":861.199356261023,"obj_size_std":671.5363687750287,"x":200,"y":135,"w":40,"h":22.5,"count":45,"ratio":0.746151520861143,"filtered":false,"id":"304-01"},
{"grid_size":900,"obj_size_mean":567.408869047619,"obj_size_std":241.79492126156583,"x":160,"y":157.5,"w":40,"h":22.5,"count":20,"ratio":0.26866102362396205,"filtered":false,"id":"304-10"},
{"grid_size":900,"obj_size_mean":655.4272408963585,"obj_size_std":304.92627792196015,"x":200,"y":157.5,"w":40,"h":22.5,"count":34,"ratio":0.3388069754688446,"filtered":false,"id":"304-11"},
{"grid_size":900,"x":240,"y":0,"w":40,"h":22.5,"count":0,"obj_size_mean":0,"filtered":false,"id":"401-00"},
{"grid_size":900,"x":280,"y":0,"w":40,"h":22.5,"count":0,"obj_size_mean":0,"filtered":false,"id":"401-01"},
{"grid_size":900,"obj_size_mean":227.42349481658695,"obj_size_std":234.5396033076568,"x":240,"y":22.5,"w":40,"h":22.5,"count":11,"ratio":0.26059955923072975,"filtered":false,"id":"401-10"},
{"grid_size":900,"x":280,"y":22.5,"w":40,"h":22.5,"count":3,"key":"401-11","obj_size_mean":202.14814814814815,"obj_size_std":119.45102479720666,"ratio":0.13272336088578518,"filtered":false,"id":"401-11"},
   
 {"grid_size":3600,"obj_size_mean":1789.9092532467532,"obj_size_std":1170.6122955950702,"x":0,"y":90,"w":80,"h":45,"count":22,"ratio":0.32517008210974174,"filtered":false,"id":"103"},
{"grid_size":900,"x":0,"y":45,"w":40,"h":22.5,"count":0,"obj_size_mean":0,"filtered":false,"id":"102-00"},
{"grid_size":900,"obj_size_mean":328.62793765577857,"obj_size_std":196.81477436269162,"x":40,"y":45,"w":40,"h":22.5,"count":22,"ratio":0.2186830826252129,"filtered":false,"id":"102-01"},
{"grid_size":900,"obj_size_mean":873.9398313492064,"obj_size_std":246.58155464993075,"x":0,"y":67.5,"w":40,"h":22.5,"count":16,"ratio":0.2739795051665897,"filtered":false,"id":"102-10"},
{"grid_size":900,"obj_size_mean":791.9583333333335,"obj_size_std":380.07986962172396,"x":40,"y":67.5,"w":40,"h":22.5,"count":11,"ratio":0.42231096624635994,"filtered":false,"id":"102-11"},
{"grid_size":225,"obj_size_mean":152.37337490551775,"obj_size_std":30.426390882578694,"x":80,"y":45,"w":20,"h":11.25,"count":21,"ratio":0.13522840392257196,"filtered":false,"id":"202-00-00"},
{"grid_size":225,"obj_size_mean":147.89575569358178,"obj_size_std":38.42226090857209,"x":100,"y":45,"w":20,"h":11.25,"count":23,"ratio":0.17076560403809818,"filtered":false,"id":"202-00-01"},
{"grid_size":225,"x":80,"y":56.25,"w":20,"h":11.25,"count":4,"key":"202-00-10","obj_size_mean":156.75892857142858,"obj_size_std":16.468614573408974,"ratio":0.07319384254848434,"filtered":false,"id":"202-00-10"},
{"grid_size":225,"x":100,"y":56.25,"w":20,"h":11.25,"count":4,"key":"202-00-11","obj_size_mean":165,"obj_size_std":20.701247949499727,"ratio":0.092005546442221,"filtered":false,"id":"202-00-11"},
{"grid_size":225,"obj_size_mean":146.1763888888889,"obj_size_std":36.57846751063706,"x":120,"y":45,"w":20,"h":11.25,"count":24,"ratio":0.1625709667139425,"filtered":false,"id":"202-01-00"},
{"grid_size":225,"obj_size_mean":153.3829322638146,"obj_size_std":29.40882147170326,"x":140,"y":45,"w":20,"h":11.25,"count":17,"ratio":0.13070587320757004,"filtered":false,"id":"202-01-01"},
{"grid_size":225,"obj_size_mean":170.61103174603176,"obj_size_std":19.587326849530932,"x":120,"y":56.25,"w":20,"h":11.25,"count":15,"ratio":0.08705478599791525,"filtered":false,"id":"202-01-10"},
{"grid_size":225,"obj_size_mean":172.84487179487178,"obj_size_std":20.484450273108457,"x":140,"y":56.25,"w":20,"h":11.25,"count":13,"ratio":0.09104200121381537,"filtered":false,"id":"202-01-11"},
{"grid_size":900,"x":80,"y":67.5,"w":40,"h":22.5,"count":0,"obj_size_mean":0,"filtered":false,"id":"202-10"},
{"grid_size":900,"x":120,"y":67.5,"w":40,"h":22.5,"count":10,"key":"202-11","obj_size_mean":180.5440476190476,"obj_size_std":9.867665015705684,"ratio":0.010964072239672983,"filtered":false,"id":"202-11"},
{"grid_size":900,"x":80,"y":90,"w":40,"h":22.5,"count":8,"key":"203-00","obj_size_mean":320.8982638888889,"obj_size_std":155.6861993125524,"ratio":0.17298466590283598,"filtered":false,"id":"203-00"},
{"grid_size":900,"obj_size_mean":401.9700846751628,"obj_size_std":148.78736091125592,"x":120,"y":90,"w":40,"h":22.5,"count":48,"ratio":0.16531928990139547,"filtered":false,"id":"203-01"},
{"grid_size":900,"x":80,"y":112.5,"w":40,"h":22.5,"count":5,"key":"203-10","obj_size_mean":318.89166666666665,"obj_size_std":142.41637287857353,"ratio":0.15824041430952615,"filtered":false,"id":"203-10"},
{"grid_size":900,"obj_size_mean":446.4520034843206,"obj_size_std":148.24107081585922,"x":120,"y":112.5,"w":40,"h":22.5,"count":41,"ratio":0.16471230090651023,"filtered":false,"id":"203-11"},
{"grid_size":225,"obj_size_mean":145.98134920634922,"obj_size_std":56.62171856810284,"x":160,"y":45,"w":20,"h":11.25,"count":16,"ratio":0.2516520825249015,"filtered":false,"id":"302-00-00"},
{"grid_size":225,"obj_size_mean":148.215931372549,"obj_size_std":48.87803153418164,"x":180,"y":45,"w":20,"h":11.25,"count":17,"ratio":0.21723569570747395,"filtered":false,"id":"302-00-01"},
{"grid_size":225,"x":160,"y":56.25,"w":20,"h":11.25,"count":10,"key":"302-00-10","obj_size_mean":150.15845238095238,"obj_size_std":37.94956524000495,"ratio":0.168664734400022,"filtered":false,"id":"302-00-10"},
{"grid_size":225,"obj_size_mean":169.17979242979246,"obj_size_std":33.159596562247614,"x":180,"y":56.25,"w":20,"h":11.25,"count":14,"ratio":0.1473759847211005,"filtered":false,"id":"302-00-11"},
{"grid_size":225,"obj_size_mean":161.49583333333334,"obj_size_std":43.152118966056385,"x":200,"y":45,"w":20,"h":11.25,"count":14,"ratio":0.19178719540469505,"filtered":false,"id":"302-01-00"},
{"grid_size":225,"obj_size_mean":142.29392857142858,"obj_size_std":39.885223179917645,"x":220,"y":45,"w":20,"h":11.25,"count":15,"ratio":0.17726765857741175,"filtered":false,"id":"302-01-01"},
{"grid_size":225,"x":200,"y":56.25,"w":20,"h":11.25,"count":6,"key":"302-01-10","obj_size_mean":149.82083333333333,"obj_size_std":44.85253732138982,"ratio":0.1993446103172881,"filtered":false,"id":"302-01-10"},
{"grid_size":225,"obj_size_mean":169.00384615384615,"obj_size_std":27.203861852963076,"x":220,"y":56.25,"w":20,"h":11.25,"count":13,"ratio":0.1209060526798359,"filtered":false,"id":"302-01-11"},
{"grid_size":225,"x":160,"y":67.5,"w":20,"h":11.25,"count":6,"key":"302-10-00","obj_size_mean":185.52916666666667,"obj_size_std":18.236915971914403,"ratio":0.08105295987517512,"filtered":false,"id":"302-10-00"},
{"grid_size":225,"x":180,"y":67.5,"w":20,"h":11.25,"count":5,"key":"302-10-01","obj_size_mean":185.62,"obj_size_std":21.47258717528002,"ratio":0.0954337207790223,"filtered":false,"id":"302-10-01"},
{"grid_size":225,"x":160,"y":78.75,"w":20,"h":11.25,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-10-10"},
{"grid_size":225,"x":180,"y":78.75,"w":20,"h":11.25,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-10-11"},
{"grid_size":225,"x":200,"y":67.5,"w":20,"h":11.25,"count":3,"key":"302-11-00","obj_size_mean":164.35,"obj_size_std":28.402772751969128,"ratio":0.12623454556430724,"filtered":false,"id":"302-11-00"},
{"grid_size":225,"obj_size_mean":172.45833333333331,"obj_size_std":27.481515252175512,"x":220,"y":67.5,"w":20,"h":11.25,"count":11,"ratio":0.12214006778744672,"filtered":false,"id":"302-11-01"},
{"grid_size":225,"x":200,"y":78.75,"w":20,"h":11.25,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-11-10"},
{"grid_size":225,"x":220,"y":78.75,"w":20,"h":11.25,"count":5,"key":"302-11-11","obj_size_mean":152.85,"obj_size_std":53.95646393158099,"ratio":0.2398065063625822,"filtered":false,"id":"302-11-11"},
{"grid_size":900,"obj_size_mean":396.1013736263736,"obj_size_std":113.59918097219467,"x":160,"y":90,"w":40,"h":22.5,"count":39,"ratio":0.12622131219132743,"filtered":false,"id":"303-00"},
{"grid_size":900,"obj_size_mean":388.83857376283845,"obj_size_std":135.93314308179805,"x":200,"y":90,"w":40,"h":22.5,"count":34,"ratio":0.15103682564644227,"filtered":false,"id":"303-01"},
{"grid_size":900,"obj_size_mean":432.22126436781616,"obj_size_std":118.65259735718057,"x":160,"y":112.5,"w":40,"h":22.5,"count":29,"ratio":0.13183621928575617,"filtered":false,"id":"303-10"},
{"grid_size":900,"obj_size_mean":426.7466825396825,"obj_size_std":118.40808326312856,"x":200,"y":112.5,"w":40,"h":22.5,"count":25,"ratio":0.13156453695903172,"filtered":false,"id":"303-11"},
{"grid_size":225,"x":240,"y":45,"w":20,"h":11.25,"count":6,"key":"402-00-00","obj_size_mean":196.34523809523807,"obj_size_std":45.39270509384697,"ratio":0.2017453559726532,"filtered":false,"id":"402-00-00"},
{"grid_size":225,"x":260,"y":45,"w":20,"h":11.25,"count":5,"key":"402-00-01","obj_size_mean":187.42666666666668,"obj_size_std":50.46249652519736,"ratio":0.22427776233421048,"filtered":false,"id":"402-00-01"},
{"grid_size":225,"x":240,"y":56.25,"w":20,"h":11.25,"count":5,"key":"402-00-10","obj_size_mean":179.98333333333332,"obj_size_std":67.26936937087753,"ratio":0.2989749749816779,"filtered":false,"id":"402-00-10"},
{"grid_size":225,"x":260,"y":56.25,"w":20,"h":11.25,"count":4,"key":"402-00-11","obj_size_mean":207.66666666666669,"obj_size_std":53.1453283546722,"ratio":0.23620145935409867,"filtered":false,"id":"402-00-11"},
{"grid_size":225,"x":280,"y":45,"w":20,"h":11.25,"count":4,"key":"402-01-00","obj_size_mean":181.59375,"obj_size_std":58.25497251665875,"ratio":0.2589109889629278,"filtered":false,"id":"402-01-00"},
{"grid_size":225,"x":300,"y":45,"w":20,"h":11.25,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-01-01"},
{"grid_size":225,"x":280,"y":56.25,"w":20,"h":11.25,"count":4,"key":"402-01-10","obj_size_mean":156.66666666666666,"obj_size_std":43.0193754797378,"ratio":0.19119722435439024,"filtered":false,"id":"402-01-10"},
{"grid_size":225,"x":300,"y":56.25,"w":20,"h":11.25,"count":8,"key":"402-01-11","obj_size_mean":206.078125,"obj_size_std":49.86530685882721,"ratio":0.22162358603923205,"filtered":false,"id":"402-01-11"},
{"grid_size":900,"x":240,"y":67.5,"w":40,"h":22.5,"count":10,"key":"402-10","obj_size_mean":194.26833333333335,"obj_size_std":40.595857220371514,"ratio":0.045106508022635015,"filtered":false,"id":"402-10"},
{"grid_size":900,"x":280,"y":67.5,"w":40,"h":22.5,"count":4,"key":"402-11","obj_size_mean":188.9471153846154,"obj_size_std":39.072479100098235,"ratio":0.04341386566677582,"filtered":false,"id":"402-11"},
{"grid_size":900,"obj_size_mean":489.74912582554396,"obj_size_std":212.37848174317372,"x":240,"y":90,"w":40,"h":22.5,"count":42,"ratio":0.23597609082574858,"filtered":false,"id":"403-00"},
{"grid_size":900,"obj_size_mean":513.2599826388889,"obj_size_std":243.0447164256245,"x":280,"y":90,"w":40,"h":22.5,"count":16,"ratio":0.27004968491736053,"filtered":false,"id":"403-01"},
{"grid_size":900,"obj_size_mean":632.2697286572288,"obj_size_std":210.3952846021855,"x":240,"y":112.5,"w":40,"h":22.5,"count":37,"ratio":0.2337725384468728,"filtered":false,"id":"403-10"},
{"grid_size":900,"x":280,"y":112.5,"w":40,"h":22.5,"count":8,"key":"403-11","obj_size_mean":533.575186965812,"obj_size_std":240.16533889147783,"ratio":0.26685037654608645,"filtered":false,"id":"403-11"},

    ],

      print_logs: [


      ],
      print_user_logs: [

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
