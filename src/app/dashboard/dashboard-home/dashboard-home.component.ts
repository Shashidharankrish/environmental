import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { DashboardService } from '@shared/services/dashboard.service';
import { Observable } from 'rxjs';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);
import { FormControl } from '@angular/forms';
import { LocationService } from '@shared/services/location.service';
import { CommonService } from '@shared/services/common.service';
import { DeviceService } from '@shared/services/device.service';
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";
import {Paho} from 'ng2-mqtt/mqttws31';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})


export class DashboardHomeComponent implements OnInit {

  private chart: am4charts.XYChart;
  results: any[] = [];
  serarchResults: any[] = [];
  queryField: FormControl = new FormControl();
  chartdata: any[] = [];
  humidityChartdata: any[] = [];
  colineChartdata: any[] = [];
  co2lineChartdata: any[] = [];
  piechartdata: any[] = [];
  chartvalue: any[] = [];
  chartdate: any[] = [];
  rows;
  dashBoardInfo: dashBoardInfos[];
  noOfShifts: any;
  noOfAllocatedShifts: any;
  noOfDevices: any;
  noOfUsers: any;
  allCounts: Observable<any>;
  flipped = false; flipped2 = false; flipped3 = false; flipped4 = false; flipped5 = false; flipped6 = false;
  graph1:boolean = false;
  grph1_close_button:boolean = false;
  graph2:boolean = false;
  grph2_close_button:boolean = false;
  currentTemperature: any = 0;
  currentHumidity: any = 0;
  currentCo: any = 0;
  currentCo2: any = 0;
  currentN2: any = 0;
  suspendedParticles: any = 0;
  searchData: any;
  chartLabel:string = 'Temperature';
  co2mRange: string;
  co2lRange: string;
  donutCo2: string;
  locationAvgInfo: any;
  donutchartCo2LowCount: number;
  donutchartCo2MediumCount: number;
  private client;
  liveChart: any;
  liveChartSeries: any;
  temperatureLebel: string;
  temperatureColor: string;
  humidityLebel: string;
  humidityColor: string;
  co2Lebel: string;
  co2Color: string;
  coLebel: string;
  coColor: string;
  n2Lebel: string;
  n2Color: string;
  susPartLebel: string;
  susPartColor: string;
  parameters: any;
  selectedParameter: string = "temperature";
  locationInfo: any;
  device: any;
  
  constructor(
    public cmnSrv: CommonService,
    private dashBoardService: DashboardService,
    private locationservice: LocationService,
    private route: ActivatedRoute,
    private deviceService: DeviceService
  ) { }

