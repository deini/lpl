angular
  .module('submitCtrl', ['ngMaterial'])
  .controller('submitCtrl', function($scope, $mdDialog) {
    $scope.openDialog = function($event) {
      $mdDialog.show({
        targetEvent: $event,
        controller: 'DialogController',
        template: 
          '<md-dialog>' +
          '  <md-content>Hello!</md-content>' +
          '  <div class="md-actions">' +
          '    <md-button ng-click="closeDialog()">' +
          '      Close' +
          '    </md-button>' +
          '  </div>' +
          '</md-dialog>'
      });
    };
  })
  .controller('DialogController', function($scope, $mdDialog) {
    $scope.closeDialog = function() {
      $mdDialog.hide();
    };
  });