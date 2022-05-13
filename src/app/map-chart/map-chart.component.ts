import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';

@Component({
  selector: 'app-map-chart',
  templateUrl: './map-chart.component.html',
  styleUrls: ['./map-chart.component.scss']
})
export class MapChartComponent implements OnInit {

  // @Input() mapData: any
  @Output() countryClick = new EventEmitter()

  constructor() { }

  ngOnInit() {
    d3.select('.mapChart').selectAll("svg").remove();
    this.mapChart()
  }

  ngAfterViewInit() {
    d3.select('.mapChart').selectAll("svg").remove()
    this.mapChart()
  }
  ngOnChanges() {
    d3.select('.mapChart').selectAll("svg").remove();
    this.mapChart()
  }

  mapChart(){

const meteoriteDataURL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";
const worldMapURL = "https://gist.githubusercontent.com/d3noob/5193723/raw/world-110m2.json";
const mainCitiesURL = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_populated_places_simple.geojson"

const width = 1000,
      height = 500;

const svg = d3.select(".svg-con").append("svg")
  .attr("width", width)
  .attr("height", height)
  .call(d3.zoom()
    .on("zoom", zoomed));

const g = svg.append("g");

const projection = d3.geoMercator()
  .scale(150)
  .translate([width / 2, height / 2 + 50]);

const path = d3.geoPath()
  .projection(projection)

const showInfo = d3.select('.show-if')
const emitter = this.countryClick

// load and display the world map
d3.json(worldMapURL).then(function(world: any) {
  
  d3.json(mainCitiesURL).then(function(mainCities: any) {

    console.log(mainCities)
    
    g.selectAll("path")
      .data(topojson.feature(world, world.objects.countries)
          .features)
      .enter().append("path")
      .attr("stroke", "#A8C4D5")
      .attr("fill", "#f0f0f7")
      .attr("d", path)

      g.selectAll("circle")
      .data(mainCities.features)
      .enter()
      .append("circle")
      .attr('cx', function(d: any) { return projection(d.geometry.coordinates)[0] })
      .attr('cy', function(d: any) { return projection(d.geometry.coordinates)[1] })
      .attr('r', function(d: any){
				// return Math.sqrt(Math.sqrt(d.properties.pop_max))
				return Math.floor(Math.pow(d.properties.pop_max, 1/7))
      })
      .attr('fill', "#0274ff2b")
      .attr('fill-opacity', 0.5)
      .attr('stroke', "#3490ff")
      .attr('stroke-width', 1)
      .attr('cursor', 'pointer')
      .on('click', function(e, d: any) {
        emitter.emit(d)
      })

      // Hover affect
    g.selectAll("circle").on('mouseover', function(e,d: any){
      showInfo.style("left", (e.pageX + 10) + "px")
      .style("top", (e.pageY + 10) + "px");

      d3.select('.show-if').style('display', 'inline-block');
      d3.select('.cityName').text(d.properties.adm1name);
      d3.select('.countryName').text(d.properties.adm0name);
      d3.select('.popSize').text(d.properties.pop_max);
    }).on('mouseout', function(e,d){
      d3.select('.show-if').style('display', 'none');
    })
    
  }, (error) => {
		console.error(error);
	});
}, (error) => {
	console.error(error);
});

  
function zoomed(e) {
	// console.log(e)
  g.attr("transform", e.transform);
}
  }
}
