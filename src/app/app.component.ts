import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mock-d3-charts';
  isExpand = false
  toggleExpand(){
    this.isExpand = !this.isExpand
  }
}
