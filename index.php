<?php
$tsvData = array();
$fileName = "";
if (isset($_POST["download"])) {
	$tsvData = $_POST["data"];
	$fileName = $_POST["fileName"];
	header('Content-Type: text/csv');
	header('Content-disposition: attachment; filename="'.$fileName.'"');
	foreach ($tsvData as $row => $rowData) {
		$rowValue = implode("\t", $rowData);
		echo $rowValue . "\r\n";
	}
	return;
} elseif (isset($_POST["load"])) {
	$fileName = $_FILES["tsv_file"]["name"];
	$tsvFileData = file_get_contents($_FILES["tsv_file"]["tmp_name"]);
	$tempTsvData = explode("\r\n", $tsvFileData);
	$tsvData = [];
	foreach ($tempTsvData as $row => $rowData) {
		$rowData = preg_replace("/\\t/", ",", $rowData);
		$rowValues = explode(",", $rowData);
		if (count($rowValues) <= 1) {
			continue;
		}

		$tsvData[] = $rowValues;
	}
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
}
$pageTitle = "CSV/TSV形式編集ツール（Web版）";
require_once 'view.php';
?>