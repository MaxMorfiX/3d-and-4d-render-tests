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
    } else if(typeOfObject === 'cubeNew') {
        let returnValue = drawNewCube(300, 10, center,
            lineWidth = 10,
            pointSize = 3
        );
        points = returnValue.points;
        lines = returnValue.lines;
    } else if(typeOfObject === 'sphere') {
        let returnValue = drawSphere(300, 10, center,
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
function drawNewCube(size, quality, center, lineWidth = 1, pointSize = 3, pointColor = 'black', lineColor = 'black') {
    
    let decor = {lineWidth, pointSize, pointColor, lineColor};
    
    let points = [];
    let lines = [];
    
    let step = size/quality;
    
    for(let z=0; z < quality; z++) {
        for(let y=0; y < quality; y++) {
            for(let x=0; x < quality; x++) {
                
                if(!(x === 0 || x === quality-1 || y === 0 || y === quality-1 || z === 0 || z === quality-1))
                    continue;
                
                let point = vector3(x*step, y*step, z*step);
                point.color = decor.pointColor;
                point.size = decor.pointSize;
                
                if(center !== false) {
                    point.x = point.x - size/2 + center.x;
                    point.y = point.y - size/2 + center.y;
                    point.z = point.z - size/2 + center.z;
                }
                
                points.push(point);
                
            }
        }
    }
    
    
    return {points, lines};
    
}
function drawSphere(size, quality, center, lineWidth = 1, pointSize = 3, pointColor = 'black', lineColor = 'black') {    
    let cube = drawNewCube(size, quality, false, lineWidth, pointSize, pointColor, lineColor);
    
    let points = [];
    let lines = [];
    
    for(let i in cube.points) {
        let point = cube.points[i];
        
        let pos2 = vector3(point.x*point.x, point.y*point.y, point.z*point.z);
        
        let pos = {
            x: point.x * Math.sqrt(1 - (pos2.y + pos2.z) / 2 + (pos2.y*pos2.z) / 3),
            y: point.y * Math.sqrt(1 - (pos2.x + pos2.z) / 2 + (pos2.x*pos2.z) / 3),
            z: point.y * Math.sqrt(1 - (pos2.x + pos2.y) / 2 + (pos2.x*pos2.y) / 3)
        };
        
        point.x = pos.x - size/2 + center.x;
        point.y = pos.y - size/2 + center.y;
        point.z = pos.z - size/2 + center.z;
        
        points.push(point);
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
        
        let difference = {
            x: mx - lastmx,
            y: my - lastmy
        };
        
        if(buttons[16]) {
            if(lastmx !== mx) {
//                FOV += difference.x/100000;
            }
        } else if(lastmx !== mx || lastmy !== my) {
            if(lastmx !== mx) {
                camera.rotation.xz += rotateSpeed * difference.x;
            } if(lastmy !== my)
                camera.rotation.yz += rotateSpeed * difference.y;
        }
    }
    
    lastmx = mx;
    lastmy = my;
}
function checkMove() {
    if(buttons[38])
        camera.pos = movePoint(camera.pos, vector3(0, 0, camera.speed));
    if(buttons[40])
        camera.pos = movePoint(camera.pos, vector3(0, 0, -camera.speed));
    if(buttons[37])
        camera.pos = movePoint(camera.pos, vector3(-camera.speed, 0, 0));
    if(buttons[39])
        camera.pos = movePoint(camera.pos, vector3(camera.speed, 0, 0));
    if(buttons[190])
        camera.pos = movePoint(camera.pos, vector3(0, camera.speed, 0));
    if(buttons[191])
        camera.pos = movePoint(camera.pos, vector3(0, -camera.speed, 0));
    
//    log(camera.pos);
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
    
    point = rotatePoint(point, camera.pos, 'xy', -camera.rotation.xy);
    point = rotatePoint(point, camera.pos, 'xy', -camera.rotation.xz);
    point = rotatePoint(point, camera.pos, 'yz', -camera.rotation.yz);
    
    point.x += camera.pos.x;
    point.y += camera.pos.y;
    point.z += camera.pos.z;
    
    let returnPoint = {x: point.x + camera.pos.x, y: point.y + camera.pos.y, color: point.color, size: point.size};
    
    returnPoint.x += returnPoint.x*FOV*point.z + camera.pos.z*FOV;
    returnPoint.y += returnPoint.y*FOV*point.z + camera.pos.z*FOV;
    
    return returnPoint;
}