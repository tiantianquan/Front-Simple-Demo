var util = {}

util.hackHighDpi = function(canvas, ctx) {
  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStorePixelRatio = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;

  var ratio = devicePixelRatio / backingStorePixelRatio;

  if (devicePixelRatio !== backingStorePixelRatio) {
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;

    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;

    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';

    ctx.scale(ratio, ratio);
  }
}

util.loop = function(callback) {
  callback()
  requestAnimationFrame(function() {
    util.loop(callback)
  })
}

util.copyArray = function(arr) {
  var copy = []
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].length !== undefined && typeof(arr[i]) === 'object') {
      copy[i] = this.copyArray(arr[i])
    } else {
      copy[i] = arr[i]
    }
  }
  return copy
}