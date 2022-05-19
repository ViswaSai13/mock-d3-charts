import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as d3js from 'd3'

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss']
})
export class BubbleChartComponent implements OnInit {

  @Input() data:any

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.createChart()
  }
  ngOnChanges() {
    d3js.select(`#bubbleChart`).selectAll("svg").remove();
  }
  createChart(){
    // this.formatData()
    this.bubbleData()
  }

  formatData(){
    let d3 = d3js
    let parseDate = d3.timeParse("%Y");
    this.data.forEach(function(d) { 
      d.values.forEach(function(d: any) {
        console.log(d.date)
        d.date = parseDate(d.date);
        console.log(d.date)
        d.price = +d.price;    
      });
    });
  }

  bubbleData(){
    const d3 = d3js
    const parentDiv = document.getElementById('bubbleChart').parentElement
    const margin = 50;
    const width = parentDiv.clientWidth - margin - 40;
    const height = 300;
    const duration = 100;

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

    let yScaleDomain: any = [0, d3.max(this.data[0].values, (d:any) => d.price)]
    var yScale = d3.scaleLinear()
    .domain(yScaleDomain)
    .range([height-margin, 0]);

    /* Add SVG */
    var svg = d3.select("#bubbleChart").append("svg")
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
    .attr('class', (d:any, i:any) => `Line ${i}`)  
    .attr('d', (d:any) => line(d.values))
    .style('stroke', "none")
    .style("fill","none")
    .style('opacity', lineOpacity)
    // .on("mouseover", function(d) {
    //     d3.selectAll('.line')
    //         .style('opacity', otherLinesOpacityHover);
    //     d3.selectAll('.circle')
    //         .style('opacity', circleOpacityOnLineHover);
    //     d3.select(this)
    //       .style('opacity', lineOpacityHover)
    //       .style("stroke-width", lineStrokeHover)
    //       .style("cursor", "pointer");
    //   })
    // .on("mouseout", function(d) {
    //     d3.selectAll(".line")
    //         .style('opacity', lineOpacity);
    //     d3.selectAll('.circle')
    //         .style('opacity', circleOpacity);
    //     d3.select(this)
    //       .style("stroke-width", lineStroke)
    //       .style("cursor", "none");
    //   });

    /* Add bubbles in the line */
    lines.selectAll("bubble-group")
    .data(this.data).enter()
    .append("g")
    .style("fill", (d:any) => d.color)
    .selectAll("bubble")
    .data((d:any) => d.values).enter()
    .append("g")
    .attr("class", "bubble")  
    .on("mouseover", function(e,d:any) {
        d3.select(this)
          .style("cursor", "pointer")
          .append("text")
          .attr("class", "text")
          .text(`${d.price}`)
          .attr("x", (d:any) => xScale(d.date) + Math.floor(Math.sqrt(d.price)))
          .attr("y", (d:any) => yScale(d.price) - 10);
        d3.selectAll('.bubble')
          .style('opacity', circleOpacityOnLineHover);
        d3.select(this)
          .style('opacity', circleOpacity);
          // d3.select(d.name)
          // .style('stroke', d.color)
          // .style('opacity', lineOpacity);
      })
    .on("mouseout", function(d) {
        d3.select(this)
          .style("cursor", "none")  
          .transition()
          .duration(duration)
          .selectAll(".text").remove();
        d3.selectAll('.bubble')
          .style('opacity', circleOpacity);
        // d3.select(d.name)
        //   .style('stroke', "none")
        //   .style('opacity', 0);
      })
    .append("circle")
    .attr("cx", (d:any) => xScale(d.date))
    .attr("cy", (d:any) => yScale(d.price))
    .attr("r", (d:any) => {
      return Math.floor(Math.sqrt(d.price))
    })
    .style('opacity', circleOpacity)
    .on("mouseover", function(e,d:any) {
          d3.select(this)
            .transition()
            .duration(duration)
            .attr("r", (d:any) => {
              return Math.floor(Math.sqrt(d.price))
            });
        })
      .on("mouseout", function(d) {
          d3.select(this) 
            .transition()
            .duration(duration)
            .attr("r", (d:any) => {
              return Math.floor(Math.sqrt(d.price))
            });  
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
      .attr("y", -30)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
  }

}
