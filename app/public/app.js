angular
  .module('bukiquotes', ['PostDirective', 'API'])
  .controller('bukiCtrl', ['$scope', 'APIService', function($scope, APIService){

    $scope.posts = [
      {
        username: 'drinki',
        quote: 'estaria cool que le supieras a la vida',
        desc: 'dicho a wo despues de opinar acerca de x'
      },
      {
        username: 'without',
        quote: 'me caga bruno mars pero canta como doscientosunmil angeles y jesus es su padre'
      }
    ];

  }]);