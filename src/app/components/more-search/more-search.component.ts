import { Component, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';
import { DashboardService } from '@shared/services/dashboard.service';
import * as moment from "moment";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
import { CommonService } from '@shared/services/common.service';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router"
import { FormControl } from '@angular/forms';
import { LocationService } from '@shared/services/location.service';
import { NotificationService } from '@shared/services/notification.service';

@Component({
	selector: 'app-more-search',
	templateUrl: './more-search.component.html',
	styleUrls: ['./more-search.component.scss']
})

export class MoreSearchComponent implements OnInit, OnDestroy {
	graph1: boolean = false;
	grph1_close_button: boolean = false;
	chartLabel: string = 'Temperature';
	chartdata: any[] = [];
	searchData: any;
	results: any[] = [];
	queryField: FormControl = new FormControl();
	locationid: FormControl = new FormControl();
	currentFocus;
	datapresent: boolean = false;
	results1: any[] = [];
	serarchResults: any[] = [];

	constructor(
		private dashBoardService: DashboardService,
		public cmnSrv: CommonService,
		private route: ActivatedRoute,
		private router: Router,
		private locationservice: LocationService,
		private notifyService: NotificationService) { }

	ngOnInit() {
		var locationid = localStorage.getItem('locationid');
		if (locationid) {
			this.dashBoardService.getLocationAllInfo(locationid, localStorage.getItem('type'), localStorage.getItem('sDate'), localStorage.getItem('eDate')).subscribe(codata => {
				console.log(codata);
				if (codata.status == false) {
					this.notifyService.showError(codata.message, 'Error');
					document.getElementById('chartdiv').style.visibility = 'hidden'
				}
				if (codata.status == true && codata.result.length != 0) {
					document.getElementById('chartdiv').style.visibility = 'visible'
					document.getElementById('nodata').style.visibility = 'hidden'
					var codata = codata.result;
					for (let x = 0; x < codata.length; x++) {
						var fdate = moment(codata[x].time).format("DD MMM  h:m:s");
						this.chartdata.push({ datetime: fdate, value: codata[x].value });
					}
					this.drawChart(this.chartdata);
				}
				else {
					this.datapresent = false;
					document.getElementById('chartdiv').style.visibility = 'hidden'
					document.getElementById('nodata').style.visibility = 'visible'
				}
			}, err => {
				console.log(err.error.message)
			});
		}
		this.route.queryParams.subscribe(params => {
			this.searchData = params['locationid'];
		});
		$(".slide_down_icon1").on("click", function () {
			$('.expansion_panel_div').slideToggle();
		});

		this.locationservice.getLocations().subscribe(
			res => {
				if (res['status'] == true) {
					this.results1 = res['list'];
				}
			});

		this.queryField.valueChanges.subscribe(queryField => {
			if (queryField.length > 0) {
				this.currentFocus = -1;
				if (this.router.url.includes('/admin/dashboard-main')) {
					this.serarchResults = this.results1.filter(e => (!e.parent_id || e.parent_id == "0") && e.locationName.toLowerCase().includes(queryField.toLowerCase()));
				} else {
					this.serarchResults = this.results1.filter(e => e.parent_id && e.parent_id != "0" && e.locationName.toLowerCase().includes(queryField.toLowerCase()));
				}
			} else {
				this.serarchResults = [];
			}
		});
	}

	ngOnDestroy() {
		this.chartdata = [];
	}
	setvalue(searchQuery) {
		this.queryField.setValue(searchQuery.locationName);
		this.locationid.setValue(searchQuery._id);
		this.serarchResults = [];
		const data = searchQuery;
		data.locationid = searchQuery._id;
		// if(this.router.url.includes('/admin/dashboard-main')) {
		//   this.router.navigate(['/admin/dashboard-main'], { queryParams: { locationid : data.locationid}});
		// }else if(this.router.url.includes('/admin/moresearch')) {
		//   this.router.navigate(['/admin/moresearch'], { queryParams: { locationid : data.locationid}});
		// }else {
		//   this.router.navigate(['/admin/dashboard'], { queryParams: { locationid : data.locationid}});
		// }
	}
	graph1toggle() {
		this.graph1 = !this.graph1;
		this.grph1_close_button = !this.grph1_close_button;
	}

	changeGraph(event: NgForm) {
		this.chartdata = [];
		var sDate = moment(event.value['startDate']).format("YYYY-MM-DD");
		var eDate = moment(event.value['endDate']).format("YYYY-MM-DD");
		localStorage.setItem('locationid', this.locationid.value);
		localStorage.setItem('sDate', sDate);
		localStorage.setItem('eDate', eDate);
		if (event.value.unit == 'temp') {
			this.chartdata = [];
			this.chartLabel = 'Temperature';
			localStorage.setItem('type', 'temperature');
			this.dashBoardService.getLocationAllInfo(this.locationid.value, 'temperature', sDate, eDate).subscribe(locationtem => {
				if (locationtem.status == false) {
					this.notifyService.showError(locationtem.message, 'Error');
					document.getElementById('chartdiv').style.visibility = 'hidden'
				}
				if (locationtem.status == true && locationtem.result.length != 0) {
					document.getElementById('chartdiv').style.visibility = 'visible'
					document.getElementById('nodata').style.visibility = 'hidden'
					this.results = locationtem.result;
					for (let x = 0; x < this.results.length; x++) {
						var fdate = moment(this.results[x].time).format("DD MMM  h:m:s");
						this.chartdata.push({ datetime: fdate, value: this.results[x].value });
					}
					this.drawChart(this.chartdata);
				}
				else {
					this.datapresent = false;
					document.getElementById('chartdiv').style.visibility = 'hidden'
					document.getElementById('nodata').style.visibility = 'visible'
				}
			}, err => {
				console.log(err.error.message)
			});
		} else if (event.value.unit == 'co2') {
			this.chartdata = [];
			this.chartLabel = 'CO2 Level';
			localStorage.setItem('type', 'co2');
			this.dashBoardService.getLocationAllInfo(this.locationid.value, 'co2', sDate, eDate).subscribe(codata => {
				if (codata.status == false) {
					this.notifyService.showError(codata.message, 'Error');
					document.getElementById('chartdiv').style.visibility = 'hidden'
				}
				if (codata.status == true && codata.result.length != 0) {
					document.getElementById('chartdiv').style.visibility = 'visible'
					document.getElementById('nodata').style.visibility = 'hidden'
					var codata = codata.result;
					for (let x = 0; x < codata.length; x++) {
						var fdate = moment(codata[x].time).format("DD MMM  h:m:s");
						this.chartdata.push({ datetime: fdate, value: codata[x].value });
					}
					this.drawChart(this.chartdata);
				}
				else {
					this.datapresent = false;
					document.getElementById('chartdiv').style.visibility = 'hidden'
					document.getElementById('nodata').style.visibility = 'visible'
				}
			}, err => {
				console.log(err.error.message)
			});
		} else if (event.value.unit == 'co') {
			this.chartdata = [];
			this.chartLabel = 'CO Level';
			localStorage.setItem('type', 'co');
			this.dashBoardService.getLocationAllInfo(this.locationid.value, 'co', sDate, eDate).subscribe(codata => {
				if (codata.status == false) {
					this.notifyService.showError(codata.message, 'Error');
					document.getElementById('chartdiv').style.visibility = 'hidden'
				}
				if (codata.status == true && codata.result.length != 0) {
					document.getElementById('chartdiv').style.visibility = 'visible'
					document.getElementById('nodata').style.visibility = 'hidden'
					var codata = codata.result;
					for (let x = 0; x < codata.length; x++) {
						var fdate = moment(codata[x].time).format("DD MMM  h:m:s");
						this.chartdata.push({ datetime: fdate, value: codata[x].value });
					}
					this.drawChart(this.chartdata);
				}
				else {
					this.datapresent = false;
					document.getElementById('chartdiv').style.visibility = 'hidden'
					document.getElementById('nodata').style.visibility = 'visible'
				}

			}, err => {
				console.log(err.error.message)
			});
		} else if (event.value.unit == 'humidity') {
			this.chartdata = [];
			this.chartLabel = 'Humidity';
			localStorage.setItem('type', 'humidity');
			this.dashBoardService.getLocationAllInfo(this.locationid.value, 'humidity', sDate, eDate).subscribe(codata => {
				if (codata.status == false) {
					this.notifyService.showError(codata.message, 'Error');
					document.getElementById('chartdiv').style.visibility = 'hidden'
				}
				if (codata.status == true && codata.result.length != 0) {
					document.getElementById('chartdiv').style.visibility = 'visible'
					document.getElementById('nodata').style.visibility = 'hidden'
					var codata = codata.result;
					for (let x = 0; x < codata.length; x++) {
						var fdate = moment(codata[x].time).format("DD MMM  h:m:s");
						this.chartdata.push({ datetime: fdate, value: codata[x].value });
					}
					this.drawChart(this.chartdata);
				}

				else {
					this.datapresent = false;
					document.getElementById('chartdiv').style.visibility = 'hidden'
					document.getElementById('nodata').style.visibility = 'visible'
				}

			}, err => {
				console.log(err.error.message)
			});
		} else if (event.value.unit == 'n2') {
			this.chartdata = [];
			this.chartLabel = 'N2';
			localStorage.setItem('type', 'n2');
			this.dashBoardService.getLocationAllInfo(this.locationid.value, 'n2', sDate, eDate).subscribe(codata => {
				if (codata.status == false)
					this.notifyService.showError(codata.message, 'Error');

				var codata = codata.result;
				for (let x = 0; x < codata.length; x++) {
					var fdate = moment(codata[x].time).format("DD MMM  h:m:s");
					this.chartdata.push({ datetime: fdate, value: codata[x].value });
				}
				this.drawChart(this.chartdata);
			}, err => {
				console.log(err.error.message)
			});
		} else if (event.value.unit == 'suspended_particles') {
			this.chartdata = [];
			this.chartLabel = 'Suspended Particles';
			localStorage.setItem('type', 'suspended_particles');
			this.dashBoardService.getLocationAllInfo(this.locationid.value, 'suspended_particles', sDate, eDate).subscribe(codata => {
				if (codata.status == false)
					this.notifyService.showError(codata.message, 'Error');

				var codata = codata.result;
				for (let x = 0; x < codata.length; x++) {
					var fdate = moment(codata[x].time).format("DD MMM  h:m:s");
					this.chartdata.push({ datetime: fdate, value: codata[x].value });
				}
				this.drawChart(this.chartdata);
			}, err => {
				console.log(err.error.message)
			});
		}
	}

	drawChart(deviceinfo) {
		var chart = am4core.create("chartdiv", am4charts.XYChart);
		chart.paddingRight = 20;

		//Add data
		chart.data = deviceinfo;

		//Create axes
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

		//Pre zoom
		chart.events.on("datavalidated", function () {
			categoryAxis.zoomToIndexes(Math.round(chart.data.length * 0.4), Math.round(chart.data.length * 0.55));
		});

		//Create value axis
		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.baseValue = 0;

		//Create series
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
	onSubmit(f: NgForm) {
		console.log(f.value)
		this.changeGraph(f)
	}

	onKeyDown(e: any) {
		var x = document.getElementById("myInputautocomplete-list");
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

	addActive(x) {
		/*a function to classify an item as "active":*/
		if (!x) return false;
		/*start by removing the "active" class on all items:*/
		this.removeActive(x);
		if (this.currentFocus >= x.length) this.currentFocus = 0;
		if (this.currentFocus < 0) this.currentFocus = (x.length - 1);
		/*add class "autocomplete-active":*/
		x[this.currentFocus].classList.add("autocomplete-active");
	}
	removeActive(x) {
		/*a function to remove the "active" class from all autocomplete items:*/
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
}