let drawGuideText = true;

function drawLines(lines, points) {
    
    for(let i in lines) {
        
        let line = lines[i];
        
        if(typeof points[line.firstPoint] === 'undefined' || typeof points[line.secondPoint] === 'undefined') {
            console.log('errrrrorrr - trying to draw line from ' + line.firstPoint + ' to ' + line.secondPoint + ', but the only aviable is ' + displayPoints.length);
            continue;
        }
        
        if(typeof line.color !== 'undefined')
            var color = line.color;
        else
            var color = 'black';
        
        if(typeof line.width !== 'undefined')
            var width = line.width;
        else
            var width = 1;
            
        drawLine(
            startPoint = {x: points[line.firstPoint].x, y: points[line.firstPoint].y},
            endPoint = {x: points[line.secondPoint].x, y: points[line.secondPoint].y},
            color,
            width
        );
    }
}
function drawLine(startPoint, endPoint, color, width) {
    ctx.beginPath();
    
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    
    ctx.moveTo(startPoint.x + fieldW/2, fieldH/2 - startPoint.y);
    ctx.lineTo(endPoint.x + fieldW/2, fieldH/2 - endPoint.y);
    
    ctx.stroke();
    ctx.closePath();
}

function drawPoints(points) {
    for(let i in points) {
        drawPoint(points[i]);
    }
}
function drawPoint(point) {

    let radius = 3;
    let color = 'black';

    if(typeof point.color !== 'undefined')
        color = point.color;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    if(typeof point.size !== 'undefined')
        radius = point.size;

    ctx.beginPath();
    ctx.arc(point.x + fieldW/2, fieldH - point.y - fieldH/2, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

document.addEventListener("keypress", function(e) {
    if(e.which === 72 || e.which === 104) {
        drawGuideText = false;
    }
});