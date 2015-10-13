<?php
$tsvData = array();
if (isset($_POST["download"])) {
	require_once 'download.php';
} elseif (isset($_POST["load"])) {
	$fileName = $_FILES["tsv_file"]["name"];
	$tsvFileData = file_get_contents($_FILES["tsv_file"]["tmp_name"]);
	$tsvData = explode("\r\n", $tsvFileData);
	require_once 'view.php';
}
?>