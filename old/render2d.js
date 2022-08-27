function start2d(typeOfObject) {
    
    if(typeOfObject === 'square') {
        drawSquare();
    } else if (typeOfObject === 'circle') {
        returnValue = drawCircle(80, 200);
        points = returnValue.points;
        lines = returnValue.lines;
    }
    
    setInterval(draw2d, 10);
}
function drawSquare() {
    points = [
        {x: 50, y: 50},
        {x: 50, y: -50},
        {x: -50, y: 50},
        {x: -50, y: -50},
        {x: 0, y: 0, color: 'green'}
    ];
    lines = [
        [0, 1],
        [0, 2],
        [3, 1],
        [3, 2],
        [0, 4],
        [1, 4],
        [2, 4],
        [3, 4]
    ];
}
function drawCircle(pointCount, radius) {
    let ang = 360/pointCount,
        rAng = d2R(ang),
        points = [],
        lines = [];
    
    for(let i = 0; i < pointCount; i++) {
        
        let x = cos(i*rAng) * radius;
        let y = sin(i*rAng) * radius;
        
        let thisPointNumber = i;
        
        points.push({x, y});
        
        if(i === 0)
            lines.push([0, pointCount - 1]);
        else
            lines.push([thisPointNumber, thisPointNumber - 1]);
    }
    
    return {points, lines};
}

function draw2d() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    var dots = calcCenterPosition(points);
    drawLines(dots);
    drawDisplayPoints(dots);
    
    modify2d();
}
function calcCenterPosition(inputPoints) {
    var centratedPoints = [];
    
    for(let i in inputPoints) {
        let point = {
            x: inputPoints[i].x + fieldW/2,
            y: inputPoints[i].y + fieldH/2
        };
        
        centratedPoints.push(point);
    }
    
    return centratedPoints;
}

function modify2d() {
    points = rotatePoints2d(points, {x: 0, y: 0}, 0.3);
}
function rotatePoints2d(points, center, ang) {
    let returnValue = [];

    for(let i in points) {
        let point = points[i],
            returnPoint = rotatePoint2d(point, center, ang);

        returnValue.push(returnPoint);
    }

    return returnValue;
}
function rotatePoint2d(point, center, ang) {
    ang = d2R(ang);
    var cos = Math.cos(ang),
        sin = Math.sin(ang),
        x = cos * (point.x - center.x) - sin * (point.y-center.y) + center.x,
        y = sin * (point.x - center.x) + cos * (point.y - center.y) + center.y;
    
    return {x, y};
}