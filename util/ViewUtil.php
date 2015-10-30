<?php
class ViewUtil {
    public static function getView($fileName) {
	return file_get_contents("templete/" . $fileName . ".html");
    }

    public static function assign($view, $key, $value) {
        return str_replace("#####" . $key . "#####", $value, $view);
    }

    public static function render($view, $values) {
	foreach ($values as $key => $value) {
            $view = self::assign($view, $Key, $value);
	}
        return $view;
    }
}
