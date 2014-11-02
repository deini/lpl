angular
  .module('API', ['Constants'])
  .factory('APIService', function($q, $http, UrlService) {
    var service;

    service = {
      getQuotes: getQuotes
    };

    return service;

    function getQuotes () {
      var deferred;

      deferred = $q.defer();
      $http.get(UrlService.getQuotes).then(function(data) {
        deferred.resolve(data.data);
      });

      return deferred.promise;
    }
  });
