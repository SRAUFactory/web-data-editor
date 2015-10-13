<?php
$pageTitle = "CSV/TSV形式編集ツール（Web版）";
?>
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="description" content="">
<title><?= $pageTitle ?></title>
<meta http-equiv="Cache-Control" content="no-cache, no-store, post-check=0, pre-check=0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="Thu, 01 Dec 1994 16:00:00 GMT">
</head>
<body>
<h1><?= $pageTitle ?></h1>
<h2>編集対象のCSV/TSVファイルを読み込んでください</h2>
<form action="edit.php" method="post" enctype="multipart/form-data">
<input type="file" name="tsv_file">
<input type="submit" name="load" value="読み込み">
<?php if (count($tsvData) > 0) { ?>
<h2><?= $fileName ?>の内容</h2>
<table>
<?php
	foreach ($tsvData as $row => $rowData) {
		$rowData = preg_replace("/\\t/", ",", $rowData);
		$rowValues = explode(",", $rowData);
		if (count($rowValues) <= 1)  {
			continue;
		}
?>
<tr>
<td><?= $row ?></td>
<?php foreach ($rowValues as $col => $rowValue) { ?>
<td><input type="text" name="<?= "data[{$row}][{$col}]" ?>" value="<?= $rowValue ?>"></td>
<?php } ?>
</tr>
<?php } ?>
</table>
<h2>編集後のファイルのダウンロードはこちら</h2>
<input type="hidden" name="fileName" value="<?= $fileName ?>">
<input type="submit" name="download" value="ダウンロード"><br>
</form>
<?php } ?>
</body>
</html>