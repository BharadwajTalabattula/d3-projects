
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();

let data;
let values;

let yScale;
let xScale;
let yAxis;
let xAxis;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select('svg')
let drawCanvas = () =>{
    svg.attr('width', width)
    svg.attr('height', height)
    .append('text')
    .attr('x', -100)
    .attr('y', 40) 
    .text('Gross Domestic Product') 
    .attr('fill', 'black') 
    .attr("transform", "rotate(-90 100 50)")
   
}

let generateScales = () =>{
    yScale = d3.scaleLinear()
               .domain([0, d3.max(values, d => d[1])])
               .range([0, height - ( 2 * padding)])
    
    xScale = d3.scaleLinear()
               .domain([0, values.length - 1])
               .range([padding, width - padding])

    let datesArray = values.map((item) =>
        new Date(item[0])
    )
    console.log(values)
    console.log(d3.min(datesArray))

    xAxis = d3.scaleTime()
              .domain([d3.min(datesArray), d3.max(datesArray)])
              .range([padding, width - padding])

    yAxis = d3.scaleLinear()
              .domain([0, d3.max(values, d => d[1])])
              .range([height - padding, padding])

}

let drawBars = () =>{

    let tootltip = d3.select('body')
                     .append('div')
                     .style("visibility", "hidden")
                     .style("position", "absolute")
                     .style("padding", "5px")
                     .style('background-color', "white")

    svg.selectAll('rect')
       .data(values)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("width", (width - (2 * padding)) / values.length)
       .attr('height', (d) => yScale(d[1]))
       .attr('x', (_d, i) => xScale(i) + 10 )
       .attr('y', (d)=> (height - padding) - yScale(d[1]))
       .attr('data-date', d => d[0])
       .attr('data-gdp', d => d[1])
       .attr('fill', "darkblack")
       .on('mouseover', (event, item) => 
        tootltip.style('visibility', 'visible')
                .html(`Date: ${item}<br>GDP: ${item[1]} Billion`)
                .attr('data-date', item[0])
                .style('left', (event.pageX + 10) + 'px' )
                .style('top', height - (4 *  padding) + 'px')
    
    )
}




let generateAxis = () =>{
    let xAxisScale = d3.axisBottom(xAxis);
    let yAxisScale = d3.axisLeft(yAxis);


    svg.append('g')
       .call(xAxisScale)
       .attr("id", "x-axis")
       .attr("transform", "translate(10, "+(height - padding)+")")

    svg.append('g')
       .call(yAxisScale)
       .attr("id", "y-axis")
       .attr("transform", "translate( "+(padding + 10)+", 0)")


}


req.open('GET', url, true);
req.onload = () =>{
    data = JSON.parse(req.responseText);
    values = data.data;
    //console.log(values)
    drawCanvas()
    generateScales()
    generateAxis()
    drawBars()
}
req.send()