  ngOnInit() {

    this.dashBoardService.getParameters().subscribe(res => {
      if(res['status'] == true) {
        this.parameters = res['list'];
      }
    });    
    
    this.route.queryParams.subscribe(params => {
        const data = { locationid: params['locationid'] };
        this.searchData = data.locationid;

        this.deviceService.getDeviceByLocation(data.locationid).subscribe(res => {
          if(res['status'] == true) {
            this.device = res['list'];
            console.log(this.device)
            this.connectMQTT();
          }
        });

       // if(data.locationid.parent_id == 0){
          this.piechartdata = [];
          this.chartdata = [];          
          
          this.dashBoardService.getLocationAvgInfo(data.locationid, 'no_type').subscribe(coinfo => { 
              this.currentCo = parseFloat(coinfo.co).toFixed(2);
              this.currentTemperature = parseFloat(coinfo.temperature).toFixed(2);
              this.currentHumidity = parseFloat(coinfo.humidity).toFixed(2);
              this.currentCo2 = parseFloat(coinfo.co2).toFixed(2);
              this.currentN2 = parseFloat(coinfo.n2).toFixed(2);
              this.suspendedParticles = parseFloat(coinfo.suspended_particles).toFixed(2);

              this.locationservice.getLocationDetails(data.locationid).subscribe( res => {
                this.locationInfo = res;
                if(res['list'].parent_id != 0){
                  //get parent location parameter range value to compare
                  this.locationservice.getLocationDetails(res['list'].parent_id).subscribe( res => {                    
                    if(this.currentTemperature < res['list'].range.temperature.low){
                      this.temperatureLebel = 'Low';
                      this.temperatureColor = 'low';
                    } else if((this.currentTemperature >= res['list'].range.temperature.low) && (this.currentTemperature < res['list'].range.temperature.medium)){
                      this.temperatureLebel = 'Medium';
                      this.temperatureColor = 'medium';
                    } else if (this.currentTemperature >= res['list'].range.temperature.high){
                      this.temperatureLebel = 'High';
                      this.temperatureColor = 'high';
                    }

                    if(this.currentHumidity < res['list'].range.humidity.low){
                      this.humidityLebel = 'Low';
                      this.humidityColor = 'low';
                    } else if((this.currentHumidity >= res['list'].range.humidity.low) && (this.currentHumidity < res['list'].range.humidity.medium)){
                      this.humidityLebel = 'Medium';
                      this.humidityColor = 'medium';
                    } else if (this.currentHumidity >= res['list'].range.humidity.high){
                      this.humidityLebel = 'High';
                      this.humidityColor = 'high';
                    }

                    if(this.currentCo2 < res['list'].range.co2.low){
                      this.co2Lebel = 'Low';
                      this.co2Color = 'low';
                    } else if((this.currentCo2 >= res['list'].range.co2.low) && (this.currentCo2 < res['list'].range.co2.medium)){
                      this.co2Lebel = 'Medium';
                      this.co2Color = 'medium';
                    } else if (this.currentCo2 >= res['list'].range.co2.high){
                      this.co2Lebel = 'High';
                      this.co2Color = 'high';
                    }

                    if(this.currentCo < res['list'].range.co.low){
                      this.coLebel = 'Low';
                      this.coColor = 'low';
                    } else if((this.currentCo >= res['list'].range.co.low) && (this.currentCo < res['list'].range.co.medium)){
                      this.coLebel = 'Medium';
                      this.coColor = 'medium';
                    } else if (this.currentCo >= res['list'].range.co.high){
                      this.coLebel = 'High';
                      this.coColor = 'high';
                    }

                    if(this.currentN2 < res['list'].range.n2.low){
                      this.n2Lebel = 'Low';
                      this.n2Color = 'low';
                    } else if((this.currentN2 >= res['list'].range.n2.low) && (this.currentN2 < res['list'].range.n2.medium)){
                      this.n2Lebel = 'Medium';
                      this.n2Color = 'medium';
                    } else if (this.currentN2 >= res['list'].range.n2.high){
                      this.n2Lebel = 'High';
                      this.n2Color = 'high';
                    }

                    if(res['list'].range.suspended_particles.medium){
                      if(this.suspendedParticles < res['list'].range.suspended_particles.low){
                        this.susPartLebel = 'Low';
                        this.susPartColor = 'low';
                      } else if((this.suspendedParticles >= res['list'].range.suspended_particles.low) && (this.suspendedParticles < res['list'].range.suspended_particles.medium)){
                        this.susPartLebel = 'Medium';
                        this.susPartColor = 'medium';
                      } else if (this.suspendedParticles >= res['list'].range.suspended_particles.high){
                        this.susPartLebel = 'High';
                        this.susPartColor = 'high';
                      }
                    }else{
                      if(this.suspendedParticles >= res['list'].range.suspended_particles.high){
                        this.susPartLebel = 'High';
                        this.susPartColor = 'high';
                      }else{
                        this.susPartLebel = 'Low';
                        this.susPartColor = 'low';
                      }
                    }

                  },err => {
                      console.log(err)
                  });
                }
              },err => {
                  console.log(err)
              });

              
              // this.piechartdata.push({
              //   type: "Temprature",
              //   percent: this.currentTemperature,
              //   color: "#ff6456",
              //   subs: [{ type: "Bangalore", percent: 15 }, { type: "Chennai",percent: 35 }, { type: "Mumbai",percent: 20 }]
              // });

              // this.piechartdata.push({
              //   type: "Humidity",
              //   percent: this.currentHumidity,
              //   color: "#1a99ec",
              //   subs: [{ type: "Bangalore", percent: 15 }, { type: "Chennai",percent: 35 }, { type: "Mumbai",percent: 20 }]
              // });
              // this.piechartdata.push({
              //   type: "Co2",
              //   percent: this.currentCo2,
              //   color: "#a756e8",
              //   subs: [{ type: "Bangalore", percent: 15 }, { type: "Chennai",percent: 35 }, { type: "Mumbai",percent: 20 }]
              // });
              // this.piechartdata.push({
              //   type: "CO",
              //   percent: this.currentCo,
              //   color: "#66c6a3",
              //   subs: [{ type: "Bangalore", percent: 15 }, { type: "Chennai",percent: 35 }, { type: "Mumbai",percent: 20 }]
              // });
              
              //this.drawpieChart(this.piechartdata);
           },err => {
            console.log(err.error.message)
          });
          this.dashBoardService.getLocationAllInfo(data.locationid, 'temperature').subscribe(locationtem => { 
            this.results = locationtem.result;
            for(let x=0; x <  this.results.length; x++){
              var fdate =  moment(this.results[x].time).format("DD MMM  h:m");     
              this.chartdata.push({ datetime: fdate, value:  this.results[x].value });
            }
            this.drawChart(this.chartdata);
          },err => {
            console.log(err.error.message)
          });

          this.dashBoardService.getLocationAllInfo(data.locationid, 'humidity').subscribe(humiditydata => { 
            humiditydata = humiditydata.result;

            for(let x=0; x <  humiditydata.length; x++){
              var fdate =  moment(humiditydata[x].time).format("DD MMM  h:m");     
              this.humidityChartdata.push({ datetime: fdate, value:  humiditydata[x].value });
            }
            //this.drawHumidityChart(this.humidityChartdata);
          },err => {
            console.log(err.error.message)
          });  
          
          this.dashBoardService.getLocationAllInfo(data.locationid, 'co').subscribe(codata => { 
            codata = codata.result;

            for(let x=0; x < codata.length; x++){
              var fdate =  moment(codata[x].time).format("DD MMM  h:m");     
              this.colineChartdata.push({ datetime: fdate, value:  codata[x].value });
            }
            //this.drawCoLineChart(this.colineChartdata);
          },err => {
            console.log(err.error.message)
          });

          this.dashBoardService.getLocationAllInfo(data.locationid, 'co2').subscribe(codata => { 
            codata = codata.result;

            for(let x=0; x < codata.length; x++){
              var fdate =  moment(codata[x].time).format("DD MMM  h:m");     
              this.co2lineChartdata.push({ datetime: fdate, value:  codata[x].value });
            }
            //this.drawco2Chart(this.co2lineChartdata);
          },err => {
            console.log(err.error.message)
          });
        
    });

    this.getAllCounts();   
      $(".slide_down_icon1").on("click",function() {
      $('.expansion_panel_div').slideToggle();
   });
 
  }
  changeGraph(type, name)
  {
    this.chartdata = [];
    this.chartLabel = name;
    this.selectedParameter = type;
    this.dashBoardService.getLocationAllInfo(this.searchData, this.selectedParameter).subscribe(locationtem => { 
      this.results = locationtem.result;
      for(let x=0; x <  this.results.length; x++){
        var fdate =  moment(this.results[x].time).format("DD MMM  h:m");     
        this.chartdata.push({ datetime: fdate, value:  this.results[x].value });
      }
      this.drawChart(this.chartdata);
    },err => {
      console.log(err.error.message)
    });

    // this.chartdata = [];
    // if(event == 'temp'){ 
    //   this.chartdata = [];
    //   this.chartLabel = 'Temperature';
    //   this.dashBoardService.getLocationAllInfo(this.searchData, 'temperature').subscribe(locationtem => { 
    //     this.results = locationtem;
    //     for(let x=0; x <  this.results.length; x++){
    //       var fdate =  moment(this.results[x].time).format("DD MMM  h:m");     
    //       this.chartdata.push({ datetime: fdate, value:  this.results[x].value });
    //     }
    //     this.drawChart(this.chartdata);
    //   },err => {
    //     console.log(err.error.message)
    //   });
    // } else if(event == 'co2'){
    //   this.chartdata = [];
    //   this.chartLabel = 'CO2 Level';
    //   this.dashBoardService.getLocationAllInfo(this.searchData, 'co2').subscribe(codata => { 
    //     for(let x=0; x < codata.length; x++){
    //       var fdate =  moment(codata[x].time).format("DD MMM  h:m");     
    //       this.chartdata.push({ datetime: fdate, value:  codata[x].value });
    //     }
    //     this.drawChart(this.chartdata);
    //   },err => {
    //     console.log(err.error.message)
    //   });
    // } else if(event == 'co'){
    //   this.chartdata = [];
    //   this.chartLabel = 'CO Level';
    //   this.dashBoardService.getLocationAllInfo(this.searchData, 'co').subscribe(codata => { 
    //     for(let x=0; x < codata.length; x++){
    //       var fdate =  moment(codata[x].time).format("DD MMM  h:m");     
    //       this.chartdata.push({ datetime: fdate, value:  codata[x].value });
    //     }
    //     this.drawChart(this.chartdata);
    //   },err => {
    //     console.log(err.error.message)
    //   });
    // } else if(event == 'humidity'){
    //   this.chartdata = [];
    //   this.chartLabel = 'Humidity';
    //   this.dashBoardService.getLocationAllInfo(this.searchData, 'humidity').subscribe(codata => { 
    //     for(let x=0; x < codata.length; x++){
    //       var fdate =  moment(codata[x].time).format("DD MMM  h:m");     
    //       this.chartdata.push({ datetime: fdate, value:  codata[x].value });
    //     }
    //     this.drawChart(this.chartdata);
    //   },err => {
    //     console.log(err.error.message)
    //   });
    // }
  }
  //   drawpieChart( piechartdata){
  //   let chart1 = am4core.create("pie_chart", am4charts.PieChart);
  //   let selected;
  //   var types = piechartdata;
   
