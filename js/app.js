'use strict';
angular.module('WebDataEditor', ['ui.bootstrap']).controller('EditorController', ['$scope', '$uibModal', function($scope, $uibModal) {
           $scope.columnSeparetor = {
               csv : ',',
               tsv : '\t'
           };
           $scope.lfCodeList = {
               crlf : "\r\n",
               lf   : "\n",
               cr   : "\r"
           }
           $scope.show = false;
           $scope.fileType = "csv";
           $scope.lfCode = "lf";
           $scope.list = [];

           $scope.openFile = function() {
               $scope.openFileModal(true);
           };

           $scope.saveFile = function() {
               $scope.openFileModal(false);
           }

           $scope.openFileModal = function(isNew) {
               $scope.file = null;
               var modalInstance = $uibModal.open({
                   templateUrl: "file-modal",
                   controller: 'ModalCtrl',
                   scope: $scope,
                   resolve: {
                       isNew: isNew 
                   }
               });

               modalInstance.result.then(function() {
                   if (!modalInstance.result.$$state.value) {
                       return;
                   }
                   if (typeof modalInstance.result.$$state.value.file !== "undefined") {
                       $scope.getList(modalInstance.result.$$state.value);
                   }
                   if (typeof modalInstance.result.$$state.value.fileName !== "undefined") {
                       $scope.download(modalInstance.result.$$state.value);
                   }
               }, function() {
               });
           };

           $scope.download = function(result) {
               let temp = [];
               let separator = $scope.columnSeparetor[result.fileType];
               let lfCode = $scope.lfCodeList[result.lfCode];
               $scope.list.forEach(function(cols, index) {
                   temp[index] = cols.join(separator);
               });
               let contents = temp.join(lfCode);
               let bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
               let blob = new Blob([bom, contents], { type: "text/plain" });
               let link = document.getElementById("download");
               link.download = result.fileName;
               link.href = window.URL.createObjectURL(blob);
           };

           $scope.addRow = function(row) {
               let temp = [];
               $scope.list[0].forEach(function(rows, index) {
                   temp[index] = '';
               });
               $scope.list.splice(row, 0, temp);
           };

           $scope.delRow = function(row) {
               $scope.list.splice(row, 1);
           };

           $scope.addCol = function(col) {
               $scope.list.forEach(function(cols, index) {
                   cols.splice(col, 0, '');
               });
           };

           $scope.delCol = function(col) {
               $scope.list.forEach(function(cols, index) {
                   cols.splice(col, 1);
               });
           }

           $scope.getList = function(info) {
               let reader = new FileReader();
               reader.onload = function() {
                   $scope.$apply(function(){
                       let separator = $scope.columnSeparetor[$scope.fileType];
                       let lfCode = $scope.lfCodeList[$scope.lfCode];
                       let temp = reader.result.split(lfCode);
                       temp.forEach(function(row, index) {
                           let rows = row.split(separator);
                           $scope.list[index] = rows;
                       });
                       if ($scope.list[0].length !== $scope.list[$scope.list.length -1].length) {
                           $scope.list.pop();
                       }
                       $scope.show = ($scope.list.length > 0)? true : false;
                   }); 
               };
               $scope.file = info.file;
               $scope.fileName = info.file.name;
               $scope.fileType = info.fileType;
               $scope.lfCode = info.lfCode;
               reader.readAsText(info.file);
           }
       }]).controller('ModalCtrl', ['$scope', '$uibModalInstance', 'isNew', function($scope, $uibModalInstance, isNew) {
           $scope.isNew = isNew;

           $scope.$watch("file", function(file) {
               if(!file || (!file.type.match('text/csv') && !file.type.match('text/tab-separated-values'))) {
                   return;
               }
               let result = {
                   file: file,
                   lfCode: $scope.lfCode,
                   fileType: $scope.fileType,
               };
               $uibModalInstance.close(result);
           });

           $scope.close = function() {
               $uibModalInstance.close();
           };

           $scope.save = function() {
               let result = {
                   fileName: $scope.fileName,
                   lfCode: $scope.lfCode,
                   fileType: $scope.fileType,
               };
               $uibModalInstance.close(result);
           };
       }]).directive('fileModel', function($parse) {
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
