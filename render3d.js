function start3d(typeOfObject) {
    axesAngles = {
        x: 150,
        y: -90,
        z: 30
    };
    axesMultificatores = {
        x: {x: cos(d2R(axesAngles.x)), y: sin(d2R(axesAngles.x))},
        y: {x: cos(d2R(axesAngles.y)), y: sin(d2R(axesAngles.y))},
        z: {x: cos(d2R(axesAngles.z)), y: sin(d2R(axesAngles.z))}
    };
    
    let center = {x: 0, y: 0, z: 0, color: 'red', size: 1};
    
    if(typeOfObject === 'sphere') {
        let returnValue = drawSphere(15, 200, {x: 0, y: 0, z: 0});
        points = returnValue.points;
        lines = returnValue.lines;
    } else if(typeOfObject === 'cube') {
        let returnValue = drawCube(300, center, 
            lineWidth = 10,
            pointSize = 3
        );
        points = returnValue.points;
        lines = returnValue.lines;
    }
    
    points.push(center);
    
//    drawAllToOne(points, points.length - 1);
    
    setInterval(draw, 15);
//    draw();
}
function drawCube(size, center, lineWidth, pointSize, pointColor, lineColor) {
    
    let decor = setSizesAndColors(lineWidth, pointSize, pointColor, lineColor);
    
    function setSizesAndColors(lineWidth, pointSize, pointColor, lineColor) {
        let returnValue = {
            lineWidth: 1,
            pointSize: 3,
            pointColor: 'black',
            lineColor: 'black'
        };
        
        if(typeof lineWidth !== 'undefined')
            returnValue.lineWidth = lineWidth;
        
        if(typeof pointSize !== 'undefined')
            returnValue.pointSize = pointSize;
        
        if(typeof pointColor !== 'undefined')
            returnValue.pointColor = pointColor;
        
        if(typeof lineColor !== 'undefined')
            returnValue.lineColor = lineColor;
        
        return {lineWidth, pointSize, lineColor, pointColor};
    }
    
    let points = [];
    let lines = [];
    
    for(let i = 0; i <= 7; i++) {
        let bin = convert2Bin(i, true);
        
        if(bin.length < 2)
            bin = '00' + bin;
        else if(bin.length < 3)
            bin = '0' + bin;
        
        let point = {
            x: parseInt(bin.charAt(2)),
            y: parseInt(bin.charAt(1)),
            z: parseInt(bin.charAt(0)),
            color: decor.pointColor,
            size: decor.pointSize
        };
        
        points.push(point);
    }
    
    for(let i in points) {
        
        i = parseInt(i);
        let point = points[i];
        
        if(points[i].z === 0) {
            let line = [i, i+4, decor.lineColor, decor.lineWidth];
            lines.push(line);
        }
        
        if(points[i].x === 0) {
            let line = [i, i + 1, decor.lineColor, decor.lineWidth];
            lines.push(line);
        }
        
        if(points[i].y === 0) {
            let line = [i, i + 2, decor.lineColor, decor.lineWidth];
            lines.push(line);
        }
        
        point.x = point.x * size - size/2 + center.x;
        point.y = point.y * size - size/2 + center.y;
        point.z = point.z * size - size/2 + center.z;
        
    }
    
    return {points, lines};
    
}
function drawSphere(pointCount, radius, center) {
    let ang = 360/pointCount,
            rAng = d2R(ang),
            points = [],
            lines = [];
    
    for(let i = -pointCount; i < pointCount; i++) {
        
        let currRadius = cos(i*rAng) * radius - center.x;
        let y = sin(i*rAng) * radius - center.z;
        
        let returnValue = drawCircle3d(pointCount, currRadius, {x: center.x, y, z: center.z}, 'xz');
        
        for(let i in returnValue.points)
            points.push(returnValue.points[i]);
        
        for(let i in returnValue.lines) {
            let line = returnValue.lines[i];
            line[0] += points.length - pointCount;
            line[1] += points.length - pointCount;
            
            
            lines.push(line);
        }
        
        for(let i in points) {
            if(i < points.length - pointCount) {
                let line = [i, parseInt(i) + pointCount];
                lines.push(line);
            }
            
//            if(i < points.length - pointCount + 1) {
//                let line = [i, parseInt(i) + pointCount + 1];
//                lines.push(line);
//            }
        }
    }
    
    return {points, lines};
}
function drawCircle3d(pointCount, radius, center, plane) {
    if(plane === 'xz' || plane === 'zx') {
        let ang = 360/pointCount,
            rAng = d2R(ang),
            points = [],
            lines = [];

        for(let i = 0; i < pointCount; i++) {

            let x = cos(i*rAng) * radius - center.x;
            let z = sin(i*rAng) * radius - center.z;
            let y = center.y;

            let thisPointNumber = i;

            points.push({x, y, z});

            if(i === 0)
                lines.push([0, pointCount - 1]);
            else
                lines.push([thisPointNumber, thisPointNumber - 1]);
        }

        return {points, lines};
    }
}

