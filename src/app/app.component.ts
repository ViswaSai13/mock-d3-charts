import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  lineChartFlag = false

  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    if (localStorage.getItem("darkmode") === null) {
      localStorage.setItem('darkmode', this.isDarkmode.toString())
    } else {
      this.isDarkmode = JSON.parse(localStorage.getItem('darkmode'))
    }
  }

  ngAfterViewInit(){
    this.loadMap()
    // this.generateRandomData()
  }
  
  // generateRandomData(){
  //   console.log('hi')
  // }

  toggleExpand(){
    this.isExpand = !this.isExpand
  }

  toggleShowNote(){
    this.isShowNote = !this.isShowNote
  }

  resetMap(){
    this.isMapLoading = true
    this.loadMap()
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

  // loadLineChart(){
  //   setTimeout(() => {
  //     this.lineChartFlag = true
  //   }, 5000);
  // }

  countryClicked(d){
    this.selectedCountry.length = 0
    this.isCountrySelected = true
    // setTimeout(() => {
    //   this.loadLineChart()
    // }, 1000);
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
    this.resetMap()
    this.isDarkmode = event.checked
    localStorage.setItem('darkmode', this.isDarkmode.toString())
  }

}
