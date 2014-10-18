angular
  .module('bukiquotes', ['satellizer', 'posts-dir'])

    .config(function($authProvider) {
      $authProvider.facebook({
        clientId: '295545623927393',
        url: 'http://localhost:1337/auth/facebook'
      });
    })

  .controller('bukiCtrl', ['$scope', '$auth', '$http', function($scope, $auth, $http) {

      $scope.authenticate = function(provider) {
        $auth.authenticate(provider);
      };

      $scope.me = function() {
        $http.get('http://localhost:1337/api/me')
            .then(function(data) {
              console.log(data.data);
            });
      };

        $scope.logout = function() {
            $auth.logout();
        };

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
