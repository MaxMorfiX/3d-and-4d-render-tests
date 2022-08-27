/* global buttons */
/* global mx */
/* global my */
/* global FOV */
/* global rotateSpeed */
/* global camera */

function start3d(typeOfObject) {
    
    let center = vector3();
    
    if(typeOfObject === 'cube') {
        let returnValue = drawCube(300, center, 
            lineWidth = 10,
            pointSize = 3
        );
        points = returnValue.points;
        lines = returnValue.lines;
    }
    
    points.push(center);
    
    setInterval(draw3d, 15);
    
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
        
        point.x = point.x * size - size/2 + center.x;
        point.y = point.y * size - size/2 + center.y;
        point.z = point.z * size - size/2 + center.z;
        
    }
    
    return {points, lines};
    
}

function draw3d() {
    
    if(lastPoints !== points || lastLines !== lines || lastCamera === camera) {
        ctx.clearRect(0, 0, fieldW, fieldH);
        
        let twoDPoints = calc2DPoints(points);
        drawLines(lines, twoDPoints);
        drawPoints(twoDPoints);
    
        lastLines = lines;
        lastPoints = points;
        lastCamera = camera;
    }
    
    modify();
    
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
            if(lastmx !== mx) {
                camera.rotation.xz += rotateSpeed * difference.x;
//                points = points = rotatePoints(points, points[points.length - 1], 'xz', rotateSpeed * difference.x);
            } if(lastmy !== my)
                camera.rotation.yz += rotateSpeed * difference.y;
//                points = points = rotatePoints(points, points[points.length - 1], 'yz', rotateSpeed * difference.y);
        }
    }
    
    lastmx = mx;
    lastmy = my;
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

function calc2DPoints(points) {
    let returnValue = [];
    
    for(let i in points) {
        let point = rotatePoint(points[i], vector3(), 'xz', 60);
            point = rotatePoint(points[i], vector3(), 'yz', 35);
        
        returnValue.push(calc2DPoint(point));
    }
    
    return returnValue;
}
function calc2DPoint(point) {
    
    point = rotatePoint(point, camera.pos, 'xy', camera.rotation.xy);
    point = rotatePoint(point, camera.pos, 'xy', camera.rotation.xz);
    point = rotatePoint(point, camera.pos, 'yz', camera.rotation.yz);
    
    let returnPoint = {x: point.x + camera.pos.x, y: point.y + camera.pos.y, color: point.color, size: point.size};
    
    returnPoint.x += returnPoint.x*FOV*point.z + camera.pos.z*FOV;
    returnPoint.y += returnPoint.y*FOV*point.z + camera.pos.z*FOV;
    
    return returnPoint;
}