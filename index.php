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
		echo $rowValue . "\n";
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
	$tempTsvData = explode("\n", $tsvFileData);
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
$templete = file_get_contents("templete/index.html");
$templete = str_replace("#####pageTitle#####", $pageTitle, $templete);
$dataView = "";
if (count($tsvData) > 0) {
	$dataView = file_get_contents("templete/data.html");
	$dataView = str_replace("#####fileName#####", $fileName, $dataView);
	$dataView = str_replace("#####fileType#####", $fileType, $dataView);
	
	$header = "";
	$addBtnView = <<<EOL
<td><input type="submit" name="#####name#####" value="+"></td>
EOL;
	$inputTextView = <<<EOL
<td><input type="text" name="#####name#####" value="#####rowValue#####"></td>
EOL;
	
	foreach ($tsvData[0] as $col => $rowValue) {
		$header .= str_replace("#####name#####", "addCol[0][{$col}]", $addBtnView);
	}
	$dataView = str_replace("#####header#####", $header, $dataView);

	$dataTable = "";
	foreach ($tsvData as $row => $rowData) {
		$dataTable .= "<tr>";
		$dataTable .= str_replace("#####name#####", "addRow[{$row}][0]", $addBtnView);
		$dataTable .= "<td>{$row}</td>";
		foreach ($rowData as $col => $rowValue) {
			$inputView = str_replace("#####name#####", "data[{$row}][{$col}]" , $inputTextView);
			$dataTable .= str_replace("#####rowValue#####", $rowValue, $inputView);
		}
		$dataTable .= "</tr>";
	}
	$dataView = str_replace("#####dataTable#####", $dataTable, $dataView);
}
$templete = str_replace("#####dataView#####", $dataView, $templete);
echo $templete;
?>
