/*
 * The bare minimum for auxiliary pages
 */

// proper resizing
window.onresize = function() {
    document.getElementById('animation').style.height =
            window.innerHeight
            -document.getElementById('hdr').offsetHeight
            -document.getElementById('ftr').offsetHeight + 'px';
}

function back() {
    window.history.back();
}