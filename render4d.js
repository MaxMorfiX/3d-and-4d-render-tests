



function start4d() {
    axesAngles = {
        x: 0,
        y: -90,
        z: 124,
        w: -124
    };
    axesMultificatores = {
        x: {x: cos(d2R(axesAngles.x)), y: sin(d2R(axesAngles.x))},
        y: {x: cos(d2R(axesAngles.y)), y: sin(d2R(axesAngles.y))},
        z: {x: cos(d2R(axesAngles.z)), y: sin(d2R(axesAngles.z))},
        w: {x: cos(d2R(axesAngles.w)), y: sin(d2R(axesAngles.w))}
    };
    
    draw4d();
}

function draw4d() {
    
    drawAxes4d();
    
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