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
      itemDur: '=',
    },
    templateUrl: 'js/slideBox.template.html',
    compile: function(tEle, tAttrs, transcludeFn) {
      return function(scope, element, attr) {
        var slideItems = element[0].querySelectorAll('.slide-item')
        var slideBox = element[0].querySelector('.slide-box')
        var ani = {
          leftToRight: function() {
            // for (var i = 0; i < slideItems.length; i++) {
            //   slideItems[i].style.left = i * slideBox.offsetWidth + 'px'
            // }
            for (var i = 0; i < slideItems.length; i++) {
              slideItems[i].style.left = 0

            }
            new animate(slideItems[0].style, 'left', -slideBox.offsetWidth, 2, 2)
            slideItems[1].style.left = slideBox.offsetWidth + 'px'
            new animate(slideItems[1].style, 'left', 0, 2, 2)

          }
        }
        ani.leftToRight()

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
      }
    },
  }
})

.directive('showLength', function() {
  return {
    transclude: true,
    restrict: 'A',
    template: '<div><span>{{ textLength }}</span><div ng-transclude></div></div>',
    compile: function(tEle, tAttrs, transcludeFn) {
      return function(scope, element, attrs) {
        var node = transcludeFn(scope)
        scope.$watch('text', function() {
          scope.textLength = node.text().length
        })
      }
    }
  }
})