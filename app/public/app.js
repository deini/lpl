

// app.config(function ($routeProvider) {
//   $routeProvider.when('/', {
//     templateUrl: 
//   })
// })



angular
  .module('bukiquotes', [])
  .controller('$scope', ['$scope', function($scope){

    testJSON = [
      {
        user: 'drinki',
        quote: 'estaria cool que le supieras a la vida',
        description: 'dicho a wo despues de opinar acerca de x'
      },
      {
        user: 'without',
        quote: 'me caga bruno mars pero canta como doscientosunmil angeles y jesus es su padre'
      }
    ];
    
  }]);