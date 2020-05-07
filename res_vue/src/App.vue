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

      let back_ = '';
      let opacity_ = "1";
      if(this.transactions.includes(item.id)) {
        back_ = 'yellow';
        opacity_ = '0.5'
      }
  

      // let dir_degree = item.direction_mean
      // if (this.groups.includes(item.id)) {
      //    back_ = '#22ee22'
      //    opacity_ = 1

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
        stroke: "black",
        strokeWidth: 2,
        selectable: false,
        fill: back_,
        opacity: opacity_
      });
      lines.push(rect);
    }

    for (let i = 0 ; i < this.print_user_logs.length ; i ++) {
      let item = this.print_user_logs[i];
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
      lines.push(rect);
    }
    for (let i = 0 ; i < this.print_logs.length ; i ++) {
      let item = this.print_logs[i];
      let back_ = 'blue';
      let opacity_ = 0.6
      let rect = new fabric.Rect({
        left: item.x,
        top: item.y,
        width: item.w,
        height: item.h,
        stroke: "black",
        strokeWidth: 1,
        selectable: false,
        fill: back_,
        opacity: opacity_
      });
      lines.push(rect);
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
    fabric.Image.fromURL(
      "https://preswottest.s3.ap-northeast-2.amazonaws.com/paper/4800.png",
      function(myImg) {
        //i create an extra var for to change some image properties
        var img1 = myImg.set({
          left: 10,
          top: 0,
          // width: 360, height: 240
          // width: 877, height: 540 // road
          // width: 1080, height: 540 // europe
         //       width: 320, height: 180 // japan
        //  width: 960, height: 540
        });
        img1.scaleToWidth(360);
        img1.scaleToHeight(240);
        
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
      groups :  
 ["403-01-00","402-11-10"],
//[`201-11-10`,`202-01-00`,`202-01-10`,`202-00-11`,`202-10-01`,`202-10-11`,`203-00`,`203-10`,`103-11`,`104`],
    // [`202-01-01`,`202-01-11`,`202-01-10`,`202-11-00`,`202-11-10`,`203-01`,`203-00`,`203-10`,`204-00`,'204-10'],
     //[`201-11-11`,`202-01-01`,`202-01-11`,`202-01-10`,`202-11-00`,`202-11-10`,`203-01`,`203-00`,`203-10`,`204-00`,`204-10`],
     // ['304-01','303-11','303-01','302-11','302-01-10','302-00-11','302-00-01','301-10-11','301-10-10' ],
      rank: 39,
      transactions: 
      ["302-00-11","302-00-01","302-00-00"],
      layout: [
        {"grid_size":5400,"x":270,"y":0,"w":90,"h":60,"count":0,"obj_size_mean":0,"filtered":false,"id":"401"},

{"grid_size":5400,"x":0,"y":0,"w":90,"h":60,"count":0,"obj_size_mean":0,"filtered":false,"id":"101"},
{"grid_size":5400,"obj_size_mean":1433.9775918116322,"obj_size_std":699.102048988493,"x":0,"y":180,"w":90,"h":60,"count":271,"ratio":0.1294633424052765,"filtered":false,"id":"104"},
{"grid_size":1350,"x":0,"y":60,"w":45,"h":30,"count":6,"key":"102-00","obj_size_mean":34.770833333333336,"obj_size_std":12.576370866297902,"ratio":0.009315830271331779,"filtered":false,"id":"102-00"},
{"grid_size":1350,"x":45,"y":60,"w":45,"h":30,"count":4,"key":"102-01","obj_size_mean":39.58213773314204,"obj_size_std":24.71610619831226,"ratio":0.018308226813564636,"filtered":false,"id":"102-01"},
{"grid_size":1350,"x":0,"y":90,"w":45,"h":30,"count":0,"obj_size_mean":0,"filtered":false,"id":"102-10"},
{"grid_size":1350,"x":45,"y":90,"w":45,"h":30,"count":0,"obj_size_mean":0,"filtered":false,"id":"102-11"},
{"grid_size":1350,"x":0,"y":120,"w":45,"h":30,"count":0,"obj_size_mean":0,"filtered":false,"id":"103-00"},
{"grid_size":1350,"x":45,"y":120,"w":45,"h":30,"count":0,"obj_size_mean":0,"filtered":false,"id":"103-01"},
{"grid_size":1350,"x":0,"y":150,"w":45,"h":30,"count":0,"obj_size_mean":0,"filtered":false,"id":"103-10"},
{"grid_size":1350,"obj_size_mean":841.90625,"obj_size_std":404.7130165498265,"x":45,"y":150,"w":45,"h":30,"count":144,"ratio":0.29978741966653816,"filtered":false,"id":"103-11"},
{"grid_size":1350,"x":90,"y":0,"w":45,"h":30,"count":0,"obj_size_mean":0,"filtered":false,"id":"201-00"},
{"grid_size":1350,"x":135,"y":0,"w":45,"h":30,"count":0,"obj_size_mean":0,"filtered":false,"id":"201-01"},
{"grid_size":1350,"x":90,"y":30,"w":45,"h":30,"count":10,"key":"201-10","obj_size_mean":22.035101001939235,"obj_size_std":8.899275520010885,"ratio":0.006592055940748804,"filtered":false,"id":"201-10"},
{"grid_size":84.375,"x":135,"y":30,"w":11.25,"h":7.5,"count":9,"key":"201-11-00-00","obj_size_mean":36.09814814814815,"obj_size_std":25.57581111514415,"ratio":0.30312072432763437,"filtered":false,"id":"201-11-00-00"},
{"grid_size":84.375,"obj_size_mean":41.86666666666667,"obj_size_std":39.508916012014865,"x":146.25,"y":30,"w":11.25,"h":7.5,"count":11,"ratio":0.46825381940165767,"filtered":false,"id":"201-11-00-01"},
{"grid_size":84.375,"obj_size_mean":69.38333333333334,"obj_size_std":32.15433897861244,"x":135,"y":37.5,"w":11.25,"h":7.5,"count":12,"ratio":0.38108846196873997,"filtered":false,"id":"201-11-00-10"},
{"grid_size":84.375,"obj_size_mean":65.33955026455025,"obj_size_std":57.658649764942865,"x":146.25,"y":37.5,"w":11.25,"h":7.5,"count":18,"ratio":0.6833617749919154,"filtered":false,"id":"201-11-00-11"},
{"grid_size":84.375,"x":157.5,"y":30,"w":11.25,"h":7.5,"count":4,"key":"201-11-01-00","obj_size_mean":86.5,"obj_size_std":75.81776396949024,"ratio":0.8985809063050696,"id":"201-11-01-00","filtered":false},
{"grid_size":84.375,"x":168.75,"y":30,"w":11.25,"h":7.5,"count":0,"obj_size_mean":0,"filtered":false,"id":"201-11-01-01"},
{"grid_size":84.375,"obj_size_mean":44.164028944911294,"obj_size_std":42.134631349475164,"x":157.5,"y":37.5,"w":11.25,"h":7.5,"count":34,"ratio":0.4993734085863723,"filtered":false,"id":"201-11-01-10"},
{"grid_size":84.375,"obj_size_mean":53.38780169602087,"obj_size_std":44.84756911250902,"x":168.75,"y":37.5,"w":11.25,"h":7.5,"count":73,"ratio":0.5315267450371439,"filtered":false,"id":"201-11-01-11"},
{"grid_size":337.5,"obj_size_mean":131.59394760794757,"obj_size_std":99.57743338657913,"x":135,"y":45,"w":22.5,"h":15,"count":175,"ratio":0.2950442470713456,"filtered":false,"id":"201-11-10"},
{"grid_size":337.5,"obj_size_mean":108.15920237385352,"obj_size_std":91.55139134209297,"x":157.5,"y":45,"w":22.5,"h":15,"count":215,"ratio":0.27126338175434955,"filtered":false,"id":"201-11-11"},
{"grid_size":337.5,"x":90,"y":60,"w":22.5,"h":15,"count":0,"obj_size_mean":0,"filtered":false,"id":"202-00-00"},
{"grid_size":337.5,"x":112.5,"y":60,"w":22.5,"h":15,"count":0,"obj_size_mean":0,"filtered":false,"id":"202-00-01"},
{"grid_size":337.5,"x":90,"y":75,"w":22.5,"h":15,"count":0,"obj_size_mean":0,"filtered":false,"id":"202-00-10"},
{"grid_size":337.5,"obj_size_mean":204.33333333333331,"obj_size_std":100.58693252183431,"x":112.5,"y":75,"w":22.5,"h":15,"count":20,"ratio":0.2980353556202498,"filtered":false,"id":"202-00-11"},
{"grid_size":337.5,"obj_size_mean":225.10252721034934,"obj_size_std":190.81601618570144,"x":135,"y":60,"w":22.5,"h":15,"count":163,"ratio":0.5653807886983746,"filtered":false,"id":"202-01-00"},
{"grid_size":337.5,"obj_size_mean":171.05981970286663,"obj_size_std":141.0699329280209,"x":157.5,"y":60,"w":22.5,"h":15,"count":320,"ratio":0.41798498645339527,"filtered":false,"id":"202-01-01"},
{"grid_size":337.5,"obj_size_mean":221.6955802262254,"obj_size_std":202.85208507761044,"x":135,"y":75,"w":22.5,"h":15,"count":341,"ratio":0.6010432150447717,"filtered":false,"id":"202-01-10"},
{"grid_size":337.5,"obj_size_mean":186.34507994721932,"obj_size_std":172.8326108394307,"x":157.5,"y":75,"w":22.5,"h":15,"count":409,"ratio":0.5120966247094243,"filtered":false,"id":"202-01-11"},
{"grid_size":337.5,"x":90,"y":90,"w":22.5,"h":15,"count":0,"obj_size_mean":0,"filtered":false,"id":"202-10-00"},
{"grid_size":337.5,"obj_size_mean":239.85980392156867,"obj_size_std":153.19955290347053,"x":112.5,"y":90,"w":22.5,"h":15,"count":170,"ratio":0.45392460119546824,"filtered":false,"id":"202-10-01"},
{"grid_size":337.5,"x":90,"y":105,"w":22.5,"h":15,"count":4,"key":"202-10-10","obj_size_mean":380,"obj_size_std":61.78996682310163,"ratio":0.18308138317956038,"id":"202-10-10","filtered":false},
{"grid_size":337.5,"x":112.5,"y":105,"w":22.5,"h":15,"count":203,"key":"202-10-11","obj_size_mean":363.13653530377667,"obj_size_std":248.93916124863327,"ratio":0.7375975148107652,"id":"202-10-11","filtered":false},
{"grid_size":337.5,"obj_size_mean":289.4987711213519,"obj_size_std":272.8382632627043,"x":135,"y":90,"w":22.5,"h":15,"count":310,"ratio":0.8084096689265312,"filtered":false,"id":"202-11-00"},
{"grid_size":337.5,"obj_size_mean":236.67161060142712,"obj_size_std":236.69468540081132,"x":157.5,"y":90,"w":22.5,"h":15,"count":327,"ratio":0.7013175863727743,"filtered":false,"id":"202-11-01"},
{"grid_size":337.5,"x":135,"y":105,"w":22.5,"h":15,"count":284,"key":"202-11-10","obj_size_mean":357.35974178403774,"obj_size_std":304.01829752927534,"ratio":0.9007949556422973,"id":"202-11-10","filtered":false},
{"grid_size":337.5,"obj_size_mean":293.7032110091743,"obj_size_std":245.09571561591494,"x":157.5,"y":105,"w":22.5,"h":15,"count":327,"ratio":0.7262095277508591,"filtered":false,"id":"202-11-11"},
{"grid_size":1350,"obj_size_mean":550.0095577945704,"obj_size_std":360.3425032831095,"x":90,"y":120,"w":45,"h":30,"count":397,"ratio":0.26692037280230335,"filtered":false,"id":"203-00"},
{"grid_size":1350,"obj_size_mean":429.22669851380084,"obj_size_std":344.0633193706427,"x":135,"y":120,"w":45,"h":30,"count":628,"ratio":0.25486171805232793,"filtered":false,"id":"203-01"},
{"grid_size":1350,"obj_size_mean":745.9285305538523,"obj_size_std":467.6166555006306,"x":90,"y":150,"w":45,"h":30,"count":466,"ratio":0.34638270777824487,"filtered":false,"id":"203-10"},
{"grid_size":1350,"obj_size_mean":675.4530831099194,"obj_size_std":541.4639797678865,"x":135,"y":150,"w":45,"h":30,"count":373,"ratio":0.4010844294576937,"filtered":false,"id":"203-11"},
{"grid_size":1350,"obj_size_mean":1119.2146838156484,"obj_size_std":703.3270658606995,"x":90,"y":180,"w":45,"h":30,"count":311,"ratio":0.5209830117486662,"filtered":false,"id":"204-00"},
{"grid_size":1350,"obj_size_mean":929.5118907563026,"obj_size_std":363.6988233925858,"x":135,"y":180,"w":45,"h":30,"count":340,"ratio":0.2694065358463598,"filtered":false,"id":"204-01"},
{"grid_size":1350,"obj_size_mean":1245.291920045045,"obj_size_std":661.8824522266876,"x":90,"y":210,"w":45,"h":30,"count":296,"ratio":0.49028329794569453,"filtered":false,"id":"204-10"},
{"grid_size":1350,"obj_size_mean":1070.3650256410258,"obj_size_std":264.10183321979406,"x":135,"y":210,"w":45,"h":30,"count":325,"ratio":0.19563098757021782,"filtered":false,"id":"204-11"},
{"grid_size":1350,"x":180,"y":0,"w":45,"h":30,"count":0,"obj_size_mean":0,"filtered":false,"id":"301-00"},
{"grid_size":1350,"x":225,"y":0,"w":45,"h":30,"count":0,"obj_size_mean":0,"filtered":false,"id":"301-01"},
{"grid_size":337.5,"obj_size_mean":108.95555555555556,"obj_size_std":63.70611343418219,"x":180,"y":30,"w":22.5,"h":15,"count":36,"ratio":0.18875885461979908,"filtered":false,"id":"301-10-00"},
{"grid_size":337.5,"x":202.5,"y":30,"w":22.5,"h":15,"count":0,"obj_size_mean":0,"filtered":false,"id":"301-10-01"},
{"grid_size":337.5,"obj_size_mean":106.81818269362917,"obj_size_std":73.27881618134826,"x":180,"y":45,"w":22.5,"h":15,"count":588,"ratio":0.21712241831510595,"filtered":false,"id":"301-10-10"},
{"grid_size":337.5,"obj_size_mean":147.20788133435187,"obj_size_std":108.91521158966694,"x":202.5,"y":45,"w":22.5,"h":15,"count":425,"ratio":0.3227117380434576,"filtered":false,"id":"301-10-11"},
{"grid_size":337.5,"x":225,"y":30,"w":22.5,"h":15,"count":0,"obj_size_mean":0,"filtered":false,"id":"301-11-00"},
{"grid_size":337.5,"x":247.5,"y":30,"w":22.5,"h":15,"count":0,"obj_size_mean":0,"filtered":false,"id":"301-11-01"},
{"grid_size":337.5,"obj_size_mean":263.83968253968254,"obj_size_std":145.36917985078992,"x":225,"y":45,"w":22.5,"h":15,"count":15,"ratio":0.43072349585419234,"filtered":false,"id":"301-11-10"},
{"grid_size":337.5,"x":247.5,"y":45,"w":22.5,"h":15,"count":0,"obj_size_mean":0,"filtered":false,"id":"301-11-11"},
{"grid_size":337.5,"obj_size_mean":145.07387724282887,"obj_size_std":97.17192003872117,"x":180,"y":60,"w":22.5,"h":15,"count":372,"ratio":0.28791680011472937,"filtered":false,"id":"302-00-00"},
{"grid_size":337.5,"obj_size_mean":183.54848048271614,"obj_size_std":119.51664171561684,"x":202.5,"y":60,"w":22.5,"h":15,"count":785,"ratio":0.35412338286108697,"filtered":false,"id":"302-00-01"},
{"grid_size":337.5,"obj_size_mean":322.69166666666666,"obj_size_std":264.2030974167181,"x":180,"y":75,"w":22.5,"h":15,"count":32,"ratio":0.7828239923458314,"filtered":false,"id":"302-00-10"},
{"grid_size":337.5,"obj_size_mean":234.08227790578601,"obj_size_std":134.9150608006432,"x":202.5,"y":75,"w":22.5,"h":15,"count":620,"ratio":0.39974832829820206,"filtered":false,"id":"302-00-11"},
{"grid_size":337.5,"obj_size_mean":244.77406554019458,"obj_size_std":198.39615040622328,"x":225,"y":60,"w":22.5,"h":15,"count":279,"ratio":0.587840445648069,"filtered":false,"id":"302-01-00"},
{"grid_size":337.5,"x":247.5,"y":60,"w":22.5,"h":15,"count":0,"obj_size_mean":0,"filtered":false,"id":"302-01-01"},
{"grid_size":337.5,"obj_size_mean":297.0449574673332,"obj_size_std":209.10126434966875,"x":225,"y":75,"w":22.5,"h":15,"count":543,"ratio":0.6195593017767963,"filtered":false,"id":"302-01-10"},
{"grid_size":337.5,"obj_size_mean":325.83140716960946,"obj_size_std":209.12889454924152,"x":247.5,"y":75,"w":22.5,"h":15,"count":178,"ratio":0.6196411690347897,"filtered":false,"id":"302-01-11"},
{"grid_size":1350,"obj_size_mean":416.55691826852353,"obj_size_std":178.46145494899827,"x":180,"y":90,"w":45,"h":30,"count":461,"ratio":0.1321936703325913,"filtered":false,"id":"302-10"},
{"grid_size":1350,"obj_size_mean":498.14600361973265,"obj_size_std":341.77975642464196,"x":225,"y":90,"w":45,"h":30,"count":649,"ratio":0.2531701899441792,"filtered":false,"id":"302-11"},
{"grid_size":1350,"obj_size_mean":626.3463424771404,"obj_size_std":176.28418333736684,"x":180,"y":120,"w":45,"h":30,"count":401,"ratio":0.13058087654619766,"filtered":false,"id":"303-00"},
{"grid_size":1350,"obj_size_mean":782.9930516031112,"obj_size_std":516.0424303537947,"x":225,"y":120,"w":45,"h":30,"count":502,"ratio":0.382253652113922,"filtered":false,"id":"303-01"},
{"grid_size":1350,"obj_size_mean":794.2043795620438,"obj_size_std":260.496270964789,"x":180,"y":150,"w":45,"h":30,"count":137,"ratio":0.19296020071465853,"filtered":false,"id":"303-10"},
{"grid_size":1350,"obj_size_mean":866.2141833810888,"obj_size_std":383.8480440092506,"x":225,"y":150,"w":45,"h":30,"count":698,"ratio":0.28433188445129676,"filtered":false,"id":"303-11"},
{"grid_size":1350,"x":180,"y":180,"w":45,"h":30,"count":7,"key":"304-00","obj_size_mean":1164.4285714285713,"obj_size_std":635.8180707149012,"ratio":0.4709763486777046,"filtered":false,"id":"304-00"},
{"grid_size":1350,"obj_size_mean":939.9246453900709,"obj_size_std":379.1486983911796,"x":225,"y":180,"w":45,"h":30,"count":376,"ratio":0.2808508876971701,"filtered":false,"id":"304-01"},
{"grid_size":1350,"x":180,"y":210,"w":45,"h":30,"count":0,"obj_size_mean":0,"filtered":false,"id":"304-10"},
{"grid_size":1350,"x":225,"y":210,"w":45,"h":30,"count":3,"key":"304-11","obj_size_mean":1322.3333333333333,"obj_size_std":784.4936796006284,"ratio":0.5811064293337989,"filtered":false,"id":"304-11"},
{"grid_size":1350,"x":270,"y":60,"w":45,"h":30,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-00"},
{"grid_size":1350,"x":315,"y":60,"w":45,"h":30,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-01"},
{"grid_size":1350,"obj_size_mean":605.7074235660174,"obj_size_std":636.0945018691092,"x":270,"y":90,"w":45,"h":30,"count":64,"ratio":0.47118111249563643,"filtered":false,"id":"402-10"},
{"grid_size":337.5,"x":315,"y":90,"w":22.5,"h":15,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-11-00"},
{"grid_size":337.5,"x":337.5,"y":90,"w":22.5,"h":15,"count":0,"obj_size_mean":0,"filtered":false,"id":"402-11-01"},
{"grid_size":337.5,"obj_size_mean":227.94002531822792,"obj_size_std":180.12453120210117,"x":315,"y":105,"w":22.5,"h":15,"count":53,"ratio":0.5337023146728923,"filtered":false,"id":"402-11-10"},
{"grid_size":337.5,"obj_size_mean":204.4875,"obj_size_std":217.35508121141373,"x":337.5,"y":105,"w":22.5,"h":15,"count":16,"ratio":0.6440150554412258,"filtered":false,"id":"402-11-11"},
{"grid_size":1350,"obj_size_mean":794.2695105820105,"obj_size_std":631.8189308747845,"x":270,"y":120,"w":45,"h":30,"count":252,"ratio":0.46801402287021077,"filtered":false,"id":"403-00"},
{"grid_size":337.5,"obj_size_mean":286.47260939509465,"obj_size_std":159.0630032646793,"x":315,"y":120,"w":22.5,"h":15,"count":46,"ratio":0.4712977874509017,"filtered":false,"id":"403-01-00"},
{"grid_size":337.5,"obj_size_mean":270.5217426432966,"obj_size_std":201.60406028303393,"x":337.5,"y":120,"w":22.5,"h":15,"count":74,"ratio":0.597345363801582,"filtered":false,"id":"403-01-01"},
{"grid_size":337.5,"x":315,"y":135,"w":22.5,"h":15,"count":8,"key":"403-01-10","obj_size_mean":328.25,"obj_size_std":355.2422714550894,"ratio":1.0525696932002648,"filtered":false,"id":"403-01-10"},
{"grid_size":337.5,"obj_size_mean":128.00842685897032,"obj_size_std":92.50821663992117,"x":337.5,"y":135,"w":22.5,"h":15,"count":66,"ratio":0.2740984196738405,"filtered":false,"id":"403-01-11"},
{"grid_size":1350,"obj_size_mean":1169.8327625570773,"obj_size_std":808.603637508678,"x":270,"y":150,"w":45,"h":30,"count":292,"ratio":0.5989656574138356,"filtered":false,"id":"403-10"},
{"grid_size":1350,"x":315,"y":150,"w":45,"h":30,"count":7,"key":"403-11","obj_size_mean":2287.714285714286,"obj_size_std":1266.7651340173145,"ratio":0.9383445437165292,"id":"403-11","filtered":false},
// {"grid_size":1350,"obj_size_mean":1159.057350187266,"obj_size_std":705.7809123600391,"x":270,"y":180,"w":45,"h":30,"count":356,"ratio":0.5228006758222512,"filtered":false,"id":"404-00"},
// {"grid_size":1350,"obj_size_mean":1125.505,"obj_size_std":552.0482590116354,"x":315,"y":180,"w":45,"h":30,"count":100,"ratio":0.4089246363049151,"filtered":false,"id":"404-01"},
// {"grid_size":1350,"x":270,"y":210,"w":45,"h":30,"count":0,"obj_size_mean":0,"filtered":false,"id":"404-10"},
{"grid_size":1350,"x":270,"y":180,"w":90,"h":60,"count":3,"key":"404-11","obj_size_mean":697,"obj_size_std":525.8507392787425,"ratio":0.38951906613240184,"filtered":false,"id":"404"},

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
