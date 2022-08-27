var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    fieldH = $('#canvas').height(),
    fieldW = $('#canvas').width(),
    rotateSpeed = 0.5,
    FOV = 0.001,
    camera = {
        pos: vector3(),
        rotation: {
            xy: 0,
            xz: 0,
            yz: 45
        }
    };

    points = [],
    lines = [],
    lastPoints = [],
    lastLines = [],
    lastmx = 0,
    lastmy = 0,
    lastCamera = camera;
    lastMouse = false;


//start3d('cube');

start4d('tesseract');

//start5d('penteract');