function start5d(typeOfObject) {
    
    let center = vector5();
    
    if(typeOfObject === 'penteract') {
        let returnValue = drawPenteract(300, center, lineWidth = 5, pointSize = 4);
        points = returnValue.points;
        lines = returnValue.lines;
    }
    
    points.push(center);
    
    setInterval(draw5d, 15);
    
}

function drawPenteract(size, center, lineWidth, pointSize, pointColor, lineColor) {
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
    
    for(let i = 0; i <= 31; i++) {
        let bin = convert2Bin(i, true);
        
        if(bin.length < 2)
            bin = '0000' + bin;
        else if(bin.length < 3)
            bin = '000' + bin;
        else if(bin.length < 4)
            bin = '00' + bin;
        else if(bin.length < 5)
            bin = '0' + bin;
        
        let point = {
            x: parseInt(bin.charAt(4)),
            y: parseInt(bin.charAt(3)),
            z: parseInt(bin.charAt(2)),
            w: parseInt(bin.charAt(1)),
            v: parseInt(bin.charAt(0)),
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
        
        if(point.v === 0) {
            let line = {firstPoint: i, secondPoint: i + 16, color: 'violet', width: decor.lineWidth};
            lines.push(line);
        }
        
        point.x = point.x * size - size/2 + center.x;
        point.y = point.y * size - size/2 + center.y;
        point.z = point.z * size - size/2 + center.z;
        point.w = point.w * size - size/2 + center.w;
        point.v = point.v * size - size/2 + center.v;
        
    }
    
    return {points, lines};
}


function draw5d() {
    if(lastPoints !== points || lastLines !== lines || lastCamera === camera) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let fourDPoints = calc4DPoints(points);
        let threeDPoints = calc3DPoints(fourDPoints);
        let twoDPoints = calc2DPoints(threeDPoints);
    
        drawLines(lines, twoDPoints);
        drawPoints(twoDPoints);

        lastLines = lines;
        lastPoints = points;
        lastCamera = camera;
    }
    
    modify5d();
}

function modify5d() {
//    checkMove5d();
    
    checkRotate5d();
}

