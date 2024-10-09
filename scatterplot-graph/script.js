const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const req = new XMLHttpRequest();

let data;
const height = 600;
const width = 800;
const padding = 50;
let xScale;
let yScale;
let xAxis;
let yAxis;



const svg = d3.select('svg');
const tooltip = d3.select("#tooltip")

const drawCanvas = () =>{
    svg.attr("width", width)
       .attr("height", height)
}




const generateScales = ()=>{
    
    xScale = d3.scaleLinear()
               .domain([d3.min(data, d => d['Year']) -1, d3.max(data, d => d['Year']) + 1])
               .range([padding, width - padding])

    yScale = d3.scaleTime()
               .domain([d3.min(data, d=> new Date((d['Seconds']+ 1800) * 1000)), d3.max(data, d=> new Date((d['Seconds'] + 1800) * 1000) )])
               .range([padding, height - padding])
               
              // console.log(data)
              // console.log(new Date((2302 + 1800) * 1000))
}

const drawPoints = () =>{

    svg.selectAll('circle')
       .data(data)
       .enter()
       .append("circle")
       .attr('class', 'dot')
       .attr('r' , 5)
       .attr('data-xvalue', (item)=>
        item['Year']
    
    )
       .attr('data-yvalue', (item)=>
        new Date((item['Seconds']+ 1800 )* 1000)
    )   
    .attr("cx", d => xScale(d['Year']))
    .attr("cy", d => yScale(new Date(d['Seconds'] + 1800) * 1000))
    .attr('fill', d => d['Doping'] != ""? "orange" : "lightgreen")
    .on("mouseover", (event, item) =>{
        tooltip.transition()
               .style("visibility", "visible")

        if(item['Doping'] != ""){
            tooltip.text(item['year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + item["Doping"] )
        }else{

            tooltip.text(item['year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + "No Allegations" )
        }

        tooltip.attr('data-year', item['Year'])

        }
    )
    .on("mouseout", (event, item) =>{
        tooltip.transition()
               .style("visibility", "hidden")
            }
            )
}


const generateAxis = () =>{

    const xAxis = d3.axisBottom(xScale)
                         .tickFormat(d3.format('d'));

    const yAxis = d3.axisLeft(yScale)
                          .tickFormat(d3.timeFormat('%M:%S'))
                        
    svg.append('g')
       .call(xAxis)
       .attr("id", "x-axis")
       .attr("transform", "translate(0, "+(height - padding)+")");

    svg.append('g')
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate("+(padding)+", 0) ");

}

req.open("GET", url, true)
req.onload =()=>{
    data = JSON.parse(req.responseText);
    drawCanvas()
    generateScales()
    drawPoints()
    generateAxis()
}
req.send();