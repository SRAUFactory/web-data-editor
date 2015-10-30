<?php
$columnsSeparetorByFileType = [
    "tsv" => "\t",
    "csv" => ",",
];
$values = [];
if (isset($_POST["download"])) {
    $values = $_POST;
    header('Content-Type: text/'. $fileType);
    header('Content-disposition: attachment; filename="'.$values["fileName"]. "." . $values["fileType"]. '"');
    foreach ($values["data"] as $row => $rowData) {
    	$rowValue = implode($columnsSeparetorByFileType[$values["fileType"]], $rowData);
    	echo $rowValue . "\n";
    }
    return;
} elseif (isset($_POST["addRow"]) || isset($_POST["addCol"])) {
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
} elseif (isset($_FILES["uploadFile"])) {
    $values["fileType"] = $_POST["fileType"];
    $values["fileName"] = str_replace("." . $values["fileType"], "", $_FILES["uploadFile"]["name"]);
    $values["data"] = [];
    $tsvFileData = file_get_contents($_FILES["uploadFile"]["tmp_name"]);
    $tempTsvData = explode("\n", $tsvFileData);
    $separater = $columnsSeparetorByFileType[$values["fileType"]];
    foreach ($tempTsvData as $row => $rowData) {
    	$rowValues = explode($separater, $rowData);
    	if (count($rowValues) <= 1) {
    		continue;
    	}
    	$values["data"][] = $rowValues;
    }
}

require_once('util/ViewUtil.php');
$values["pageTitle"] = "CSV/TSV形式編集ツール（Web版）";
$view = ViewUtil::getView("index");
$values["dataView"] = "";
if (count($values["data"]) > 0) {
    $dataView = ViewUtil::getView("data");
    $values["header"] = "";
    foreach ($values["data"][0] as $col => $rowValue) {
        $values["header"] .= ViewUtil::assign(ViewUtil::TABLE_ADD_BTN_VIEW, "name", "addCol[0][{$col}]");
    }

    $dataTable = "";
    foreach ($values["data"] as $row => $rowData) {
	$dataTable .= "<tr>";
        $dataTable .= ViewUtil::assign(ViewUtil::TABLE_ADD_BTN_VIEW, "name", "addRow[{$row}][0]");
        $dataTable .= "<td>{$row}</td>";
	foreach ($rowData as $col => $rowValue) {
            $inputViewValues = ["name" => "data[{$row}][{$col}]", "rowValue" => $rowValue];
	    $dataTable .= ViewUtil::render(ViewUtil::TABLE_INPUT_TEXT_VIEW, $inputViewValues);
        }
        $dataTable .= "</tr>";
    }
    $values["dataTable"] = $dataTable;
    $values["dataView"] = ViewUtil::render($dataView, $values);
}
echo ViewUtil::render($view, $values);
?>
