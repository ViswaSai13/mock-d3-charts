import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

@Component({
  selector: 'app-map-chart',
  templateUrl: './map-chart.component.html',
  styleUrls: ['./map-chart.component.scss'],
})
export class MapChartComponent implements OnInit {
  @Input() isDarkmode: boolean;
  @Output() countryClick = new EventEmitter();

  constructor() {}

  ngOnInit() {
    d3.select('.mapChart').selectAll('svg').remove();
    this.mapChart();
  }

  ngAfterViewInit() {
    d3.select('.mapChart').selectAll('svg').remove();
    this.mapChart();
  }
  ngOnChanges() {
    d3.select('.mapChart').selectAll('svg').remove();
    this.mapChart();
  }

  mapChart() {
    // const meteoriteDataURL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";
    const worldMapURL =
      'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json';
    // https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json
    // const mainCitiesURL = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_populated_places_simple.geojson"
    const mainCitiesURL =
      'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_populated_places.geojson';
    // const mainAirportsURL = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson"

    const width = 1000,
      height = 500;

    const svg = d3
      .select('.svg-con')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom().on('zoom', zoomed));

    const g = svg.append('g');

    const projection = d3
      .geoMercator()
      .scale(150)
      .translate([width / 2, height / 2 + 50]);

    const path = d3.geoPath().projection(projection);

    const showInfo = d3.select('.show-if');
    const emitter = this.countryClick;
    let isDarkmode = this.isDarkmode;

    // load and display the world map
    d3.json(worldMapURL).then(
      function (world: any) {
        d3.json(mainCitiesURL).then(
          function (mainCities: any) {
            // console.log(mainCities)

            g.selectAll('path')
              .data(topojson.feature(world, world.objects.countries).features)
              .enter()
              .append('path')
              .attr('stroke', function () {
                if (isDarkmode) {
                  return '#7885cb';
                } else {
                  return '#97b0bf';
                }
              })
              .attr('fill', '#dbdbe1')
              .attr('d', path);

            g.selectAll('circle')
              .data(mainCities.features)
              .enter()
              .append('circle')
              .attr('cx', function (d: any) {
                return projection(d.geometry.coordinates)[0];
              })
              .attr('cy', function (d: any) {
                return projection(d.geometry.coordinates)[1];
              })
              .attr('r', function (d: any) {
                // return Math.sqrt(Math.sqrt(d.properties.pop_max))
                // return Math.floor(Math.pow(d.properties.pop_max, 1/7))
                return 4;
              })
              .attr('fill', '#0274ff2b')
              .attr('fill-opacity', 0.5)
              .attr('stroke', '#3490ff')
              .attr('stroke-width', 1)
              .attr('cursor', 'pointer')
              .on('click', function (e, d: any) {
                emitter.emit(d);
              });

            // Hover affect
            g.selectAll('circle')
              .on('mouseover', function (e, d: any) {
                // console.log(d)
                showInfo
                  .style('left', e.pageX + 10 + 'px')
                  .style('top', e.pageY + 10 + 'px');

                d3.select('.show-if').style('display', 'inline-block');
                d3.select('.cityName').text(d.properties.NAME);
                d3.select('.countryName').text(d.properties.SOV0NAME);
                d3.select('.popSize').text(d.properties.POP_MAX);
              })
              .on('mouseout', function (e, d) {
                d3.select('.show-if').style('display', 'none');
              });
          },
          (error) => {
            console.error(error);
          }
        );
      },
      (error) => {
        console.error(error);
      }
    );

    function zoomed(e) {
      // console.log(e.transform.k)
      g.attr('transform', e.transform);
      g.selectAll('circle')
        .attr('r', function (d: any) {
          // return Math.sqrt(Math.sqrt(d.properties.pop_max))
          // return Math.floor(Math.pow(d.properties.pop_max, 1/7))
          if (e.transform.k > 2 && e.transform.k < 10) return 2;
          if (e.transform.k > 10) return 1;
          else return 4;
        })
        .attr('stroke-width', function (d: any) {
          if (e.transform.k > 2 && e.transform.k < 10) return 0.5;
          if (e.transform.k > 10) return 0.3;
          else return 1;
        });
    }
  }
}
