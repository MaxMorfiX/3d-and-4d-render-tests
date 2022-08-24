function start4d(typeOfObject) {
    axesAngles = {
        x: 0,
        y: 270,
        z: 145,
        w: 236
    };
    axesMultificatores = {
        x: {x: cos(d2R(axesAngles.x)), y: sin(d2R(axesAngles.x))},
        y: {x: cos(d2R(axesAngles.y)), y: sin(d2R(axesAngles.y))},
        z: {x: cos(d2R(axesAngles.z)), y: sin(d2R(axesAngles.z))},
        w: {x: cos(d2R(axesAngles.w)), y: sin(d2R(axesAngles.w))}
    };
    
    let center = {x: 0, y: 0, z: 0, w: 0, color: 'red', size: 1};
    
    if(typeOfObject === 'tesseract') {
        let returnValue = drawTesseract(150, {x: 0, y: 0, z: 0, w: 0}, lineWidth = 5);
        points = returnValue.points;
        lines = returnValue.lines;
    }
    
    points.push(center);
    
    setInterval(draw4d, 15);
}
function drawTesseract(size, center, lineWidth, pointSize, pointColor, lineColor) {
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
    
    for(let i = 0; i <= 15; i++) {
        let bin = convert2Bin(i, true);
        
        if(bin.length < 2)
            bin = '000' + bin;
        else if(bin.length < 3)
            bin = '00' + bin;
        else if(bin.length < 4)
            bin = '0' + bin;
        
        let point = {
            x: parseInt(bin.charAt(3)),
            y: parseInt(bin.charAt(2)),
            z: parseInt(bin.charAt(1)),
            w: parseInt(bin.charAt(0)),
            color: decor.pointColor,
            size: decor.pointSize
        };
        
        points.push(point);
    }
    
    for(let i in points) {
        
        i = parseInt(i);
        let point = points[i];
        
        if(point.z === 0) {
            let line = [i, i+4, decor.lineColor, decor.lineWidth];
            lines.push(line);
        }
        
        if(point.x === 0) {
            let line = [i, i + 1, decor.lineColor, decor.lineWidth];
            lines.push(line);
        }
        
        if(point.y === 0) {
            let line = [i, i + 2, decor.lineColor, decor.lineWidth];
            lines.push(line);
        }
        
        if(point.w === 0) {
            let line = [i, i + 8, decor.lineColor, decor.lineWidth];
            lines.push(line);
        }
        
        point.x = point.x * size - size/2 + center.x;
        point.y = point.y * size - size/2 + center.y;
        point.z = point.z * size - size/2 + center.z;
        point.w = point.w * size - size/2 + center.w;
        
    }
    
    return {points, lines};
}

function draw4d() {
    
    if(lastPoints !== points || lastLines !== lines) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawAxes4d();
        
        let displayPoints = calcDisplayPoints4d(points);
        drawLines(displayPoints);
    
        drawDisplayPoints(displayPoints);

        lastLines = lines;
        lastPoints = points;
    }
    
    modify4d();
    
}

function modify4d() {
    checkMove4d();
    
    checkRotate4d();
}
function checkMove4d() {
    if(buttons[38])
        points = movePoints4d(points, {x: 0, y: -1, z: 0, w: 0});
    if(buttons[40])
        points = movePoints4d(points, {x: 0, y: 1, z: 0, w: 0});
    if(buttons[37])
        points = movePoints4d(points, {x: -1, y: 0, z: 0, w: 0});
    if(buttons[39])
        points = movePoints4d(points, {x: 1, y: 0, z: 0, w: 0});
    if(buttons[190])
        points = movePoints4d(points, {x: 0, y: 0, z: 0, w: -1});
    if(buttons[191])
        points = movePoints4d(points, {x: 0, y: 0, z: 0, w: 1});
}
function movePoints4d(points, vector4) {
    let returnValue = [];

    for(let i in points) {
        let point = points[i],
            returnPoint = movePoint4d(point, vector4);

        returnValue.push(returnPoint);
    }
    
    console.log(returnValue);

    return returnValue;
}
function movePoint4d(point, vector4) {
    let movedPoint = point;
    
    movedPoint.x += vector4.x;
    movedPoint.y += vector4.y;
    movedPoint.z += vector4.z;
    movedPoint.w += vector4.w;
    
    return movedPoint;
}

