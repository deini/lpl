angular
  .module('API', ['Constants', 'bukiService'])
  .factory('APIService', function($q, $http, $location, UrlService, bukiService) {
    var service;

    service = {
      getQuotes: getQuotes,
      getBukis: getBukis,
      isLoggedIn: isLoggedIn
    };

    return service;

    function getQuotes() {
      return genericGet(UrlService.getQuotes);
    }

    function getBukis() {
      return genericGet(UrlService.getBukis);
    }

    function isLoggedIn() {
      $http.get(UrlService.me)
        .then(function(data) {
          if (data.status === 200) {
            console.log('logged in as duck', data.data);
            bukiService.setBuki(data.data);
            $location.path('/home');
            console.log(bukiService.getBuki())
          }
        })
        .catch(function(err) {
          console.log('err', err.data);
          $location.path('/login');
        });
    }

    // Helper
    function genericGet(url) {
      var deferred;

      deferred = $q.defer();
      $http.get(url).then(function(data) {
        deferred.resolve(data.data);
      });

      return deferred.promise;
    }
  });
