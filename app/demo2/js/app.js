angular.module('demo-app', [])

.controller('Ctrl', function($scope, $element, $compile) {

  $scope.text = 'asfdasf'
})

.directive('slideItem', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'js/slideItem.template.html',
    compile: function(tEle, tAttrs, transcludeFn) {}
  }
})

.directive('slideBox', function($interval, $timeout) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      aniName: '=',
      aniDur: '=',
      showDur: '=',
    },
    templateUrl: 'js/slideBox.template.html',
    compile: function(tEle, tAttrs, transcludeFn) {
      return function(scope, element, attr) {
        var slideItems = element[0].querySelectorAll('.slide-item')
        var slideWrapper = element[0].querySelector('.slide-item-wrapper')
        var slideBox = element[0].querySelector('.slide-box')
        var ani = {
          leftToRight: function() {
            var _inter
            Array.prototype.forEach.call(slideItems, function(item, index, list) {
              item.style.left = index * slideBox.offsetWidth + 'px'
              console.dir(item)
              item.onmouseenter = function() {
                $interval.cancel(_inter)
              }
              item.onmouseleave = function() {
                _inter = inter()
              }
            })
            slideWrapper.style.transition = 'left ' + scope.aniDur + 's';
            var inter = function() {
              return $interval(function() {
                if (convertCSS(slideWrapper.style.left) === -slideBox.offsetWidth * (slideItems.length - 1)) {
                  Array.prototype.forEach.call(slideItems, function(item, index, list) {
                    if (index !== list.length - 1) {
                      item.style.left = (list.length + index) * slideBox.offsetWidth + 'px'
                    }
                  })
                }
                if (convertCSS(slideWrapper.style.left) === -slideBox.offsetWidth * slideItems.length) {
                  slideWrapper.style.transition = ''
                  slideWrapper.style.left = 0 + 'px'
                  Array.prototype.forEach.call(slideItems, function(item, index, list) {
                    item.style.left = index * slideBox.offsetWidth + 'px'
                  })
                }
                slideWrapper.style.transition = 'left ' + scope.aniDur + 's';
                slideWrapper.style.left = convertCSS(slideWrapper.style.left) - slideBox.offsetWidth + 'px'
              }, scope.showDur * 1000)
            }
            _inter = inter()
          }
        }
        ani.leftToRight()
      }
    },
  }
})

function convertCSS(pxNum) {
  if (pxNum === undefined || pxNum === '')
    return 0
  return parseFloat(pxNum)
}


function animate(item, css, target, dur, delay) {
  this.startNum = parseFloat(item[css])
  this.gap = (target - this.startNum) / dur / 60
  this.item = item
  this.dur = dur
  this.delay = delay
  this.target = target
  var that = this
  $timeout(function() {
    that.time = Date.now()
    var loop = function() {
      var t = Date.now() - that.time
      if (t >= that.dur * 1000) {
        if (typeof(that.item[css]) === 'string')
          that.item[css] = that.target + 'px'
        else
          that.item[css] = that.target
        cancelAnimationFrame(that.inter)
      } else {
        var end = t / (that.dur * 1000) * (that.target - that.startNum)
        if (typeof(that.item[css]) === 'string')
          that.item[css] = that.startNum + end + 'px'
        else
          that.item[css] = that.startNum + end
      }

      that.inter = requestAnimationFrame(loop)
    }
    loop()

  }, delay * 1000)
}