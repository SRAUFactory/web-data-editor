angular.module('WebDataEditor', []).controller('EditorController', function($scope) {
           $scope.upload = function() {
               console.log("WebDataEditor.upload1234");
               console.log($scope.file);
           };

           $scope.addRowCol = function() {
           };

           $scope.download = function() {
               console.log("WebDataEditor.download");
           }
       }).directive('fileModel',function($parse) {
           return{
               restrict: 'A',
               link: function(scope,element,attrs) {
                   var model = $parse(attrs.fileModel);
                   element.bind('change',function() {
                       scope.$apply(function() {

                           model.assign(scope,element[0].files[0]);
                       });
                   });
               }
           };
       });