function drawAllToOne(points, point) {
    for(let i in points) {
        if(points[i] === points[point])
            continue;
        lines.push([i, point]);
    }
}

function draw() {
    if(lastPoints !== points || lastLines !== lines) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
//        drawAxes();
        
        let displayPoints = calcDisplayPoints(points);
        drawLines(displayPoints);
    
        lastLines = lines;
        lastPoints = points;

//        drawDisplayPoints(displayPoints);
    }
    
    modify();
    
}

function calcDisplayPoints(points) {
    
    let returnValue = [];
    
    for(let point in points) {
        returnValue.push(calcDisplayPoint(points[point]));
    }
    
    return returnValue;
}
function calcDisplayPoint(point) {
    let x = point.x * axesMultificatores.x.x + point.y * axesMultificatores.y.x + point.z * axesMultificatores.z.x;
    let y = point.x * axesMultificatores.x.y + point.y * axesMultificatores.y.y + point.z * axesMultificatores.z.y;
    
    x += fieldW / 2;
    y += fieldH / 2;
    
    return {x, y};
}

function modify() {
    checkRotate();
    
    checkMove();
}
function checkRotate() {
    
    if(buttons.mouse) {
        if(lastmx !== mx || lastmy !== my) {
            let difference = {
                x: mx - lastmx,
                y: my - lastmy
            };
            if(lastmx !== mx)
                points = points = rotatePoints(points, points[points.length - 1], 'xz', rotateSpeed * difference.x);
            if(lastmy !== my)
                points = points = rotatePoints(points, points[points.length - 1], 'yz', rotateSpeed * difference.y);
                points = points = rotatePoints(points, points[points.length - 1], 'yx', rotateSpeed * difference.y);
        }
    }
    
    lastmx = mx;
    lastmy = my;
    
    
    
    if(buttons[68])
        points = rotatePoints(points, points[points.length - 1], 'yz', -rotateSpeed);
    if(buttons[65])
        points = rotatePoints(points, points[points.length - 1], 'yz', rotateSpeed);
    if(buttons[87])
        points = rotatePoints(points, points[points.length - 1], 'yx', rotateSpeed);
    if(buttons[83])
        points = rotatePoints(points, points[points.length - 1], 'yx', -rotateSpeed);
    if(buttons[81])
        points = rotatePoints(points, points[points.length - 1], 'xz', rotateSpeed);
    if(buttons[69])
        points = rotatePoints(points, points[points.length - 1], 'xz', -rotateSpeed);
}
function checkMove() {
    if(buttons[38])
        points = movePoints(points, {x: 0, y: -1, z: 0});
    if(buttons[40])
        points = movePoints(points, {x: 0, y: 1, z: 0});
    if(buttons[37])
        points = movePoints(points, {x: 1, y: 0, z: 0});
    if(buttons[39])
        points = movePoints(points, {x: -1, y: 0, z: 0});
    if(buttons[190])
        points = movePoints(points, {x: 0, y: 0, z: -1});
    if(buttons[191])
        points = movePoints(points, {x: 0, y: 0, z: 1});
}

