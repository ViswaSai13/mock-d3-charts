import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as d3js from 'd3'

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {
  
  @Input() data:any  

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.createChart()
  }
  ngOnChanges() {
    d3js.select(`#lineChart`).selectAll("svg").remove();
  }
  createChart(){
    this.formatData()
    this.lineChart()
  }

  formatData(){
    let d3 = d3js
    let parseDate = d3.timeParse("%Y");
    this.data.forEach(function(item) { 
      item.values.forEach(function(d: any) {
        d.date = parseDate(d.date);
        d.price = +d.price;
        d.name = item.name
        d.color = item.color    
      });
    });
  }

  lineChart(){
    const d3 = d3js
    const parentDiv = document.getElementById('lineChart').parentElement
    const margin = 50;
    const width = parentDiv.clientWidth;
    const height = 300;
    const duration = 250;

    const lineOpacity = "0.45";
    const lineOpacityHover = "0.95";
    const otherLinesOpacityHover = "0.1";
    const lineStroke = "1.5px";
    const lineStrokeHover = "2.5px";

    const circleOpacity = '0.85';
    const circleOpacityOnLineHover = "0.25"
    const circleRadius = 3;
    const circleRadiusHover = 6;


    /* Scale */
    let xScaleDomain: any = d3.extent(this.data[0].values, (d:any) => d.date)
    var xScale = d3.scaleTime()
    .domain(xScaleDomain)
    .range([0, width-margin]);

    let yScaleDomain: any = [0, d3.max(this.data[0].values, (d:any) => d.price+20)]
    var yScale = d3.scaleLinear()
    .domain(yScaleDomain)
    .range([height-margin, 0]);

    /* Add SVG */
    var svg = d3.select("#lineChart").append("svg")
    .attr("width", (width+margin)+"px")
    .attr("height", (height+margin)+"px")
    .append('g')
    .attr("transform", `translate(${margin}, ${margin})`);

    /* Add line into SVG */
    var line = d3.line()
    .x((d:any) => xScale(d.date))
    .y((d:any) => yScale(d.price));

    let lines = svg.append('g')
    .attr('class', 'lines');

    lines.selectAll('.line-group')
    .data(this.data).enter()
    .append('g')
    .attr('class', 'line-group')
    .append('path')
    .attr('class', 'line')  
    .attr('d', (d:any) => line(d.values))
    .style('stroke', (d:any) => d.color)
    .style("fill","none")
    .style('opacity', lineOpacity)
    .on("mouseover", function(d) {
        d3.selectAll('.line')
            .style('opacity', otherLinesOpacityHover);
        d3.selectAll('.circle')
            .style('opacity', circleOpacityOnLineHover);
        d3.select(this)
          .style('opacity', lineOpacityHover)
          .style("stroke-width", lineStrokeHover)
          .style("cursor", "pointer");
      })
    .on("mouseout", function(d) {
        d3.selectAll(".line")
            .style('opacity', lineOpacity);
        d3.selectAll('.circle')
            .style('opacity', circleOpacity);
        d3.select(this)
          .style("stroke-width", lineStroke)
          .style("cursor", "none");
      });

    /* Add circles in the line */
    lines.selectAll("circle-group")
    .data(this.data).enter()
    .append("g")
    .style("fill", (d:any) => d.color)
    .selectAll("circle")
    .data((d:any) => d.values).enter()
    .append("g")
    .attr("class", "circle")  
    .on("mouseover", function(e,d:any) {
        d3.select(this)     
          .style("cursor", "pointer")
          .append("text")
          .attr("class", "text")
          .text(`${d.price}`)
          .attr("x", (d:any) => xScale(d.date) + 5)
          .attr("y", (d:any) => yScale(d.price) - 10);
      })
    .on("mouseout", function(d) {
        d3.select(this)
          .style("cursor", "none")  
          .transition()
          .duration(duration)
          .selectAll(".text").remove();
      })
    .append("circle")
    .attr("cx", (d:any) => xScale(d.date))
    .attr("cy", (d:any) => yScale(d.price))
    .attr("r", circleRadius)
    .style('opacity', circleOpacity)
    .on("mouseover", function(d) {
          d3.select(this)
            .transition()
            .duration(duration)
            .attr("r", circleRadiusHover);
        })
      .on("mouseout", function(d) {
          d3.select(this) 
            .transition()
            .duration(duration)
            .attr("r", circleRadius);  
        });

    /* Add Axis into SVG */
    var xAxis = d3.axisBottom(xScale).ticks(5);
    var yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height-margin})`)
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append('text')
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
  }
}