function checkRotate4d() {
    if(buttons.mouse && (lastmx !== mx || lastmy !== my)) {
        if(buttons[32]) {
            let difference = {
                x: mx - lastmx,
                y: my - lastmy
            };
            if(lastmx !== mx)
                points = points = rotatePoints4d(points, points[points.length - 1], 'xw', rotateSpeed * difference.x);
            if(lastmy !== my)
                points = points = rotatePoints4d(points, points[points.length - 1], 'wz', rotateSpeed * difference.y);
                points = points = rotatePoints4d(points, points[points.length - 1], 'wx', rotateSpeed * difference.y);
        } else {
            let difference = {
                x: mx - lastmx,
                y: my - lastmy
            };
            if(lastmx !== mx)
                points = points = rotatePoints4d(points, points[points.length - 1], 'xz', rotateSpeed * difference.x);
            if(lastmy !== my)
                points = points = rotatePoints4d(points, points[points.length - 1], 'yz', rotateSpeed * difference.y);
                points = points = rotatePoints4d(points, points[points.length - 1], 'yx', rotateSpeed * difference.y);
        }
    }
    
    lastmx = mx;
    lastmy = my;
    
    if(buttons[68])
        points = rotatePoints4d(points, points[points.length - 1], 'xw', -rotateSpeed);
    if(buttons[65])
        points = rotatePoints4d(points, points[points.length - 1], 'xw', rotateSpeed);
}
function rotatePoints4d(points, center, plane, ang) {
    let returnValue = [];

    for(let i in points) {
        let point = points[i],
            returnPoint = rotatePoint4d(point, center, plane, ang);

        returnValue.push(returnPoint);
    }

    return returnValue;
}
function rotatePoint4d(point, center, plane, ang) {
    let returnValue = {};
    
    if(plane === 'xy' || plane === 'yx') {
        ang = d2R(ang);
        
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            x = cos * (point.x - center.x) - sin * (point.y-center.y) + center.x,
            y = sin * (point.x - center.x) + cos * (point.y - center.y) + center.y,
            
            z = point.z,
            w = point.w,
            color = point.color,
            size = point.size;
    
        returnValue = {x, y, z, w, color, size};
    } else if(plane === 'yz' || plane === 'zy') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            z = cos * (point.z - center.z) - sin * (point.y-center.y) + center.z,
            y = sin * (point.z - center.z) + cos * (point.y - center.y) + center.y,
            
            x = point.x,
            w = point.w,
            color = point.color,
            size = point.size;
    
        returnValue = {x, y, z, w, color, size};
    
    } else if(plane === 'xz' || plane === 'zx') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            z = cos * (point.z - center.z) - sin * (point.x-center.x) + center.z,
            x = sin * (point.z- center.z) + cos * (point.x - center.x) + center.x,
            
            y = point.y,
            w = point.w,
            color = point.color,
            size = point.size;

        returnValue = {x, y, z, w, color, size};

    } else if(plane === 'xw' || plane === 'wx') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            w = cos * (point.w - center.w) - sin * (point.x-center.x) + center.w,
            x = sin * (point.w- center.w) + cos * (point.x - center.x) + center.x,
            
            y = point.y,
            z = point.z,
            color = point.color,
            size = point.size;

        returnValue = {x, y, z, w, color, size};
        
    } else if(plane === 'yw' || plane === 'wy') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            w = cos * (point.w - center.w) - sin * (point.y - center.y) + center.w,
            y = sin * (point.w- center.w) + cos * (point.y - center.y) + center.y,
            
            x = point.x,
            z = point.z,
            color = point.color,
            size = point.size;

        returnValue = {x, y, z, w, color, size};
    } else if(plane === 'zw' || plane === 'wz') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            w = cos * (point.w - center.w) - sin * (point.z - center.z) + center.w,
            z = sin * (point.w- center.w) + cos * (point.z - center.z) + center.z,
            
            x = point.x,
            y = point.y,
            color = point.color,
            size = point.size;

        returnValue = {x, y, z, w, color, size};
    }
    
    return returnValue;
}

function calcDisplayPoints4d(points) {
    let returnValue = [];
    
    for(let point in points) {
        returnValue.push(calcDisplayPoint4d(points[point]));
    }
    
    return returnValue;
}
function calcDisplayPoint4d(point) {
    let x = point.x * axesMultificatores.x.x + 
            point.y * axesMultificatores.y.x + 
            point.w * axesMultificatores.z.x + 
            point.w * axesMultificatores.w.x;
    
    let y = point.x * axesMultificatores.x.y + 
            point.y * axesMultificatores.y.y + 
            point.z * axesMultificatores.z.y + 
            point.w * axesMultificatores.w.y;
    
    x += fieldW / 2;
    y += fieldH / 2;
    
    return {x, y};
}

function drawAxes4d() {
    
    ctx.lineWidth = 3;
    
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
    
    ctx.beginPath();
    ctx.strokeStyle = 'yellow';
    ctx.moveTo(0 + fieldW/2, 0 + fieldH/2);
    ctx.lineTo(1000 * axesMultificatores.w.x + fieldW/2, 1000 * axesMultificatores.w.y + fieldH/2);
    ctx.stroke();
    ctx.closePath();
    
    ctx.strokeStyle = 'black';
    
    ctx.lineWidth = 1;
    
}