<?php
require('classes/WDEController.php');
$controller = new WDEController();
if (isset($_POST["download"])) {
    $result = $controller->download();
} elseif (isset($_POST["addRow"]) || isset($_POST["addCol"])) {
    $result = $controller->addRowCol();
} elseif (isset($_FILES["uploadFile"])) {
    $result = $controller->upload();
} else {
    $result = $controller->index();
}
echo $result;