function checkRotate5d() {
    
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
        points = rotatePoints5d(points, points[points.length - 1], 'xv', rotateSpeed*1.5);
    if(buttons[65])
        points = rotatePoints5d(points, points[points.length - 1], 'xv', rotateSpeed*1.5);
    if(buttons[87])
        points = rotatePoints5d(points, points[points.length - 1], 'yv', rotateSpeed*1.5);
    if(buttons[83])
        points = rotatePoints5d(points, points[points.length - 1], 'wv', rotateSpeed*1.5);
    if(buttons[81])
        points = rotatePoints5d(points, points[points.length - 1], 'zw', rotateSpeed*1.5);
    if(buttons[69])
        points = rotatePoints5d(points, points[points.length - 1], 'zw', -rotateSpeed*1.5);
    
}
function rotatePoints5d(points, center, plane, ang) {
    let returnValue = [];

    for(let i in points) {
        let point = points[i],
            returnPoint = rotatePoint5d(point, center, plane, ang);

        returnValue.push(returnPoint);
    }

    return returnValue;
}
function rotatePoint5d(point, center, plane, ang) {
    let returnValue = {};
    
    if(plane === 'xy' || plane === 'yx') {
        ang = d2R(ang);
        
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            x = cos * (point.x - center.x) - sin * (point.y-center.y) + center.x,
            y = sin * (point.x - center.x) + cos * (point.y - center.y) + center.y,
            
            z = point.z,
            w = point.w,
            v = point.v,
            color = point.color,
            size = point.size;
    
        returnValue = {x, y, z, w, v, color, size};
    } else if(plane === 'yz' || plane === 'zy') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            z = cos * (point.z - center.z) - sin * (point.y-center.y) + center.z,
            y = sin * (point.z - center.z) + cos * (point.y - center.y) + center.y,
            
            x = point.x,
            w = point.w,
            v = point.v,
            color = point.color,
            size = point.size;
    
        returnValue = {x, y, z, w, v, color, size};
    
    } else if(plane === 'xz' || plane === 'zx') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            z = cos * (point.z - center.z) - sin * (point.x-center.x) + center.z,
            x = sin * (point.z- center.z) + cos * (point.x - center.x) + center.x,
            
            y = point.y,
            w = point.w,
            v = point.v,
            color = point.color,
            size = point.size;
    
        returnValue = {x, y, z, w, v, color, size};

    } else if(plane === 'xw' || plane === 'wx') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            w = cos * (point.w - center.w) - sin * (point.x-center.x) + center.w,
            x = sin * (point.w- center.w) + cos * (point.x - center.x) + center.x,
            
            y = point.y,
            z = point.z,
            v = point.v,
            color = point.color,
            size = point.size;
    
        returnValue = {x, y, z, w, v, color, size};
        
    } else if(plane === 'yw' || plane === 'wy') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            w = cos * (point.w - center.w) - sin * (point.y - center.y) + center.w,
            y = sin * (point.w- center.w) + cos * (point.y - center.y) + center.y,
            
            x = point.x,
            z = point.z,
            v = point.v,
            color = point.color,
            size = point.size;
    
        returnValue = {x, y, z, w, v, color, size};
    } else if(plane === 'zw' || plane === 'wz') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            w = cos * (point.w - center.w) - sin * (point.z - center.z) + center.w,
            z = sin * (point.w- center.w) + cos * (point.z - center.z) + center.z,
            
            x = point.x,
            y = point.y,
            v = point.v,
            color = point.color,
            size = point.size;
    
        returnValue = {x, y, z, w, v, color, size};
    } else if(plane === 'xv' || plane === 'vx') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            v = cos * (point.v - center.v) - sin * (point.x-center.x) + center.v,
            x = sin * (point.v- center.v) + cos * (point.x - center.x) + center.x,
            
            y = point.y,
            z = point.z,
            w = point.w,
            color = point.color,
            size = point.size;
    
        returnValue = {x, y, z, w, v, color, size};
        
    } else if(plane === 'yv' || plane === 'vy') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            v = cos * (point.v - center.v) - sin * (point.y - center.y) + center.v,
            y = sin * (point.v- center.v) + cos * (point.y - center.y) + center.y,
            
            x = point.x,
            z = point.z,
            w = point.w,
            color = point.color,
            size = point.size;
    
        returnValue = {x, y, z, w, v, color, size};
    } else if(plane === 'zv' || plane === 'vz') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            v = cos * (point.v - center.v) - sin * (point.z - center.z) + center.v,
            z = sin * (point.v- center.v) + cos * (point.z - center.z) + center.z,
            
            x = point.x,
            y = point.y,
            w = point.w,
            color = point.color,
            size = point.size;
    
        returnValue = {x, y, z, w, v, color, size};
    } else if(plane === 'wv' || plane === 'vw') {
        ang = d2R(ang);
        let cos = Math.cos(ang),
            sin = Math.sin(ang),
            v = cos * (point.v - center.v) - sin * (point.w - center.w) + center.v,
            w = sin * (point.v- center.v) + cos * (point.w - center.w) + center.w,
            
            x = point.x,
            y = point.y,
            z = point.z,
            color = point.color,
            size = point.size;
    
        returnValue = {x, y, z, w, v, color, size};
    }
    
    return returnValue;
}

function calc4DPoints(points) {
    let returnValue = [];
    
    for(let i in points) {
        returnValue.push(calc4DPoint(points[i]));
    }
    
    return returnValue;
}
function calc4DPoint(point) {
    let returnPoint = {x: point.x, y: point.y, z: point.z, w: point.w, color: point.color, size: point.size};
    
    returnPoint.x += returnPoint.x*FOV*point.v;
    returnPoint.y += returnPoint.y*FOV*point.v;
    returnPoint.z += returnPoint.z*FOV*point.v;
    returnPoint.w += returnPoint.w*FOV*point.v;
    
    return returnPoint;
}