  //     chart1.data = generatePieChartData();
  //     // Add data
  //     var pieSeries = chart1.series.push(new am4charts.PieSeries());
  //     pieSeries.dataFields.value = "percent";
  //     pieSeries.dataFields.category = "type";
  //     pieSeries.slices.template.propertyFields.fill = "color";
  //     pieSeries.slices.template.propertyFields.isActive = "pulled";
  //     pieSeries.slices.template.strokeWidth = 0;

  //     function generatePieChartData() {
  //       var chart1Data = [];
  //       for (var i = 0; i < types.length; i++) {
  //         if (i == selected) {
  //           for (var x = 0; x < types[i].subs.length; x++) {
  //             chart1Data.push({
  //               type: types[i].subs[x].type,
  //               percent: types[i].subs[x].percent,
  //               color: types[i].color,
  //               pulled: true
  //             });
  //           }
  //         } else {
  //           chart1Data.push({
  //             type: types[i].type,
  //             percent: types[i].percent,
  //             color: types[i].color,
  //             id: i
  //           });
  //         }
  //       }
  //       return chart1Data;
      
  //     }

  //     pieSeries.slices.template.events.on("hit", function (event)  {
  //       if (event.target.dataItem.dataContext['id'] != undefined) {
  //         selected = event.target.dataItem.dataContext['id'];
  //       } else {
  //         selected = undefined;
  //       }
  //       chart1.data = generatePieChartData();
  //     });

