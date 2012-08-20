/* 
 * Manage UI with populating, sorting and animation.
 */

// UI state instance
var state = new State();

// variables for animation speed
var fps;

// constants and variables for drawing
var W = 120; var H = 120; var S = 2;
var ctx = document.getElementById('canvas').getContext('2d');
reset();

// array to work on
var rand = [];

// a queue for sort to push and UI to shift
var cmdq = [];

// proper resizing
window.onresize = function() {
    document.getElementById('animation').style.height =
            window.innerHeight
            -document.getElementById('H').offsetHeight
            -document.getElementById('F').offsetHeight + 'px';
}

// respond to UI input from here on
function statusToTop() {
    document.getElementById('status').style.zIndex=1;
    document.getElementById('canvas').style.zIndex=0;
}

function canvasToTop() {
    document.getElementById('canvas').style.zIndex=1;
    document.getElementById('status').style.zIndex=0;
}

function changeFrameRate() {
    if (fps !== undefined) {
        clearInterval(fps);
        fps = setInterval(
                function(){drawCanvas()},
                document.getElementById('fps-selector').value);
    }
}

function drawCanvas() {
    if (cmdq.length === 0) {
        if (state.isSorting()) state.setSorted();
        clearInterval(fps);
        return;
    }
    var msg = cmdq.shift();
    switch(msg.cmd) {
        case 'exchange':
            ctx.clearRect(msg.ix*S, -S+(H-msg.iy)*S, S, S);
            ctx.clearRect(msg.jx*S, -S+(H-msg.jy)*S, S, S);
            ctx.fillRect(msg.ix*S, -S+(H-msg.jy)*S, S, S);
            ctx.fillRect(msg.jx*S, -S+(H-msg.iy)*S, S, S);
            document.getElementById('queued-ops').innerHTML = cmdq.length;
            break;
        case 'copy':
            ctx.clearRect(msg.tx*S, -S+(H-msg.ty)*S, S, S);
            ctx.fillRect(msg.tx*S, -S+(H-msg.sy)*S, S, S);
            document.getElementById('queued-ops').innerHTML = cmdq.length;
            break;
        case 'sortElapsed':
            document.getElementById('sort-elapsed').innerHTML =
                    msg.milliseconds/1000 + 's';
            break;
        case 'sortHandlersArray':
            document.getElementById('sort-handlers').innerHTML = msg.handlers;
            break;
        default:
            //alert("Command '" + msg.cmd + "' not recognized");
    }
    document.getElementById('fps-achieved').innerHTML =
            Math.round(1000/time.getLap());
    var d = new Date(time.getElapsed());
    document.getElementById('anim-elapsed').innerHTML =
            lpad(d.getMinutes()) + ':' + lpad(d.getSeconds());
}

function lpad(n) {
    return (n > 9) ? n : '0' + n;
}

function populate() {
    state.setPopulated();
    rand = window['random'][document.getElementById('random-selector').value](
            new Array(W), H);
    canvasToTop();
    ctx.fillStyle = "black";
    for (var i=0; i < rand.length; i++) {
        ctx.fillRect(i*S, -S+(H-rand[i])*S, S, S);
    }
}

function reset() {
    state.setInitial();
    rand = [];
    cmdq = [];
    ctx.clearRect(0, 0, W*S, H*S);
    ctx.fillStyle = "silver";
    ctx.fillRect(0, 0, W*S, H*S);
    document.getElementById('sort-handlers').innerHTML = 'na';
    document.getElementById('queued-ops').innerHTML = rand.length;
    document.getElementById('sort-elapsed').innerHTML = '0s';
    document.getElementById('anim-elapsed').innerHTML = '00:00';
    document.getElementById('fps-achieved').innerHTML = 'na';
}

function sort() {
    state.setSorting();
    cmdq = cmd.invokesort(
            window['algorithm'][document.getElementById('algorithm-selector').value],
            rand);
    ctx.fillStyle = "red";
    fps = setInterval(
            function(){drawCanvas()},
            document.getElementById('fps-selector').value);
    time.getElapsed = time.initElapsed();
}

function cancel() {
    state.setCanceled();
    clearInterval(fps);
}
