import { AfterViewInit, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'mock-d3-charts';
  isExpand = false
  isMapLoading = true

  constructor(private _snackBar: MatSnackBar) {}

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
}
