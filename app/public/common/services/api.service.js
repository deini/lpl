angular
  .module('API', ['Constants'])
  .factory('APIService', function($q, $http, $location, UrlService) {
    var service;

    service = {
      getQuotes: getQuotes,
      isLoggedIn: isLoggedIn
    };

    return service;

    function getQuotes() {
      var deferred;

      deferred = $q.defer();
      $http.get(UrlService.getQuotes).then(function(data) {
        deferred.resolve(data.data);
      });

      return deferred.promise;
    }

    function isLoggedIn() {
      $http.get(UrlService.me)
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
    }
  });
