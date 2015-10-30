<?php
class ViewUtil {
    const TABLE_ADD_BTN_VIEW  = <<<EOL
<td><input type="submit" name="#####name#####" value="+"></td>
EOL;

   const TABLE_INPUT_TEXT_VIEW = <<<EOL
<td><input type="text" name="#####name#####" value="#####rowValue#####"></td>
EOL;

    public static function getView($fileName) {
	return file_get_contents("templete/" . $fileName . ".html");
    }

    public static function assign($view, $key, $value) {
        return str_replace("#####{$key}#####", $value, $view);
    }

    public static function render($view, $values) {
	foreach ($values as $key => $value) {
	    $view = self::assign($view, $key, $value);
	}
        return $view;
    }
}
