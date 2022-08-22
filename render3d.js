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
    
    if(typeOfObject === 'sphere') {
        returnValue = drawSphere(15, 200, {x: 0, y: 0, z: 0});
        points = returnValue.points;
        lines = returnValue.lines;
    } else if(typeOfObject === 'cube') {
        drawCube();
    }
    
    points.push({x: 0, y: 0, z: 0, color: 'red'});
    
//    drawAllToOne(points, points.length - 1);
    
    setInterval(draw, 15);
//    draw();
}
function drawCube() {
    points = [
        {x: 0, y: 0, z: 0, size: 5},
        {x: 0, y: 200, z: 0, size: 5},
        {x: 200, y: 0, z: 0, size: 5},
        {x: 200, y: 200, z: 0, size: 5},
        {x: 0, y: 0, z: 200, size: 5},
        {x: 0, y: 200, z: 200, size: 5},
        {x: 200, y: 0, z: 200, size: 5},
        {x: 200, y: 200, z: 200, size: 5},
        {x: 100, y: 100, z: 100, color: 'yellow'}
    ];
    lines = [
        [0, 1, 'black', 10],
        [0, 2, 'black', 10],
        [0, 4, 'black', 10],
        [1, 3, 'black', 10],
        [1, 5, 'black', 10],
        [2, 6, 'black', 10],
        [2, 3, 'black', 10],
        [7, 3, 'black', 10],
        [7, 5, 'black', 10],
        [7, 6, 'black', 10],
        [4, 6, 'black', 10],
        [4, 5, 'black', 10],
        
        [8, 0],
        [8, 1],
        [8, 2],
        [8, 3],
        [8, 4],
        [8, 5],
        [8, 6],
        [8, 7]
    ];
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
        
        let displayPoints = calcDisplayPoints(points);
        drawLines(displayPoints);
    
        lastLines = lines;
        lastPoints = points;

        drawDisplayPoints(displayPoints);
//        drawAxes();
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