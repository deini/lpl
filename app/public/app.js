angular
  .module('bukiquotes', [
    'ngRoute',
    'PostDirective',
    'API',
    'satellizer',
    'ngMaterial',
    'homeCtrl',
    'bukiService'
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

  .controller('bukiCtrl', function($scope, $auth, $http, $location, APIService, bukiService) {
    (function init() {
      APIService.isLoggedIn();
      APIService.getBukis().then(function(data) {
        bukiService.setBukis(data);
      }).catch(function(err) {
        console.log(err);
      });
    })();

    $scope.whichBuki = bukiService.getBuki();
    console.log('which', $scope.whichBuki)

    $scope.bukiService = bukiService;

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
      $location.path('/login');
    };

    $scope.isLogin = function() {
      return $location.path() === '/login';
    };

    $scope.me = function() {
      return $http.get('http://localhost:1337/api/me');
    };

    $scope.postQuote = function() {
      $scope.isPosting = !$scope.isPosting;
      // $http.post('http://localhost:1337/api/quotes', {
      //   text: 'Da dream',
      //   context: 'Dem context',
      //   author: 1
      // });
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
      },
      {
        username: 'without',
        quote: 'me caga bruno mars pero canta como doscientosunmil angeles y jesus es su padre'
      },
      {
        username: 'without',
        quote: 'me caga bruno mars pero canta como doscientosunmil angeles y jesus es su padre'
      },
      {
        username: 'without',
        quote: 'me caga bruno mars pero canta como doscientosunmil angeles y jesus es su padre'
      }
    ];

  });
