<?php
$tsvData = $_POST["data"];
$fileName = $_POST["fileName"];
header('Content-Type: text/csv');
header('Content-disposition: attachment; filename="'.$fileName.'"');
foreach ($tsvData as $row => $rowData) {
	$rowValue = implode("\t", $rowData);
	echo $rowValue . "\r\n";
}