  //   $(document).on("click", ".slide_down_icon", function () {
  //     $('.slide_down_div').slideToggle();
  //   });

  //   $(document).on("click", ".full_screen_icon", function () {
  //     $('.slide_down_div').addClass('toggle_class_overlay');
  //     $('.close_default_btn').css('display', 'block');
  //   });

  //   $(document).on("click", ".close_default_btn", function () {
  //     $('.slide_down_div').removeClass('graph1');
  //     $('.close_default_btn').css('display', 'none');
  //   });

  // }

  drawHumidityChart(deviceinfo){
    var humchart = am4core.create("humiditychartdiv", am4charts.XYChart);
    humchart.paddingRight = 20;
    humchart.data = deviceinfo ;
    var categoryAxish = humchart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxish.dataFields.category = "datetime";
    categoryAxish.renderer.minGridDistance = 50;
    categoryAxish.renderer.grid.template.location = 0.5;
    categoryAxish.startLocation = 0.5;
    categoryAxish.endLocation = 0.5;

    categoryAxish.renderer.labels.template.rotation = 20;
    categoryAxish.renderer.labels.template.fontSize = "13px";
    categoryAxish.renderer.labels.template.verticalCenter = "middle";
    categoryAxish.renderer.labels.template.horizontalCenter = "middle";
    // Pre zoom
    humchart.events.on("datavalidated", function () {
      categoryAxish.zoomToIndexes(Math.round(humchart.data.length * 0.4), Math.round(humchart.data.length * 0.55));
    });
    // Create value axis
    var valueAxish = humchart.yAxes.push(new am4charts.ValueAxis());
    valueAxish.baseValue = 0;
    // Create series
    var seriesh = humchart.series.push(new am4charts.LineSeries());
    seriesh.dataFields.valueY = "value";
    seriesh.dataFields.categoryX = "datetime";
    seriesh.strokeWidth = 2;
    seriesh.tensionX = 0.77;
    seriesh.fillOpacity = 0.3;
    // Add scrollbar  
    var scrollbarXh = new am4charts.XYChartScrollbar();
    humchart.scrollbarX = scrollbarXh;
    humchart.scrollbarX.thumb.minWidth = 50;
    humchart.cursor = new am4charts.XYCursor();
  }

