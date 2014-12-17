angular.module('demo-app', [])

.controller('Ctrl', function($scope) {
  $scope.init = function() {
    // $scope.targetDate = new Date('2014-12-18 23:29:0')

    $scope.targetDateChanged = function() {
      $scope.$broadcast('countDown.targetDateChanged')
    }
  }
})

.directive('countDown', function($interval, $timeout, $rootScope) {
  return {
    restrict: 'E',
    scope: {
      targetDate: '='
    },
    templateUrl: 'js/count-down.template.html',
    link: function(scope, element, attr) {
      var time, inter

      scope.$on('countDown.targetDateChanged', function() {
        $timeout(function() {
          go()
        }, 0)
      })

      go()

      function go() {
        console.log(scope)
        $interval.cancel(inter)

        time = Math.round((scope.targetDate - Date.now()) / 1000)
        if (time > 0) {
          scope.countTime = convertTime(time)

        } else {
          scope.countTime = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          }
        }

        inter = $interval(function() {
          if (time > 0) {
            time--
            scope.countTime = convertTime(time)
          } else {
            $interval.cancel(inter)
          }
        }, 1000)
      }

    },
  }
})

function convertTime(time, mil) {
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
}