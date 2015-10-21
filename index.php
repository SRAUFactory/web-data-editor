<?php
$columnsSeparetorByFileType = [
	"tsv" => "\t",
	"csv" => ",",
];
$tsvData = array();
if (isset($_POST["download"])) {
	$tsvData = $_POST["data"];
	$fileName = $_POST["fileName"];
	$fileType = $_POST["fileType"];
	header('Content-Type: text/'. $fileType);
	header('Content-disposition: attachment; filename="'.$fileName. "." . $fileType. '"');
	foreach ($tsvData as $row => $rowData) {
		$rowValue = implode($columnsSeparetorByFileType[$fileType], $rowData);
		echo $rowValue . "\r\n";
	}
	return;
} elseif (isset($_POST["addRow"]) || isset($_POST["addCol"])) {
	$tsvData = $_POST["data"];
	$fileName = $_POST["fileName"];
	$tempTsvData = $tsvData;
	$addRow = 0;
	foreach ($tempTsvData as $row => $rowData) {
		if (isset($_POST["addRow"][$row][0])) {
			$addRow++;
			$addRowData = [];
			foreach ($rowData as $col => $rowValue) {
				$addRowData[] = "";
			}
			$tsvData[$row] = $addRowData;
		}
		$addCol = 0;
		foreach ($rowData as $col => $rowValue) {
			if (isset($_POST["addCol"][0][$col])) {
				$tsvData[$row + $addRow][$col] = "";
				$addCol++;
			}
			$tsvData[$row + $addRow][$col + $addCol] = $rowValue;
		}
	}
} elseif (isset($_FILES["uploadFile"])) {
	$fileType = $_POST["fileType"];
	$fileName = $_FILES["uploadFile"]["name"];
	$fileName = str_replace("." . $fileType, "", $fileName);
	$tsvFileData = file_get_contents($_FILES["uploadFile"]["tmp_name"]);
	$tempTsvData = explode("\r\n", $tsvFileData);
	$separater = $columnsSeparetorByFileType[$fileType];
	foreach ($tempTsvData as $row => $rowData) {
		$rowValues = explode($separater, $rowData);
		if (count($rowValues) <= 1) {
			continue;
		}

		$tsvData[] = $rowValues;
	}
}
$pageTitle = "CSV/TSV形式編集ツール（Web版）";
require_once 'view.php';
?>