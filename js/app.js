'use strict';
angular.module('WebDataEditor', []).controller('EditorController', function($scope) {
           var columnSeparetor = {
               csv : ',',
               tsv : '\t'
           };
           var lfCodeList = {
               crlf : "\r\n",
               lf   : "\n",
               cr   : "\r"
           }
           $scope.list = [];
           $scope.show = false;

           $scope.download = function() {
               console.log("WebDataEditor.download");
           };

           $scope.$watch("file", function(file) {
               if(!file || (!file.type.match('text/csv') && !file.type.match('text/tab-separated-values'))) {
                   return;
               }
               var reader = new FileReader();
               reader.onload = function() {
                   $scope.$apply(function(){
                       var separator = columnSeparetor[$scope.fileType];
                       var lfCode = lfCodeList[$scope.lfCode];
                       var temp = reader.result.split(lfCode);
                       temp.forEach(function(row, index) {
                           var rows = row.split(separator);
                           $scope.list[index] = rows;
                       });
                       $scope.list.pop();
                       $scope.show = ($scope.list.length > 0)? true : false;
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
