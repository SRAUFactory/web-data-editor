<?php
require(dirname(__FILE__) . '/../classes/WDEController.php');
/**
 * WDEControllerクラスのテスト
 */
class WDEControllerTest extends  PHPUnit_Framework_TestCase {
    /**
     * テスト対象のコントローラークラス
     */
    private $controller;

    public function setUp() {
	parent::setUp();
        $this->controller = new WDEController();
    }

    /**
     * indexのテスト
     */ 
    function testIndex() {
        $expected = <<<EOF
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="description" content="">
<title>CSV/TSV形式編集ツール（Web版）</title>
<meta http-equiv="Cache-Control" content="no-cache, no-store, post-check=0, pre-check=0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="Thu, 01 Dec 1994 16:00:00 GMT">
</head>
<body>
<h1>CSV/TSV形式編集ツール（Web版）</h1>
<h2>編集対象のCSV/TSVファイルを読み込んでください</h2>
<form action="index.php" method="post" enctype="multipart/form-data">
ファイル形式：<select name=fileType><option value="csv" selected>CSV</option><option value="tsv">TSV</option></select><br>
改行コード：<select name=lfCode><option value="crlf">CR+LF</option><option value="lf" selected>LF</option><option value="cr">CR</option></select><br>
<input type="file" name="uploadFile" onchange="document.forms[0].submit()">
<input type="submit" name="download" value="保存">

</form>
</body>
</html>

EOF;
        $actual = $this->controller->index();
        $this->assertSame($expected, $actual);
    }

    /**
     * uploadのテスト
     */ 
    function testUpload() {
        $filePath = dirname(__FILE__) . '/../data/sample.csv';
	$_POST = ["fileType" => WDEConst::FILE_TYPE_CSV , "lfCode" => WDEConst::LF_CODE_LF];
	$_FILES = ["uploadFile" => [
	    "name" => "sample.csv",
	    "type" => "text/csv",
            "tmp_name" => $filePath,
            "error" => 0,
            "size" => 87,
        ]];
	$expected = <<<EOF
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="description" content="">
<title>CSV/TSV形式編集ツール（Web版）</title>
<meta http-equiv="Cache-Control" content="no-cache, no-store, post-check=0, pre-check=0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="Thu, 01 Dec 1994 16:00:00 GMT">
</head>
<body>
<h1>CSV/TSV形式編集ツール（Web版）</h1>
<h2>編集対象のCSV/TSVファイルを読み込んでください</h2>
<form action="index.php" method="post" enctype="multipart/form-data">
ファイル形式：<select name=fileType><option value="csv" selected>CSV</option><option value="tsv">TSV</option></select><br>
改行コード：<select name=lfCode><option value="crlf">CR+LF</option><option value="lf" selected>LF</option><option value="cr">CR</option></select><br>
<input type="file" name="uploadFile" onchange="document.forms[0].submit()">
<input type="submit" name="download" value="保存">
<input type="hidden" name="fileName" value="sample">
<h2>sample. csvの内容</h2>
<table>
    <tr>
    	<td></td>
    	<td></td>
    	<td><input type="submit" name="addCol[0][0]" value="+"></td><td><input type="submit" name="addCol[0][1]" value="+"></td><td><input type="submit" name="addCol[0][2]" value="+"></td><td><input type="submit" name="addCol[0][3]" value="+"></td>
    </tr>
    <tr><td><input type="submit" name="addRow[0][0]" value="+"></td><td>0</td><td><input type="text" name="data[0][0]" value="header1"></td><td><input type="text" name="data[0][1]" value="header2"></td><td><input type="text" name="data[0][2]" value="header3"></td><td><input type="text" name="data[0][3]" value="header4"></td></tr><tr><td><input type="submit" name="addRow[1][0]" value="+"></td><td>1</td><td><input type="text" name="data[1][0]" value="data11"></td><td><input type="text" name="data[1][1]" value="data12"></td><td><input type="text" name="data[1][2]" value="data13"></td><td><input type="text" name="data[1][3]" value="data14"></td></tr><tr><td><input type="submit" name="addRow[2][0]" value="+"></td><td>2</td><td><input type="text" name="data[2][0]" value="data21"></td><td><input type="text" name="data[2][1]" value="data22"></td><td><input type="text" name="data[2][2]" value="data23"></td><td><input type="text" name="data[2][3]" value="data4"></td></tr>
</table>


</form>
</body>
</html>

EOF;
	$actual = $this->controller->upload();
        $this->assertSame($expected, $actual);
    }

    /**
     * downloadのテスト
     */ 
    function testDownload() {
	$_POST = [
	     "fileType" => WDEConst::FILE_TYPE_CSV,
             "lfCode" => WDEConst::LF_CODE_LF,
             "fileName" => "sample",
             "data" => [
                 ["header1", "header2", "header3", "header4"],
                 ["data11", "data12", "data13", "data14"],
                 ["data21", "data22", "data23", "data24"],
             ],
	];
	$expected = file_get_contents(dirname(__FILE__) . '/../data/sample.csv');
	//$actual = $this->controller->download();
        //$this->assertSame($expected, $actual);
    }
}