  drawChart(deviceinfo){
        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.paddingRight = 20;
        // Add data
        chart.data = deviceinfo ;
        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "datetime";
        categoryAxis.renderer.minGridDistance = 50;
        categoryAxis.renderer.grid.template.location = 0.5;
        categoryAxis.startLocation = 0.5;
        categoryAxis.endLocation = 0.5;

        categoryAxis.renderer.labels.template.rotation = 20;
        categoryAxis.renderer.labels.template.fontSize = "13px";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.horizontalCenter = "middle";
        // Pre zoom
        chart.events.on("datavalidated", function () {
        categoryAxis.zoomToIndexes(Math.round(chart.data.length * 0.4), Math.round(chart.data.length * 0.55));
        });
        // Create value axis
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.baseValue = 0;
        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "datetime";
        series.strokeWidth = 2;
        series.tensionX = 0.77; 
        series.fillOpacity = 0.4;
        series.fill = am4core.color("#00BCD4");
        series.stroke = am4core.color("#00BCD4");
        // Add scrollbar
        var scrollbarX = new am4core.Scrollbar();
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarX = scrollbarX;
        chart.scrollbarX.thumb.minWidth = 50;
        chart.cursor = new am4charts.XYCursor();
  }  

  drawCoLineChart(deviceinfo){
    var chart = am4core.create("colinechartdiv", am4charts.XYChart);
    chart.paddingRight = 20;
    chart.data = deviceinfo ;
    var categoryAxis1 = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis1.dataFields.category = "datetime";
    categoryAxis1.renderer.minGridDistance = 50;
    categoryAxis1.renderer.grid.template.location = 0.5;
    categoryAxis1.startLocation = 0.5;
    categoryAxis1.endLocation = 0.5;

    categoryAxis1.renderer.labels.template.rotation = 20;
    categoryAxis1.renderer.labels.template.fontSize = "13px";
    categoryAxis1.renderer.labels.template.verticalCenter = "middle";
    categoryAxis1.renderer.labels.template.horizontalCenter = "middle";
    // Pre zoom
    chart.events.on("datavalidated", function () {
    categoryAxis1.zoomToIndexes(Math.round(chart.data.length * 0.4), Math.round(chart.data.length * 0.55));
    });
    // Create value axis
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.baseValue = 0;
    // Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "datetime";
    series.strokeWidth = 2;
    series.tensionX = 0.77;
    series.fillOpacity = 0.3;
    // Add scrollbar
    var scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX = scrollbarX;
    chart.scrollbarX.thumb.minWidth = 50;
    chart.cursor = new am4charts.XYCursor();
  }
  
  drawco2Chart(deviceinfo){
    var chart = am4core.create("co2linechartdiv", am4charts.XYChart);
    chart.paddingRight = 20;
    // Add data
    chart.data = deviceinfo ;
    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "datetime";
    categoryAxis.renderer.minGridDistance = 50;
    categoryAxis.renderer.grid.template.location = 0.5;
    categoryAxis.startLocation = 0.5;
    categoryAxis.endLocation = 0.5;

    categoryAxis.renderer.labels.template.rotation = 20;
    categoryAxis.renderer.labels.template.fontSize = "13px";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.horizontalCenter = "middle";
    // Pre zoom
    chart.events.on("datavalidated", function () {
    categoryAxis.zoomToIndexes(Math.round(chart.data.length * 0.4), Math.round(chart.data.length * 0.55));
    });
    // Create value axis
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.baseValue = 0;
    // Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "datetime";
    series.strokeWidth = 2;
    series.tensionX = 0.77;
    series.fillOpacity = 0.3;
    // Add scrollbar
    var scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX = scrollbarX;
    chart.scrollbarX.thumb.minWidth = 50;
    chart.cursor = new am4charts.XYCursor();
}

  getSubCities(){

  }

  
 flipIt1() {
    this.flipped = !this.flipped;
  }

