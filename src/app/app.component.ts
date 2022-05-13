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

  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    console.log(localStorage.getItem("darkmode"))
    if (localStorage.getItem("darkmode") === null) {
      localStorage.setItem('darkmode', this.isDarkmode.toString())
    } else {
      this.isDarkmode = JSON.parse(localStorage.getItem('darkmode'))
    }
  }

  ngAfterViewInit(){
    this.loadMap()
  }
  
  toggleExpand(){
    this.isExpand = !this.isExpand
  }

  resetMap(){
    this.isMapLoading = true
    this.loadMap()
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

  countryClicked(param){
    this.openSnackBar(`${param.properties.adm1name}, ${param.properties.adm0name}`, 'X')
  }

  toggleDarkmode(event: MatSlideToggleChange){
    this.resetMap()
    this.isDarkmode = event.checked
    localStorage.setItem('darkmode', this.isDarkmode.toString())
  }

}
