'use strict';
angular.module('WebDataEditor', []).controller('EditorController', function($scope) {
           const columnSeparetor = {
               csv : ',',
               tsv : '\t'
           };
           const lfCodeList = {
               crlf : "\r\n",
               lf   : "\n",
               cr   : "\r"
           }
           $scope.list = [];
           $scope.show = false;
           $scope.fileType = "csv";
           $scope.lfCode = "lf";

           $scope.download = function() {
               console.log("WebDataEditor.download");
               console.log($scope);
           };

           $scope.addRow = function(row) {
               let temp = [];
               $scope.list[0].forEach(function(row, index) {
                   temp[index] = '';
               });
               $scope.list.splice(row, 0, temp);
           };

           $scope.$watch("file", function(file) {
               if(!file || (!file.type.match('text/csv') && !file.type.match('text/tab-separated-values'))) {
                   return;
               }
               let reader = new FileReader();
               reader.onload = function() {
                   $scope.$apply(function(){
                       let separator = columnSeparetor[$scope.fileType];
                       let lfCode = lfCodeList[$scope.lfCode];
                       let temp = reader.result.split(lfCode);
                       temp.forEach(function(row, index) {
                           let rows = row.split(separator);
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
                   let model = $parse(attrs.fileModel);
                   element.bind('change',function() {
                       scope.$apply(function() {
                           model.assign(scope,element[0].files[0]);
                       });
                   });
               }
           };
       });
