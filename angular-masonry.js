/*!
 * angular-masonry 0.1.3
 * Nageshwar Tiwari http://www.docplexus.in
 */
 (function() {
  "use strict";

  angular.module('angular-masonry', []).directive('dpMasonry', ["$timeout", "$rootScope", function($timeout, $rootScope) {
    if($rootScope.appValues.screenSize.label == 'mobile'){
      return {
        restrict: 'AC'
      }
    }
    return {
      restrict: 'AC',
      link: function(scope, elem, attrs) {
        scope.busyRendering = true;
        var container = elem[0];
        var destroyed = false;
        var options = {
          itemSelector: '.dp-masonry-item'
        };
        if(attrs.dpMasonry && attrs.dpMasonry!=""){
          options = angular.extend({}, options, angular.fromJson(attrs.dpMasonry));
        }
        var masonry = scope.masonry = new Masonry(container, options);
        var debounceTimeout = 0;
        scope.update = function($count) {
          var $vnt = $count;
          if (debounceTimeout) {
            $timeout.cancel(debounceTimeout);
          }
          debounceTimeout = $timeout(function() {
            if (destroyed) {
              return;
            }
            debounceTimeout = 0;
            masonry.layout();
            elem.children(options.itemSelector).css('visibility', 'visible');

            $timeout(function() {
              masonry.reloadItems();
              masonry.layout();
              scope.busyRendering = false;
            },300);
            imagesLoaded(container, function(){
            });

          });
        };

        scope.appendBricks = function(ele, $count) {
          var $vnt = $count;
          if (destroyed) {
            return;
          }
          $timeout(function() {
            masonry.appended(ele);
          }, 120);
        };

        scope.removeBrick = function() {
          if (destroyed) {
            return;
          }
          $timeout(function() {
            masonry.reloadItems();
            masonry.layout();
          }, 300);
        };

        scope.$on('masonry.layout', function() {
          masonry.layout();
        });

        scope.$on("$destroy", function handleDestroyEvent() {
            destroyed = true;
            masonry.destroy();
            elem.remove();
          }
        );
      }
    };
  }])
  .directive('dpMasonryTile', ["$rootScope", function($rootScope) {
    if($rootScope.appValues.screenSize.label == 'mobile'){
      return {
        restrict: 'AC'
      }
    }
    return {
      restrict: 'AC',
      link: function(scope, elem) {
        elem.css('visibility', 'hidden');
        var master = scope.$parent;
        master.busyRendering = true;
        var update = master.update;
        var removeBrick = master.removeBrick;
        var appendBricks = master.appendBricks;
        var elemm = elem.get(0);
        elem.ready(function(){
          appendBricks(elem, scope.$index);
          update(scope.$index);
        });
        scope.$on('$destroy', function() {
          removeBrick();
        });
      }
    };
  }]);
})();
