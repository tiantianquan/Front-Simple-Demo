angular.module('demo-app', [])

.controller('Ctrl', function($scope) {
  $scope.init = function() {
    $scope.targetDate = new Date('2014-12-20 23:29:00')

    $scope.targetDateChanged = function() {
      $scope.$broadcast('countDown.targetDateChanged')
    }
  }
})

.directive('countDown', function($interval, $timeout, Util, Animate) {
  return {
    restrict: 'E',
    scope: {
      targetDate: '=',
      animationName: '@',
      circleRadii:'='
    },
    templateUrl: 'js/count-down.template.html',
    link: function(scope, element, attr) {
      var time, inter, arcUnit
      scope.showAnimate = false
      scope.countTime = {}
        //-------------------------------------
      scope.$on('countDown.targetDateChanged', function() {
        $timeout(function() {
          go()
        }, 0)
      })

      if (scope.animationName === 'CountDownCircle') {
        arcUnit = initAnimate()
      }
      go()

      //-----------------------------------------
      function go() {
        $interval.cancel(inter)

        time = Math.round((scope.targetDate - Date.now()) / 1000)
        if (time > 0) {
          scope.countTime = Util.convertTime(time)

          inter = $interval(function() {
            if (time > 0) {
              time--
              scope.countTime = Util.convertTime(time)
            } else {
              $interval.cancel(inter)
            }
          }, 1000)

        } else {
          scope.countTime = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          }
        }
      }

      function initAnimate() {
        scope.showAnimate = true
        var c = element[0].querySelector('#count-down-canvas')
        var ctx = c.getContext('2d')

        //计算尺寸
        var timeW = element[0].querySelector('.time').offsetWidth
        var timeH = element[0].querySelector('.time').offsetHeight
        var cw = c.width = element[0].querySelector('.count-down').offsetWidth
          // var ch = c.height = element[0].querySelector('.count-down').offsetHeight * 2
        var radii = scope.circleRadii || 60
        var lineWidth = 4
        var ch = c.height = (radii+lineWidth) * 2 
        Util.hackHighDpi(c, ctx)

        var arcUnit = Animate.CountDownCircle({
          lineWidth: lineWidth,
          strokeStyle: 'hsla(200,20%,75%,1)',
          ctx: ctx,
          c: c,
          radii: radii
        })

        var j = 0
        for (var i in arcUnit.arcs) {
          var startPos = (cw - timeW * 4) / 2 + timeW / 2
          var dataRange
          switch (i) {
            case 'days':
              dataRange = 1
              break
            case 'hours':
              dataRange = 24
              break
            default:
              dataRange = 60
              break
          }
          arcUnit.arcs[i].init({
            dataRange: dataRange,
            cx: startPos + j * timeW,
            cy: ch / 2
          })
          j++
        }

        arcUnit.drew()
        scope.$watch('countTime', function() {
          arcUnit.update(scope.countTime)
            // arcUnit.update({
            //   days: 365,
            //   hours: 24,
            //   minutes: 60,
            //   seconds: 60
            // })

        })
        return arcUnit
      }

    }
  }
})

.factory('Util', function() {
  return {
    convertTime: function(time, mil) {
      if (mil === true)
        time = parseInt(time / 1000)

      var countTime = {}
      countTime.days = Math.floor(time / (24 * 60 * 60))
      time -= countTime.days * 24 * 60 * 60
      countTime.hours = Math.floor(time / (60 * 60))
      time -= countTime.hours * 60 * 60
      countTime.minutes = Math.floor(time / 60)
      time -= countTime.minutes * 60
      countTime.seconds = time

      return countTime
    },
    hackHighDpi: function(canvas, ctx) {
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

  }
})

.factory('Animate', function() {
  return {
    CountDownCircle: function(option) {
      var Arc = function(opt) {
        this.init(opt)
      }
      Arc.prototype.init = function(opt) {
        var opt = opt || {}
          //圆心
        this.cx = opt.cx || this.cx
        this.cy = opt.cy || this.cy
          //半径
        this.radii = opt.radii || this.radii
          //线段宽度
        this.lineWidth = opt.lineWidth || this.lineWidth
          //style
        this.strokeStyle = opt.strokeStyle || this.strokeStyle
          //数据
        this.dataRange = opt.dataRange || this.dataRange
        this.data = opt.data || this.data || 0
          //画布
        this.c = opt.c || this.c
        this.ctx = opt.ctx || this.ctx || this.c.getContext('2d')
      }
      Arc.prototype.update = function(data) {
        this.data = data
      }
      Arc.prototype.getEndAngle = function() {
        if (this.dataRange === 0)
          return
        return this.data / this.dataRange * 2 * Math.PI
      }
      Arc.prototype.drew = function() {
        var ctx = this.ctx
        ctx.beginPath()
        ctx.arc(
          this.cx,
          this.cy,
          this.radii, -Math.PI / 2,
          this.getEndAngle() - Math.PI / 2
        )

        ctx.strokeStyle = this.strokeStyle
        ctx.lineWidth = this.lineWidth
        ctx.stroke()
      }


      var ArcUnit = function(opt) {
        var opt = opt || {}
          //画布
        this.c = opt.c
        this.ctx = opt.ctx || this.c.getContext('2d')
        this.note = opt.note || ['days', 'hours', 'minutes', 'seconds']
          //集合
        this.arcs = {}
        for (var i = 0; i < this.note.length; i++) {
          this.arcs[this.note[i]] = new Arc({
            c: this.c,
            ctx: this.ctx,
            lineWidth: opt.lineWidth,
            strokeStyle: opt.strokeStyle,
            radii: opt.radii,
          })
        }
      }

      ArcUnit.prototype.update = function(countTime) {
        for (var i in countTime) {
          this.arcs[i].update(countTime[i])
        }
        this.ctx.clearRect(0, 0, this.c.width, this.c.height)
        this.drew()
      }

      ArcUnit.prototype.drew = function() {
        for (var i in this.arcs) {
          this.arcs[i].drew()
        }
      }
      return new ArcUnit(option)
    }
  }
})