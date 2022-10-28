/* global buttons */
/* global mx */
/* global my */
/* global FOV */
/* global rotateSpeed */

function start4d(typeOfObject) {
    
    let center = vector4();
    center.color = 'orange';
    center.size = 0;
    
    if(typeOfObject === 'tesseract') {
        let returnValue = drawTesseract(300, {x: 0, y: 0, z: 0, w: 0}, lineWidth = 10, pointSize = 3);
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
        
        if(point.x === 0) {
            let line = {firstPoint: i, secondPoint: i + 1, color: 'red', width: decor.lineWidth};
            lines.push(line);
        }
        
        if(point.y === 0) {
            let line = {firstPoint: i, secondPoint: i + 2, color: 'green', width: decor.lineWidth};
            lines.push(line);
        }
        
        if(point.z === 0) {
            let line = {firstPoint: i, secondPoint: i + 4, color: 'blue', width: decor.lineWidth};
            lines.push(line);
        }
        
        if(point.w === 0) {
            let line = {firstPoint: i, secondPoint: i + 8, color: 'yellow', width: decor.lineWidth};
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
    if(lastPoints !== points || lastLines !== lines || lastCamera === camera) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let threeDPoints = calc3DPoints(points);
        let twoDPoints = calc2DPoints(threeDPoints);
    
        drawLines(lines, twoDPoints);
        drawPoints(twoDPoints);
        if(drawGuideText) {
            drawGuideText4d();
        }

        lastLines = lines;
        lastPoints = points;
        lastCamera = camera;
        
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
        let difference = {
            x: mx - lastmx,
            y: my - lastmy
        };
        
        if(buttons[32]) {
            if(lastmx !== mx)
                points = points = rotatePoints4d(points, points[points.length - 1], 'xw', rotateSpeed * difference.x);
            if(lastmy !== my)
                points = points = rotatePoints4d(points, points[points.length - 1], 'wz', rotateSpeed * difference.y);
        } else if(buttons[16]) {
            if(lastmx !== mx)
                FOV += difference.x/100000;
        } else {
            if(lastmx !== mx)
                camera.rotation.xz += rotateSpeed * difference.x;
//                points = points = rotatePoints4d(points, points[points.length - 1], 'xz', rotateSpeed * difference.x);
            if(lastmy !== my)
                camera.rotation.yz += rotateSpeed * difference.y;
//                points = points = rotatePoints4d(points, points[points.length - 1], 'yz', rotateSpeed * difference.y);
        }
    }
    
    lastmx = mx;
    lastmy = my;
    
    if(buttons[68])
        points = rotatePoints4d(points, points[points.length - 1], 'xw', -rotateSpeed*1.5);
    if(buttons[65])
        points = rotatePoints4d(points, points[points.length - 1], 'xw', rotateSpeed*1.5);
    if(buttons[87])
        points = rotatePoints4d(points, points[points.length - 1], 'yw', rotateSpeed*1.5);
    if(buttons[83])
        points = rotatePoints4d(points, points[points.length - 1], 'yw', -rotateSpeed*1.5);
    if(buttons[81])
        points = rotatePoints4d(points, points[points.length - 1], 'zw', rotateSpeed*1.5);
    if(buttons[69])
        points = rotatePoints4d(points, points[points.length - 1], 'zw', -rotateSpeed*1.5);
    
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

function calc3DPoints(points) {
    let returnValue = [];
    
    for(let i in points) {
        returnValue.push(calc3DPoint(points[i]));
    }
    
    return returnValue;
}
function calc3DPoint(point) {
    let returnPoint = {x: point.x, y: point.y, z: point.z, color: point.color, size: point.size};
    
    returnPoint.x += returnPoint.x*FOV*point.w;
    returnPoint.y += returnPoint.y*FOV*point.w;
    returnPoint.z += returnPoint.z*FOV*point.w;
    
    return returnPoint;
}




function drawGuideText4d() {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.font = "15px Arial";
    ctx.fillText('Hello There!', 10, 25);
    ctx.fillText('in this project I did 4d rendering', 10, 40);
    ctx.fillText('hold & move your mouse to rotate cube (4d cube - tesseract)', 10, 55);
    ctx.fillText('press wasdqr to rotate it in 4th dimension', 10, 70);
    ctx.fillText('or hold spacebar & mouse and move mouse to rotate in 4th dm', 10, 85);
    ctx.fillText('(press H to hide guide)', 10, 100);
    ctx.closePath();
}