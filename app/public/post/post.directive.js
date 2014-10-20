angular
  .module('PostDirective', [])
  .directive('bukiQuote', function () {
    return {
      restrict: 'E', 
      scope: {
        post: '='
      },
      templateUrl: 'post/post.tpl.html',

      link: function ($scope) {

      }
    };
  });