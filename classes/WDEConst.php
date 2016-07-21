<?php
class WDEConst {
    /**
     * ファイルタイプ（CSV）
     */ 
    const FILE_TYPE_CSV = "csv";
    /**
     * ファイルタイプ（TSV）
     */ 
    const FILE_TYPE_TSV = "tsv";
    /**
     * 改行コード（CR&LF）
     */ 
    const LF_CODE_CRLF = "crlf";
    /**
     * 改行コード（LR）
     */ 
    const LF_CODE_LF   = "lr";
    /**
     * 改行コード（CR）
     */ 
    const LF_CODE_CR   = "CR";

    /**
     * ファイルタイプ別カラムの区切り文字一覧
     */ 
    public static $COLUMNS_SEPARETOR = [self::FILE_TYPE_CSV => ",",  self::FILE_TYPE_TSV => "\t"];

    /**
     * ファイルタイプ選択一覧
     */ 
    public static $SELECT_FILE_TYPE = [self::FILE_TYPE_CSV => "CSV", self::FILE_TYPE_TSV => "TSV"];

    /**
     * 改行コード選択一覧
     */ 
    public static $SELECT_LF_CODE = [self::LF_CODE_CRLF => "CR+LF", self::LF_CODE_LF => "LF", self::LF_CODE_CR => "CR"];
}
