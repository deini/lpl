angular
  .module('Constants', [])
  .factory('UrlService', [function() {
    var baseUrl = 'http://localhost:1337/api',
        service;

    service = {
      getQuotes: baseUrl + '/quotes',
      getBukis: baseUrl + '/users',
      me: baseUrl + '/me'
    };

    return service;
  }]);