  flipIt2() {
    this.flipped2 = !this.flipped2;
  }

  flipIt3() {
    this.flipped3 = !this.flipped3;
  }

  flipIt4() {
    this.flipped4 = !this.flipped4;
  }

  flipIt5() {
    this.flipped5 = !this.flipped5;
  }

  flipIt6() {
    this.flipped6 = !this.flipped6;
  }


  getAllCounts() {
    this.dashBoardService.getAllCounts().subscribe(allCounts => {
      this.noOfUsers = allCounts['userCount'];
      this.noOfShifts = allCounts['shiftCount'];
      this.noOfDevices = allCounts['deviceCount'];
      this.noOfAllocatedShifts = allCounts['userShiftCount'];
    });
  }


  graph1toggle(){
  this.graph1 = !this.graph1; 
  this.grph1_close_button = !this.grph1_close_button;
  }


  graph2toggle(){
  this.graph2 = !this.graph2; 
  this.grph2_close_button = !this.grph2_close_button;
  }

  ngAfterViewInit(){    
    this.loadLiveChart();    
  }

  loadLiveChart() {

    var chart = am4core.create("liveChart", am4charts.XYChart);

    //chart.padding(0, 0, 0, 0);

    chart.zoomOutButton.disabled = true;

    var data = [];
    var visits = 50;
    var i = 0;

    for (i = 0; i <= 5; i++) {
        visits -= Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 5);
        data.push({ date: new Date().setSeconds(i - 30), value: visits });
    }

    chart.data = data;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.dateFormats.setKey("second", "ss");
    dateAxis.periodChangeDateFormats.setKey("second", "[bold]h:mm a");
    dateAxis.periodChangeDateFormats.setKey("minute", "[bold]h:mm a");
    dateAxis.periodChangeDateFormats.setKey("hour", "[bold]h:mm a");
   // dateAxis.renderer.inside = true;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;  
    valueAxis.interpolationDuration = 500;
    valueAxis.rangeChangeDuration = 500;
    //valueAxis.renderer.inside = true;
    valueAxis.renderer.minLabelPosition = 0.05;
    valueAxis.renderer.maxLabelPosition = 0.95;

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.interpolationDuration = 500;
    series.defaultState.transitionDuration = 0;
    series.tensionX = 0.8;
       series.fillOpacity = 0.2;
        series.fill = am4core.color("#00BCD4");
        series.stroke = am4core.color("#00BCD4");

    chart.events.on("datavalidated", function () {
        dateAxis.zoom({ start: 1 / 15, end: 1.2 }, false, true);
    });

    dateAxis.interpolationDuration = 500;
    dateAxis.rangeChangeDuration = 500;

    this.liveChart = chart;
    this.liveChartSeries = series;    

  }

  connectMQTT() {
      this.client = new Paho.MQTT.Client("34.73.96.242", Number(80), 'AngularApp');
      this.client.onMessageArrived = this.onMessageArrived.bind(this);
      this.client.onConnectionLost = this.onConnectionLost.bind(this);
      this.client.connect({onSuccess: this.onConnect.bind(this),  userName : this.device.mfDeviceId, password : this.device.mfKey, useSSL : false});
  }

  onConnect() {
    console.log('onConnect');
    var chennalId = this.device.mfChannelId;
    this.client.subscribe("channels/"+chennalId+"/messages");    
  }

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  }

  onMessageArrived(message) {
    console.log('onMessageArrived: ', message.payloadString);
    let payload = JSON.parse(message.payloadString);
    console.log(payload)
    //let temprature = payload[0].v;
    let res = payload.find(item => item.n == this.selectedParameter);
    console.log(res)    
    var lastdataItem = this.liveChartSeries.dataItems.getIndex(this.liveChartSeries.dataItems.length - 1);
    this.liveChart.addData( { date: new Date(lastdataItem.dateX.getTime() + 1000), "value": res.v }, 1 );
  }

  ngOnDestroy() {
    console.log("ngOnDestroy");
    //this.client.disconnect();
  }

}

export class dashBoardInfos {
  users: number;
  devices: number;
  shifts: number;
  allocatedShifts: number;
  constructor(users: number,
    devices: number,
    shifts: number,
    allocatedShifts: number) {
    this.users = users;
    this.devices = devices;
    this.shifts = shifts;
    this.allocatedShifts = allocatedShifts;
  }
}