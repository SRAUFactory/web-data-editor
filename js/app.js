angular.module('WebDataEditor', []).controller('EditorController', function($scope) {
           $scope.addRowCol = function() {
           };

           $scope.download = function() {
               console.log("WebDataEditor.download");
           };

           $scope.$watch("file", function(file) {
               if(!file || (!file.type.match('text/csv') && !file.type.match('text/tab-separated-values'))) {
                   return;
               }
               console.log(file);
               var reader = new FileReader();
               reader.onload = function() {
                   $scope.$apply(function() {
                       console.log(reader.result);
                   });
               };
               reader.readAsText(file);
           });
       }).directive('fileModel', function($parse) {
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
