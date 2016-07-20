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

    /**
     * @dataProvider renderDataTableViewProvider
     * @param $values array 引数に渡すデータ配列
     * @param $expected string 期待値 
     */
    function testRenderDataTableView($values, $expected) { 
	$dataTableView = ViewUtil::renderDataTableView("data", $values);
        $this->assertSame($expected, $dataTableView);
    }

    function renderDataTableViewProvider() {
	$dataTableView = <<<EOF
<input type="hidden" name="fileName" value="sample">
<h2>sample. csvの内容</h2>
<table>
    <tr>
    	<td></td>
    	<td></td>
    	<td><input type="submit" name="addCol[0][0]" value="+"></td><td><input type="submit" name="addCol[0][1]" value="+"></td><td><input type="submit" name="addCol[0][2]" value="+"></td><td><input type="submit" name="addCol[0][3]" value="+"></td>
    </tr>
    <tr><td><input type="submit" name="addRow[0][0]" value="+"></td><td>0</td><td><input type="text" name="data[0][0]" value="header1"></td><td><input type="text" name="data[0][1]" value="header2"></td><td><input type="text" name="data[0][2]" value="header3"></td><td><input type="text" name="data[0][3]" value="header4"></td></tr><tr><td><input type="submit" name="addRow[1][0]" value="+"></td><td>1</td><td><input type="text" name="data[1][0]" value="data11"></td><td><input type="text" name="data[1][1]" value="data12"></td><td><input type="text" name="data[1][2]" value="data13"></td><td><input type="text" name="data[1][3]" value="data14"></td></tr><tr><td><input type="submit" name="addRow[2][0]" value="+"></td><td>2</td><td><input type="text" name="data[2][0]" value="data21"></td><td><input type="text" name="data[2][1]" value="data22"></td><td><input type="text" name="data[2][2]" value="data23"></td><td><input type="text" name="data[2][3]" value="data24"></td></tr>
</table>


EOF;
	return [
           [["data" => []], ""],
	   [
	       [
                   "fileType" => "csv",
		   "lfCode" => "lf",
                   "fileName" => "sample",
                   "data" => [
                       ["header1", "header2", "header3", "header4"],
                       ["data11", "data12", "data13", "data14"],
                       ["data21", "data22", "data23", "data24"],
                   ]
               ],
	       $dataTableView,
           ],
        ];
    }
}
