angular
  .module('Constants', [])
  .factory('UrlService', [function() {
    var baseUrl = 'http://localhost:1337/api',
        service;

    service = {
      getQuotes: baseUrl + '/quotes'
    };

    return service;
  }]);
