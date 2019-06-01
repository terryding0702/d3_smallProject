//get the width and height of visable of area
//I choose let instead of var in some part in order to reduce the consumption of resources
let width = document.documentElement.clientWidth;
let height = document.documentElement.clientHeight;
//get the width and height with svgContainer.
var svgContainer = d3.select("body").append("svg")
    .attr("width", '100%')
    .attr("height", height);
//read json file
// if want to read another file 'data-02.json' you can replace the place of 'data.json' below.
d3.json('data.json',function(data){
    let caculateR = function(lines,id){
        let r = 1;
        lines.forEach(function(one){
            if(one.node01 == id || one.node02==id){
                r += Number((one.amount/100).toFixed(2));
            }
        })
        return r;
    }
    //get all nodes elements, get all links elements
    let allNodes = data.nodes;
    let allLines = data.links;

    for(let j=0;j<allLines.length;j++){
        let lineData = [];//create a list which wil be use in line generater
        //add all element releted to links.node01 elements to lineData list
        allNodes.forEach(function(each){
            if(each.id == allLines[j].node01){
                let eachLine = {
                    x:Number(each.x),
                    y:Number(each.y)
                }
                lineData.push(eachLine);
            }
            //add all element releted to links.node02 elements to lineData list;
            if(each.id == allLines[j].node02){
                let eachLine = {
                    x:Number(each.x),
                    y:Number(each.y)
                }
                lineData.push(eachLine);
            }
        })
        //create a line generater
        var valueline1 = d3.line()
        //get the value of X axix and Y axix
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; });
        //Throw the path into the container and assign the d attribute.
        svgContainer.append("path")
            .attr('class',allLines[j].node01+' '+allLines[j].node02)
            .attr("stroke", "grey")
            .attr("stroke-width", Number((allLines[j].amount/100).toFixed(2)))
            .attr("d", valueline1(lineData))
            .attr("fill", "none");
    }


    //Add the div of the prompt box
    var tooltip = d3.select("body").append("div")
        .attr("class","tooltip") //Used to set the class style for CSS
        .attr("opacity",0.0);
    //get each element of node part
    for(let i=0;i<allNodes.length;i++){
        //draw circles
        var circle = svgContainer.append("circle")
            .attr("id",allNodes[i].id)
            .attr("cx",allNodes[i].x)
            .attr("cy",allNodes[i].y)
            .attr('class','circle')
            .attr("r",caculateR(allLines,allNodes[i].id))
            .on("mouseover",function(){
                svgContainer.selectAll('path').attr('stroke','grey');
                svgContainer.selectAll('circle').attr('class','circle');
                svgContainer.selectAll('#'+this.id).attr('class','circleHover');
                svgContainer.selectAll('.'+this.id).attr('stroke','green');
                let connectedLocations = svgContainer.selectAll('.'+this.id).size();
                let radius = Number(svgContainer.selectAll('#'+this.id).attr('r'));
                let totalAmount = ((radius-1)*100).toFixed(2);
                //set tooltip word
                tooltip.html('site id is :' + allNodes[i].id + ' TotalAmount is :'+totalAmount+' </br>'+'the number of connected locations is: '+connectedLocations)
                //set the position of tooltip(left,top relative to the distance to the page)
                    .style("left",(d3.event.pageX+radius+"px"))
                    .style("top",(d3.event.pageY+radius+"px"))
                    .style("opacity",1.0);
            })
                //set mouseout function 
            .on("mouseout",function(){
                svgContainer.selectAll('circle').attr('class','circle');
                svgContainer.selectAll('path').attr('stroke','grey');
                tooltip.style("opacity",0.0);//set completely transparent
            });
    }

})