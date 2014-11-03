angular
  .module('bukiService', [])
  .factory('bukiService', function() {
    var bukis,
      buki,
      service;

    bukis = [];
    service = {
      getBukis: getBukis,
      setBukis: setBukis,
      getBuki: getBuki,
      setBuki: setBuki
    };

    return service;

    function setBukis(value) {
      bukis = value;
    }

    function getBukis() {
      return bukis;
    }

    function setBuki(value) {
      buki = value;
    }

    function getBuki() {
      return buki;
    }

  });