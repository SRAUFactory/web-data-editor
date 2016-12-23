angular.module('WebDataEditor', [])
       .controller('EditorController', function($scope) {
           $scope.upload = function() {
               console.log("WebDataEditor.upload");
           };

           $scope.addRowCol = function() {
           };

           $scope.download = function() {
               console.log("WebDataEditor.download");
           }
       });
