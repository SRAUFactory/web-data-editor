<?php
class ViewUtil {
    const TABLE_ADD_BTN_VIEW = <<<EOL
<td><input type="submit" name="#####name#####" value="+"></td>
EOL;

    const TABLE_INPUT_TEXT_VIEW = <<<EOL
<td><input type="text" name="#####name#####" value="#####rowValue#####"></td>
EOL;
  
    const SELECT_LIST_VIEW = <<<EOL
<select name=#####name#####>#####option#####</select>
EOL;

    const SELECT_OPTION_VIEW = <<<EOL
<option value="#####value#####"#####selected#####>#####option#####</option>
EOL;

    public static function getView($fileName) {
	return file_get_contents("templete/" . $fileName . ".html");
    }

    public static function assign($view, $key, $value) {
        return str_replace("#####{$key}#####", $value, $view);
    }

    public static function render($view, $values) {
	foreach ($values as $key => $value) {
	    if (is_array($value)) {
                continue;
            }
	    $view = self::assign($view, $key, $value);
	}
        return $view;
    }

    public static function renderDataTableView($fileName, $values) {
	$renderView = "";
        if (count($values["data"]) > 0) {
            $dataView = ViewUtil::getView($fileName);
            $values["header"] = "";
            foreach ($values["data"][0] as $col => $rowValue) {
                $values["header"] .= self::assign(self::TABLE_ADD_BTN_VIEW, "name", "addCol[0][{$col}]");
            }

            $dataTable = "";
            foreach ($values["data"] as $row => $rowData) {
                $dataTable .= "<tr>";
                $dataTable .= self::assign(self::TABLE_ADD_BTN_VIEW, "name", "addRow[{$row}][0]");
                $dataTable .= "<td>{$row}</td>";
                foreach ($rowData as $col => $rowValue) {
                    $inputViewValues = ["name" => "data[{$row}][{$col}]", "rowValue" => $rowValue];
                    $dataTable .= self::render(self::TABLE_INPUT_TEXT_VIEW, $inputViewValues);
                }
                $dataTable .= "</tr>";
            }
	    $values["dataTable"] = $dataTable;
            $renderView = self::render($dataView, $values);
	}
        return $renderView;
    }

    public static function renderSelectList($selectName, $options, $selected = "") {
        $optionView = "";
	foreach ($options as $value => $option) {
	    $values = ["value" => $value, "option" => $option];
            $values["selected"] = ($value === $selected)? " selected" : "";
            $optionView .= self::render(self::SELECT_OPTION_VIEW, $values);
	}
        return self::render(self::SELECT_LIST_VIEW, ["name" => $selectName, "option" => $optionView]);
   }
}
