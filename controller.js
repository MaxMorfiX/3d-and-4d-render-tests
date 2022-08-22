var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var fieldH = $('#canvas').height();
var fieldW = $('#canvas').width();
var buttons = {};
var rotateSpeed = 2;

var points = [];
var lines = [];
var lastPoints = [];
var lastLines = [];
var axesAngles = {};
var axesMultificatores = {};


//start2d('circle');
//start2d('square');

start3d('sphere');


document.addEventListener('keydown', KeyDown);
document.addEventListener('keyup', KeyUp);

function KeyDown(e) {
    buttons[e.which] = true;
}
function KeyUp(e) {
    if (buttons[e.which]) {
        buttons[e.which] = false;
    }
}
function drawLines(displayPoints) {
    
    for(let line in lines) {
        
        if(typeof displayPoints[lines[line][0]] === 'undefined' || typeof displayPoints[lines[line][1]] === 'undefined') {
            console.log('errrrrorrr - trying to draw line from ' + lines[line][0] + ' to ' + lines[line][1] + ', but the only aviable is ' + displayPoints.length);
            continue;
        }
        
        if(typeof lines[line][2] !== 'undefined')
            var color = lines[line][2];
        else
            var color = 'black';
        
        if(typeof lines[line][3] !== 'undefined')
            var width = lines[line][3];
        else
            var width = 1;
            
        drawLine(
            startPoint = {x: displayPoints[lines[line][0]].x, y: displayPoints[lines[line][0]].y},
            endPoint = {x: displayPoints[lines[line][1]].x, y: displayPoints[lines[line][1]].y},
            color,
            width
        );
    }
}
function drawLine(startPoint, endPoint, color, width) {
    ctx.beginPath();
    
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    
    ctx.moveTo(startPoint.x, fieldH - startPoint.y);
    ctx.lineTo(endPoint.x, fieldH - endPoint.y);
    
    ctx.stroke();
    ctx.closePath();
}
function drawDisplayPoints(displayPoints) {
    for(let i in displayPoints) {
        let point = displayPoints[i];
        let point3d = points[i];
        
        let radius = 3;
        let color = 'black';
        
        if(typeof point3d.color !== 'undefined')
            color = point3d.color;
        
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        
        if(typeof point3d.size !== 'undefined')
            radius = point3d.size;
        
        ctx.beginPath();
        ctx.arc(point.x, fieldH - point.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}