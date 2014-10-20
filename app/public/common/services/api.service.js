angular
  .module('API', ['Constants'])
  .factory('APIService', ['$q', '$http', 'UrlService', function($q, $http, UrlService) {
    var service;

    service = {
      getQuotes: getQuotes
    };

    return service;

    function getQuotes () {
      var deferred;

      deferred = $q.defer();
      $http.get(UrlService.getQuotes).then(function(data) {
        deferred.resolve(data);
      });

      return deferred.promise;
    }
  }]);