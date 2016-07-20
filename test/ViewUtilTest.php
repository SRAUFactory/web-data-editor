<?php
require(dirname(__FILE__) . '/../src/ViewUtil.php');
/**
 * ViewUtilクラスのテスト
 */
class ViewUtilTest extends PHPUnit_Framework_TestCase {
    function testGetView() {
	$expected = <<<EOF
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="description" content="">
<title>#####pageTitle#####</title>
<meta http-equiv="Cache-Control" content="no-cache, no-store, post-check=0, pre-check=0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="Thu, 01 Dec 1994 16:00:00 GMT">
</head>
<body>
<h1>#####pageTitle#####</h1>
<h2>編集対象のCSV/TSVファイルを読み込んでください</h2>
<form action="index.php" method="post" enctype="multipart/form-data">
ファイル形式：#####selectFileType#####<br>
改行コード：#####selectLfCode#####<br>
<input type="file" name="uploadFile" onchange="document.forms[0].submit()">
<input type="submit" name="download" value="保存">
#####dataView#####
</form>
</body>
</html>

EOF;
	$view = ViewUtil::getView("index");
        $this->assertSame($expected, $view);
    }
    
    function testRenderSelectList() {
        $expected = <<<EOF
<select name=fileType><option value="csv" selected>CSV</option><option value="tsv">TSV</option></select>
EOF;
        $selectList = ViewUtil::renderSelectList("fileType", ["csv" => "CSV", "tsv" => "TSV"], "csv");
        $this->assertSame($expected, $selectList);
    }
    
    /*function testRenderDataTableView() {
    }*/
}
