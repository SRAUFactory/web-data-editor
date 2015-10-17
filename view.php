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
<form action="index.php" method="post" enctype="multipart/form-data">
<input type="file" name="tsv_file" onchange="document.forms[0].submit()">
<input type="submit" name="download" value="保存">
<input type="hidden" name="fileName" value="<?= $fileName ?>">
<?php if (count($tsvData) > 0) { ?>
<h2><?= $fileName ?>の内容</h2>
<table>
<tr>
<td></td>
<td></td>
<?php foreach ($tsvData[0] as $col => $rowValue) { ?>
<td><input type="submit" name="<?= "addCol[0][{$col}]" ?>" value="+"></td>
<?php } ?>
</tr>
<?php foreach ($tsvData as $row => $rowData) { ?>
<tr>
<td><input type="submit" name="<?= "addRow[{$row}][0]" ?>" value="+"></td>
<td><?= $row ?></td>
<?php foreach ($rowData as $col => $rowValue) { ?>
<td><input type="text" name="<?= "data[{$row}][{$col}]" ?>" value="<?= $rowValue ?>"></td>
<?php } ?>
</tr>
<?php } ?>
</table>
<?php } ?>
</form>
</body>
</html>