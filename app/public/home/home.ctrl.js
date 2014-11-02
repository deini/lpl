angular
  .module('homeCtrl', ['API'])
  .controller('homeCtrl', function(APIService) {
    APIService.isLoggedIn();
    console.log('LOGGED IN AS DACK')
  });