function rotatePoints(points, center, plane, ang) {
    let returnValue = [];

    for(let i in points) {
        let point = points[i],
            returnPoint = rotatePoint(point, center, plane, ang);

        returnValue.push(returnPoint);
    }

    return returnValue;
}
function rotatePoint(point, center, plane, ang) {
    if(plane === 'xy' || plane === 'yx') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            x = cos * (point.x - center.x) - sin * (point.y-center.y) + center.x,
            y = sin * (point.x - center.x) + cos * (point.y - center.y) + center.y,
            
            z = point.z,
            color = point.color,
            size = point.size,
            returnValue = {x, y, z, color, size};


        return returnValue;
    } else if(plane === 'yz' || plane === 'zy') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            z = cos * (point.z - center.z) - sin * (point.y-center.y) + center.z,
            y = sin * (point.z - center.z) + cos * (point.y - center.y) + center.y,
            
            x = point.x,
            color = point.color,
            size = point.size,
            returnValue = {x, y, z, color, size};


        return returnValue;
    } else if(plane === 'xz' || plane === 'zx') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            z = cos * (point.z - center.z) - sin * (point.x-center.x) + center.z,
            x = sin * (point.z- center.z) + cos * (point.x - center.x) + center.x,
            
            y = point.y,
            color = point.color,
            size = point.size,
            returnValue = {x, y, z, color, size};


        return returnValue;
    }
}

function movePoints(points, vector3) {
    let returnValue = [];

    for(let i in points) {
        let point = points[i],
            returnPoint = movePoint(point, vector3);

        returnValue.push(returnPoint);
    }

    return returnValue;
}
function movePoint(point, vector3) {
    let movedPoint = point;
    
    movedPoint.x += vector3.x;
    movedPoint.y += vector3.y;
    movedPoint.z += vector3.z;
    
    return movedPoint;
}


function drawAxes() {
    
    ctx.lineWidth = 3;
    
    ctx.strokeStyle = 'gray';
    
    ctx.beginPath();
    ctx.moveTo(0 + fieldW/2, 0 + fieldH/2);
    ctx.lineTo(-1000 * axesMultificatores.x.x + fieldW/2, -1000 * axesMultificatores.x.y + fieldH/2);
    ctx.stroke();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.moveTo(0 + fieldW/2, 0 + fieldH/2);
    ctx.lineTo(-1000 * axesMultificatores.y.x + fieldW/2, -1000 * axesMultificatores.y.y + fieldH/2);
    ctx.stroke();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.moveTo(0 + fieldW/2, 0 + fieldH/2);
    ctx.lineTo(-1000 * axesMultificatores.z.x + fieldW/2, -1000 * axesMultificatores.z.y + fieldH/2);
    ctx.stroke();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.moveTo(0 + fieldW/2, 0 + fieldH/2);
    ctx.lineTo(1000 * axesMultificatores.x.x + fieldW/2, 1000 * axesMultificatores.x.y + fieldH/2);
    ctx.stroke();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.moveTo(0 + fieldW/2, 0 + fieldH/2);
    ctx.lineTo(1000 * axesMultificatores.y.x + fieldW/2, 1000 * axesMultificatores.y.y + fieldH/2);
    ctx.stroke();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.moveTo(0 + fieldW/2, 0 + fieldH/2);
    ctx.lineTo(1000 * axesMultificatores.z.x + fieldW/2, 1000 * axesMultificatores.z.y + fieldH/2);
    ctx.stroke();
    ctx.closePath();
    
    ctx.strokeStyle = 'black';
    
    ctx.lineWidth = 1;
    
}