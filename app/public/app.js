angular
  .module('bukiquotes', [
    'ngRoute',
    'PostDirective',
    'API',
    'satellizer',
    'ngMaterial',
    'homeCtrl'
  ])

  .config(function($authProvider, $routeProvider, $locationProvider) {
    $authProvider.facebook({
      clientId: '295545623927393',
      url: 'http://localhost:1337/auth/facebook'
    });
    $routeProvider
      .when('/login', {
        templateUrl: 'login/login.tpl.html',
        controller: 'bukiCtrl'
      })
      .when('/home', {
        templateUrl: 'home/home.tpl.html',
        controller: 'homeCtrl'
      });
    // $locationProvider.html5Mode({
    //   enabled: true,
    //   requireBase: false
    // });
  })

  .controller('bukiCtrl', function($scope, $auth, $http, $location, APIService) {

    (function init () {
      $http.get('http://localhost:1337/api/me')
      .then(function(data) {
        if (data.status === 200) {
          console.log('logged in as duck', data.data);
          $location.path('/home');
        }
      })
      .catch(function(err) {
        console.log('err', err.data);
        $location.path('/login');
      });
    })();

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          $location.path('/home');
        })
        .catch(function() {
          $location.path('/login');
        });
    };

    $scope.logout = function() {
      $auth.logout();
    };

    $scope.me = function() {
      return $http.get('http://localhost:1337/api/me');
    };

    $scope.postQuote = function() {
      $http.post('http://localhost:1337/api/quotes', {
        text: 'Da dream',
        context: 'Dem context',
        author: 1
      });
    };

    console.log($auth.isAuthenticated('facebook'));

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

  });
