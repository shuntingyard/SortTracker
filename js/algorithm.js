/* 
 * A collection of sort algorithms
 */

var algorithm = {}; // namespace

algorithm.selectionSort = function(a, l, r, exch) {
    for (var i=l; i < r; i++) {
        var min=i;
        for (var j=i+1; j <= r; j++) if (a[j] < a[min]) min=j;
        exch(a, i, min);
    }
    // Return a string representation of handlers used.
    return [ 'exchange' ];
}

algorithm.insertionSort = function(a, l, r, exch, compexch) {
    for (var i=l+1; i <= r; i++) {
        for (var j=i; j > l; j--) {
            compexch(a, j-1, j);
        }
    }
    return [ 'exchange' ];
}

algorithm.insertionSortBetter = function(a, l, r, exch, compexch, copy) {
    var i;
    for (i=r; i > l; i--) compexch(a, i-1, i);
    for (i=l+2; i <= r; i++) {
        var j=i; var v=a[i];
        while (v < a[j-1]) {
            copy(a, j, a[j-1]); j--;
        }
        copy(a, j, v);
    }
    return [ 'exchange', 'copy' ];
}

algorithm.bubbleSort = function(a, l, r, exch, compexch) {
    for (var i=l; i < r; i++) {
        for (var j=r; j > i; j--) compexch(a, j-1, j);
    }
    return [ 'exchange' ];
}

algorithm.shellSort = function(a, l, r, exch, compexch, copy) {
    var h; // Double bitwise ~~ results in integer arithmetics.
    for (h=1; h <= ~~((r-l)/9); h=~~(3*h+1));
    for (; h > 0; h=~~(h/3)) {
        for (var i=l+h; i <= r; i++) {
            var j=i; var v=a[i];
            while (j >= l+h && v < a[j-h]) {
                copy(a, j, a[j-h]); j-=h;
            }
            copy(a, j, v);
        }
    }
    return [ 'copy' ];
}

algorithm.quickSort = function(a, l, r, exch) {
    function partition(a, l, r) {
        var i = l-1; var j = r;
        var v = a[r];
        for ( ;; ) {
            while (a[++i] < v);
            while (v < a[--j]) if (j === l) break;
            if (i >= j) break;
            exch(a, i, j);
        }
        exch(a, i, r);
        return i;
    }
    if (r <= l) return [ 'exchange' ];
    var k = partition(a, l, r);
    algorithm.quickSort(a, l, k-1, exch);
    algorithm.quickSort(a, k+1, r, exch);
    return [ 'exchange' ];
}
