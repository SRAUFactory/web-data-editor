<?php
require('WDEConst.php');
require('WDEView.php');
/**
 * web-data-editorのController
 */
class WDEController {
    /**
     * インデックス
     */
    public function index() {
        $values = ["fileType" => WDEConst::FILE_TYPE_CSV , "lfCode" => WDEConst::LF_CODE_LF, "data" => []];
        return $this->renderIndexView($values);
    }

    /**
     * ファイルダウンロード処理
     * @return array "header" => ヘッダー情報一覧 "body" => レスポンスボディ
     */
    public function download() {
	$values = $_POST;
	$result = [
            "header" => [
                'Content-Type: text/'. $values["fileType"],
                'Content-disposition: attachment; filename="'.$values["fileName"]. "." . $values["fileType"]. '"',
            ],
            "body" => "",
        ];
        foreach ($values["data"] as $row => $rowData) {
            $result["body"] .= implode(WDEConst::$COLUMNS_SEPARETOR[$values["fileType"]], $rowData) . "\n";
	}
        return $result;
    }

   /**
    * 行/列追加処理
    */
   public function addRowCol() {
       $values = $_POST;
       $tempTsvData = $values["data"];
       $addRow = 0;
       foreach ($tempTsvData as $row => $rowData) {
           if (isset($values["addRow"][$row][0])) {
               $addRow++;
               $addRowData = [];
               foreach ($rowData as $col => $rowValue) {
                   $addRowData[] = "";
               }
               $values["data"][$row] = $addRowData;
           }
           $addCol = 0;
           foreach ($rowData as $col => $rowValue) {
               if (isset($values["addCol"][0][$col])) {
                   $values["data"][$row + $addRow][$col] = "";
                   $addCol++;
               }
               $values["data"][$row + $addRow][$col + $addCol] = $rowValue;
	   }
       }
       return $this->renderIndexView($values);
   }

   /**
    * ファイルアップロード処理
    */
   public function upload() {
       $values = $_POST;
       $values["fileName"] = str_replace("." . $values["fileType"], "", $_FILES["uploadFile"]["name"]);
       $values["data"] = [];
       $tsvFileData = file_get_contents($_FILES["uploadFile"]["tmp_name"]);
       $tempTsvData = explode("\n", $tsvFileData);
       $separater = WDEConst::$COLUMNS_SEPARETOR[$values["fileType"]];
       foreach ($tempTsvData as $row => $rowData) {
           $rowValues = explode($separater, $rowData);
           if (count($rowValues) <= 1) {
               continue;
           }
           $values["data"][] = $rowValues;
       }
       return $this->renderIndexView($values);
   }

   /**
 　 * indexのViewへのレンダリング処理 
    * @param $values array レンダリングする値群
    */
   private function renderIndexView($values) {
       $values["pageTitle"] = "CSV/TSV形式編集ツール（Web版）";
       $values["selectFileType"] = WDEView::renderSelectList("fileType", WDEConst::$SELECT_FILE_TYPE, $values["fileType"]);
       $values["selectLfCode"] = WDEView::renderSelectList("lfCode", WDEConst::$SELECT_LF_CODE, $values["lfCode"]);
       $values["dataView"] = WDEView::renderDataTableView("data", $values);
       $view = WDEView::getView("index");
       return WDEView::render($view, $values);
   }
}
