import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as d3js from 'd3'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'mock-d3-charts';
  isExpand = false
  isMapLoading = true
  isDarkmode = false
  isShowNote = false
  isCountrySelected = false
  selectedCountry = []

  //chartData
  color = d3js.scaleOrdinal(d3js.schemeCategory10);
  chartData: any
  showChart = false

  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    if (localStorage.getItem("darkmode") === null) {
      localStorage.setItem('darkmode', this.isDarkmode.toString())
    } else {
      this.isDarkmode = JSON.parse(localStorage.getItem('darkmode'))
    }
  }

  loadChartData(){
    
    this.chartData = [
      {
        name: "Line 1",
        values: [
          {date: "2000", price: "100"},
          {date: "2001", price: "110"},
          {date: "2002", price: "145"},
          {date: "2003", price: "241"},
          {date: "2004", price: "101"},
          {date: "2005", price: "90"},
          {date: "2006", price: "10"},
          {date: "2007", price: "35"},
          {date: "2008", price: "21"},
          {date: "2009", price: "201"}
        ],
        color: this.color('1')
      },
      {
        name: "Line 2",
        values: [
          {date: "2000", price: "200"},
          {date: "2001", price: "120"},
          {date: "2002", price: "33"},
          {date: "2003", price: "21"},
          {date: "2004", price: "51"},
          {date: "2005", price: "190"},
          {date: "2006", price: "120"},
          {date: "2007", price: "85"},
          {date: "2008", price: "221"},
          {date: "2009", price: "101"}
        ],
        color: this.color('2')
      },
      {
        name: "Line 3",
        values: [
          {date: "2000", price: "50"},
          {date: "2001", price: "10"},
          {date: "2002", price: "5"},
          {date: "2003", price: "71"},
          {date: "2004", price: "20"},
          {date: "2005", price: "9"},
          {date: "2006", price: "220"},
          {date: "2007", price: "235"},
          {date: "2008", price: "61"},
          {date: "2009", price: "10"}
        ],
        color: this.color('3')
      }
    ];
  }

  ngAfterViewInit(){
    this.loadMap()
    this.loadChartData()
    // this.generateRandomData()
  }
  
  // generateRandomData(){
  //   console.log('hi')
  // }

  toggleExpand(){
    this.isExpand = !this.isExpand
    this.loadChartData()
    this.showChart = false
    this.loadCharts()
  }

  toggleShowNote(){
    this.isShowNote = !this.isShowNote
  }

  resetMap(){
    this.isMapLoading = true
    this.loadMap()
    this.loadChartData()
    this.selectedCountry.length = 0
    this.isCountrySelected = false
  }

  loadMap(){
    setTimeout(() => {
      this.isMapLoading = false
    }, 1000);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  loadCharts(){
    setTimeout(() => {
      this.showChart = true
    }, 1000);
  }

  countryClicked(d){
    this.selectedCountry.length = 0
    this.isCountrySelected = true
    this.loadCharts()
    Object.keys(d.properties).forEach((keyName)=>{
      if(d.properties[keyName] != undefined || d.properties[keyName] != null){
        this.selectedCountry.push({
          keyName: keyName,
          property: d.properties[keyName]
        })
      }
    })
    this.openSnackBar(`${d.properties.NAME}, ${d.properties.SOV0NAME}`, 'X')
  }

  toggleDarkmode(event: MatSlideToggleChange){
    // this.resetMap()
    this.isMapLoading = true
    this.loadMap()
    this.loadChartData()
    this.showChart = false
    this.loadCharts()
    this.isDarkmode = event.checked
    localStorage.setItem('darkmode', this.isDarkmode.toString())
  }

}
