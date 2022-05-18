import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as d3js from 'd3'

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {

  @Input() graphData: any
  @Input() chartId = 1
  @Input() isRotateLabels = false
  @Input() parseFormat = "%Y"
  tooltipId = 'tooltip'
  data;
  years;
  keys = []

  constructor() { }

  ngOnInit() {
    //this.lineChart()
  }
  ngAfterViewInit() {
    this.createChart()
  }
  ngOnChanges() {
    this.formatData();
  }
  createChart(){
    let d3 = d3js
    d3.select(`#chart${this.chartId}`).selectAll("svg").remove();
    d3.select(`#tooltip${this.chartId}`).remove();
    if (this.data) {
      this.lineChart(this.chartId)
    }
  }
  formatData() {
    let d3 = d3js
    this.keys = []
    this.years = []
    this.data = []
    let keys1 = Object.keys(this.graphData);
    let years1 = []

    keys1.forEach(item => {

      years1.push(...Object.keys(this.graphData[item]))
    })

    let finalYears = []
    years1.forEach(item => {
      if (finalYears.indexOf(item) === -1) {
        finalYears.push(item)
      }
    })

    let finalData = []
    finalYears.sort()
    keys1.forEach(key => {
      let obj = {}
      obj['name'] = key
      let values = []
      finalYears.forEach(item => {
        let obj1 = {}
        obj1['date'] = item
        if (this.graphData[key].hasOwnProperty(item)) {
          obj1['count'] = this.graphData[key][item]
        }
        else {
          obj1['count'] = 0
        }
        values.push(obj1)
      })
      obj['values'] = values
      finalData.push(obj)
    })
    this.data = finalData
    this.years = finalYears
    let colors = d3.scaleOrdinal(d3.schemeTableau10)
    keys1.map((item, i) => {
      let obj = {}
      obj['key'] = item;
      obj['color'] = colors(i.toString())
      this.keys.push(obj)
    })
  }

  lineChart(chartNum: any) {
    let d3 = d3js
    const data = this.data
    let margin = 50;
    let parentDiv = document.getElementById(`chart${chartNum}`)
    console.log(parentDiv)
    let width = parentDiv.clientWidth - margin + 20;
    let height = 250;

    let lineOpacity = "0.4";
    let lineStroke = "2px";

    let circleOpacity = '0.85';
    let circleRadius = 3;

    /* Format Data */
    let parseFormat = this.parseFormat
    let parseDate = d3.timeParse(this.parseFormat);
    data.forEach((d) => {
      d.values.forEach(d => {
        d.date = parseDate(d.date);
        d.count = +d.count;
      });
    });

    let xScaleDomain: any
    xScaleDomain = d3.extent(data[0].values, ({ date }) => date)
    let yScaleDomain: any
    yScaleDomain = [0, d3.max(data, ({ values }) => d3.max(values, ({ count }) => count))]

    /* Scale */
    let xScale = d3.scaleTime()
      .domain(xScaleDomain)
      .range([0, width - margin]);

    let yScale = d3.scaleLinear()
      .domain(yScaleDomain)
      .range([height - margin, 0]);

    let color = d3.scaleOrdinal(d3.schemeTableau10);

    /* Add SVG */
    let svg = d3.select(`#chart${chartNum}`).append("svg")
      .attr("width", `${width}px`)
      .attr("height", `${height}px`)
      //.attr("viewBox", `0 0 420 350`)
      .attr("preserveAspectRatio", "xMinYMin slice")
      .style('overflow-x', 'scroll')
      .style('padding-left', '0px')
      .style('padding-right', '20px')
      .append('g')
      .attr("transform", `translate(30,20)`);


    /* Add line into SVG */
    let line = d3.line()
      .x((d: any) => xScale(d.date))
      .y((d: any) => yScale(d.count))

    let lines = svg.append('g')
      .attr('class', 'lines');

    lines.selectAll('.line-group')
      .data(data).enter()
      .append('g')
      .attr('class', 'line-group')
      .on("mouseover", (d, i) => {
        svg.append("text")
          .attr("class", "title-text")
          .text(d.name)
          .style("text-transform", 'capitalize')
          .style("fill", '#818181')
          .attr("text-anchor", "middle")
          .attr("x", (width - margin) / 2)
          .attr("y", -5);
      })
      .on("mouseout", d => {
        svg.select(".title-text").remove();
      })
      .append('path')
      .attr('class', 'line')
      .attr('d', (d: any) => line(d.values))
      .style('stroke', (d, i) => color(i.toString()))
      .style("stroke-width", lineStroke)
      .style('opacity', lineOpacity)
      .style('fill', '#ffffff00')
      //.style('filter', 'drop-shadow(1px 2px 3px #00002B)');
      .style('filter', 'drop-shadow(1px 2px 3px #818181)');

    /* Add circles in the line */
    lines.selectAll("circle-group")
      .data(data).enter()
      .append("g")
      .style("fill", (d, i) => color(i.toString()))
      .selectAll("circle")
      .data((d: any) => d.values).enter()
      .append("g")
      .attr("class", "circle")
      .append("circle")
      .attr("cx", (d:any) => xScale(d.date))
      .attr("cy", (d:any) => yScale(d.count))
      .attr("r", circleRadius)
      .style('opacity', circleOpacity);


    /* Add Axis into SVG */
    let xAxis = d3.axisBottom(xScale).ticks(this.years.length);
    let yAxis = d3.axisLeft(yScale).ticks(5).tickFormat((d:any) => {
      if (d != 0 && d >= 500) {
        return `${d / 1000}k`;
      } else {
        return d;
      }
    }).tickSize(0);

    function make_y_gridlines() {
      return d3.axisLeft(yScale)
    }
    svg.append("g")
      .attr("class", "grid")
      .style('color', '#d0cfcf')
      .style("stroke-width", "0.7px")
      .style("opacity", '0.6')
      .call(make_y_gridlines()
        .tickSize(-width)
        .tickPadding(10)
        // .tickFormat("")
        .ticks(5)
      )

    if(this.isRotateLabels){
      svg.append("g")
      .attr("class", "x-axis")
      .style("color", "#828282")
      .attr("transform", `translate(0, ${height - margin})`)
      .call(xAxis)
      .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "-0.60em")
        .attr("transform", "rotate(-90)" )
    }else{
      svg.append("g")
      .attr("class", "x-axis")
      .style("color", "#828282")
      .attr("transform", `translate(0, ${height - margin})`)
      .call(xAxis)
      .append('text')
      .attr("text-anchor", "end")
      .attr("x", width - 10)
      .attr("y", height)
      .attr("fill", "#000")
      // .text("Years");
    }

    svg.append("g")
      .attr("class", "y-axis")
      .style("color", "#828282")
      .call(yAxis)
      .append('text')
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
    // .text("Patents");

    //removing path line
    d3.select('.x-axis').selectAll('.domain').attr('display', 'none');
    d3.select('.y-axis').selectAll('.domain').attr('display', 'none');
    d3.select('.grid').selectAll('.domain').attr('display', 'none');
    // d3.select('x-axis').selectAll('g').select('line').style('stroke','none');
    // d3.select('y-axis').selectAll('g').select('line').attr('display','none');

    //Tooltip box
    const mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", `mouse-line${chartNum}`)
      .style("stroke", "#d0cfcf")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    const lines1 = document.getElementsByClassName('line');

    const mousePerLine = mouseG.selectAll(`.mouse-per-line${chartNum}`)
      .data(data)
      .enter()
      .append("g")
      .attr("class", `mouse-per-line${chartNum}`);

    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", "none")
      .style("fill", "white")
      .style('filter', (d, i) => `drop-shadow(1px 0px 6px ${color(i.toString())})`)
      // .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("circle")
      .attr("r", 3)
      .style("stroke", "none")
      .style("fill", (d, i) => color(i.toString()))
      .style("opacity", "0");

    const tooltip = d3.select(`#chart${chartNum}`).append("div")
      .attr('id', `tooltip${chartNum}`)
      .style('position', 'absolute')
      .style("background-color", "#ffffff")
      .style('padding', '10px')
      .style('border-radius', '7px')
      .style('height', '100')
      .style('width', '100')
      .style('filter', 'drop-shadow(7px 9px 21px #0000002B)')
      .style('display', 'none');


    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', (width - margin)) // can't catch mouse events on a g element
      .attr('height', height)
      //.attr("viewBox", `0 0 400 400`)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', () => { // on mouse out hide line, circles and text
        d3.select(`.mouse-line${chartNum}`)
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line2 circle")
          .style("opacity", "0");
        d3.selectAll(`#tooltip${chartNum}`)
          .style('display', 'none');
        // d3.selectAll(".mouse-per-line2 text")
        //   .style("opacity", "0");
      })
      .on('mouseover', () => { // on mouse in show line, circles and text
        d3.select(`.mouse-line${chartNum}`)
          .style("opacity", "1");
        d3.selectAll(`.mouse-per-line${chartNum} circle`)
          .style("opacity", "1");
        d3.selectAll(`#tooltip${chartNum}`)
          .style('display', 'block');
        // d3.selectAll(".mouse-per-line2 text")
        //   .style("opacity", "1");
      })
      .on('mousemove', function () { // mouse moving over canvas
        const mouse = d3.pointer(this);

        d3.selectAll(`.mouse-per-line${chartNum}`)
          .attr("transform", (d: any, i) => {
            const xDate = xScale.invert(mouse[0]);
            const bisect = d3.bisector((d:any) => d.date).left;
            let idx = bisect(d.values, xDate) - 1;

            d3.select(`.mouse-line${chartNum}`)
              .attr("d", () => {
                let data = `M${xScale(d.values[idx].date)},${height - margin}`;
                data += ` ${xScale(d.values[idx].date)},${0}`;
                return data;
              });

            d3.select(`#tooltip${chartNum}`)
              .style('transform', `translate(${xScale(d.values[idx].date) + 45}px,-200px)`);

            return `translate(${xScale(d.values[idx].date)},${yScale(d.values[idx].count)})`;
          });
        updateTooltipContent(mouse, data, parseFormat)
      });

    function updateTooltipContent(mouse, res_nested, parseFormat) {

      const sortingObj = [];
      res_nested.map((d) => {
        const xDate = xScale.invert(mouse[0]);
        const bisect = d3.bisector((d: any) => d.date).left;
        const idx = bisect(d.values, xDate) - 1;
        if(parseFormat == "%Y"){
          sortingObj.push({ key: d.values[idx].date.getFullYear(), premium: d.values[idx].count, name: d.name })
        } else if (parseFormat == "%Y-%m-%d"){
          sortingObj.push({ key: `${d.values[idx].date.getFullYear()}-${d.values[idx].date.getMonth()+1}-${d.values[idx].date.getDate()}` , premium: d.values[idx].count, name: d.name })
        }
      })

      sortingObj.sort((x, y) => d3.descending(x.premium, y.premium))

      const sortingArr = sortingObj.map((d) => d.key);

      const res_nested1 = res_nested.slice().sort((a, b) => // rank vehicle category based on price of premium
        sortingArr.indexOf(a.key) - sortingArr.indexOf(b.key));

      tooltip.html(()=>{
        if(parseFormat == "%Y"){
          return `Year: ${sortingObj[0].key}`
        } else if (parseFormat == "%Y-%m-%d") {
          return `Date: ${sortingObj[0].key}`
        }
      })
        .style('display', 'block')
        .style('font-size', '12px')
        .style('color', '#00174B')
        .selectAll()
        .data(res_nested).enter() // for each vehicle category, list out name and price of premium
        .append('div')
        .style('color', (d, i) => color(i.toString()))
        .style('font-size', '11px')
        .style('text-align', 'left')
        .style('padding-top', '5px')
        .html((d: any) => {
          const xDate = xScale.invert(mouse[0]);
          const bisect = d3.bisector((d:any) => d.date).left;
          const idx = bisect(d.values, xDate) - 1;
          return `${d.name.charAt(0).toUpperCase() + d.name.slice(1)}: ${d.values[idx].count}`;
        })
    }
  }

}
