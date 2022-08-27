const PI = Math.PI,
    multForMoveByVector = PI / 180;
    
var fieldH = $('#field').height(),
    buttons = {},
    mouse,
    mx,
    my;

function fitToSizeJQbottom(fieldFinder) {
    fieldH = $(fieldFinder).height();
}

(function($) {
    $.fn.y = function(bottom) {
    
    var offsetTop = fieldH - this[0].offsetTop - this[0].offsetHeight;
    
    if (typeof bottom !== 'undefined') {
        offsetTop = fieldH - bottom - this[0].offsetHeight;
        this[0].style.top = offsetTop + 'px';
        return this;
    } else {
        return offsetTop;
    }
    
  };
})(jQuery);

(function($) {
    $.fn.x = function(left) {
    
    var offsetLeft = this[0].offsetLeft;
    
    if (typeof left !== 'undefined') {
        offsetLeft = left;
        this[0].style.left = offsetLeft + 'px';
        return this;
    } else {
        return offsetLeft;
    }
    
  };
})(jQuery);

(function($) {
    $.fn.moveByVec = function(ang, shift, fDontMove, fDontUseDat, angType) {
    
    if(angType !== 'rad') {
        ang = dToR(ang);
    }
    
    var obj = $('#' + this[0].id);
    
    var xAdd = cos(ang) * shift;
    var yAdd = -(sin(ang) * shift);
    
    var currX = 0.00;
    var currY = 0.00;
    
    if(!fDontUseDat) {
        if(!isNaN(obj.data('x'))) {
            currX = obj.data('x');
        } else {
        currX = obj.x();
        currY = obj.y();
        }
        if(!isNaN(obj.data('y'))) {
            currY = obj.data('y');
        } else {
        currX = obj.x();
        currY = obj.y();
        }
    } else {
        currX = obj.x();
        currY = obj.y();
    }
    
    var finX = currX + xAdd;
    var finY = currY + yAdd;
    
    if(!fDontMove) {
        obj.x(finX);
        obj.y(finY);
        
        if(!fDontUseDat) {
            obj.data('x', finX);
            obj.data('y', finY);
        }
    }
    
    var ret = {xAdd, yAdd, finX, finY};
    
    return ret;
    
    };
})(jQuery);

(function($) {
    $.fn.rotate = function(ang) {
        if (typeof ang !== 'undefined') {
            this.css('transform', 'rotate(' + ang + 'deg)');
            return this;
        } else {
            console.log('now getting rotation isn`t aviable');
            return;
        }
  };
})(jQuery);
(function($) {
    $.fn.opacity = function(opacity) {
        if (typeof opacity !== 'undefined') {
            this[0].style.opacity = opacity;
            
            return this;
        } else {
            return this[0].style.opacity;
        }
  };
})(jQuery);
(function($) {
    $.fn.placeholder = function(value) {
        if (typeof value !== 'undefined') {
            this[0].placeholder = value;
            
            return this;
        } else {
            return this[0].getAttribute("placeholder");
        }
  };
})(jQuery);

function cos(number) {
    return Math.cos(number);
}

function sin(number) {
    return Math.sin(number);
}

function tan(number) {
    return Math.tan(number);
}

function atan(number) {
    return Math.atan(number);
}

function sqrt(number) {
    return Math.sqrt(number);
}

function r2D(radians) {
    return radians * (180/PI);
}

function d2R(degrees) {
    return degrees * (PI/180);
}

function log(value, string) {
    if(string) {
        value = JSON.stringify(value);
    }
    console.log(value);
}

function convert2Bin(num, string) {
  let bin = num.toString(2);
  
  if(string)
      return bin;
      
  return parseInt(bin);
}

function mouseClick(action) {
    if (action === 'down') {
        buttons.mouse = true;
    } else if (action === 'up') {
        buttons.mouse = false;
    }
}
onmousemove = function (e) {
    mx = e.x;
    my = fieldH - e.y;
};

document.addEventListener('keydown', KeyDown);
document.addEventListener('keyup', KeyUp);

function KeyDown(e) {
    buttons[e.which] = true;
}
function KeyUp(e) {
    if (buttons[e.which]) {
        buttons[e.which] = false;
    }
}

function vector3(x, y, z) {
    let returnValue = {x: 0, y: 0, z: 0};
    
    if(typeof x !== 'undefined') {
        if(y)
            returnValue = {x: x, y: x, z: x};
        else
            returnValue.x = x;
    }
    if(typeof y !== 'undefined')
        returnValue.y = y;
    if(typeof z !== 'undefined')
        returnValue.z = z;
    
    return returnValue;
}
function vector4(x, y, z, w) {
    let returnValue = {x: 0, y: 0, z: 0, w: 0};
    
    if(typeof x !== 'undefined') {
        if(y)
            returnValue = {x: x, y: x, z: x, w: x};
        else
            returnValue.x = x;
    }
    if(typeof y !== 'undefined')
        returnValue.y = y;
    if(typeof z !== 'undefined')
        returnValue.z = z;
    if(typeof w !== 'undefined')
        returnValue.w = w;
    
    return returnValue;
}
function vector5(x, y, z, w, v) {
    let returnValue = {x: 0, y: 0, z: 0, w: 0, v: 0};
    
    if(typeof x !== 'undefined') {
        if(y)
            returnValue = {x: x, y: x, z: x, w: x, v: x};
        else
            returnValue.x = x;
    }
    if(typeof y !== 'undefined')
        returnValue.y = y;
    if(typeof z !== 'undefined')
        returnValue.z = z;
    if(typeof w !== 'undefined')
        returnValue.w = w;
    if(typeof v !== 'undefined')
        returnValue.v = v;
    
    return returnValue;
}