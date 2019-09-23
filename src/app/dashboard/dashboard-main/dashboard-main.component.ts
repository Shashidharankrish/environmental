import { Component, OnInit, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import * as $ from 'jquery';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
import { Router, ActivatedRoute } from "@angular/router"

import { DashboardService } from '@shared/services/dashboard.service';
import { CommonService } from '@shared/services/common.service';
import { LocationService } from '@shared/services/location.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss']
})
export class DashboardMainComponent implements OnInit, AfterViewInit {

  parameters: any[] = [];
  chartParameters: any[] = [];
  locationAvgInfo: any;
  locationInfo: any;
  subLocations: any = {};
  chartsSub: any;
  userdetails:any;

  @ViewChildren('charts') charts: QueryList<any>;

  constructor(
  	private dashboardService: DashboardService,
  	private commonService: CommonService,  	
  	private locationService: LocationService,  	
  	private router: Router,
  	private route: ActivatedRoute,
    private userService: UserService  	
  ) { }

  ngOnInit() {
  	
  	this.userdetails = this.userService.getUserPayload();
    this.dashboardService.getParameters().subscribe(res => {
  		if(res['status'] == true) {
  			this.parameters = res['list'];
  			this.parameters.forEach(item => {
  				this.subLocations[item.key] = [];
  			}) 			
  		}
  	});

  	this.route.queryParams.subscribe(params => {        
        this.getLocationDetails(params['locationid']? params['locationid'] : this.userdetails.default_location);
		});
		
	

  }

  ngAfterViewInit() {
  	this.chartsSub = this.charts.changes.subscribe(item => {  		
		this.loadCharts();
	})
  }

  getLocationDetails(locationid) {
  	this.locationService.getLocationDetails(locationid).subscribe(res => {
        if (res['status'] == true) {          
          this.locationInfo = res['list'];
          this.getSubLocationAvgInfo(res['list']);
        } 
    });
  }

  getSubLocationAvgInfo(location) {
	this.locationService.getSubLocationAvgInfo(location._id).subscribe(res => {
		this.locationAvgInfo = res;
		//console.log(this.locationAvgInfo)   		
		this.chartParameters = this.parameters;		
		this.loadCharts();		
	});
  }

  loadCharts() {
  	this.parameters.forEach(item => {  		
 		const avgData = this.locationAvgInfo[item.key] || [];
 		const range = this.locationInfo.range? this.locationInfo.range[item.key] : {low: 0, high: 0};
 		//console.log(avgData, range) 		  				
  		var low = 0, medium = 0, high = 0, subLocations = {"Low": [], "Medium": [], "High": []};
  		//console.log(avgData)
  		avgData.forEach(row => {
  			let temp = {"locationid": row.location_info.deviceLocation , "locationName": row.location_info.deviceName};
  			if(row.avg <= range.low) {
  				low++;
  				subLocations.Low.push(temp);
  			}
  			else if(row.avg > range.low && row.avg < range.high) {
  				medium++;
  				subLocations.Medium.push(temp);
  			}
  			else {
  				high++;
  				subLocations.High.push(temp);
  			}
  		});
  		var data = [{type: "Low",value: low},{type: "Medium",value: medium},{type: "High",value: high}];
  		//console.log(subLocations)
		this.drawDonutChart(item.key, data, subLocations);		
	})
	this.chartsSub.unsubscribe();
  }

  drawDonutChart(envParam, data, subLocations){
	  var chart = am4core.create('chart_'+envParam, am4charts.PieChart);
	  chart.hiddenState.properties.opacity = 0; // this creates initial fade-in	  

	  chart.data = data;
	  chart.radius = am4core.percent(70);
	  chart.innerRadius = am4core.percent(40);
	  chart.startAngle = 180;
	  chart.endAngle = 360;  
	  
	  let series = chart.series.push(new am4charts.PieSeries());
	  series.dataFields.value = "value";
	  series.dataFields.category = "type";
	  series.colors.list = [
	    am4core.color("#ff6456"),
	    am4core.color("#a756e8"),
	    am4core.color("#66c6a3")
	  ];
	  series.slices.template.cornerRadius = 10;
	  series.slices.template.innerCornerRadius = 7;
	  series.slices.template.draggable = false;
	  series.slices.template.inert = false;
	  series.alignLabels = false;	  

	  series.labels.template.text = "{category}: {value}";
	  series.slices.template.tooltipText = "{category}: {value}";
	  
	  series.hiddenState.properties.startAngle = 90;
	  series.hiddenState.properties.endAngle = 90;
	  series.slices.template.events.on("hit", (ev) => {	    
		this.showSubLocations(subLocations[ev.target.dataItem.properties.category], envParam);	    
	  }, this);
	  // chart.legend = new am4charts.Legend();
  }

  showSubLocations(locations, envParam) {
  	 for(let key in this.subLocations) {
		this.subLocations[key] = [];
	 }	 
  	 this.subLocations[envParam] = locations;
  }

  homeDashboard(location) {  	
  	this.router.navigate(['/admin/dashboard'], {queryParams: { "locationid": location.locationid }});
  }

}
