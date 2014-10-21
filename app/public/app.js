angular
  .module('bukiquotes', [
    'PostDirective',
    'API',
    'satellizer'
  ])

  .config(function($authProvider) {
    $authProvider.facebook({
      clientId: '295545623927393',
      url: 'http://localhost:1337/auth/facebook'
    });
  })

  .controller('bukiCtrl', ['$scope', '$auth', '$http', 'APIService', function($scope, $auth, $http, APIService) {

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider);
    };

    $scope.logout = function() {
      $auth.logout();
    };

    $scope.me = function() {
      $http.get('http://localhost:1337/api/me')
        .then(function(data) {
          console.log(data.data);
        })
        .catch(function(err) {
          console.log(err.data);
        })
    };

    console.log($auth.isAuthenticated());

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
