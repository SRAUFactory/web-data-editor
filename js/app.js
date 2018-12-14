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
           const maxLines = 100;
           $scope.show = false;
           $scope.fileType = "csv";
           $scope.lfCode = "lf";
           $scope.list = [];
           $scope.lines = [];
           for (var i = 1; i <= maxLines; i++) {
               $scope.lines[i] = i;
           }
           $scope.row = "1";
           $scope.col = "1";
           $scope.isModalShow = false;

           $scope.newFile = function() {
               if ($scope.isModalShow) return;
               $scope.file = null;
               var modalInstance = $uibModal.open({
                    templateUrl: "create-modal",
                    controller: 'ModalCtrl',
                    scope: $scope,
                    resolve: {
                        isNew: false,
                    },
                    backdrop: "static",
                    keyboard: false,
                });
                modalInstance.result.then(function() {
                    if (modalInstance.result.$$state.value) {
                        $scope.list = [];
                        for (var row = 0; row < modalInstance.result.$$state.value.row; ++row) {
                            $scope.list[row] = [];
                            for (var col = 0; col < modalInstance.result.$$state.value.col; col++) {
                                $scope.list[row][col] = "";
                            }
                        }
                        $scope.show = true;
                    }
                    $scope.isModalShow = false;
                }, function() {
                    $scope.isModalShow = false;
                });
                $scope.isModalShow = true;
           };

           $scope.openFile = function() {
               $scope.openFileModal(true, document.getElementById("openFile").innerHTML);
           };

           $scope.saveFile = function() {
               $scope.openFileModal(false, document.getElementById("saveFile").innerHTML);
           }

           $scope.clear = function() {
               window.location.reload();
           }

           $scope.openFileModal = function(isNew, title) {
               if ($scope.isModalShow) return;
               $scope.file = null;
               $scope.title = title;
               var modalInstance = $uibModal.open({
                   templateUrl: "file-modal",
                   controller: 'ModalCtrl',
                   scope: $scope,
                   resolve: {
                       isNew: isNew,
                   },
                   backdrop: "static",
                   keyboard: false,
               });

               modalInstance.result.then(function() {
                   $scope.isModalShow = false;
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
                   $scope.isModalShow = false;
               });
               $scope.isModalShow = true;
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
               if (link === null) {
                   link = document.createElement("a");
                   link.setAttribute("id", "download");
               }
               link.download = result.fileName;
               link.href = window.URL.createObjectURL(blob);
               link.click();
           };

           $scope.addRow = function(row, isEmpty) {
               let temp = [];
               $scope.list[0].forEach(function(rows, index) {
                   temp[index] = (isEmpty == true)? '' : rows;
               });
               $scope.list.splice(row, 0, temp);
           };

           $scope.delRow = function(row) {
               $scope.list.splice(row, 1);
           };

           $scope.autoRowNumber = function(row) {
               $scope.list[row].forEach(function(rows, index) {
                   $scope.list[row][index] = index + 1;
               });
           };

           $scope.addCol = function(col, isEmpty) {
               $scope.list.forEach(function(cols, index) {
                   var value = (isEmpty == true)? '' : cols[col];
                   cols.splice(col, 0, value);
               });
           };

           $scope.delCol = function(col) {
               $scope.list.forEach(function(cols, index) {
                   cols.splice(col, 1);
               });
           }

           $scope.autoColNumber = function(col) {
               $scope.list.forEach(function(cols, index) {
                   cols[col] = index + 1;
               });
           };

           $scope.getList = function(info) {
               let reader = new FileReader();
               $scope.list = [];
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

           $scope.create = function() {
               let result = {
                   row: $scope.row,
                   col: $scope.col,
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
