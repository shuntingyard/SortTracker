/*
 * A object to manage UI state transitions
 */util
function State() {
    this.sval;
    this.rsel = document.getElementById('random-selector');
    this.pbtn = document.getElementById('populate-btn');
    this.rbtn = document.getElementById('reset-btn');
    this.asel = document.getElementById('algorithm-selector');
    this.sbtn = document.getElementById('sort-btn');
    this.cbtn = document.getElementById('cancel-btn');
        
    this.setInitial = function() {
        this.sval = 'initial';
        this.rsel.disabled = '';
        this.pbtn.disabled = '';
        this.rbtn.disabled = 'disabled';
        this.asel.disabled = 'disabled';
        this.sbtn.disabled = 'disabled';
        this.cbtn.disabled = 'disabled';
    }
    this.setPopulated = function() {
        this.sval = 'populated';
        this.rsel.disabled = 'disabled';
        this.pbtn.disabled = 'disabled';
        this.rbtn.disabled = '';
        this.asel.disabled = '';
        this.sbtn.disabled = '';
        this.cbtn.disabled = 'disabled';
    }
    this.setSorting = function() {
        this.sval = 'sorting';
        this.rsel.disabled = 'disabled';
        this.pbtn.disabled = 'disabled';
        this.rbtn.disabled = 'disabled';
        this.asel.disabled = 'disabled';
        this.sbtn.disabled = 'disabled';
        this.cbtn.disabled = '';
    }
    this.setSorted = function() {
        this.sval = 'sorted';
        this.rsel.disabled = 'disabled';
        this.pbtn.disabled = 'disabled';
        this.rbtn.disabled = '';
        this.asel.disabled = 'disabled';
        this.sbtn.disabled = 'disabled';
        this.cbtn.disabled = 'disabled';
    }
    this.setCanceled = function() {
        this.sval = 'canceled';
        this.rsel.disabled = 'disabled';
        this.pbtn.disabled = 'disabled';
        this.rbtn.disabled = '';
        this.asel.disabled = 'disabled';
        this.sbtn.disabled = 'disabled';
        this.cbtn.disabled = 'disabled';
    }
    this.isSorting = function() { return this.sval === 'sorting'; }
}

var time = {}; // namespace for stop watches

time.getLap = (function() {
    var before;
    return function() {
        var now = new Date().getTime();
        if (before === undefined) {
            before = now;
            return 500; // Return something not entirely out of the way.
        } else {
            var lap = now-before;
            before = now;
            return lap;
        }
    };
})();

time.getElapsed;

time.initElapsed = function() {
    var start = new Date().getTime();
    return function() {
        return new Date().getTime()-start;
    };
}

var random = {}; // namespace for a selection of random distributions

/*
 * param    mean
 * param    stddev
 * return   standard normal random value
 */
random.getMarsagliaPolar = (function() {
    // http://en.wikipedia.org/wiki/Marsaglia_polar_method
    var spare;var hasSpare = false;
    return function (mean, stddev) {
        if (hasSpare) {
            hasSpare = false;
            return spare*stddev+mean;
        } else {
            var u, v, s;
            do {
                u = Math.random()*2-1;
                v = Math.random()*2-1;
                s = u*u+v*v;
            } while (s >= 1 || s === 0);
            spare = v*Math.sqrt(-2.0*Math.log(s)/s);
            hasSpare = true;
            return  u*Math.sqrt(-2.0*Math.log(s)/s)*stddev+mean;
        }
    };
})();

random.getRandom = function(a, uplim) {
    for (var i=0; i < a.length; i++) {
        a[i] = ~~(Math.random()*uplim); // ~~ for integer
    }
    return a;
}

random.getGaussian = function(a, uplim) {
    var min = 0;var max = 0;
    var i;
    for (i=0; i < a.length; i++) {
        a[i] = random.getMarsagliaPolar(0, 1);
        min = (a[i] < min) ? a[i] : min;
        max = (a[i] > max) ? a[i] : max;
    }
    for (i=0; i < a.length; i++) {
        a[i] = ~~((a[i]-min)/(max-min+0.001)*uplim);
    }
    /*var b = a.slice(0);
    cmd.invokesort(algorithm.shellSort, b);
    alert(b);*/
    return a;
}

random.getNearOrdered = function(a, uplim) {
    function narrowToOrdered(n, i) {
        var WIDTH = 16;
        var r = ~~(WIDTH*n/uplim+i-WIDTH/2);
        if (r < 0) {
            return -r;
        } else if (r > uplim-1) {
            return 2*(uplim-1)-r;
        } else {
            return r;
        }
    }
    for (var i=0; i < a.length; i++) {
        a[i] = narrowToOrdered(~~(Math.random()*uplim), i);
    }
    return a;
}

random.getNearReverse = function(a, uplim) {
    function narrowToReverse(n, i) {
        var WIDTH = 16;
        var r = ~~(WIDTH*n/uplim+uplim-i-WIDTH/2);  // ~~ is not the same as
        if (r < 0) {                                // Math.floor (for
            return -r;                              // negative numbers).
        } else if (r > uplim-1) {
            return 2*(uplim-1)-r;
        } else {
            return r;
        }
    }
    for (var i=0; i < a.length; i++) {
        a[i] = narrowToReverse(~~(Math.random()*uplim), i);
    }
    return a;
}

random.getRandomlyOrdered = function(a, uplim) {
    // TODO Implement!
    return a;
}

// namespace  for invoking sort algorithms and queuing draw commands
var cmd = {};

cmd.invokesort = function(sortfunc, sortarray) {
    // handlers
    function exch(a, i, j) {
        cmdq.push(cmd.exchange(i, j, a[i], a[j]));
        var t=a[i];a[i]=a[j];a[j]=t;
    }
    
    function compexch(a, i, j) {
        if (a[j] < a[i]) exch(a, i, j); 
    }
    
    function copy(a, tx, sv) {
        cmdq.push(cmd.copy(tx, a[tx], sv));
        a[tx]=sv;
    }
    // end handlers
    var cmdq = [];
    var start = new Date().getTime();
    cmdq.unshift(cmd.sortHandlersArray(
            sortfunc(sortarray, 0, sortarray.length-1,
            exch, compexch, copy)));
    cmdq.unshift(cmd.sortElapsed(new Date().getTime()-start));
    return cmdq;
}

cmd.exchange = function(ix, jx, iy, jy) {
    return {"cmd": "exchange", "ix": ix, "jx": jx, "iy": iy, "jy": jy};
}

cmd.copy = function(tx, ty, sy) {
    return {"cmd": "copy", "tx": tx, "ty": ty, "sy": sy};
}

cmd.sortElapsed = function(milliseconds) {
    return {"cmd": "sortElapsed", "milliseconds": milliseconds};
}

cmd.sortHandlersArray = function(array) {
    return {"cmd": "sortHandlersArray", "handlers": array};
}
