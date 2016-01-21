// public/core.js
var scotchGratitude = angular.module('scotchGratitude', []);

function mainController($scope, $http) {
  $scope.formData = {};

  // when landing on the page, get all gratitudes and show them
  $http.get('/api/gratitudes')
    .success(function(data) {
      $scope.gratitudes = data;
      console.log(data);

    })
    .error(function(data) {
      console.log('Error: ' + data);

    });

  // when submitting the add form, send the text to the node API
  $scope.createGratitude = function() {
    $http.post('/api/gratitudes', $scope.formData)
      .success(function(data) {
        $scope.formData = {}; // clear the form so our user is ready to enter another
        $scope.gratitudes = data;
        console.log(data);

      })
      .error(function(data) {
        console.log('Error: ' + data);

      });

  };

  // delete a gratitude after checking it
  $scope.deleteGratitude = function(id) {
    $http.delete('/api/gratitudes/' + id)
      .success(function(data) {
        $scope.gratitudes = data;
        console.log(data);

      })
      .error(function(data) {
        console.log('Error: ' + data);

      });

  };


}
