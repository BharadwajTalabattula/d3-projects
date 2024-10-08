let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest()

let data;
let values;

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;


let width = 800;
let height = 600;

let padding = 40;

let svg = d3.select("svg")
let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr("height", height)
}

let generateScales = () => {
    heightScale = d3.scaleLinear()
        .domain([0, d3.max(values, d => d[1])])
        .range([0, height - (2 * padding)])
    xScale = d3.scaleLinear()
        .domain([0, values.length - 1])
        .range([padding, width - padding])

    let datesArray = values.map((item) => {
        return new Date(item[0])
    })
    xAxisScale = d3.scaleTime()
        .domain([d3.min(datesArray), d3.max(datesArray)])
        .range([padding, width - padding])

    yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(values, (item) => {
            return item[1]
        })])
        .range([height - padding, padding])
}

let drawBars = () => {

    let tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('position', 'absolute')  // Ensures the tooltip floats above the bars
        .style('background-color', 'white')
        .style('border', '1px solid black')
        .style('padding', '5px')

    svg.selectAll('rect')
        .data(values)
        .enter()
        .append("rect")
        .attr('class', "bar")
        .attr("width", (width - (2 * padding)) / values.length)
        .attr('data-date', (item) => item[0])
        .attr("data-gdp", (item) => item[1])
        .attr('height', (item) => heightScale(item[1]))
        .attr('x', (item, index) => xScale(index))
        .attr('y', (item) => (height - padding) - heightScale(item[1]))

        // Tooltip functionality
        .on('mouseover', (event, item) => {
            tooltip.style('visibility', 'visible')
                .html(`Date: ${item[0]}<br>GDP: $${item[1]} Billion`)
                .attr('data-date', item[0])
                .style('top', (event.pageY - 50) + 'px')  // Positioning tooltip near the mouse pointer
                .style('left', (event.pageX + 10) + 'px')
        })
        .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
        });

}


let generateAxis = () => {

    let xAxis = d3.axisBottom(xAxisScale);
    let yAxis = d3.axisLeft(yAxisScale);

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + (height - padding) + ')')

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr("transform", "translate(" + padding + ", 0)")
}


req.open("GET", url, true);
req.onload = () => {
    data = JSON.parse(req.responseText)
    values = data.data;
    console.log(values)
    drawCanvas()
    generateScales()
    drawBars()
    generateAxis()
}
req.send()