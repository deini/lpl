angular
  .module('Url', [])
  .factory('UrlService', [function() {
    var service;

    service = {
      getQuotes: 'http://bukiserver.com/api/getquotes'
    };

    return service;
  }]);