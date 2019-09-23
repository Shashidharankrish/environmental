import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonService } from '@shared/services/common.service';
import { Router } from '@angular/router'
import { UserService } from '@shared/services/user.service';
import { LocationService } from '@shared/services/location.service';
import { FormControl } from '@angular/forms';
import { DashboardService } from '@shared/services/dashboard.service';
import * as moment from "moment";
import * as $ from 'jquery';
// @ts-ignore
import * as am4core from "@amcharts/amcharts4/core";
// @ts-ignore
import * as am4charts from "@amcharts/amcharts4/charts";
// @ts-ignore
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {

  @Output() chartEvent = new EventEmitter<any>();
  private chart: am4charts.XYChart;
  results: any[] = [];
  serarchResults: any[] = [];
  queryField: FormControl = new FormControl();
  username: String;
  userdetails:any;
  keyword = 'name';
  chartdata: any;
  chartvalue: any[] = [];
  chartdate: any[] = [];
  currentFocus;
  constructor( 
    public cmnSrv: CommonService, 
    private router: Router,
    private userService:UserService,
    private locationservice: LocationService,
    private dashBoardService: DashboardService) { }

  ngOnInit(){
    this.profileNameChange();
    this.locationservice.getLocations().subscribe(
      res => {
        if (res['status'] == true) {
          this.results = res['list'];
        } 
      });

      this.queryField.valueChanges.subscribe(queryField =>  {
        if(queryField.length > 0 ){ 
          this.currentFocus = -1;
          if(this.router.url.includes('/admin/dashboard-main')) {            
            this.serarchResults =this.results.filter(e =>(!e.parent_id || e.parent_id == "0") && e.locationName.toLowerCase().includes(queryField.toLowerCase()));
          } else {
            this.serarchResults =this.results.filter(e => e.parent_id && e.parent_id != "0" && e.locationName.toLowerCase().includes(queryField.toLowerCase()));
          }
        } else {
          this.serarchResults = [];
        }
      });       

      $(document).on("click", ".search_toggle_view", function () {
        $('.toggle_form_search').slideToggle();
      });      
  }

  profileNameChange(){
     this.userdetails = this.userService.getUserPayload();
     this.username = this.userdetails.first_name;
  }
  profile(){
    this.router.navigate(['/admin/profile']);
  }
  changePassword(){
    this.router.navigate(['/admin/password']);
  }
  logout(){
    localStorage.clear();
     this.router.navigate(['/']);
  }
  
  setvalue(searchQuery){
    this.queryField.setValue(searchQuery.locationName);
    this.serarchResults = [];
    const data = searchQuery;
    data.locationid = searchQuery._id;        
    if(this.router.url.includes('/admin/dashboard-main')) {
      this.router.navigate(['/admin/dashboard-main'], { queryParams: { locationid : data.locationid}});
    }else if(this.router.url.includes('/admin/moresearch')) {
      this.router.navigate(['/admin/moresearch'], { queryParams: { locationid : data.locationid}});
    }else {
      //this.cmnSrv.changeMessage(data);
      this.router.navigate(['/admin/dashboard'], { queryParams: { locationid : data.locationid}});
    }
    //this.dashBoardService.getLocationDeviceInfo(searchQuery._id, 'co').subscribe(deviceinfo => {
          //var fdate =  moment(this.weather[x].utcTime).format("MMMM DD, YYYY");
      //this.chartdata.push({ date: fdate, name: "name" + x, value: this.weather[x].highTemperature });
      //console.log(deviceinfo)
      /*for(let x=0; x < deviceinfo.length; x++){
        this.chartvalue.push();              
        var fdate =  moment(deviceinfo[x].time).format("MMMM DD, YYYY");
        this.chartdate.push(fdate);
        this.chartdata.push({ date: fdate, name: "name" + x, value: deviceinfo[x].value });
      }*/
   // });
   // this.drawchart();
  }

  drawchart(){
    let chart = am4core.create("chartdiv", am4charts.XYChart);

    chart.paddingRight = 20;        

    chart.data = this.chartdata;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";

    series.tooltipText = "{valueY.value}";
    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    this.chart = chart;
  }


   addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    this.removeActive(x);
    if (this.currentFocus >= x.length) this.currentFocus = 0;
    if (this.currentFocus < 0) this.currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    console.log(x[this.currentFocus])
    x[this.currentFocus].classList.add("autocomplete-active");
  }
   removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  

  onKeyDown(e: any) {
    var x = document.getElementById( "myInputautocomplete-list");
    if (x) var y = x.getElementsByTagName("li");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      this.currentFocus++;
      /*and and make the current item more visible:*/
      this.addActive(y);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      this.currentFocus--;
      /*and and make the current item more visible:*/
      this.addActive(y);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (this.currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (y) y[this.currentFocus].click();
      }
    }
    
  }
  

}