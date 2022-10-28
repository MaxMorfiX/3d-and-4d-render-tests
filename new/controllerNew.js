var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    fieldH = $('#canvas').height(),
    fieldW = $('#canvas').width(),
    rotateSpeed = 0.5,
    FOV = 0.001,
    camera = {
        pos: vector4(0, 0, 0, 0),
        rotation: {
            xy: 0,
            xz: 0,
            yz: 45
        },
        speed: 5
    },

    points = [],
    lines = [],
    lastPoints = [],
    lastLines = [],
    lastmx = 0,
    lastmy = 0,
    lastCamera = camera,
    lastMouse = false;


//start3d('cube');
//start3d('cubeNew');
//start3d('sphere');

start4d('tesseract');

//start5d('penteract');